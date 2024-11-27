import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization, OrganizationType, JoinRequest, AuditFirm } from '../types/organization';

interface JoinRequestWithReason {
  id: string;
  userId: string;
  organizationId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
}

interface OrganizationStore {
  organizations: Organization[];
  currentOrganization: Organization | null;
  joinRequests: JoinRequestWithReason[];
  notifications: {
    id: string;
    userId: string;
    message: string;
    type: 'SUCCESS' | 'ERROR' | 'INFO';
    read: boolean;
    createdAt: string;
  }[];

  createOrganization: (
    nameAr: string,
    nameEn: string,
    type: OrganizationType,
    registrationNumber: string,
    adminId: string,
    registrationType?: 'PARTNER' | 'EMPLOYEE',
    registeredBy?: {
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
    }
  ) => Promise<void>;

  joinOrganization: (organizationId: string, userId: string) => Promise<void>;
  approveJoinRequest: (requestId: string) => Promise<void>;
  rejectJoinRequest: (requestId: string, reason: string) => Promise<void>;
  getJoinRequests: (organizationId: string) => JoinRequestWithReason[];
  getPendingJoinRequestsCount: (organizationId: string) => number;
  getNotifications: (userId: string) => typeof notifications;
  markNotificationAsRead: (notificationId: string) => void;
  validateLicenseNumber: (number: string) => Promise<boolean>;
  validateSocpaNumber: (number: string) => Promise<boolean>;
  generateSubdomain: (name: string) => Promise<string>;
  approveVerification: (organizationId: string) => Promise<void>;
  rejectVerification: (organizationId: string, reason: string) => Promise<void>;
  suspendFirm: (organizationId: string, reason: string) => Promise<void>;
  deleteFirm: (organizationId: string) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set, get) => ({
      organizations: [],
      currentOrganization: null,
      joinRequests: [],
      notifications: [],

      createOrganization: async (nameAr, nameEn, type, registrationNumber, adminId, registrationType, registeredBy) => {
        const isValid = await get().validateLicenseNumber(registrationNumber);
        if (!isValid) {
          throw new Error('Invalid license number format');
        }

        const subdomain = await get().generateSubdomain(nameEn);

        const newOrg: Organization = {
          id: Math.random().toString(36).substr(2, 9),
          nameAr,
          nameEn,
          type,
          registrationNumber,
          subdomain,
          adminId,
          status: 'PENDING',
          members: [{
            userId: adminId,
            organizationId: '',
            role: 'ADMIN',
            permissions: ['ADMIN'],
            status: 'APPROVED',
            joinedAt: new Date().toISOString(),
          }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(type === 'FIRM' && {
            registrationType,
            registeredBy,
            verificationStatus: 'PENDING',
            agreementAccepted: true,
            agreementDate: new Date().toISOString(),
          }),
        };

        set((state) => ({
          organizations: [...state.organizations, newOrg],
          currentOrganization: newOrg,
        }));

        localStorage.setItem('userOrgId', newOrg.id);
      },

      joinOrganization: async (organizationId, userId) => {
        const newRequest: JoinRequestWithReason = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          organizationId,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          joinRequests: [...state.joinRequests, newRequest],
          notifications: [...state.notifications, {
            id: Math.random().toString(36).substr(2, 9),
            userId: state.organizations.find(org => org.id === organizationId)?.adminId || '',
            message: 'New join request received',
            type: 'INFO',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },

      approveJoinRequest: async (requestId) => {
        const request = get().joinRequests.find(req => req.id === requestId);
        if (!request) return;

        set((state) => ({
          joinRequests: state.joinRequests.map((req) =>
            req.id === requestId ? { ...req, status: 'APPROVED' } : req
          ),
          organizations: state.organizations.map((org) =>
            org.id === request.organizationId
              ? {
                  ...org,
                  members: [
                    ...(org.members || []),
                    {
                      userId: request.userId,
                      organizationId: org.id,
                      role: 'MEMBER',
                      permissions: ['VIEW'],
                      status: 'APPROVED',
                      joinedAt: new Date().toISOString(),
                    },
                  ],
                }
              : org
          ),
          notifications: [...state.notifications, {
            id: Math.random().toString(36).substr(2, 9),
            userId: request.userId,
            message: 'Your join request has been approved',
            type: 'SUCCESS',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },

      rejectJoinRequest: async (requestId, reason) => {
        const request = get().joinRequests.find(req => req.id === requestId);
        if (!request) return;

        set((state) => ({
          joinRequests: state.joinRequests.map((req) =>
            req.id === requestId ? { ...req, status: 'REJECTED', rejectionReason: reason } : req
          ),
          notifications: [...state.notifications, {
            id: Math.random().toString(36).substr(2, 9),
            userId: request.userId,
            message: `Your join request has been rejected. Reason: ${reason}`,
            type: 'ERROR',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },

      getJoinRequests: (organizationId) => {
        return get().joinRequests.filter((req) => req.organizationId === organizationId);
      },

      getPendingJoinRequestsCount: (organizationId) => {
        return get().joinRequests.filter(
          (req) => req.organizationId === organizationId && req.status === 'PENDING'
        ).length;
      },

      getNotifications: (userId) => {
        return get().notifications.filter((notif) => notif.userId === userId);
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
        }));
      },

      validateLicenseNumber: async (number) => {
        // 1. SOCPA format: digits/SOCPA/year
        // 2. Up to 10 digits
        return /^\d+\/SOCPA\/\d{4}$/.test(number) || /^\d{1,10}$/.test(number);
      },

      validateSocpaNumber: async (number) => {
        return /^\d+\/SOCPA\/\d{4}$/.test(number) || /^\d{1,10}$/.test(number);
      },

      generateSubdomain: async (name) => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      },

      approveVerification: async (organizationId) => {
        set((state) => ({
          organizations: state.organizations.map((org) =>
            org.id === organizationId && org.type === 'FIRM'
              ? {
                  ...org,
                  verificationStatus: 'VERIFIED',
                  status: 'APPROVED',
                  updatedAt: new Date().toISOString(),
                }
              : org
          ),
          notifications: [...state.notifications, {
            id: Math.random().toString(36).substr(2, 9),
            userId: state.organizations.find(org => org.id === organizationId)?.adminId || '',
            message: 'Your firm verification has been approved',
            type: 'SUCCESS',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },

      rejectVerification: async (organizationId, reason) => {
        set((state) => ({
          organizations: state.organizations.map((org) =>
            org.id === organizationId && org.type === 'FIRM'
              ? {
                  ...org,
                  verificationStatus: 'REJECTED',
                  status: 'REJECTED',
                  rejectionReason: reason,
                  updatedAt: new Date().toISOString(),
                }
              : org
          ),
          notifications: [...state.notifications, {
            id: Math.random().toString(36).substr(2, 9),
            userId: state.organizations.find(org => org.id === organizationId)?.adminId || '',
            message: `Your firm verification has been rejected. Reason: ${reason}`,
            type: 'ERROR',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },

      suspendFirm: async (organizationId, reason) => {
        set((state) => ({
          organizations: state.organizations.map((org) =>
            org.id === organizationId && org.type === 'FIRM'
              ? {
                  ...org,
                  verificationStatus: 'SUSPENDED',
                  status: 'SUSPENDED',
                  suspensionReason: reason,
                  updatedAt: new Date().toISOString(),
                }
              : org
          ),
          notifications: [...state.notifications, {
            id: Math.random().toString(36).substr(2, 9),
            userId: state.organizations.find(org => org.id === organizationId)?.adminId || '',
            message: `Your firm has been suspended. Reason: ${reason}`,
            type: 'ERROR',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },

      deleteFirm: async (organizationId) => {
        const firm = get().organizations.find(org => org.id === organizationId) as AuditFirm;
        if (!firm || firm.type !== 'FIRM') return;

        // Check if firm has any active members
        const hasActiveMembers = firm.members.some(member => member.status === 'APPROVED');
        if (hasActiveMembers) {
          throw new Error('Cannot delete firm with active members');
        }

        set((state) => ({
          organizations: state.organizations.filter(org => org.id !== organizationId),
          notifications: [...state.notifications, {
            id: Math.random().toString(36).substr(2, 9),
            userId: firm.adminId,
            message: 'Your firm has been deleted from the system',
            type: 'ERROR',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },
    }),
    {
      name: 'organization-storage',
      partialize: (state) => ({
        organizations: state.organizations,
        joinRequests: state.joinRequests,
        notifications: state.notifications,
      }),
    }
  )
);