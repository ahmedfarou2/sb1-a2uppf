import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrganizationStore } from '../../stores/organizationStore';
import { Building2, Search, AlertCircle, Plus } from 'lucide-react';
import ProfileCompletion, { calculateProfileCompletion } from '../shared/ProfileCompletion';

interface JoinOrganizationProps {
  isArabic: boolean;
}

const JoinOrganization: React.FC<JoinOrganizationProps> = ({ isArabic }) => {
  const { user } = useAuth();
  const { organizations, joinOrganization } = useOrganizationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const organizationType = (location.state?.type || 'FIRM') as 'FIRM' | 'COMPANY';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [showError, setShowError] = useState(false);
  
  const profileCompletion = calculateProfileCompletion(user);

  const filteredOrganizations = organizations.filter(org => 
    org.type === organizationType &&
    (org.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     org.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     org.registrationNumber?.includes(searchTerm))
  );

  const handleJoin = async () => {
    if (!selectedOrg) {
      setShowError(true);
      return;
    }

    try {
      if (user) {
        await joinOrganization(selectedOrg, user.id);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to join organization:', error);
    }
  };

  const handleCreateNew = () => {
    navigate('/organization-setup', { state: { type: organizationType } });
  };

  if (profileCompletion < 100) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ProfileCompletion isArabic={isArabic} />
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {isArabic
                    ? 'يجب إكمال ملفك الشخصي قبل الانضمام لمؤسسة'
                    : 'Please complete your profile before joining an organization'}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/settings', { state: { section: 'profile' } })}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    {isArabic ? 'أكمل ملفك الشخصي' : 'Complete Your Profile'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            {isArabic 
              ? (organizationType === 'FIRM' ? 'انضم لمكتب مراجعة' : 'انضم لشركة')
              : (organizationType === 'FIRM' ? 'Join an Audit Firm' : 'Join a Company')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isArabic
              ? 'ابحث عن المؤسسة التي تريد الانضمام إليها'
              : 'Search for the organization you want to join'}
          </p>
        </div>

        <div className="mt-8">
          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={isArabic 
                  ? 'ابحث بالاسم أو رقم التسجيل'
                  : 'Search by name or registration number'}
              />
            </div>
          </div>

          {/* Organizations List */}
          <div className="mt-8 space-y-4">
            {filteredOrganizations.map((org) => (
              <div
                key={org.id}
                className={`relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 transition-colors ${
                  selectedOrg === org.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
                onClick={() => setSelectedOrg(org.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {isArabic ? org.nameAr : org.nameEn}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isArabic ? 'رقم التسجيل: ' : 'Registration Number: '}
                      {org.registrationNumber}
                    </p>
                  </div>
                  {org.type === 'FIRM' && org.globalNetwork && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {org.globalNetwork}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filteredOrganizations.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {isArabic ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isArabic
                    ? 'جرب البحث بكلمات مختلفة'
                    : 'Try searching with different terms'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {isArabic 
                      ? (organizationType === 'FIRM' ? 'إنشاء مكتب مراجعة جديد' : 'إنشاء شركة جديدة')
                      : (organizationType === 'FIRM' ? 'Create New Audit Firm' : 'Create New Company')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {showError && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {isArabic
                      ? 'الرجاء اختيار مؤسسة للانضمام إليها'
                      : 'Please select an organization to join'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Join Button */}
          {filteredOrganizations.length > 0 && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleJoin}
                disabled={!selectedOrg}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isArabic ? 'تقديم طلب الانضمام' : 'Submit Join Request'}
              </button>
            </div>
          )}

          {/* Create New Link */}
          {filteredOrganizations.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="mr-1 h-4 w-4" />
                {isArabic 
                  ? (organizationType === 'FIRM' ? 'لم تجد مكتب المراجعة؟ أنشئ مكتباً جديداً' : 'لم تجد الشركة؟ أنشئ شركة جديدة')
                  : (organizationType === 'FIRM' ? "Can't find your firm? Create a new one" : "Can't find your company? Create a new one")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinOrganization;