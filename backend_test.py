import requests
import sys
import json
from datetime import datetime, timedelta

class DailyTrackerAPITester:
    def __init__(self, base_url="https://taskhub-481.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_task_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, params=data)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@example.com"
        test_password = "TestPass123!"
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={"email": test_email, "password": test_password}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   Registered user: {test_email}")
            return True, test_email, test_password
        return False, None, None

    def test_user_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_get_current_user(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_create_task(self):
        """Test task creation"""
        task_data = {
            "title": "Test Task",
            "description": "This is a test task",
            "due_date": (datetime.now() + timedelta(days=1)).isoformat(),
            "priority": "High",
            "category": "Work",
            "status": "pending"
        }
        
        success, response = self.run_test(
            "Create Task",
            "POST",
            "tasks",
            200,
            data=task_data
        )
        
        if success and 'id' in response:
            self.created_task_ids.append(response['id'])
            return True, response['id']
        return False, None

    def test_get_tasks(self):
        """Test get all tasks"""
        success, response = self.run_test(
            "Get All Tasks",
            "GET",
            "tasks",
            200
        )
        return success, response if success else []

    def test_get_task_by_id(self, task_id):
        """Test get task by ID"""
        success, response = self.run_test(
            "Get Task by ID",
            "GET",
            f"tasks/{task_id}",
            200
        )
        return success

    def test_update_task(self, task_id):
        """Test task update"""
        update_data = {
            "title": "Updated Test Task",
            "status": "completed"
        }
        
        success, response = self.run_test(
            "Update Task",
            "PUT",
            f"tasks/{task_id}",
            200,
            data=update_data
        )
        return success

    def test_delete_task(self, task_id):
        """Test task deletion"""
        success, response = self.run_test(
            "Delete Task",
            "DELETE",
            f"tasks/{task_id}",
            200
        )
        return success

    def test_search_tasks(self):
        """Test task search functionality"""
        success, response = self.run_test(
            "Search Tasks",
            "GET",
            "tasks",
            200,
            data={"search": "Test"}
        )
        return success

    def test_filter_tasks_by_category(self):
        """Test filter tasks by category"""
        success, response = self.run_test(
            "Filter Tasks by Category",
            "GET",
            "tasks",
            200,
            data={"category": "Work"}
        )
        return success

    def test_filter_tasks_by_priority(self):
        """Test filter tasks by priority"""
        success, response = self.run_test(
            "Filter Tasks by Priority",
            "GET",
            "tasks",
            200,
            data={"priority": "High"}
        )
        return success

    def test_filter_tasks_by_status(self):
        """Test filter tasks by status"""
        success, response = self.run_test(
            "Filter Tasks by Status",
            "GET",
            "tasks",
            200,
            data={"status": "pending"}
        )
        return success

    def test_analytics_summary(self):
        """Test analytics summary endpoint"""
        success, response = self.run_test(
            "Analytics Summary",
            "GET",
            "analytics/summary",
            200
        )
        return success

    def test_analytics_trends(self):
        """Test analytics trends endpoint"""
        success, response = self.run_test(
            "Analytics Trends",
            "GET",
            "analytics/trends",
            200
        )
        return success

    def test_duplicate_email_registration(self, email):
        """Test duplicate email registration should fail"""
        success, response = self.run_test(
            "Duplicate Email Registration (Should Fail)",
            "POST",
            "auth/register",
            400,
            data={"email": email, "password": "AnotherPass123!"}
        )
        return success

    def test_invalid_login(self):
        """Test invalid login credentials"""
        success, response = self.run_test(
            "Invalid Login (Should Fail)",
            "POST",
            "auth/login",
            401,
            data={"email": "nonexistent@example.com", "password": "wrongpass"}
        )
        return success

def main():
    print("🚀 Starting Daily Tracker API Tests")
    print("=" * 50)
    
    tester = DailyTrackerAPITester()
    
    # Test user registration and authentication
    print("\n📝 AUTHENTICATION TESTS")
    print("-" * 30)
    
    reg_success, test_email, test_password = tester.test_user_registration()
    if not reg_success:
        print("❌ Registration failed, stopping tests")
        return 1
    
    # Test duplicate registration
    tester.test_duplicate_email_registration(test_email)
    
    # Test login
    login_success = tester.test_user_login(test_email, test_password)
    if not login_success:
        print("❌ Login failed, stopping tests")
        return 1
    
    # Test invalid login
    tester.test_invalid_login()
    
    # Test get current user
    tester.test_get_current_user()
    
    # Test task operations
    print("\n📋 TASK MANAGEMENT TESTS")
    print("-" * 30)
    
    # Create multiple tasks for testing
    task_success, task_id = tester.test_create_task()
    if not task_success:
        print("❌ Task creation failed, stopping task tests")
        return 1
    
    # Create another task for better testing
    task_data_2 = {
        "title": "Personal Task",
        "description": "Personal task for testing",
        "due_date": (datetime.now() + timedelta(days=2)).isoformat(),
        "priority": "Medium",
        "category": "Personal",
        "status": "pending"
    }
    
    success, response = tester.run_test(
        "Create Second Task",
        "POST",
        "tasks",
        200,
        data=task_data_2
    )
    
    if success and 'id' in response:
        tester.created_task_ids.append(response['id'])
    
    # Test task retrieval
    tester.test_get_tasks()
    tester.test_get_task_by_id(task_id)
    
    # Test task update
    tester.test_update_task(task_id)
    
    # Test search and filtering
    print("\n🔍 SEARCH AND FILTER TESTS")
    print("-" * 30)
    
    tester.test_search_tasks()
    tester.test_filter_tasks_by_category()
    tester.test_filter_tasks_by_priority()
    tester.test_filter_tasks_by_status()
    
    # Test analytics
    print("\n📊 ANALYTICS TESTS")
    print("-" * 30)
    
    tester.test_analytics_summary()
    tester.test_analytics_trends()
    
    # Test task deletion (do this last)
    print("\n🗑️ CLEANUP TESTS")
    print("-" * 30)
    
    for task_id in tester.created_task_ids:
        tester.test_delete_task(task_id)
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())