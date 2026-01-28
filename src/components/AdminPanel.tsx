import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, Trash2, Search, Download, RefreshCw } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

interface UserData {
  username: string;
  hash: string;
  gamesPlayed: number;
  gamesWon: number;
  quizzes: number;
  lastLogin: string;
  createdAt: string;
  email?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'username' | 'gamesPlayed' | 'lastLogin'>('username');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string>('');

  useEffect(() => {
    const loadUsers = () => {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
      setUsers(userData);
      setFilteredUsers(userData);
      setLoading(false);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const filterAndSortUsers = () => {
      let result = [...users];
      
      // Filter by search term
      if (searchTerm) {
      result = result.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort users
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'gamesPlayed':
          aValue = a.gamesPlayed;
          bValue = b.gamesPlayed;
          break;
        case 'lastLogin':
          aValue = new Date(a.lastLogin).getTime();
          bValue = new Date(b.lastLogin).getTime();
          break;
        default:
          aValue = a.username.toLowerCase();
          bValue = b.username.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredUsers(result);
  };
    filterAndSortUsers();
  }, [users, searchTerm, sortBy, sortOrder]);

  const loadUsers = () => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
    setUsers(userData);
    setFilteredUsers(userData);
    setLoading(false);
  };

  const handleSort = (field: 'username' | 'gamesPlayed' | 'lastLogin') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const deleteUser = (username: string) => {
    const updatedUsers = users.filter(user => user.username !== username);
    localStorage.setItem('cplayground_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowDeleteConfirm(false);
    setUserToDelete('');
    if (selectedUser && selectedUser.username === username) {
      setSelectedUser(null);
    }
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cplayground_users.json';
    link.click();
  };

  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => {
      const lastLogin = new Date(u.lastLogin);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastLogin > thirtyDaysAgo;
    }).length;
    
    const totalGames = users.reduce((sum, user) => sum + user.gamesPlayed, 0);
    const totalQuizzes = users.reduce((sum, user) => sum + user.quizzes, 0);
    
    return { totalUsers, activeUsers, totalGames, totalQuizzes };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = getStats();

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
          <h1 className="text-3xl font-bold font-mono">👑 Admin Panel</h1>
          <div className="flex gap-2">
            <button
              onClick={exportUsers}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active (30d)</p>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Games Played</p>
                <p className="text-3xl font-bold">{stats.totalGames}</p>
              </div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                🎮
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Quizzes Taken</p>
                <p className="text-3xl font-bold">{stats.totalQuizzes}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                📝
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              {/* Search and Filter Bar */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                      placeholder="Search users..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSort('username')}
                      className={`px-4 py-2 rounded flex items-center ${
                        sortBy === 'username' 
                          ? 'bg-blue-600' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Name
                      {sortBy === 'username' && (
                        <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('gamesPlayed')}
                      className={`px-4 py-2 rounded flex items-center ${
                        sortBy === 'gamesPlayed' 
                          ? 'bg-blue-600' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Games
                      {sortBy === 'gamesPlayed' && (
                        <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('lastLogin')}
                      className={`px-4 py-2 rounded flex items-center ${
                        sortBy === 'lastLogin' 
                          ? 'bg-blue-600' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Last Active
                      {sortBy === 'lastLogin' && (
                        <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* User List */}
              <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No users found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.username}
                        className={`p-4 hover:bg-gray-800/50 cursor-pointer ${
                          selectedUser?.username === user.username ? 'bg-gray-800' : ''
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold">{user.username}</p>
                              <p className="text-sm text-gray-400">
                                {user.email || 'No email'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Last login</p>
                              <p className="text-sm">
                                {formatDate(user.lastLogin)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(user.username);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-2 text-red-400 hover:bg-red-900/30 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex gap-6 mt-3">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">{user.gamesPlayed}</p>
                            <p className="text-xs text-gray-400">Games</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">{user.gamesWon}</p>
                            <p className="text-xs text-gray-400">Wins</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-400">{user.quizzes}</p>
                            <p className="text-xs text-gray-400">Quizzes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">
                              {user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0}%
                            </p>
                            <p className="text-xs text-gray-400">Win Rate</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - User Details */}
          <div className="space-y-8">
            {/* Selected User Details */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">
                {selectedUser ? 'User Details' : 'Select a User'}
              </h3>
              
              {selectedUser ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="text-2xl font-bold">{selectedUser.username}</h4>
                    <p className="text-gray-400">{selectedUser.email || 'No email provided'}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Account Created</p>
                      <p className="font-semibold">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Last Login</p>
                      <p className="font-semibold">{formatDate(selectedUser.lastLogin)}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 p-3 rounded text-center">
                        <p className="text-2xl font-bold text-blue-400">{selectedUser.gamesPlayed}</p>
                        <p className="text-xs text-gray-400">Games Played</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded text-center">
                        <p className="text-2xl font-bold text-green-400">{selectedUser.gamesWon}</p>
                        <p className="text-xs text-gray-400">Games Won</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 p-3 rounded text-center">
                        <p className="text-2xl font-bold text-yellow-400">{selectedUser.quizzes}</p>
                        <p className="text-xs text-gray-400">Quizzes</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded text-center">
                        <p className="text-2xl font-bold text-purple-400">
                          {selectedUser.gamesPlayed > 0 ? Math.round((selectedUser.gamesWon / selectedUser.gamesPlayed) * 100) : 0}%
                        </p>
                        <p className="text-xs text-gray-400">Win Rate</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <button
                      onClick={() => {
                        setUserToDelete(selectedUser.username);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete User
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p>Select a user from the list to view details</p>
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={exportUsers}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export All Users
                </button>
                <button
                  onClick={loadUsers}
                  className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh Data
                </button>
                <button
                  onClick={() => {
                    // Reset all stats (demo only)
                    if (window.confirm('Reset all user statistics? This cannot be undone.')) {
                      const updatedUsers = users.map(user => ({
                        ...user,
                        gamesPlayed: 0,
                        gamesWon: 0,
                        quizzes: 0
                      }));
                      localStorage.setItem('cplayground_users', JSON.stringify(updatedUsers));
                      setUsers(updatedUsers);
                    }
                  }}
                  className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 rounded flex items-center justify-center"
                >
                  🔄 Reset Stats
                </button>
              </div>
            </div>
            
            {/* System Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">System Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage Used</span>
                  <span>{(JSON.stringify(users).length / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Users Online</span>
                  <span className="text-green-400">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Server Status</span>
                  <span className="text-green-400">● Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Backup</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete user <span className="font-bold text-red-400">{userToDelete}</span>?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => deleteUser(userToDelete)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded font-semibold"
                >
                  Delete User
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete('');
                  }}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};