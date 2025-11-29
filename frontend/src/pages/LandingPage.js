import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, TrendingUp, Filter } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="heading-font text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          TaskHub
        </div>
        <Button 
          data-testid="header-get-started-btn"
          onClick={() => navigate('/auth')} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Get Started
        </Button>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="heading-font text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          Organize Your Day,
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Boost Your Productivity
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          A powerful daily tracker to manage tasks, visualize progress, and achieve your goals with intelligent analytics and beautiful design.
        </p>
        <Button 
          data-testid="hero-get-started-btn"
          onClick={() => navigate('/auth')} 
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          Start Tracking Now
        </Button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h3 className="heading-font text-xl font-semibold mb-2 text-slate-900 dark:text-white">Task Management</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Create, edit, and organize tasks with priorities and categories</p>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h3 className="heading-font text-xl font-semibold mb-2 text-slate-900 dark:text-white">Calendar Views</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Visualize tasks in monthly grid or weekly list formats</p>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h3 className="heading-font text-xl font-semibold mb-2 text-slate-900 dark:text-white">Analytics</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Track completion rates and productivity trends</p>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
            <Filter className="w-7 h-7 text-white" />
          </div>
          <h3 className="heading-font text-xl font-semibold mb-2 text-slate-900 dark:text-white">Smart Filters</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Search and filter tasks by category, priority, or date</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
        © 2025 TaskHub. Built for productivity.
      </footer>
    </div>
  );
};

export default LandingPage;
