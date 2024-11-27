import React, { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

interface NotificationSettingsProps {
  isArabic: boolean;
}

interface NotificationSetting {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  enabled: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isArabic }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'email',
      title: { en: 'Email Notifications', ar: 'إشعارات البريد الإلكتروني' },
      description: { 
        en: 'Receive email notifications for important updates',
        ar: 'استلام إشعارات البريد الإلكتروني للتحديثات المهمة'
      },
      enabled: true,
    },
    {
      id: 'audit',
      title: { en: 'Audit Updates', ar: 'تحديثات المراجعة' },
      description: {
        en: 'Get notified about audit engagement updates',
        ar: 'الحصول على إشعارات حول تحديثات عمليات المراجعة'
      },
      enabled: true,
    },
    {
      id: 'messages',
      title: { en: 'Messages', ar: 'الرسائل' },
      description: {
        en: 'Receive notifications for new messages',
        ar: 'استلام إشعارات للرسائل الجديدة'
      },
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'email':
        return <Mail className="h-6 w-6 text-indigo-600" />;
      case 'audit':
        return <Bell className="h-6 w-6 text-indigo-600" />;
      case 'messages':
        return <MessageSquare className="h-6 w-6 text-indigo-600" />;
      default:
        return <Bell className="h-6 w-6 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isArabic ? 'إعدادات الإشعارات' : 'Notification Settings'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isArabic 
            ? 'تخصيص إعدادات الإشعارات الخاصة بك'
            : 'Customize your notification preferences'}
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className={`flex items-center ${isArabic ? 'space-x-reverse' : 'space-x-4'}`}>
              <div className={isArabic ? 'ml-4' : 'mr-4'}>
                {getIcon(setting.id)}
              </div>
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-gray-900">
                  {isArabic ? setting.title.ar : setting.title.en}
                </p>
                <p className="text-sm text-gray-500">
                  {isArabic ? setting.description.ar : setting.description.en}
                </p>
              </div>
            </div>
            <div className={`relative ${isArabic ? 'mr-4' : 'ml-4'}`}>
              <button
                type="button"
                onClick={() => toggleSetting(setting.id)}
                className={`${
                  setting.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <span className="sr-only">
                  {isArabic ? 'تغيير الإعداد' : 'Toggle setting'}
                </span>
                <span
                  className={`${
                    setting.enabled 
                      ? isArabic ? 'translate-x-0' : 'translate-x-5'
                      : isArabic ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-gray-400" />
          <p className={`text-sm text-gray-500 ${isArabic ? 'mr-2 text-right' : 'ml-2'}`}>
            {isArabic
              ? 'سيتم تطبيق إعدادات الإشعارات الجديدة على الفور'
              : 'New notification settings will be applied immediately'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;