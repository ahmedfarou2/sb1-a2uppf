import React, { useState } from 'react';
import { useOrganizationStore } from '../../stores/organizationStore';
import { AuditFirm } from '../../types/organization';
import { Building2, CheckCircle, XCircle, Eye, ExternalLink, FileText, AlertTriangle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface PendingVerificationsProps {
  isArabic: boolean;
}

interface VerificationModalProps {
  firm: AuditFirm;
  isArabic: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onSuspend: (reason: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ 
  firm, 
  isArabic, 
  onClose, 
  onApprove, 
  onReject,
  onSuspend,
  onDelete
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsProcessing(true);
    try {
      await onReject(rejectReason);
    } finally {
      setIsProcessing(false);
      setShowRejectForm(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) return;
    setIsProcessing(true);
    try {
      await onSuspend(suspendReason);
    } finally {
      setIsProcessing(false);
      setShowSuspendForm(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await onDelete();
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderActionButtons = () => {
    if (isProcessing) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (firm.verificationStatus === 'VERIFIED') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">
                {isArabic ? 'تم التحقق من المكتب' : 'Firm is verified'}
              </span>
            </div>
            <button
              onClick={() => setShowSuspendForm(true)}
              className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
            >
              {isArabic ? 'تعليق' : 'Suspend'}
            </button>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isArabic ? 'حذف المكتب' : 'Delete Firm'}
          </button>
        </div>
      );
    }

    if (firm.verificationStatus === 'REJECTED') {
      return (
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">
                {isArabic ? 'تم رفض التحقق' : 'Verification rejected'}
              </span>
            </div>
            <p className="mt-2 text-sm text-red-600">
              {isArabic ? 'السبب: ' : 'Reason: '}{firm.rejectionReason}
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isArabic ? 'حذف المكتب' : 'Delete Firm'}
          </button>
        </div>
      );
    }

    if (firm.verificationStatus === 'SUSPENDED') {
      return (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-yellow-700">
                {isArabic ? 'المكتب معلق' : 'Firm is suspended'}
              </span>
            </div>
            <p className="mt-2 text-sm text-yellow-600">
              {isArabic ? 'السبب: ' : 'Reason: '}{firm.suspensionReason}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="flex-1 px-4 py-2 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
            >
              {isArabic ? 'إلغاء التعليق' : 'Remove Suspension'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              {isArabic ? 'حذف المكتب' : 'Delete Firm'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {isArabic ? 'إغلاق' : 'Close'}
        </button>
        <button
          onClick={() => setShowRejectForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          {isArabic ? 'رفض' : 'Reject'}
        </button>
        <button
          onClick={handleApprove}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          {isArabic ? 'قبول' : 'Approve'}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isArabic ? 'تفاصيل طلب التحقق' : 'Verification Request Details'}
          </h3>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Firm Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              {isArabic ? 'معلومات المكتب' : 'Firm Information'}
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {isArabic ? 'اسم المكتب بالعربية' : 'Firm Name (Arabic)'}
                </p>
                <p className="mt-1 text-sm text-gray-900">{firm.nameAr}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {isArabic ? 'اسم المكتب بالإنجليزية' : 'Firm Name (English)'}
                </p>
                <p className="mt-1 text-sm text-gray-900">{firm.nameEn}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {isArabic ? 'رقم الترخيص' : 'License Number'}
                </p>
                <p className="mt-1 text-sm text-gray-900">{firm.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {isArabic ? 'تاريخ التسجيل' : 'Registration Date'}
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(firm.createdAt), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Registrant Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              {isArabic ? 'معلومات المسجل' : 'Registrant Information'}
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {isArabic ? 'الاسم بالعربية' : 'Name (Arabic)'}
                </p>
                <p className="mt-1 text-sm text-gray-900">{firm.registeredBy.nameAr}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {isArabic ? 'الاسم بالإنجليزية' : 'Name (English)'}
                </p>
                <p className="mt-1 text-sm text-gray-900">{firm.registeredBy.nameEn}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {isArabic ? 'نوع التسجيل' : 'Registration Type'}
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {firm.registrationType === 'PARTNER' 
                    ? (isArabic ? 'شريك' : 'Partner')
                    : (isArabic ? 'موظف' : 'Employee')}
                </p>
              </div>
              {firm.registrationType === 'PARTNER' && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {isArabic ? 'رقم ترخيص الشريك' : 'Partner License Number'}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{firm.registeredBy.socpaNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              {isArabic ? 'المستندات' : 'Documents'}
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {firm.registeredBy.documents.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    {doc.name}
                    <ExternalLink className="inline-block h-4 w-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6">
            {showRejectForm ? (
              <div className="w-full">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  placeholder={isArabic ? 'سبب الرفض...' : 'Reason for rejection...'}
                />
                <div className="mt-3 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || isProcessing}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-300"
                  >
                    {isArabic ? 'تأكيد الرفض' : 'Confirm Rejection'}
                  </button>
                </div>
              </div>
            ) : showSuspendForm ? (
              <div className="w-full">
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  placeholder={isArabic ? 'سبب التعليق...' : 'Reason for suspension...'}
                />
                <div className="mt-3 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSuspendForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSuspend}
                    disabled={!suspendReason.trim() || isProcessing}
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:bg-gray-300"
                  >
                    {isArabic ? 'تأكيد التعليق' : 'Confirm Suspension'}
                  </button>
                </div>
              </div>
            ) : showDeleteConfirm ? (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">
                    {isArabic 
                      ? 'هل أنت متأكد من حذف هذا المكتب؟ لا يمكن التراجع عن هذا الإجراء.'
                      : 'Are you sure you want to delete this firm? This action cannot be undone.'}
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-300"
                  >
                    {isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            ) : (
              renderActionButtons()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PendingVerifications: React.FC<PendingVerificationsProps> = ({ isArabic }) => {
  const { organizations, approveVerification, rejectVerification, suspendFirm, deleteFirm } = useOrganizationStore();
  const [selectedFirm, setSelectedFirm] = useState<AuditFirm | null>(null);
  
  // Filter audit firms with pending verification
  const pendingFirms = organizations.filter(
    org => org.type === 'FIRM' && org.verificationStatus === 'PENDING'
  ) as AuditFirm[];

  const handleApprove = async () => {
    if (!selectedFirm) return;
    await approveVerification(selectedFirm.id);
    setSelectedFirm(null);
  };

  const handleReject = async (reason: string) => {
    if (!selectedFirm) return;
    await rejectVerification(selectedFirm.id, reason);
    setSelectedFirm(null);
  };

  const handleSuspend = async (reason: string) => {
    if (!selectedFirm) return;
    await suspendFirm(selectedFirm.id, reason);
    setSelectedFirm(null);
  };

  const handleDelete = async () => {
    if (!selectedFirm) return;
    await deleteFirm(selectedFirm.id);
    setSelectedFirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              {isArabic ? 'التحققات المعلقة' : 'Pending Verifications'}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {isArabic 
                ? 'قائمة مكاتب المراجعة في انتظار التحقق'
                : 'List of audit firms awaiting verification'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {pendingFirms.length > 0 ? (
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
                          {isArabic ? 'نوع التسجيل' : 'Registration Type'}
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
                      {pendingFirms.map((firm) => (
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
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {firm.registrationType === 'PARTNER' 
                              ? (isArabic ? 'شريك' : 'Partner')
                              : (isArabic ? 'موظف' : 'Employee')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(firm.createdAt), 'dd/MM/yyyy')}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => setSelectedFirm(firm)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Eye className="h-5 w-5" />
                              <span className="sr-only">{isArabic ? 'عرض' : 'View'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {isArabic ? 'لا توجد تحققات معلقة' : 'No Pending Verifications'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isArabic
                        ? 'لا توجد مكاتب مراجعة في انتظار التحقق حالياً'
                        : 'There are no audit firms awaiting verification at the moment'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedFirm && (
        <VerificationModal
          firm={selectedFirm}
          isArabic={isArabic}
          onClose={() => setSelectedFirm(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PendingVerifications;