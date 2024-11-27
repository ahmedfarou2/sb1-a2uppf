import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Link as LinkIcon, ExternalLink, AlertCircle } from 'lucide-react';
import { useOrganizationStore } from '../../../stores/organizationStore';
import { useAuth } from '../../../contexts/AuthContext';
import { Organization } from '../../../types/organization';

interface OrganizationConnectionsProps {
  isArabic: boolean;
}

const OrganizationConnections: React.FC<OrganizationConnectionsProps> = ({ isArabic }) => {
  const { user } = useAuth();
  const { organizations, joinRequests } = useOrganizationStore();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const pendingRequests = joinRequests.filter(
    request => request.userId === user?.id && request.status === 'PENDING'
  );

  const connectedOrganizations = organizations.filter(org => 
    org.adminId === user?.id || org.members?.some(member => member.userId === user?.id)
  );

  const handleConnect = () => {
    navigate('/organization-choice');
  };

  const handleDisconnect = (org: Organization) => {
    setSelectedOrg(org);
    setShowConfirmation(true);
  };

  const confirmDisconnect = () => {
    // Implement disconnect logic here
    setShowConfirmation(false);
    setSelectedOrg(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isArabic ? 'ربط المؤسسات' : 'Organization Connections'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isArabic 
            ? 'إدارة ارتباطاتك مع المؤسسات والشركات'
            : 'Manage your connections with organizations and companies'}
        </p>
      </div>

      {/* Connected Organizations */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isArabic ? 'المؤسسات المرتبطة' : 'Connected Organizations'}
          </h3>
          
          {connectedOrganizations.length > 0 ? (
            <div className="mt-4 space-y-4">
              {connectedOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {org.type === 'FIRM' ? (
                      <Building2 className="h-6 w-6 text-indigo-500" />
                    ) : (
                      <Users className="h-6 w-6 text-emerald-500" />
                    )}
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {isArabic ? org.nameAr : org.nameEn}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          org.type === 'FIRM' 
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {org.type === 'FIRM' 
                            ? (isArabic ? 'مكتب مراجعة' : 'Audit Firm')
                            : (isArabic ? 'شركة' : 'Company')}
                        </span>
                        {org.type === 'FIRM' && org.globalNetwork && (
                          <span className="ml-2 text-xs text-gray-500">
                            {org.globalNetwork}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect(org)}
                    className="ml-4 flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isArabic ? 'إلغاء الربط' : 'Disconnect'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-center py-8">
              <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {isArabic 
                  ? 'لا توجد مؤسسات مرتبطة حالياً'
                  : 'No organizations connected yet'}
              </p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleConnect}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {isArabic ? 'ربط مؤسسة جديدة' : 'Connect New Organization'}
            </button>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isArabic ? 'طلبات الربط المعلقة' : 'Pending Connection Requests'}
            </h3>
            <div className="mt-4 space-y-4">
              {pendingRequests.map((request) => {
                const org = organizations.find(o => o.id === request.organizationId);
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-6 w-6 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {isArabic ? org?.nameAr : org?.nameEn}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            org?.type === 'FIRM' 
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {org?.type === 'FIRM' 
                              ? (isArabic ? 'مكتب مراجعة' : 'Audit Firm')
                              : (isArabic ? 'شركة' : 'Company')}
                          </span>
                          <span className="ml-2 text-xs text-yellow-600">
                            {isArabic ? 'في انتظار الموافقة' : 'Awaiting Approval'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {isArabic ? 'تأكيد إلغاء الربط' : 'Confirm Disconnection'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {isArabic
                        ? `هل أنت متأكد من رغبتك في إلغاء الربط مع ${selectedOrg?.nameAr}؟`
                        : `Are you sure you want to disconnect from ${selectedOrg?.nameEn}?`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={confirmDisconnect}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                >
                  {isArabic ? 'تأكيد' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationConnections;