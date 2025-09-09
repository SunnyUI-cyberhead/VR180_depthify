
import React, { useState } from 'react';
import { LoginIcon } from './icons/LoginIcon';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
        <p className="text-gray-400">Sign in to begin conversion</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-300 block mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 px-4 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-300"
        >
          <LoginIcon />
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
