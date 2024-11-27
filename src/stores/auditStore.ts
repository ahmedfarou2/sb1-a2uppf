import { create } from 'zustand';
import { AuditEngagement, AuditWorkpaper } from '../types/audit';

interface AuditStore {
  engagements: AuditEngagement[];
  currentEngagement: AuditEngagement | null;
  workpapers: AuditWorkpaper[];
  
  // Engagement actions
  createEngagement: (engagement: Omit<AuditEngagement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEngagement: (id: string, updates: Partial<AuditEngagement>) => Promise<void>;
  assignTeamMember: (engagementId: string, userId: string, role: string) => Promise<void>;
  
  // Workpaper actions
  createWorkpaper: (workpaper: Omit<AuditWorkpaper, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWorkpaper: (id: string, updates: Partial<AuditWorkpaper>) => Promise<void>;
  submitForReview: (id: string) => Promise<void>;
  approveWorkpaper: (id: string, reviewerId: string) => Promise<void>;
  rejectWorkpaper: (id: string, reviewerId: string, comments: string) => Promise<void>;
}

export const useAuditStore = create<AuditStore>((set, get) => ({
  engagements: [],
  currentEngagement: null,
  workpapers: [],

  createEngagement: async (engagement) => {
    const newEngagement: AuditEngagement = {
      ...engagement,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      engagements: [...state.engagements, newEngagement],
      currentEngagement: newEngagement,
    }));
  },

  updateEngagement: async (id, updates) => {
    set((state) => ({
      engagements: state.engagements.map((eng) =>
        eng.id === id
          ? { ...eng, ...updates, updatedAt: new Date().toISOString() }
          : eng
      ),
    }));
  },

  assignTeamMember: async (engagementId, userId, role) => {
    set((state) => ({
      engagements: state.engagements.map((eng) =>
        eng.id === engagementId
          ? {
              ...eng,
              assignedTeam: [
                ...eng.assignedTeam,
                {
                  userId,
                  role,
                  responsibilities: [],
                  assignedAt: new Date().toISOString(),
                },
              ],
            }
          : eng
      ),
    }));
  },

  createWorkpaper: async (workpaper) => {
    const newWorkpaper: AuditWorkpaper = {
      ...workpaper,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      workpapers: [...state.workpapers, newWorkpaper],
    }));
  },

  updateWorkpaper: async (id, updates) => {
    set((state) => ({
      workpapers: state.workpapers.map((wp) =>
        wp.id === id
          ? { ...wp, ...updates, updatedAt: new Date().toISOString() }
          : wp
      ),
    }));
  },

  submitForReview: async (id) => {
    set((state) => ({
      workpapers: state.workpapers.map((wp) =>
        wp.id === id
          ? { ...wp, status: 'PENDING_REVIEW', updatedAt: new Date().toISOString() }
          : wp
      ),
    }));
  },

  approveWorkpaper: async (id, reviewerId) => {
    set((state) => ({
      workpapers: state.workpapers.map((wp) =>
        wp.id === id
          ? {
              ...wp,
              status: 'REVIEWED',
              reviewedBy: reviewerId,
              updatedAt: new Date().toISOString(),
            }
          : wp
      ),
    }));
  },

  rejectWorkpaper: async (id, reviewerId, comments) => {
    set((state) => ({
      workpapers: state.workpapers.map((wp) =>
        wp.id === id
          ? {
              ...wp,
              status: 'REJECTED',
              reviewedBy: reviewerId,
              content: { ...wp.content, rejectionComments: comments },
              updatedAt: new Date().toISOString(),
            }
          : wp
      ),
    }));
  },
}));