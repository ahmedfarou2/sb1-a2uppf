import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionProps {
  isArabic: boolean;
  showButton?: boolean;
  className?: string;
}

export const calculateProfileCompletion = (user: any) => {
  if (!user) return 0;
  
  const requiredFields = ['nameAr', 'nameEn', 'phone', 'titleAr', 'titleEn', 'email'];
  const completedFields = requiredFields.filter(field => {
    const value = user[field];
    return value && typeof value === 'string' && value.trim() !== '';
  });
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ 
  isArabic, 
  showButton = true,
  className = ''
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profileCompletion = calculateProfileCompletion(user);

  return (
    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isArabic ? 'اكتمال الملف الشخصي' : 'Profile Completion'}
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              {isArabic
                ? `اكتمال ملفك الشخصي: ${profileCompletion}%`
                : `Your profile is ${profileCompletion}% complete`}
            </p>
          </div>
        </div>
        {showButton && profileCompletion < 100 && (
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <button
              onClick={() => navigate('/settings', { state: { section: 'profile' } })}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isArabic ? 'أكمل ملفك الشخصي' : 'Complete Your Profile'}
            </button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="relative">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${profileCompletion}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                profileCompletion === 100 ? 'bg-green-600' : 'bg-indigo-600'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;