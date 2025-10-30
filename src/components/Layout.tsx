import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Shield, AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/donor-registration', label: 'Become Donor' },
    { path: '/receiver-registration', label: 'Need Blood' },
    { path: '/blood-donation', label: 'Donate Blood' },
    { path: '/donation-history', label: 'History' },
    { path: '/admin', label: 'Admin', icon: Shield },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle }
  ];

  const isActive = (path: string) => location.pathname === path;

  const getItemColor = (path: string) => {
    if (path === '/admin') return 'blue';
    if (path === '/alerts') return 'orange';
    return 'red';
  };

  const getItemStyles = (path: string, isActive: boolean) => {
    const color = getItemColor(path);
    
    if (isActive) {
      return {
        backgroundColor: color === 'blue' ? '#2563eb' : color === 'orange' ? '#ea580c' : '#dc2626',
        color: 'white'
      };
    } else {
      return {
        color: color === 'blue' ? '#1d4ed8' : color === 'orange' ? '#c2410c' : '#b91c1c'
      };
    }
  };

  const getHoverClasses = (path: string) => {
    const color = getItemColor(path);
    return `hover:bg-${color}-50 hover:text-${color}-600`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="text-xl font-bold text-gray-900">BloodCare</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const styles = getItemStyles(item.path, active);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                      active
                        ? 'shadow-md'
                        : getHoverClasses(item.path)
                    }`}
                    style={styles}
                  >
                    {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  const styles = getItemStyles(item.path, active);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        active
                          ? 'shadow-md'
                          : getHoverClasses(item.path)
                      }`}
                      style={styles}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <span className="text-lg font-semibold">BloodCare</span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              © 2025 BloodCare. Saving lives, one donation at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;