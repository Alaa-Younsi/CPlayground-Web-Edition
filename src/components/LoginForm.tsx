import React, { useState } from 'react';
import { LogIn, Key, User } from 'lucide-react';
import { sha256 } from '../utils/sha256';
import type { User as UserType } from '../Types';

interface LoginFormProps {
  onLogin: (username: string) => void;
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would call an API
    const users = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
    const user = users.find((u: UserType) => u.username === username);
    
    if (!user) {
      setError('User not found');
      return;
    }

    const hash = await sha256(password);
    if (user.hash !== hash) {
      setError('Invalid password');
      return;
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem('cplayground_users', JSON.stringify(users));
    
    console.log('Login successful, calling onLogin with:', username);
    onLogin(username);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 max-w-md w-full">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-600 p-3 rounded-full">
          <Key className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Login to CPlayground</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold flex items-center justify-center"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Login
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};