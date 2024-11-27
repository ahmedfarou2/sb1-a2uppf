import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../contexts/AuthContext';
import { CheckCircle } from 'lucide-react';
import ProfileCompletion from '../../shared/ProfileCompletion';

const schema = z.object({
  nameAr: z.string().min(2, 'Arabic name is required'),
  nameEn: z.string().min(2, 'English name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  titleAr: z.string().min(2, 'Arabic job title is required'),
  titleEn: z.string().min(2, 'English job title is required'),
});

type ProfileFormData = z.infer<typeof schema>;

interface ProfileSettingsProps {
  isArabic: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isArabic }) => {
  const { user, updateProfile } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: user?.nameAr || '',
      nameEn: user?.nameEn || '',
      email: user?.email || '',
      phone: user?.phone || '',
      titleAr: user?.titleAr || '',
      titleEn: user?.titleEn || '',
    },
  });

  const inputClasses = "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white";

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {isArabic ? 'الملف الشخصي' : 'Profile'}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isArabic 
            ? 'تحديث معلومات ملفك الشخصي'
            : 'Update your profile information'}
        </p>
      </div>

      <ProfileCompletion isArabic={isArabic} showButton={false} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Arabic Name */}
          <div>
            <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isArabic ? 'الاسم باللغة العربية' : 'Arabic Name'}
            </label>
            <input
              type="text"
              {...register('nameAr')}
              dir="rtl"
              className={inputClasses}
              placeholder={isArabic ? "الاسم باللغة العربية" : "Arabic Name"}
            />
            {errors.nameAr && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {isArabic ? 'الاسم باللغة العربية مطلوب' : errors.nameAr.message}
              </p>
            )}
          </div>

          {/* English Name */}
          <div>
            <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isArabic ? 'الاسم باللغة الإنجليزية' : 'English Name'}
            </label>
            <input
              type="text"
              {...register('nameEn')}
              className={inputClasses}
              placeholder={isArabic ? "الاسم باللغة الإنجليزية" : "English Name"}
            />
            {errors.nameEn && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {isArabic ? 'الاسم باللغة الإنجليزية مطلوب' : errors.nameEn.message}
              </p>
            )}
          </div>

          {/* Arabic Job Title */}
          <div>
            <label htmlFor="titleAr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isArabic ? 'المسمى الوظيفي باللغة العربية' : 'Arabic Job Title'}
            </label>
            <input
              type="text"
              {...register('titleAr')}
              dir="rtl"
              className={inputClasses}
              placeholder={isArabic ? "المسمى الوظيفي باللغة العربية" : "Arabic Job Title"}
            />
            {errors.titleAr && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {isArabic ? 'المسمى الوظيفي باللغة العربية مطلوب' : errors.titleAr.message}
              </p>
            )}
          </div>

          {/* English Job Title */}
          <div>
            <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isArabic ? 'المسمى الوظيفي باللغة الإنجليزية' : 'English Job Title'}
            </label>
            <input
              type="text"
              {...register('titleEn')}
              className={inputClasses}
              placeholder={isArabic ? "المسمى الوظيفي باللغة الإنجليزية" : "English Job Title"}
            />
            {errors.titleEn && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {isArabic ? 'المسمى الوظيفي باللغة الإنجليزية مطلوب' : errors.titleEn.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isArabic ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              {...register('email')}
              className={`${inputClasses} bg-gray-50 dark:bg-gray-600`}
              readOnly
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {isArabic ? 'البريد الإلكتروني غير صالح' : errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isArabic ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              {...register('phone')}
              className={inputClasses}
              dir="ltr"
              placeholder="+966XXXXXXXXX"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {isArabic ? 'رقم الهاتف مطلوب' : errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isArabic ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 p-4 rounded-md shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {isArabic ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;