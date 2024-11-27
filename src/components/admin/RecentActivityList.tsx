import React from 'react';
import { format } from 'date-fns';
import { Building2, UserPlus, ShieldAlert, CheckCircle, XCircle, User } from 'lucide-react';
import { useOrganizationStore } from '../../stores/organizationStore';
import { useAuth } from '../../contexts/AuthContext';

interface RecentActivityListProps {
  isArabic: boolean;
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ isArabic }) => {
  const { organizations, joinRequests } = useOrganizationStore();
  const { users } = useAuth();

  // Combine and sort all activities
  const activities = [
    ...users.map(user => ({
      type: 'USER_REGISTRATION',
      date: new Date(user.createdAt),
      data: user,
    })),
    ...joinRequests.map(request => ({
      type: 'JOIN_REQUEST',
      date: new Date(request.createdAt),
      data: request,
      organization: organizations.find(org => org.id === request.organizationId),
    })),
    ...organizations
      .filter(org => org.verificationStatus === 'PENDING')
      .map(org => ({
        type: 'VERIFICATION_REQUEST',
        date: new Date(org.createdAt),
        data: org,
        organization: org,
      })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'USER_REGISTRATION':
        return <User className="h-5 w-5 text-green-500" />;
      case 'JOIN_REQUEST':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'VERIFICATION_REQUEST':
        return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
      default:
        return <Building2 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityMessage = (activity: any) => {
    const { type, data, organization } = activity;
    
    if (type === 'USER_REGISTRATION') {
      return {
        ar: `تسجيل مستخدم جديد: ${data.email}`,
        en: `New user registration: ${data.email}`,
      };
    }
    
    if (type === 'JOIN_REQUEST') {
      return {
        ar: `طلب ${data.userId} الانضمام إلى ${organization?.nameAr}`,
        en: `${data.userId} requested to join ${organization?.nameEn}`,
      };
    }
    
    if (type === 'VERIFICATION_REQUEST') {
      return {
        ar: `طلب التحقق من مكتب ${organization?.nameAr}`,
        en: `Verification request for ${organization?.nameEn}`,
      };
    }

    return {
      ar: 'نشاط غير معروف',
      en: 'Unknown activity',
    };
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.slice(0, 10).map((activity, index) => (
          <li key={index}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-50">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {isArabic 
                        ? getActivityMessage(activity).ar
                        : getActivityMessage(activity).en}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {format(activity.date, 'MMM d, yyyy')}
                  </div>
                </div>
                {activity.type === 'VERIFICATION_REQUEST' && (
                  <div className="flex space-x-2">
                    <button
                      className="text-green-600 hover:text-green-800"
                      title={isArabic ? 'قبول' : 'Accept'}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title={isArabic ? 'رفض' : 'Reject'}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityList;