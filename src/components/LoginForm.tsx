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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Social Buttons */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="flex-1 bg-[#4285F4] text-white py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#3367D6] transition-colors"
        >
          <div className="bg-white p-1 rounded-full">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span className="text-sm">Log in with Google</span>
        </button>
        {/* Apple Login Hidden */}
        {/* <button className="flex-1 bg-black text-white py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.64 3.4 1.63-3.12 1.88-2.6 5.75.35 7.1-.9 2.17-2.04 4.03-2.4 4.28zm-5.36-16.08c.34 1.54-1.32 2.71-2.42 2.45-.46-1.47 1.73-2.84 2.42-2.45z" />
          </svg>
          <span className="text-sm">Log in with Apple</span>
        </button> */}
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-gray-200 w-full absolute"></div>
        <span className="bg-white px-4 text-gray-500 text-sm relative z-10">OR</span>
      </div>

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
            <Link href="#" className="text-blue-600 text-sm hover:underline">
                Forgot Password?
            </Link>
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
