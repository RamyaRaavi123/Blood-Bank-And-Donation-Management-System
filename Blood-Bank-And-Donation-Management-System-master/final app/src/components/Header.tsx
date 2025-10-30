import React from 'react';
import { Heart, User, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onLogin, 
  onLogout, 
  currentView, 
  onViewChange 
}) => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105"
            onClick={() => onViewChange('home')}
          >
            <Heart className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">LifeBlood</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onViewChange('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onViewChange('register-donor')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'register-donor' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Become a Donor
            </button>
            <button
              onClick={() => onViewChange('register-receiver')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'register-receiver' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Need Blood
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser?.role === 'admin' ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onViewChange('admin')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'admin' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  Admin Dashboard
                </button>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{currentUser.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;