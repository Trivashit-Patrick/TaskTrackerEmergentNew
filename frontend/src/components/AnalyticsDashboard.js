import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, TrendingUp, Target } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [summaryRes, trendsRes] = await Promise.all([
        axios.get(`${API}/analytics/summary`),
        axios.get(`${API}/analytics/trends`)
      ]);
      setSummary(summaryRes.data);
      setTrends(trendsRes.data.trends);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Loading analytics...</div>;
  }

  if (!summary) {
    return <div className="text-center py-20 text-slate-500 dark:text-slate-400">No data available</div>;
  }

  const categoryData = Object.entries(summary.by_category).map(([name, data]) => ({
    name,
    total: data.total,
    completed: data.completed
  }));

  const priorityData = Object.entries(summary.by_priority).map(([name, data]) => ({
    name,
    value: data.total
  }));

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6" data-testid="analytics-dashboard">
      <h2 className="heading-font text-3xl font-bold text-slate-900 dark:text-white mb-6">Analytics Overview</h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100" data-testid="total-tasks">{summary.total_tasks}</p>
            </div>
            <Target className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100" data-testid="completed-tasks">{summary.completed_tasks}</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Pending</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100" data-testid="pending-tasks">{summary.pending_tasks}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100" data-testid="completion-rate">{summary.completion_rate}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#6366f1" name="Total" />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Priority Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trends Chart */}
      {trends.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Weekly Trends (Last 8 Weeks)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
