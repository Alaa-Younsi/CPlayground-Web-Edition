import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { GamePanel } from './components/GamePanel';
import { TutorialPanel } from './components/TutorialPanel';
import { CalculatorPanel } from './components/CalculatorPanel';
import { ProfilePanel } from './components/ProfilePanel';
import { AdminPanel } from './components/AdminPanel';
import { Terminal, Gamepad2, BookOpen, Calculator, User, Users, LogOut } from 'lucide-react';

type View = 'login' | 'signup' | 'main' | 'games' | 'learn' | 'calc' | 'profile' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setLoggedInUser(username);
    setCurrentView('main');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView('login');
  };

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-x-hidden">
      <header className="border-b border-gray-800">
        <div className="w-full px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              <h1 className="text-xl sm:text-2xl font-bold font-mono">CPlayground</h1>
              <span className="text-sm sm:text-base text-gray-400">v1.0</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <span className="text-sm sm:text-base text-gray-300 text-center break-words">Welcome, <span className="text-blue-400">{loggedInUser}</span></span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:px-4 text-sm bg-red-600 hover:bg-red-700 rounded flex items-center whitespace-nowrap flex-shrink-0"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">C Code Editor</h2>
              <p className="text-gray-400 mb-4">Write your C code here and click the buttons in the menu to access features.</p>
              <div className="bg-gray-900 p-2 sm:p-4 rounded font-mono text-xs sm:text-sm text-green-400 overflow-x-auto max-w-full">
                <pre className="whitespace-pre-wrap break-all">{`#include <stdio.h>

int main() {
    printf("Hello CPlayground!\\n");
    return 0;
}`}</pre>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                <Terminal className="w-6 h-6 mr-2 text-green-400" />
                Platform Menu
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCurrentView('games')}
                  className="p-3 sm:p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-700 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <Gamepad2 className="w-8 h-8 mb-2" />
                  <span>Games</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('learn')}
                  className="p-3 sm:p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-700 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <BookOpen className="w-8 h-8 mb-2" />
                  <span>Learn C</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('calc')}
                  className="p-3 sm:p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-700 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <Calculator className="w-8 h-8 mb-2" />
                  <span>Calculator</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('profile')}
                  className="p-3 sm:p-4 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-700 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <User className="w-8 h-8 mb-2" />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('admin')}
                  className="p-3 sm:p-4 bg-red-600/20 hover:bg-red-600/30 border border-red-700 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 col-span-2"
                >
                  <Users className="w-8 h-8 mb-2" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h3 className="font-bold mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Games Played</span>
                  <span className="text-green-400">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quizzes Completed</span>
                  <span className="text-blue-400">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Code Runs</span>
                  <span className="text-purple-400">47</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!loggedInUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        {currentView === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
          />
        ) : (
          <SignupForm
            onSignup={handleLogin}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    );
  }

  switch (currentView) {
    case 'games':
      return <GamePanel username={loggedInUser} onBack={() => setCurrentView('main')} />;
    case 'learn':
      return <TutorialPanel username={loggedInUser} onBack={() => setCurrentView('main')} />;
    case 'calc':
      return <CalculatorPanel onBack={() => setCurrentView('main')} />;
    case 'profile':
      return <ProfilePanel username={loggedInUser} onBack={() => setCurrentView('main')} />;
    case 'admin':
      return <AdminPanel onBack={() => setCurrentView('main')} />;
    default:
      return renderMainView();
  }
}

export default App;
