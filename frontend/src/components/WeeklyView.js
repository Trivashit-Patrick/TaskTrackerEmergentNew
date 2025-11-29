import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';

const WeeklyView = ({ tasks, onEdit }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDay = (day) => {
    return tasks.filter(task => isSameDay(new Date(task.due_date), day));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-l-slate-300';
    }
  };

  return (
    <div data-testid="weekly-view">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-font text-3xl font-bold text-slate-900 dark:text-white">
          {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
        </h2>
        <div className="flex space-x-2">
          <Button
            data-testid="weekly-prev-btn"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            data-testid="weekly-next-btn"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day.toString()} data-testid={`weekly-day-${format(day, 'yyyy-MM-dd')}`}>
              <div className={`flex items-center space-x-3 mb-3 ${
                isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
              }`}>
                <Calendar className="w-5 h-5" />
                <h3 className="text-xl font-semibold">
                  {format(day, 'EEEE, MMM dd')}
                  {isToday && ' (Today)'}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">({dayTasks.length} tasks)</span>
              </div>

              {dayTasks.length === 0 ? (
                <Card className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-center">
                  No tasks for this day
                </Card>
              ) : (
                <div className="space-y-2">
                  {dayTasks.map(task => (
                    <Card
                      key={task.id}
                      data-testid={`weekly-task-${task.id}`}
                      className={`p-4 border-l-4 cursor-pointer hover:shadow-lg transition-all duration-200 ${getPriorityColor(task.priority)}`}
                      onClick={() => onEdit(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold text-slate-900 dark:text-white mb-1 ${
                            task.status === 'completed' ? 'line-through text-slate-500 dark:text-slate-400' : ''
                          }`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {task.category}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{task.priority} Priority</span>
                          </div>
                        </div>
                        {task.status === 'completed' && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Completed
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
