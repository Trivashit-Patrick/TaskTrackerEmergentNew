import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import CalendarView from '@/components/CalendarView';
import WeeklyView from '@/components/WeeklyView';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import TaskDialog from '@/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Search, Sun, Moon } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { logout } = useAuth();
  const [view, setView] = useState('list'); // list, calendar, weekly, analytics
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterPriority !== 'all') params.priority = filterPriority;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${API}/tasks`, { params });
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterCategory, filterPriority, filterStatus]);

  const handleCreateTask = async (taskData) => {
    try {
      await axios.post(`${API}/tasks`, taskData);
      toast.success('Task created successfully!');
      fetchTasks();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await axios.put(`${API}/tasks/${taskId}`, taskData);
      toast.success('Task updated successfully!');
      fetchTasks();
      setIsDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/tasks/${taskId}`);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar view={view} setView={setView} logout={logout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                data-testid="search-input"
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {view === 'list' && (
              <>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger data-testid="category-filter" className="w-32 bg-slate-50 dark:bg-slate-900">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Study">Study</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger data-testid="priority-filter" className="w-32 bg-slate-50 dark:bg-slate-900">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger data-testid="status-filter" className="w-32 bg-slate-50 dark:bg-slate-900">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            <Button
              data-testid="theme-toggle-btn"
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {view === 'list' && (
              <Button
                data-testid="add-task-btn"
                onClick={() => {
                  setEditingTask(null);
                  setIsDialogOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-500 dark:text-slate-400">Loading...</div>
            </div>
          ) : (
            <>
              {view === 'list' && (
                <TaskList
                  tasks={tasks}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                  onStatusChange={(taskId, status) => handleUpdateTask(taskId, { status })}
                />
              )}
              {view === 'calendar' && <CalendarView tasks={tasks} onEdit={handleEditClick} />}
              {view === 'weekly' && <WeeklyView tasks={tasks} onEdit={handleEditClick} />}
              {view === 'analytics' && <AnalyticsDashboard />}
            </>
          )}
        </main>
      </div>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
};

export default Dashboard;
