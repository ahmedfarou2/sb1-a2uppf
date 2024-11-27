import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ShieldAlert, Activity, UserMinus } from 'lucide-react';
import { useOrganizationStore } from '../../stores/organizationStore';
import { useAuth } from '../../contexts/AuthContext';
import RecentActivityList from './RecentActivityList';

interface SystemAdminDashboardProps {
  isArabic: boolean;
}

const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({ isArabic }) => {
  const navigate = useNavigate();
  const { organizations } = useOrganizationStore();
  const { users } = useAuth();
  
  // Calculate actual statistics
  const auditFirms = organizations.filter(org => org.type === 'FIRM');
  const companies = organizations.filter(org => org.type === 'COMPANY');
  
  // Get all users who are members of organizations
  const connectedUsers = new Set(
    organizations.flatMap(org => org.members.map(member => member.userId))
  );
  
  const totalUsers = users.length;
  const unconnectedUsers = users.filter(user => !connectedUsers.has(user.id)).length;
  const pendingVerifications = auditFirms.filter(firm => firm.verificationStatus === 'PENDING').length;

  const stats = [
    {
      id: 1,
      name: { en: 'Total Users', ar: 'إجمالي المستخدمين' },
      stat: totalUsers.toString(),
      icon: Users,
      description: { 
        en: 'Total registered users',
        ar: 'إجمالي المستخدمين المسجلين'
      },
      onClick: () => navigate('/admin/users')
    },
    {
      id: 2,
      name: { en: 'Audit Firms', ar: 'مكاتب المراجعة' },
      stat: auditFirms.length.toString(),
      icon: Building2,
      description: {
        en: 'Registered audit firms',
        ar: 'مكاتب المراجعة المسجلة'
      },
      onClick: () => navigate('/admin/firms')
    },
    {
      id: 3,
      name: { en: 'Companies', ar: 'الشركات' },
      stat: companies.length.toString(),
      icon: Building2,
      description: {
        en: 'Registered companies',
        ar: 'الشركات المسجلة'
      },
      onClick: () => navigate('/admin/companies')
    },
    {
      id: 4,
      name: { en: 'Pending Verifications', ar: 'التحققات المعلقة' },
      stat: pendingVerifications.toString(),
      icon: ShieldAlert,
      description: {
        en: 'Firms awaiting verification',
        ar: 'المكاتب في انتظار التحقق'
      },
      onClick: () => navigate('/admin/verifications')
    },
    {
      id: 5,
      name: { en: 'Unconnected Users', ar: 'المستخدمون غير المرتبطين' },
      stat: unconnectedUsers.toString(),
      icon: UserMinus,
      description: {
        en: 'Users not connected to any organization',
        ar: 'المستخدمون غير المرتبطين بأي مؤسسة'
      },
      onClick: () => navigate('/admin/users?filter=unconnected')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isArabic ? 'لوحة تحكم مدير النظام' : 'System Admin Dashboard'}
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {isArabic 
                ? 'نظرة عامة على النظام وإحصائياته'
                : 'System overview and statistics'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                className="relative bg-white dark:bg-gray-800 px-4 py-5 shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {isArabic ? item.name.ar : item.name.en}
                    </dt>
                    <dd className="mt-3">
                      <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {item.stat}
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {isArabic ? item.description.ar : item.description.en}
                      </p>
                    </dd>
                  </div>
                  <div className="p-3 bg-indigo-500 dark:bg-indigo-600 rounded-md">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {isArabic ? 'النشاط الأخير' : 'Recent Activity'}
                </h3>
                <Activity className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <RecentActivityList isArabic={isArabic} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;