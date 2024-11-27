import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isArabic: boolean;
  onLanguageToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isArabic, onLanguageToggle }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Audit Unity
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
              {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/services" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
              {isArabic ? 'الخدمات' : 'Services'}
            </Link>
            {!isAuthenticated ? (
              <Link to="/login" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                  {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                </Link>
                <Link 
                  to="/settings" 
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {isArabic ? 'الإعدادات' : 'Settings'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                >
                  {isArabic ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onLanguageToggle}
              className="inline-flex items-center px-3 py-2 border border-indigo-500 rounded-md text-indigo-600 hover:bg-indigo-50"
            >
              {isArabic ? (
                <>
                  <img
                    src="https://flagcdn.com/w40/gb.png"
                    alt="English"
                    className="w-6 h-4 mr-2"
                  />
                  <span>English</span>
                </>
              ) : (
                <>
                  <img
                    src="https://flagcdn.com/w40/sa.png"
                    alt="العربية"
                    className="w-6 h-4 mr-2"
                  />
                  <span>عربي</span>
                </>
              )}
            </button>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;