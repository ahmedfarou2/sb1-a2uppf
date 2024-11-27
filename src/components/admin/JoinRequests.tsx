import React from 'react';
import { Check, X, User } from 'lucide-react';
import { useOrganizationStore } from '../../stores/organizationStore';

interface JoinRequestsProps {
  isArabic: boolean;
  organizationId: string;
}

const JoinRequests: React.FC<JoinRequestsProps> = ({ isArabic, organizationId }) => {
  const { getJoinRequests, approveJoinRequest, rejectJoinRequest } = useOrganizationStore();
  const requests = getJoinRequests(organizationId);

  const handleApprove = async (requestId: string) => {
    try {
      await approveJoinRequest(requestId, ['VIEW', 'EDIT']); // Default permissions
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectJoinRequest(requestId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {isArabic ? 'طلبات الانضمام' : 'Join Requests'}
        </h3>
        <div className="mt-4 divide-y divide-gray-200">
          {requests.map((request) => (
            <div key={request.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {request.userId}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {isArabic ? 'قبول' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="h-4 w-4 mr-1" />
                  {isArabic ? 'رفض' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinRequests;