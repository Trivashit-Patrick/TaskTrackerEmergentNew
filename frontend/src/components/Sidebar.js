import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutList, Calendar, CalendarRange, BarChart3, LogOut } from 'lucide-react';

const Sidebar = ({ view, setView, logout }) => {
  const menuItems = [
    { id: 'list', label: 'Tasks', icon: LayoutList },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'weekly', label: 'Weekly View', icon: CalendarRange },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6">
        <h1 className="heading-font text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          TaskHub
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <Button
              key={item.id}
              data-testid={`nav-${item.id}-btn`}
              onClick={() => setView(item.id)}
              variant="ghost"
              className={`w-full justify-start px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4">
        <Button
          data-testid="logout-btn"
          onClick={logout}
          variant="ghost"
          className="w-full justify-start px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
