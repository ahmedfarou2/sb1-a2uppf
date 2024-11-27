export interface TrialBalance {
  id: string;
  organizationId: string;
  period: string;
  accounts: Account[];
  uploadedAt: string;
  processedAt: string | null;
  status: 'PENDING' | 'PROCESSED' | 'ERROR';
}

export interface Account {
  code: string;
  nameAr: string;
  nameEn: string;
  type: AccountType;
  category: AccountCategory;
  subcategory?: string;
  debit: string;
  credit: string;
  balance: string;
  parentCode?: string;
}

export type AccountType =
  | 'ASSET'
  | 'LIABILITY'
  | 'EQUITY'
  | 'REVENUE'
  | 'EXPENSE';

export type AccountCategory =
  | 'CURRENT_ASSET'
  | 'NON_CURRENT_ASSET'
  | 'CURRENT_LIABILITY'
  | 'NON_CURRENT_LIABILITY'
  | 'CAPITAL'
  | 'RETAINED_EARNINGS'
  | 'OPERATING_REVENUE'
  | 'OTHER_REVENUE'
  | 'OPERATING_EXPENSE'
  | 'OTHER_EXPENSE';