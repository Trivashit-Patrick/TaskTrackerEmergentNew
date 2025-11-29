import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

const CalendarView = ({ tasks, onEdit }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (day) => {
    return tasks.filter(task => isSameDay(new Date(task.due_date), day));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div data-testid="calendar-view">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-font text-3xl font-bold text-slate-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <Button
            data-testid="calendar-prev-btn"
            onClick={prevMonth}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            data-testid="calendar-next-btn"
            onClick={nextMonth}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-slate-600 dark:text-slate-400 py-2">
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <Card
              key={idx}
              data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
              className={`min-h-24 p-2 ${
                !isCurrentMonth ? 'opacity-40 bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-700'
              } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map(task => (
                  <button
                    key={task.id}
                    data-testid={`calendar-task-${task.id}`}
                    onClick={() => onEdit(task)}
                    className="w-full text-left text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 truncate"
                  >
                    {task.title}
                  </button>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 px-2">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
