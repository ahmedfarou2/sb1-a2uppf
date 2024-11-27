export type AuditStatus = 
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED';

export type AuditType = 
  | 'ANNUAL'
  | 'SEMI_ANNUAL'
  | 'QUARTERLY'
  | 'MONTHLY'
  | 'SPECIAL_PURPOSE';

export interface AuditEngagement {
  id: string;
  clientId: string;
  firmId: string;
  type: AuditType;
  status: AuditStatus;
  startDate: string;
  endDate: string;
  fiscalYearEnd: string;
  assignedTeam: AuditTeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditTeamMember {
  userId: string;
  role: 'PARTNER' | 'MANAGER' | 'SENIOR' | 'STAFF';
  responsibilities: string[];
  assignedAt: string;
}

export interface AuditWorkpaper {
  id: string;
  engagementId: string;
  title: string;
  section: string;
  preparedBy: string;
  reviewedBy: string | null;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'REVIEWED' | 'REJECTED';
  content: Record<string, any>;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}