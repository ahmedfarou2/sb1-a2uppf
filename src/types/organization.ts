export type OrganizationType = 'FIRM' | 'COMPANY';

export interface BaseOrganization {
  id: string;
  nameAr: string;
  nameEn: string;
  type: OrganizationType;
  registrationNumber: string;
  subdomain: string;
  adminId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  members: OrganizationMember[];
  createdAt: string;
  updatedAt: string;
  allowedEmailDomain?: string; // New field
}

export interface AuditFirm extends BaseOrganization {
  type: 'FIRM';
  globalNetwork?: string;
  licenseNumber: string;
  registrationType: 'PARTNER' | 'EMPLOYEE';
  registeredBy: {
    nameAr: string;
    nameEn: string;
    nationalId: string;
    socpaNumber?: string;
    role: string;
    documents: {
      url: string;
      type: string;
      name: string;
      category: 'NATIONAL_ID' | 'COMMERCIAL_REGISTER' | 'SOCPA_LICENSE' | 'OTHER';
    }[];
  };
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationDate?: string;
  agreementAccepted: boolean;
  agreementDate: string;
}

export interface Company extends BaseOrganization {
  type: 'COMPANY';
  commercialRegistration: string;
  taxRegistration?: string;
}

export type Organization = AuditFirm | Company;

export interface OrganizationMember {
  userId: string;
  organizationId: string;
  role: 'ADMIN' | 'MEMBER';
  permissions: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  joinedAt: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  organizationId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}