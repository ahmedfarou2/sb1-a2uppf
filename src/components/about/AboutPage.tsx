import React from 'react';
import { Shield, Users, Globe2, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  isArabic: boolean;
}

const AboutPage: React.FC<AboutPageProps> = ({ isArabic }) => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Secure & Reliable",
      titleAr: "آمن وموثوق",
      descEn: "Enterprise-grade security for your sensitive financial data",
      descAr: "أمان على مستوى المؤسسات لبياناتك المالية الحساسة"
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Collaborative Platform",
      titleAr: "منصة تعاونية",
      descEn: "Seamless collaboration between audit firms and companies",
      descAr: "تعاون سلس بين مكاتب المراجعة والشركات"
    },
    {
      icon: <Globe2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Multi-language Support",
      titleAr: "دعم متعدد اللغات",
      descEn: "Full support for Arabic and English languages",
      descAr: "دعم كامل للغتين العربية والإنجليزية"
    }
  ];

  const stats = [
    {
      numberEn: "100+",
      numberAr: "+١٠٠",
      labelEn: "Audit Firms",
      labelAr: "مكتب مراجعة"
    },
    {
      numberEn: "1000+",
      numberAr: "+١٠٠٠",
      labelEn: "Companies",
      labelAr: "شركة"
    },
    {
      numberEn: "5000+",
      numberAr: "+٥٠٠٠",
      labelEn: "Users",
      labelAr: "مستخدم"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">
                    {isArabic ? 'منصة المراجعة' : 'AuditConnect'}
                  </span>{' '}
                  <span className="block text-indigo-600 dark:text-indigo-400 xl:inline">
                    {isArabic ? 'الأولى في المنطقة' : 'First in the Region'}
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {isArabic
                    ? 'نقدم حلولاً متكاملة لمكاتب المراجعة والشركات لإدارة عمليات المراجعة وإعداد القوائم المالية بكفاءة عالية'
                    : 'We provide comprehensive solutions for audit firms and companies to manage audit engagements and prepare financial statements efficiently'}
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
              {isArabic ? 'مميزاتنا' : 'Our Features'}
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {isArabic ? 'حلول متكاملة للمراجعة المالية' : 'Complete Financial Audit Solutions'}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 dark:bg-indigo-600 text-white">
                    {feature.icon}
                  </div>
                  <p className="mr-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {isArabic ? feature.titleAr : feature.titleEn}
                  </p>
                  <p className="mt-2 mr-16 text-base text-gray-500 dark:text-gray-400">
                    {isArabic ? feature.descAr : feature.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-800 dark:bg-indigo-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {isArabic ? 'إحصائيات المنصة' : 'Platform Statistics'}
            </h2>
            <p className="mt-3 text-xl text-indigo-200 sm:mt-4">
              {isArabic
                ? 'نفخر بثقة عملائنا وشركائنا في المنطقة'
                : 'Trusted by clients and partners across the region'}
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                  {isArabic ? stat.labelAr : stat.labelEn}
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-white">
                  {isArabic ? stat.numberAr : stat.numberEn}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;