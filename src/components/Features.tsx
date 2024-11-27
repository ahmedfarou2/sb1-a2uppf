import React from 'react';
import { FileCheck, Building2, Languages, Shield } from 'lucide-react';

interface FeaturesProps {
  isArabic: boolean;
}

const Features: React.FC<FeaturesProps> = ({ isArabic }) => {
  const features = [
    {
      icon: <FileCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Financial Statements",
      titleAr: "القوائم المالية",
      descEn: "Prepare and manage financial statements in both English and Arabic",
      descAr: "إعداد وإدارة القوائم المالية باللغتين العربية والإنجليزية"
    },
    {
      icon: <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Audit Firms Connection",
      titleAr: "الربط مع مكاتب المراجعة",
      descEn: "Direct connection with qualified audit firms",
      descAr: "ربط مباشر مع مكاتب المراجعة المؤهلة"
    },
    {
      icon: <Languages className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Bilingual Support",
      titleAr: "دعم ثنائي اللغة",
      descEn: "Full support for Arabic and English languages",
      descAr: "دعم كامل للغتين العربية والإنجليزية"
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      titleEn: "Secure File Exchange",
      titleAr: "تبادل آمن للملفات",
      descEn: "Secure platform for exchanging audit files",
      descAr: "منصة آمنة لتبادل ملفات المراجعة"
    }
  ];

  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {isArabic ? 'مميزات المنصة' : 'Platform Features'}
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            {isArabic
              ? 'حلول متكاملة لإدارة عمليات المراجعة والقوائم المالية'
              : 'Comprehensive solutions for managing audit processes and financial statements'}
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 dark:bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 dark:bg-indigo-600 rounded-md shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                      {isArabic ? feature.titleAr : feature.titleEn}
                    </h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      {isArabic ? feature.descAr : feature.descEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;