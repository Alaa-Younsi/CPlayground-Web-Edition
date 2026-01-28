import React, { useState } from 'react';
import { UserPlus, User, Key, Mail } from 'lucide-react';
import { sha256 } from '../utils/sha256';
import type { User as UserType } from '../Types';

interface SignupFormProps {
  onSignup: (username: string) => void;
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const users = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
    if (users.some((u: UserType) => u.username === username)) {
      setError('Username already exists');
      return;
    }

    const hash = await sha256(password);
    const newUser = {
      username,
      hash,
      email,
      gamesPlayed: 0,
      gamesWon: 0,
      quizzes: 0,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('cplayground_users', JSON.stringify([...users, newUser]));
    setSuccess('Account created successfully! You can now login.');
    
    console.log('Signup successful, calling onSignup with:', username);
    // Auto login after signup
    setTimeout(() => {
      onSignup(username);
    }, 1500);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 max-w-md w-full">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-600 p-3 rounded-full">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
      
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
              placeholder="Choose username"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Email (Optional)</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
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
              placeholder="At least 6 characters"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Confirm Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded">
            {success}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold flex items-center justify-center"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Create Account
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-green-400 hover:text-green-300 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};