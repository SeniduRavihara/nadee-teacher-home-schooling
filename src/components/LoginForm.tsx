'use client';

import { createClient } from '@/utils/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/student');
      router.refresh();
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Parent Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="text-right">
            <button 
                type="button"
                onClick={() => alert("Please contact the school administration to reset your password.")}
                className="text-blue-600 text-sm hover:underline"
            >
                Forgot Password?
            </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5B5FC7] text-white py-3 rounded-full font-bold text-lg hover:bg-[#4a4ea3] transition-colors shadow-md mt-2 disabled:opacity-50"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-600 text-sm">Don't have an account? </span>
        <Link href="/signup" className="text-[#5B5FC7] hover:underline text-sm font-medium">
          Sign Up for Free
        </Link>
      </div>
    </div>
  );
}
