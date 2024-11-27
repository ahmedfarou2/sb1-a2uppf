import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizationStore } from '../stores/organizationStore';
import UserManagement from './admin/UserManagement';
import OrganizationChoice from './organization/OrganizationChoice';
import SystemAdminDashboard from './admin/SystemAdminDashboard';

interface DashboardProps {
  isArabic: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isArabic }) => {
  const { user, isSystemAdmin } = useAuth();
  const { currentOrganization } = useOrganizationStore();

  // If user is system admin, show system admin dashboard
  if (isSystemAdmin) {
    return <SystemAdminDashboard isArabic={isArabic} />;
  }

  // If user is not connected to any organization, show the organization choice screen
  if (!currentOrganization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {isArabic ? 'مرحباً بك في منصة المراجعة' : 'Welcome to AuditConnect'}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {isArabic 
                  ? 'لبدء استخدام المنصة، يرجى الانضمام إلى مؤسسة أو إنشاء مؤسسة جديدة'
                  : 'To get started, please join an organization or create a new one'}
              </p>
            </div>
            <OrganizationChoice isArabic={isArabic} />
          </div>
        </div>
      </div>
    );
  }

  // Regular user dashboard
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="border-b border-gray-200 pb-5 mb-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isArabic ? 'لوحة التحكم' : 'Dashboard'}
            </h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              {isArabic
                ? `مرحباً ${user?.nameAr || user?.nameEn} - ${currentOrganization?.name}`
                : `Welcome back, ${user?.nameEn || user?.nameAr} - ${currentOrganization?.name}`}
            </p>
          </div>

          {/* Organization Type Specific Content */}
          {currentOrganization.type === 'FIRM' ? (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">
                {isArabic ? 'إحصائيات مكتب المراجعة' : 'Audit Firm Statistics'}
              </h4>
              {/* Add audit firm specific content here */}
            </div>
          ) : (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">
                {isArabic ? 'إحصائيات الشركة' : 'Company Statistics'}
              </h4>
              {/* Add company specific content here */}
            </div>
          )}

          {/* Admin Section */}
          {currentOrganization.adminId === user?.id && (
            <UserManagement isArabic={isArabic} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;