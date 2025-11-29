import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const TaskDialog = ({ isOpen, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'Medium',
    category: 'Personal',
    status: 'pending'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        due_date: task.due_date.split('T')[0],
        priority: task.priority,
        category: task.category,
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: format(new Date(), 'yyyy-MM-dd'),
        priority: 'Medium',
        category: 'Personal',
        status: 'pending'
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800" data-testid="task-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="task-form">
          <div>
            <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">Title</Label>
            <Input
              id="title"
              data-testid="task-title-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1 bg-slate-50 dark:bg-slate-900"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">Description</Label>
            <Textarea
              id="description"
              data-testid="task-description-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 bg-slate-50 dark:bg-slate-900 min-h-20"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-slate-700 dark:text-slate-300">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger data-testid="task-category-select" className="mt-1 bg-slate-50 dark:bg-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority" className="text-slate-700 dark:text-slate-300">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger data-testid="task-priority-select" className="mt-1 bg-slate-50 dark:bg-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="due_date" className="text-slate-700 dark:text-slate-300">Due Date</Label>
            <Input
              id="due_date"
              data-testid="task-due-date-input"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
              className="mt-1 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} data-testid="cancel-task-btn">
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="save-task-btn">
              {task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
