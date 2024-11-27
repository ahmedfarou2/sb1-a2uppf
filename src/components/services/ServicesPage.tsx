import React from 'react';
import { FileCheck, Building2, Shield, Users, ChartBar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServicesPageProps {
  isArabic: boolean;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ isArabic }) => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <FileCheck className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Financial Statement Preparation",
      titleAr: "إعداد القوائم المالية",
      descEn: "Comprehensive financial statement preparation with multi-language support",
      descAr: "إعداد شامل للقوائم المالية مع دعم متعدد اللغات"
    },
    {
      icon: <Building2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Audit Firm Management",
      titleAr: "إدارة مكاتب المراجعة",
      descEn: "Complete audit firm management and team collaboration tools",
      descAr: "أدوات متكاملة لإدارة مكاتب المراجعة والتعاون بين الفريق"
    },
    {
      icon: <Shield className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Quality Control",
      titleAr: "رقابة الجودة",
      descEn: "Robust quality control system for audit engagements",
      descAr: "نظام متين لرقابة جودة عمليات المراجعة"
    },
    {
      icon: <Users className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Team Collaboration",
      titleAr: "التعاون بين الفريق",
      descEn: "Real-time collaboration tools for audit teams",
      descAr: "أدوات تعاون مباشر لفرق المراجعة"
    },
    {
      icon: <ChartBar className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Analytics & Reporting",
      titleAr: "التحليل والتقارير",
      descEn: "Advanced analytics and customizable reporting tools",
      descAr: "أدوات متقدمة للتحليل والتقارير القابلة للتخصيص"
    },
    {
      icon: <FileText className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Document Management",
      titleAr: "إدارة المستندات",
      descEn: "Secure document management and sharing system",
      descAr: "نظام آمن لإدارة ومشاركة المستندات"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {isArabic ? 'خدماتنا' : 'Our Services'}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            {isArabic
              ? 'مجموعة متكاملة من الخدمات لتلبية احتياجات مكاتب المراجعة والشركات'
              : 'A comprehensive suite of services to meet the needs of audit firms and companies'}
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 dark:bg-indigo-900 ring-4 ring-white dark:ring-gray-800">
                    {service.icon}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {isArabic ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {isArabic ? service.descAr : service.descEn}
                  </p>
                </div>
                <span
                  className="absolute top-6 right-6 text-gray-300 dark:text-gray-700 group-hover:text-gray-400 dark:group-hover:text-gray-600"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isArabic ? 'ابدأ الآن' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;