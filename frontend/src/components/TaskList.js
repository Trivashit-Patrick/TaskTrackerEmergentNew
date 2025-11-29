import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-slate-300 dark:border-slate-600';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Personal': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Health': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Study': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20" data-testid="empty-tasks-message">
        <p className="text-slate-500 dark:text-slate-400 text-lg">No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4" data-testid="task-list">
      {tasks.map((task) => (
        <Card
          key={task.id}
          data-testid={`task-card-${task.id}`}
          className={`p-5 border-l-4 transition-all duration-200 hover:shadow-lg ${getPriorityColor(task.priority)}`}
        >
          <div className="flex items-start space-x-4">
            <Checkbox
              data-testid={`task-checkbox-${task.id}`}
              checked={task.status === 'completed'}
              onCheckedChange={(checked) => onStatusChange(task.id, checked ? 'completed' : 'pending')}
              className="mt-1"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    data-testid={`task-title-${task.id}`}
                    className={`text-lg font-semibold text-slate-900 dark:text-white mb-1 ${
                      task.status === 'completed' ? 'line-through text-slate-500 dark:text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p data-testid={`task-description-${task.id}`} className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`} data-testid={`task-category-${task.id}`}>
                      {task.category}
                    </span>
                    <span className="flex items-center text-slate-500 dark:text-slate-400" data-testid={`task-due-date-${task.id}`}>
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(task.due_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button
                    data-testid={`edit-task-btn-${task.id}`}
                    onClick={() => onEdit(task)}
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    data-testid={`delete-task-btn-${task.id}`}
                    onClick={() => onDelete(task.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
