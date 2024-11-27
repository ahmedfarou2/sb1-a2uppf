import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Building2,
  Shield,
  Bell,
  Languages,
  Key,
  UserCircle,
  LogOut,
  Palette,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileSettings from './sections/ProfileSettings';
import SecuritySettings from './sections/SecuritySettings';
import OrganizationConnections from './sections/OrganizationConnections';
import NotificationSettings from './sections/NotificationSettings';
import LanguageSettings from './sections/LanguageSettings';
import AppearanceSettings from './sections/AppearanceSettings';

interface UserSettingsProps {
  isArabic: boolean;
}

type SettingsSection = 'profile' | 'security' | 'organizations' | 'notifications' | 'language' | 'appearance';

const UserSettings: React.FC<UserSettingsProps> = ({ isArabic }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section as SettingsSection);
    }
  }, [location.state]);

  const menuItems = [
    {
      id: 'profile',
      icon: <UserCircle className="h-5 w-5" />,
      titleEn: 'Profile Settings',
      titleAr: 'إعدادات الملف الشخصي',
      description: {
        en: 'Manage your personal information',
        ar: 'إدارة معلوماتك الشخصية'
      }
    },
    {
      id: 'security',
      icon: <Key className="h-5 w-5" />,
      titleEn: 'Security',
      titleAr: 'الأمان',
      description: {
        en: 'Password and authentication settings',
        ar: 'إعدادات كلمة المرور والمصادقة'
      }
    },
    {
      id: 'organizations',
      icon: <Building2 className="h-5 w-5" />,
      titleEn: 'Organization Connections',
      titleAr: 'ربط المؤسسات',
      description: {
        en: 'Manage your organization connections',
        ar: 'إدارة ارتباطاتك مع المؤسسات'
      }
    },
    {
      id: 'notifications',
      icon: <Bell className="h-5 w-5" />,
      titleEn: 'Notifications',
      titleAr: 'الإشعارات',
      description: {
        en: 'Configure notification preferences',
        ar: 'تخصيص إعدادات الإشعارات'
      }
    },
    {
      id: 'appearance',
      icon: <Palette className="h-5 w-5" />,
      titleEn: 'Appearance',
      titleAr: 'المظهر',
      description: {
        en: 'Customize application appearance',
        ar: 'تخصيص مظهر التطبيق'
      }
    },
    {
      id: 'language',
      icon: <Languages className="h-5 w-5" />,
      titleEn: 'Language',
      titleAr: 'اللغة',
      description: {
        en: 'Change display language',
        ar: 'تغيير لغة العرض'
      }
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings isArabic={isArabic} />;
      case 'security':
        return <SecuritySettings isArabic={isArabic} />;
      case 'organizations':
        return <OrganizationConnections isArabic={isArabic} />;
      case 'notifications':
        return <NotificationSettings isArabic={isArabic} />;
      case 'language':
        return <LanguageSettings isArabic={isArabic} />;
      case 'appearance':
        return <AppearanceSettings isArabic={isArabic} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Sidebar */}
          <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingsSection)}
                  className={`w-full text-left rounded-lg p-4 transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-white dark:bg-gray-800 shadow-sm border-l-4 border-indigo-500'
                      : 'hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`${
                      activeSection === item.id ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {item.icon}
                    </div>
                    <div className={`ml-3 ${isArabic ? 'mr-3 ml-0 text-right' : ''}`}>
                      <p className={`text-sm font-medium ${
                        activeSection === item.id 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-900 dark:text-gray-200'
                      }`}>
                        {isArabic ? item.titleAr : item.titleEn}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {isArabic ? item.description.ar : item.description.en}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full text-left rounded-lg p-4 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 group"
              >
                <div className="flex items-center">
                  <LogOut className="text-gray-400 group-hover:text-red-500 dark:text-gray-500 dark:group-hover:text-red-400" />
                  <div className={`ml-3 ${isArabic ? 'mr-3 ml-0 text-right' : ''}`}>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400">
                      {isArabic ? 'تسجيل الخروج' : 'Logout'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {isArabic ? 'الخروج من حسابك' : 'Sign out of your account'}
                    </p>
                  </div>
                </div>
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white dark:bg-gray-800 py-6 px-4 sm:p-6">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;