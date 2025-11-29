import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await register(email, password);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center mb-8">
            <h1 className="heading-font text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
              TaskHub
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="auth-form">
            <div>
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
              <Input
                id="email"
                data-testid="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
              <Input
                id="password"
                data-testid="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              data-testid="auth-submit-btn"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-6 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              data-testid="toggle-auth-mode-btn"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
