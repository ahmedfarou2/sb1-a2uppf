import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Filter, AlertTriangle, CheckCircle, XCircle, Eye, MoreVertical } from 'lucide-react';
import { useOrganizationStore } from '../../stores/organizationStore';
import { AuditFirm } from '../../types/organization';
import { format } from 'date-fns';

interface RegisteredAuditFirmsProps {
  isArabic: boolean;
}

type FilterStatus = 'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';

const RegisteredAuditFirms: React.FC<RegisteredAuditFirmsProps> = ({ isArabic }) => {
  const navigate = useNavigate();
  const { organizations } = useOrganizationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter audit firms
  const auditFirms = organizations.filter(org => 
    org.type === 'FIRM'
  ) as AuditFirm[];

  const filteredFirms = auditFirms.filter(firm => {
    const matchesSearch = 
      firm.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firm.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firm.licenseNumber.includes(searchTerm);

    const matchesStatus = 
      filterStatus === 'ALL' || 
      firm.verificationStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            {isArabic ? 'تم التحقق' : 'Verified'}
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            {isArabic ? 'قيد المراجعة' : 'Pending'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            {isArabic ? 'مرفوض' : 'Rejected'}
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            {isArabic ? 'معلق' : 'Suspended'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              {isArabic ? 'مكاتب المراجعة المسجلة' : 'Registered Audit Firms'}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {isArabic 
                ? 'قائمة بجميع مكاتب المراجعة المسجلة في النظام'
                : 'A list of all audit firms registered in the system'}
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
                  ? 'البحث بالاسم أو رقم الترخيص...'
                  : 'Search by name or license number...'}
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
                  {(['ALL', 'VERIFIED', 'PENDING', 'REJECTED', 'SUSPENDED'] as FilterStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilterMenu(false);
                      }}
                      className={`${
                        filterStatus === status ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                      role="menuitem"
                    >
                      {isArabic ? {
                        'ALL': 'الكل',
                        'VERIFIED': 'تم التحقق',
                        'PENDING': 'قيد المراجعة',
                        'REJECTED': 'مرفوض',
                        'SUSPENDED': 'معلق'
                      }[status] : {
                        'ALL': 'All',
                        'VERIFIED': 'Verified',
                        'PENDING': 'Pending',
                        'REJECTED': 'Rejected',
                        'SUSPENDED': 'Suspended'
                      }[status]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Firms List */}
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {filteredFirms.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                          {isArabic ? 'المكتب' : 'Firm'}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {isArabic ? 'رقم الترخيص' : 'License Number'}
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
                      {filteredFirms.map((firm) => (
                        <tr key={firm.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                            <div className="flex items-center">
                              <Building2 className="h-5 w-5 text-gray-400" />
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {isArabic ? firm.nameAr : firm.nameEn}
                                </div>
                                <div className="text-gray-500">
                                  {isArabic ? firm.nameEn : firm.nameAr}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {firm.licenseNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {getStatusBadge(firm.verificationStatus)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(firm.createdAt), 'dd/MM/yyyy')}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => navigate(`/admin/firms/${firm.id}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Eye className="h-5 w-5" />
                                <span className="sr-only">{isArabic ? 'عرض' : 'View'}</span>
                              </button>
                              <button className="text-gray-400 hover:text-gray-500">
                                <MoreVertical className="h-5 w-5" />
                                <span className="sr-only">{isArabic ? 'المزيد' : 'More'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {isArabic ? 'لا توجد نتائج' : 'No results found'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isArabic
                        ? 'لا توجد مكاتب مراجعة تطابق معايير البحث'
                        : 'No audit firms match your search criteria'}
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

export default RegisteredAuditFirms;