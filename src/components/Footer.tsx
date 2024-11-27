import React from 'react';

interface FooterProps {
  isArabic: boolean;
}

const Footer: React.FC<FooterProps> = ({ isArabic }) => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {isArabic ? 'الشركة' : 'Company'}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'من نحن' : 'About'}
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'تواصل معنا' : 'Contact'}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {isArabic ? 'الخدمات' : 'Services'}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'القوائم المالية' : 'Financial Statements'}
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'المراجعة' : 'Auditing'}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {isArabic ? 'الدعم' : 'Support'}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'المساعدة' : 'Help Center'}
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'الأسئلة الشائعة' : 'FAQ'}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {isArabic ? 'القانونية' : 'Legal'}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'الخصوصية' : 'Privacy'}
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  {isArabic ? 'الشروط' : 'Terms'}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            {isArabic
              ? '© 2024 Audit Unity. جميع الحقوق محفوظة.'
              : '© 2024 Audit Unity. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;