import React from 'react';
import { Languages, Check } from 'lucide-react';

interface LanguageSettingsProps {
  isArabic: boolean;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ isArabic }) => {
  const languages = [
    { code: 'en', name: { en: 'English', ar: 'الإنجليزية' }, flag: '🇺🇸' },
    { code: 'ar', name: { en: 'Arabic', ar: 'العربية' }, flag: '🇸🇦' },
  ];

  const currentLanguage = isArabic ? 'ar' : 'en';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isArabic ? 'إعدادات اللغة' : 'Language Settings'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isArabic 
            ? 'اختر لغة العرض المفضلة لديك'
            : 'Choose your preferred display language'}
        </p>
      </div>

      <div className="space-y-4">
        {languages.map((language) => (
          <div
            key={language.code}
            className={`flex items-center justify-between p-4 rounded-lg ${
              currentLanguage === language.code
                ? 'bg-indigo-50 border-2 border-indigo-500'
                : 'bg-white border-2 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-2xl">{language.flag}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isArabic ? language.name.ar : language.name.en}
                </p>
              </div>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-5 w-5 text-indigo-600" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Languages className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {isArabic ? 'ملاحظة' : 'Note'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {isArabic
                    ? 'تغيير اللغة سيؤدي إلى إعادة تحميل التطبيق'
                    : 'Changing the language will reload the application'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;