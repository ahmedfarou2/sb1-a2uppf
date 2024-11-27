import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppearanceStore } from '../stores/appearanceStore';

interface HeroProps {
  isArabic: boolean;
}

const Hero: React.FC<HeroProps> = ({ isArabic }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isVerticalLayout } = useAppearanceStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">
                  Audit Unity
                </span>{' '}
                <span className="block text-indigo-600 dark:text-indigo-400">
                  {isArabic ? 'منصة المراجعة المتكاملة' : 'Unified Audit Platform'}
                </span>
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                {isArabic
                  ? 'منصة متخصصة تربط بين مكاتب المراجعة والشركات لإعداد وتبادل القوائم المالية والتقارير بكفاءة عالية'
                  : 'Specialized platform connecting audit firms with companies for efficient financial statement preparation and report exchange'}
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  {isArabic ? 'ابدأ الآن' : 'Get Started'}
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  {isArabic ? 'تعرف أكثر' : 'Learn More'}
                </button>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="mt-12 sm:mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-auto object-cover"
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2340&q=80"
                  alt="Financial analysis and reporting"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;