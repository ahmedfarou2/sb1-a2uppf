import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Smartphone } from 'lucide-react';

const schema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SecurityFormData = z.infer<typeof schema>;

interface SecuritySettingsProps {
  isArabic: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ isArabic }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SecurityFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SecurityFormData) => {
    try {
      // Implement password change logic here
      console.log('Password change:', data);
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isArabic ? 'الأمان' : 'Security'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isArabic 
            ? 'إدارة إعدادات الأمان وكلمة المرور'
            : 'Manage your security settings and password'}
        </p>
      </div>

      {/* Password Change Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isArabic ? 'تغيير كلمة المرور' : 'Change Password'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                {isArabic ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type="password"
                {...register('currentPassword')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {isArabic ? 'كلمة المرور الحالية مطلوبة' : 'Current password is required'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                {isArabic ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <input
                type="password"
                {...register('newPassword')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {isArabic ? 'كلمة المرور الجديدة مطلوبة' : 'New password is required'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {isArabic ? 'كلمات المرور غير متطابقة' : "Passwords don't match"}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isArabic ? 'تحديث كلمة المرور' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isArabic ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isArabic 
                    ? 'تفعيل المصادقة الثنائية لحماية حسابك'
                    : 'Enable two-factor authentication to secure your account'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              {isArabic ? 'تفعيل' : 'Enable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;