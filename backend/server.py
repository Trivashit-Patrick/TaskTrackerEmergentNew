from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
#mongo_url = os.environ['mongodb://localhost:27017/']
#client = AsyncIOMotorClient(mongo_url)
#db = client[os.environ['DB_NAME']]

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = os.environ.get("DB_NAME", "TaskTrackerNewlyCreated")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    due_date: str
    priority: str = "Medium"  # Low, Medium, High
    category: str = "Personal"  # Work, Personal, Health, Study
    status: str = "pending"  # pending, completed

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None

class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    title: str
    description: str
    due_date: str
    priority: str
    category: str
    status: str
    created_at: str
    updated_at: str

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Auth Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    user_dict = {
        "id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user_id})
    
    user_response = User(id=user_id, email=user_data.email, created_at=user_dict["created_at"])
    
    return TokenResponse(access_token=access_token, token_type="bearer", user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    
    user_response = User(id=user["id"], email=user["email"], created_at=user["created_at"])
    
    return TokenResponse(access_token=access_token, token_type="bearer", user=user_response)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Task Routes
@api_router.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate, current_user: User = Depends(get_current_user)):
    task_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    task_dict = {
        "id": task_id,
        "user_id": current_user.id,
        "title": task_data.title,
        "description": task_data.description,
        "due_date": task_data.due_date,
        "priority": task_data.priority,
        "category": task_data.category,
        "status": task_data.status,
        "created_at": now,
        "updated_at": now
    }
    
    await db.tasks.insert_one(task_dict)
    
    return Task(**task_dict)

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    query = {"user_id": current_user.id}
    
    if category:
        query["category"] = category
    if priority:
        query["priority"] = priority
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    tasks = await db.tasks.find(query, {"_id": 0}).to_list(1000)
    return [Task(**task) for task in tasks]

@api_router.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: str, current_user: User = Depends(get_current_user)):
    task = await db.tasks.find_one({"id": task_id, "user_id": current_user.id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return Task(**task)

@api_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user)
):
    task = await db.tasks.find_one({"id": task_id, "user_id": current_user.id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = {k: v for k, v in task_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.tasks.update_one(
        {"id": task_id, "user_id": current_user.id},
        {"$set": update_data}
    )
    
    updated_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    return Task(**updated_task)

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user: User = Depends(get_current_user)):
    result = await db.tasks.delete_one({"id": task_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

# Analytics Routes
@api_router.get("/analytics/summary")
async def get_analytics_summary(current_user: User = Depends(get_current_user)):
    all_tasks = await db.tasks.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    
    total_tasks = len(all_tasks)
    completed_tasks = len([t for t in all_tasks if t["status"] == "completed"])
    pending_tasks = total_tasks - completed_tasks
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    by_category = {}
    by_priority = {}
    
    for task in all_tasks:
        # Category count
        cat = task["category"]
        if cat not in by_category:
            by_category[cat] = {"total": 0, "completed": 0}
        by_category[cat]["total"] += 1
        if task["status"] == "completed":
            by_category[cat]["completed"] += 1
        
        # Priority count
        pri = task["priority"]
        if pri not in by_priority:
            by_priority[pri] = {"total": 0, "completed": 0}
        by_priority[pri]["total"] += 1
        if task["status"] == "completed":
            by_priority[pri]["completed"] += 1
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "completion_rate": round(completion_rate, 1),
        "by_category": by_category,
        "by_priority": by_priority
    }

@api_router.get("/analytics/trends")
async def get_analytics_trends(current_user: User = Depends(get_current_user)):
    all_tasks = await db.tasks.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    
    # Group by week
    weekly_data = {}
    for task in all_tasks:
        try:
            task_date = datetime.fromisoformat(task["created_at"].replace('Z', '+00:00'))
            week_key = task_date.strftime("%Y-W%U")
            
            if week_key not in weekly_data:
                weekly_data[week_key] = {"created": 0, "completed": 0}
            
            weekly_data[week_key]["created"] += 1
            if task["status"] == "completed":
                weekly_data[week_key]["completed"] += 1
        except:
            pass
    
    # Convert to sorted list
    trends = []
    for week, data in sorted(weekly_data.items()):
        trends.append({
            "week": week,
            "created": data["created"],
            "completed": data["completed"]
        })
    
    return {"trends": trends[-8:]}  # Last 8 weeks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
