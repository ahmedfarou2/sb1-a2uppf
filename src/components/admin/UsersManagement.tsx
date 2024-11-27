import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrganizationStore } from '../../stores/organizationStore';
import { User, UserCircle, Building2, Mail, Phone, Ban, CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface UsersManagementProps {
  isArabic: boolean;
}

type FilterStatus = 'ALL' | 'ACTIVE' | 'PENDING' | 'SUSPENDED';
type FilterType = 'ALL' | 'CONNECTED' | 'UNCONNECTED';

const UsersManagement: React.FC<UsersManagementProps> = ({ isArabic }) => {
  const { users } = useAuth();
  const { organizations } = useOrganizationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Get all users who are members of organizations
  const connectedUsers = new Set(
    organizations.flatMap(org => org.members.map(member => member.userId))
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = 
      filterType === 'ALL' ||
      (filterType === 'CONNECTED' && connectedUsers.has(user.id)) ||
      (filterType === 'UNCONNECTED' && !connectedUsers.has(user.id));

    return matchesSearch && matchesType;
  });

  const getUserOrganizations = (userId: string) => {
    return organizations.filter(org => 
      org.members.some(member => member.userId === userId)
    );
  };

  const getStatusBadge = (user: any) => {
    if (user.suspended) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Ban className="w-4 h-4 mr-1" />
          {isArabic ? 'معلق' : 'Suspended'}
        </span>
      );
    }

    if (user.verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          {isArabic ? 'نشط' : 'Active'}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertTriangle className="w-4 h-4 mr-1" />
        {isArabic ? 'قيد التفعيل' : 'Pending'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              {isArabic ? 'إدارة المستخدمين' : 'Users Management'}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {isArabic 
                ? 'قائمة بجميع المستخدمين المسجلين في النظام'
                : 'A list of all users registered in the system'}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
                  ? 'البحث بالاسم أو البريد الإلكتروني...'
                  : 'Search by name or email...'}
              />
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="h-5 w-5 mr-2" />
              {isArabic ? 'تصفية' : 'Filter'}
            </button>
            {showFilterMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  {(['ALL', 'CONNECTED', 'UNCONNECTED'] as FilterType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterMenu(false);
                      }}
                      className={`${
                        filterType === type ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                      role="menuitem"
                    >
                      {isArabic ? {
                        'ALL': 'الكل',
                        'CONNECTED': 'مرتبط بمؤسسة',
                        'UNCONNECTED': 'غير مرتبط'
                      }[type] : {
                        'ALL': 'All Users',
                        'CONNECTED': 'Connected Users',
                        'UNCONNECTED': 'Unconnected Users'
                      }[type]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {filteredUsers.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                          {isArabic ? 'المستخدم' : 'User'}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {isArabic ? 'معلومات الاتصال' : 'Contact Info'}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {isArabic ? 'المؤسسات المرتبطة' : 'Connected Organizations'}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {isArabic ? 'الحالة' : 'Status'}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {isArabic ? 'تاريخ التسجيل' : 'Registration Date'}
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">{isArabic ? 'إجراءات' : 'Actions'}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <UserCircle className="h-6 w-6 text-gray-400" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {isArabic ? user.nameAr : user.nameEn}
                                </div>
                                <div className="text-gray-500">
                                  {isArabic ? user.titleAr : user.titleEn}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1 text-gray-400" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-col space-y-1">
                              {getUserOrganizations(user.id).map((org) => (
                                <div key={org.id} className="flex items-center">
                                  <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>{isArabic ? org.nameAr : org.nameEn}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {getStatusBadge(user)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => setSelectedUser(user.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {isArabic ? 'إدارة' : 'Manage'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {isArabic ? 'لا توجد نتائج' : 'No results found'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isArabic
                        ? 'لا يوجد مستخدمون يطابقون معايير البحث'
                        : 'No users match your search criteria'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;