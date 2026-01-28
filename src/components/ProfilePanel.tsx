import React, { useState, useMemo } from 'react';
import { ArrowLeft, User, Trophy, Calendar, Target, BarChart3, Edit, Save } from 'lucide-react';
import type { User as UserType } from '../Types';

interface ProfilePanelProps {
  username: string;
  onBack: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ username, onBack }) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [userBio, setUserBio] = useState(() => 
    localStorage.getItem(`user_bio_${username}`) || 
    'C programming enthusiast. Love solving problems and building things!'
  );
  const loading = false;

  // Compute user stats from localStorage
  const userStats = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
    const user = users.find((u: UserType) => u.username === username);
    
    if (!user) return null;
    
    const winRate = user.gamesPlayed > 0 ? (user.gamesWon / user.gamesPlayed) * 100 : 0;
    const xp = (user.gamesPlayed * 10) + (user.quizzes * 20) + (user.gamesWon * 30);
    const level = Math.floor(xp / 100) + 1;
    const nextLevelXp = level * 100;
    
    return {
      username: user.username,
      gamesPlayed: user.gamesPlayed || 0,
      gamesWon: user.gamesWon || 0,
      quizzes: user.quizzes || 0,
      lastLogin: user.lastLogin || new Date().toISOString(),
      createdAt: user.createdAt || new Date().toISOString(),
      winRate,
      level,
      xp: xp % 100,
      nextLevelXp
    };
  }, [username]);

  const saveBio = () => {
    localStorage.setItem(`user_bio_${username}`, userBio);
    setIsEditingBio(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || !userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-3xl font-bold font-mono">👤 Profile</h1>
          <div className="w-32"></div> {/* Spacer */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-600 text-black px-3 py-1 rounded-full font-bold">
                    Level {userStats.level}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-bold">{username}</h2>
                      <p className="text-gray-400">C Playground Member</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-400">
                        <Trophy className="w-5 h-5" />
                        <span className="font-bold">{userStats.gamesWon} Wins</span>
                      </div>
                      <p className="text-gray-400 text-sm">Win Rate: {userStats.winRate.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  {/* XP Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Level {userStats.level}</span>
                      <span>{userStats.xp}/{userStats.nextLevelXp} XP</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Bio Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">About</h3>
                      <button
                        onClick={() => isEditingBio ? saveBio() : setIsEditingBio(true)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center"
                      >
                        {isEditingBio ? (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </>
                        )}
                      </button>
                    </div>
                    
                    {isEditingBio ? (
                      <textarea
                        value={userBio}
                        onChange={(e) => setUserBio(e.target.value)}
                        className="w-full h-32 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-300">{userBio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600/30 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold">Games Played</h3>
                </div>
                <p className="text-4xl font-bold">{userStats.gamesPlayed}</p>
                <p className="text-gray-400 text-sm mt-2">Total games completed</p>
              </div>
              
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-600/30 rounded-lg">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-bold">Quizzes Completed</h3>
                </div>
                <p className="text-4xl font-bold">{userStats.quizzes}</p>
                <p className="text-gray-400 text-sm mt-2">Knowledge tests passed</p>
              </div>
              
              <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-bold">Win Rate</h3>
                </div>
                <p className="text-4xl font-bold">{userStats.winRate.toFixed(1)}%</p>
                <p className="text-gray-400 text-sm mt-2">Games won vs played</p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/30 rounded">
                      <Trophy className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Won Number Guessing Game</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-600/30 text-green-400 rounded-full text-sm">
                    +30 XP
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600/30 rounded">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Completed C Basics Quiz</p>
                      <p className="text-sm text-gray-400">1 day ago</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-600/30 text-purple-400 rounded-full text-sm">
                    +20 XP
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-600/30 rounded">
                      <Calendar className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Daily Login Streak</p>
                      <p className="text-sm text-gray-400">3 days in a row</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-600/30 text-yellow-400 rounded-full text-sm">
                    +15 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Info & Achievements */}
          <div className="space-y-8">
            {/* Account Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="font-semibold">{formatDate(userStats.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Last Login</p>
                  <p className="font-semibold">{formatDate(userStats.lastLogin)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Total XP</p>
                  <p className="font-semibold text-yellow-400">
                    {(userStats.level - 1) * 100 + userStats.xp} points
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Next Level</p>
                  <p className="font-semibold">
                    {userStats.nextLevelXp - userStats.xp} XP needed for Level {userStats.level + 1}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded ${userStats.gamesPlayed >= 1 ? 'bg-yellow-900/30' : 'bg-gray-900/50'}`}>
                  <div className={`p-2 rounded ${userStats.gamesPlayed >= 1 ? 'bg-yellow-600/30' : 'bg-gray-800'}`}>
                    <Trophy className={`w-5 h-5 ${userStats.gamesPlayed >= 1 ? 'text-yellow-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold">First Game</p>
                    <p className="text-sm text-gray-400">Play your first game</p>
                  </div>
                  {userStats.gamesPlayed >= 1 && (
                    <span className="ml-auto text-yellow-400">✓</span>
                  )}
                </div>
                
                <div className={`flex items-center gap-3 p-3 rounded ${userStats.quizzes >= 1 ? 'bg-blue-900/30' : 'bg-gray-900/50'}`}>
                  <div className={`p-2 rounded ${userStats.quizzes >= 1 ? 'bg-blue-600/30' : 'bg-gray-800'}`}>
                    <Target className={`w-5 h-5 ${userStats.quizzes >= 1 ? 'text-blue-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold">Quiz Master</p>
                    <p className="text-sm text-gray-400">Complete your first quiz</p>
                  </div>
                  {userStats.quizzes >= 1 && (
                    <span className="ml-auto text-blue-400">✓</span>
                  )}
                </div>
                
                <div className={`flex items-center gap-3 p-3 rounded ${userStats.winRate >= 50 ? 'bg-green-900/30' : 'bg-gray-900/50'}`}>
                  <div className={`p-2 rounded ${userStats.winRate >= 50 ? 'bg-green-600/30' : 'bg-gray-800'}`}>
                    <Trophy className={`w-5 h-5 ${userStats.winRate >= 50 ? 'text-green-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold">Competitive Player</p>
                    <p className="text-sm text-gray-400">Achieve 50% win rate</p>
                  </div>
                  {userStats.winRate >= 50 && (
                    <span className="ml-auto text-green-400">✓</span>
                  )}
                </div>
                
                <div className={`flex items-center gap-3 p-3 rounded ${userStats.gamesPlayed >= 10 ? 'bg-purple-900/30' : 'bg-gray-900/50'}`}>
                  <div className={`p-2 rounded ${userStats.gamesPlayed >= 10 ? 'bg-purple-600/30' : 'bg-gray-800'}`}>
                    <User className={`w-5 h-5 ${userStats.gamesPlayed >= 10 ? 'text-purple-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold">Veteran Player</p>
                    <p className="text-sm text-gray-400">Play 10+ games</p>
                  </div>
                  {userStats.gamesPlayed >= 10 && (
                    <span className="ml-auto text-purple-400">✓</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Level Progression */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Level Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Basic Editor</p>
                    <p className="text-sm text-gray-400">Standard features</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userStats.level >= 3 ? 'bg-green-600' : 'bg-gray-700'}`}>
                    3
                  </div>
                  <div>
                    <p className={`font-semibold ${userStats.level >= 3 ? 'text-green-400' : ''}`}>
                      Syntax Highlighting
                    </p>
                    <p className="text-sm text-gray-400">Advanced code editor</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userStats.level >= 5 ? 'bg-purple-600' : 'bg-gray-700'}`}>
                    5
                  </div>
                  <div>
                    <p className={`font-semibold ${userStats.level >= 5 ? 'text-purple-400' : ''}`}>
                      Code Snippets
                    </p>
                    <p className="text-sm text-gray-400">Save and reuse code</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userStats.level >= 10 ? 'bg-yellow-600' : 'bg-gray-700'}`}>
                    10
                  </div>
                  <div>
                    <p className={`font-semibold ${userStats.level >= 10 ? 'text-yellow-400' : ''}`}>
                      Expert Mode
                    </p>
                    <p className="text-sm text-gray-400">All features unlocked</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                  View All Features
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};