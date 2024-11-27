export type UserRole = 'SYSTEM_ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  titleAr: string;
  titleEn: string;
  role: UserRole;
  organizationId?: string;
  profileCompletion: number;
  createdAt: string;
  updatedAt: string;
}

export const SYSTEM_ADMIN_EMAIL = 'acc.farouk@yahoo.com';

export interface UserNotification {
  id: string;
  userId: string;
  title: {
    ar: string;
    en: string;
  };
  message: {
    ar: string;
    en: string;
  };
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
  read: boolean;
  createdAt: string;
  link?: string;
}