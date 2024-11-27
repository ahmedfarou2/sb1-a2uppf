import React, { useState } from 'react';
import { UserPlus, UserMinus, UserCog, Mail } from 'lucide-react';
import { useOrganizationStore } from '../../stores/organizationStore';
import { useAuth } from '../../contexts/AuthContext';

interface UserManagementProps {
  isArabic: boolean;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

const UserManagement: React.FC<UserManagementProps> = ({ isArabic }) => {
  const { currentOrganization } = useOrganizationStore();
  const { user } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Mock data - replace with actual API calls
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'MEMBER',
      status: 'ACTIVE',
    },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement invite logic
    setShowInviteModal(false);
    setInviteEmail('');
  };

  const handleRemoveMember = (memberId: string) => {
    // Implement remove member logic
  };

  const handleRoleChange = (memberId: string, newRole: 'ADMIN' | 'MEMBER') => {
    // Implement role change logic
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            {isArabic ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {isArabic
              ? `قائمة المستخدمين في ${currentOrganization?.name}`
              : `List of users in ${currentOrganization?.name}`}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isArabic ? 'دعوة مستخدم' : 'Invite User'}
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {isArabic ? 'المستخدم' : 'User'}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {isArabic ? 'الدور' : 'Role'}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {isArabic ? 'الحالة' : 'Status'}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">{isArabic ? 'إجراءات' : 'Actions'}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as 'ADMIN' | 'MEMBER')}
                          disabled={member.id === user?.id}
                          className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="ADMIN">{isArabic ? 'مدير' : 'Admin'}</option>
                          <option value="MEMBER">{isArabic ? 'عضو' : 'Member'}</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          member.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {member.id !== user?.id && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <UserMinus className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isArabic ? 'دعوة مستخدم جديد' : 'Invite New User'}
            </h3>
            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {isArabic ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isArabic ? 'إرسال الدعوة' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;