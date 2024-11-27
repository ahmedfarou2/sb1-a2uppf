import React from 'react';
import { Sun, Moon, LayoutDashboard, LayoutList } from 'lucide-react';
import { useAppearanceStore } from '../../../stores/appearanceStore';

interface AppearanceSettingsProps {
  isArabic: boolean;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ isArabic }) => {
  const { isDarkMode, isVerticalLayout, toggleDarkMode, toggleLayout } = useAppearanceStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isArabic ? 'إعدادات المظهر' : 'Appearance Settings'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isArabic 
            ? 'تخصيص مظهر التطبيق'
            : 'Customize the application appearance'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {isDarkMode ? (
                <Moon className="h-6 w-6 text-indigo-600" />
              ) : (
                <Sun className="h-6 w-6 text-indigo-600" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isArabic ? 'الوضع الليلي' : 'Dark Mode'}
                </p>
                <p className="text-sm text-gray-500">
                  {isArabic 
                    ? 'تبديل بين الوضع النهاري والليلي'
                    : 'Toggle between light and dark mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`${
                isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span className="sr-only">
                {isArabic ? 'تغيير الوضع' : 'Toggle mode'}
              </span>
              <span
                className={`${
                  isDarkMode 
                    ? isArabic ? 'translate-x-0' : 'translate-x-5'
                    : isArabic ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>

        {/* Layout Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {isVerticalLayout ? (
                <LayoutList className="h-6 w-6 text-indigo-600" />
              ) : (
                <LayoutDashboard className="h-6 w-6 text-indigo-600" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isArabic ? 'تخطيط القائمة' : 'Menu Layout'}
                </p>
                <p className="text-sm text-gray-500">
                  {isArabic 
                    ? 'تبديل بين التخطيط الأفقي والعمودي'
                    : 'Toggle between horizontal and vertical layout'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleLayout}
              className={`${
                isVerticalLayout ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span className="sr-only">
                {isArabic ? 'تغيير التخطيط' : 'Toggle layout'}
              </span>
              <span
                className={`${
                  isVerticalLayout 
                    ? isArabic ? 'translate-x-0' : 'translate-x-5'
                    : isArabic ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">
          {isArabic
            ? 'سيتم حفظ تفضيلات المظهر تلقائياً وتطبيقها في زياراتك القادمة'
            : 'Appearance preferences will be automatically saved and applied on your next visits'}
        </p>
      </div>
    </div>
  );
};

export default AppearanceSettings;