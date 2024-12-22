'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import loginAction from './login.server';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const [state, formAction] = useActionState(loginAction, { message: '' });

  const handleLocalStorageAndRedirect = (user?: { userid: string; role: string }) => {
    if (user) {
      // Store user data in local storage
      localStorage.setItem('userId', user.userid);
      localStorage.setItem('role', user.role);
  
      // Redirect based on the user's role
      switch (user.role) {
        case 'student':
          router.push('/dashboards/student'); // Corrected path
          break;
        case 'instructor':
          router.push('/dashboards/instructor'); // Corrected path
          break;
        case 'admin':
          router.push('/dashboards/admin'); // Corrected path
          break;
        default:
          router.push('/welcome'); // Fallback route
      }
    }
  };
  

  // Trigger redirection on successful login
  if (state?.message === 'Login successful!') {
    handleLocalStorageAndRedirect(state.user);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Login
        </h1>

        {state?.message && (
          <p
            className={`text-center mb-4 ${
              state.message === 'Login successful!' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {state.message}
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">Don't have an account?</p>
          <button
            onClick={() => router.push('/auth/register')}
            className="text-blue-500 hover:underline focus:outline-none mt-2"
          >
            Switch to Register
          </button>
        </div>
      </div>
    </div>
  );
}
