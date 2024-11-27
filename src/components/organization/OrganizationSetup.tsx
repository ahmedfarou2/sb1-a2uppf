import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, AlertCircle, Building2, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';
import { useOrganizationStore } from '../../stores/organizationStore';
import ProfileCompletion, { calculateProfileCompletion } from '../shared/ProfileCompletion';

const schema = z.object({
  nameAr: z.string().min(2, 'Arabic name is required'),
  nameEn: z.string().min(2, 'English name is required'),
  globalNetwork: z.string().optional(),
  licenseNumber: z.string().min(1, 'License number is required'),
  registrationType: z.enum(['PARTNER', 'EMPLOYEE']),
  nationalId: z.string().min(10, 'National ID is required'),
  socpaNumber: z.string().optional(),
  allowedEmailDomain: z.string().optional(),
  restrictEmailDomain: z.boolean().default(false),
  documents: z.array(z.object({
    url: z.string(),
    type: z.string(),
    name: z.string(),
    category: z.enum(['NATIONAL_ID', 'COMMERCIAL_REGISTER', 'SOCPA_LICENSE', 'OTHER']),
  })).optional(),
  agreementAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the agreement to continue' }),
  }),
});

type OrganizationFormData = z.infer<typeof schema>;

interface OrganizationSetupProps {
  isArabic: boolean;
}

const OrganizationSetup: React.FC<OrganizationSetupProps> = ({ isArabic }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrganization } = useOrganizationStore();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const profileCompletion = calculateProfileCompletion(user);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<OrganizationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      registrationType: 'PARTNER',
      agreementAccepted: false,
      restrictEmailDomain: false,
    },
  });

  const registrationType = watch('registrationType');
  const agreementAccepted = watch('agreementAccepted');
  const restrictEmailDomain = watch('restrictEmailDomain');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      if (!user) return;

      // Simulate file upload and get URLs
      const documentUrls = uploadedFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        category: 'OTHER' as const,
      }));

      await createOrganization(
        data.nameAr,
        data.nameEn,
        'FIRM',
        data.licenseNumber,
        user.id,
        data.registrationType,
        {
          nameAr: user.nameAr,
          nameEn: user.nameEn,
          nationalId: data.nationalId,
          socpaNumber: data.socpaNumber,
          role: data.registrationType,
          documents: documentUrls,
        }
      );

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
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
                    ? 'يجب إكمال ملفك الشخصي قبل إنشاء المكتب'
                    : 'Please complete your profile before creating a firm'}
                </p>
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
            {isArabic ? 'إعداد مكتب المراجعة' : 'Audit Firm Setup'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isArabic
              ? 'قم بإدخال معلومات مكتب المراجعة'
              : 'Enter your audit firm information'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-2 md:gap-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {isArabic ? 'المعلومات الأساسية' : 'Basic Information'}
                </h3>
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700">
                      {isArabic ? 'اسم المكتب بالعربية' : 'Firm Name (Arabic)'}
                    </label>
                    <input
                      type="text"
                      {...register('nameAr')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      dir="rtl"
                    />
                    {errors.nameAr && (
                      <p className="mt-1 text-sm text-red-600">
                        {isArabic ? 'اسم المكتب بالعربية مطلوب' : errors.nameAr.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">
                      {isArabic ? 'اسم المكتب بالإنجليزية' : 'Firm Name (English)'}
                    </label>
                    <input
                      type="text"
                      {...register('nameEn')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.nameEn && (
                      <p className="mt-1 text-sm text-red-600">
                        {isArabic ? 'اسم المكتب بالإنجليزية مطلوب' : errors.nameEn.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                      {isArabic ? 'رقم ترخيص المكتب' : 'Firm License Number'}
                    </label>
                    <input
                      type="text"
                      {...register('licenseNumber')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {isArabic ? 'رقم ترخيص المكتب مطلوب' : errors.licenseNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="globalNetwork" className="block text-sm font-medium text-gray-700">
                      {isArabic ? 'الشبكة العالمية' : 'Global Network'}
                    </label>
                    <input
                      type="text"
                      {...register('globalNetwork')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {isArabic ? 'معلومات التسجيل' : 'Registration Information'}
                </h3>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {isArabic ? 'نوع التسجيل' : 'Registration Type'}
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          {...register('registrationType')}
                          value="PARTNER"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className="ml-3 block text-sm font-medium text-gray-700">
                          {isArabic ? 'شريك' : 'Partner'}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          {...register('registrationType')}
                          value="EMPLOYEE"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label className="ml-3 block text-sm font-medium text-gray-700">
                          {isArabic ? 'موظف' : 'Employee'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                      {isArabic ? 'رقم الهوية' : 'National ID'}
                    </label>
                    <input
                      type="text"
                      {...register('nationalId')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.nationalId && (
                      <p className="mt-1 text-sm text-red-600">
                        {isArabic ? 'رقم الهوية مطلوب' : errors.nationalId.message}
                      </p>
                    )}
                  </div>

                  {registrationType === 'PARTNER' && (
                    <div>
                      <label htmlFor="socpaNumber" className="block text-sm font-medium text-gray-700">
                        {isArabic ? 'رقم ترخيص الشريك' : 'Partner License Number'}
                      </label>
                      <input
                        type="text"
                        {...register('socpaNumber')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Email Domain Restriction */}
            <div className="mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('restrictEmailDomain')}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="restrictEmailDomain" className="font-medium text-gray-700">
                    {isArabic 
                      ? 'تقييد طلبات الربط بنطاق بريد إلكتروني محدد'
                      : 'Restrict join requests to specific email domain'}
                  </label>
                  <p className="text-gray-500">
                    {isArabic
                      ? 'سيتم السماح فقط للمستخدمين الذين لديهم بريد إلكتروني بنطاق محدد بطلب الربط مع المكتب'
                      : 'Only users with email addresses from a specific domain will be allowed to request joining the firm'}
                  </p>
                </div>
              </div>

              {restrictEmailDomain && (
                <div className="mt-3">
                  <label htmlFor="allowedEmailDomain" className="block text-sm font-medium text-gray-700">
                    {isArabic ? 'نطاق البريد الإلكتروني المسموح به' : 'Allowed Email Domain'}
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      {...register('allowedEmailDomain')}
                      placeholder="example.com"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                {isArabic ? 'المستندات المطلوبة' : 'Required Documents'}
              </label>
              <div className="mt-1">
                <div {...getRootProps()} className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <input {...getInputProps()} />
                      <p className="pl-1">
                        {isArabic
                          ? 'اسحب وأفلت الملفات هنا أو انقر للاختيار'
                          : 'Drag and drop files here or click to select'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500">
                      <FileText className="h-4 w-4 mr-2" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Agreement */}
            <div className="mt-6">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('agreementAccepted')}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreementAccepted" className="font-medium text-gray-700">
                    {isArabic
                      ? 'أقر بصحة البيانات المقدمة وأنني مفوض بالتسجيل'
                      : 'I confirm the accuracy of the provided information and my authorization to register'}
                  </label>
                  {errors.agreementAccepted && (
                    <p className="mt-1 text-sm text-red-600">
                      {isArabic
                        ? 'يجب الموافقة على الإقرار للمتابعة'
                        : errors.agreementAccepted.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!agreementAccepted}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isArabic ? 'إنشاء المكتب' : 'Create Firm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSetup;