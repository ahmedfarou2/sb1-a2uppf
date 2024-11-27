import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, UserPlus, CircleDollarSign, FileCheck, Shield } from 'lucide-react';

interface OrganizationChoiceProps {
  isArabic: boolean;
}

const OrganizationChoice: React.FC<OrganizationChoiceProps> = ({ isArabic }) => {
  const navigate = useNavigate();

  const features = {
    firm: [
      {
        icon: <FileCheck className="h-5 w-5 text-indigo-400" />,
        titleEn: "Manage Audit Engagements",
        titleAr: "إدارة عمليات المراجعة"
      },
      {
        icon: <Users className="h-5 w-5 text-indigo-400" />,
        titleEn: "Team Management",
        titleAr: "إدارة فريق العمل"
      },
      {
        icon: <Shield className="h-5 w-5 text-indigo-400" />,
        titleEn: "Quality Control",
        titleAr: "رقابة الجودة"
      }
    ],
    company: [
      {
        icon: <CircleDollarSign className="h-5 w-5 text-emerald-400" />,
        titleEn: "Financial Statements",
        titleAr: "القوائم المالية"
      },
      {
        icon: <Building2 className="h-5 w-5 text-emerald-400" />,
        titleEn: "Connect with Auditors",
        titleAr: "التواصل مع المراجعين"
      },
      {
        icon: <FileCheck className="h-5 w-5 text-emerald-400" />,
        titleEn: "Document Management",
        titleAr: "إدارة المستندات"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {isArabic ? 'مرحباً بك في منصة المراجعة' : 'Welcome to AuditConnect'}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {isArabic 
              ? 'اختر نوع المؤسسة التي تريد الانضمام إليها أو إنشائها'
              : 'Choose the type of organization you want to join or create'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Audit Firm Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl">
                  <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                  {isArabic ? 'مكتب مراجعة' : 'Audit Firm'}
                </span>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                {isArabic ? 'إنشاء أو الانضمام لمكتب مراجعة' : 'Create or Join an Audit Firm'}
              </h2>
              <ul className="mt-4 space-y-3">
                {features.firm.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                    {feature.icon}
                    <span className="text-gray-600">
                      {isArabic ? feature.titleAr : feature.titleEn}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => navigate('/organization-setup', { state: { type: 'FIRM' } })}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  {isArabic ? 'إنشاء مكتب مراجعة' : 'Create Audit Firm'}
                </button>
                <button
                  onClick={() => navigate('/join-organization', { state: { type: 'FIRM' } })}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-indigo-600 rounded-lg text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {isArabic ? 'انضم لمكتب مراجعة' : 'Join Existing Firm'}
                </button>
              </div>
            </div>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-xl">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-100 rounded-full">
                  {isArabic ? 'شركة' : 'Company'}
                </span>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                {isArabic ? 'إنشاء أو الانضمام لشركة' : 'Create or Join a Company'}
              </h2>
              <ul className="mt-4 space-y-3">
                {features.company.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                    {feature.icon}
                    <span className="text-gray-600">
                      {isArabic ? feature.titleAr : feature.titleEn}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => navigate('/organization-setup', { state: { type: 'COMPANY' } })}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Users className="mr-2 h-5 w-5" />
                  {isArabic ? 'إنشاء شركة' : 'Create Company'}
                </button>
                <button
                  onClick={() => navigate('/join-organization', { state: { type: 'COMPANY' } })}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-emerald-600 rounded-lg text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {isArabic ? 'انضم لشركة' : 'Join Existing Company'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            {isArabic 
              ? 'تحتاج مساعدة؟ تواصل مع فريق الدعم'
              : 'Need help? Contact our support team'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationChoice;