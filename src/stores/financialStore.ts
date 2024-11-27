import { create } from 'zustand';
import { TrialBalance, Account } from '../types/financial';
import Decimal from 'decimal.js';

interface FinancialStore {
  trialBalances: TrialBalance[];
  currentTrialBalance: TrialBalance | null;
  chartOfAccounts: Account[];
  
  // Trial Balance actions
  uploadTrialBalance: (file: File, organizationId: string, period: string) => Promise<void>;
  processTrialBalance: (id: string) => Promise<void>;
  
  // Account actions
  updateAccount: (code: string, updates: Partial<Account>) => Promise<void>;
  recategorizeAccount: (code: string, category: string) => Promise<void>;
  
  // Financial Statement Generation
  generateBalanceSheet: (trialBalanceId: string, language: 'ar' | 'en') => Promise<any>;
  generateIncomeStatement: (trialBalanceId: string, language: 'ar' | 'en') => Promise<any>;
  generateCashFlow: (trialBalanceId: string, language: 'ar' | 'en') => Promise<any>;
}

export const useFinancialStore = create<FinancialStore>((set, get) => ({
  trialBalances: [],
  currentTrialBalance: null,
  chartOfAccounts: [],

  uploadTrialBalance: async (file, organizationId, period) => {
    // Here we'll implement Excel file processing
    const newTrialBalance: TrialBalance = {
      id: Math.random().toString(36).substr(2, 9),
      organizationId,
      period,
      accounts: [],
      uploadedAt: new Date().toISOString(),
      processedAt: null,
      status: 'PENDING',
    };

    set((state) => ({
      trialBalances: [...state.trialBalances, newTrialBalance],
      currentTrialBalance: newTrialBalance,
    }));
  },

  processTrialBalance: async (id) => {
    set((state) => ({
      trialBalances: state.trialBalances.map((tb) =>
        tb.id === id
          ? {
              ...tb,
              status: 'PROCESSED',
              processedAt: new Date().toISOString(),
            }
          : tb
      ),
    }));
  },

  updateAccount: async (code, updates) => {
    set((state) => ({
      chartOfAccounts: state.chartOfAccounts.map((account) =>
        account.code === code ? { ...account, ...updates } : account
      ),
    }));
  },

  recategorizeAccount: async (code, category) => {
    set((state) => ({
      chartOfAccounts: state.chartOfAccounts.map((account) =>
        account.code === code ? { ...account, category } : account
      ),
    }));
  },

  generateBalanceSheet: async (trialBalanceId, language) => {
    const tb = get().trialBalances.find((tb) => tb.id === trialBalanceId);
    if (!tb) throw new Error('Trial balance not found');

    // Group accounts by category
    const accounts = tb.accounts.reduce((acc, account) => {
      const category = account.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(account);
      return acc;
    }, {} as Record<string, Account[]>);

    // Calculate totals
    const totalAssets = new Decimal(0);
    const totalLiabilities = new Decimal(0);
    const totalEquity = new Decimal(0);

    // Return structured balance sheet data
    return {
      assets: accounts['CURRENT_ASSET'].concat(accounts['NON_CURRENT_ASSET']),
      liabilities: accounts['CURRENT_LIABILITY'].concat(accounts['NON_CURRENT_LIABILITY']),
      equity: accounts['CAPITAL'].concat(accounts['RETAINED_EARNINGS']),
      totalAssets,
      totalLiabilities,
      totalEquity,
    };
  },

  generateIncomeStatement: async (trialBalanceId, language) => {
    const tb = get().trialBalances.find((tb) => tb.id === trialBalanceId);
    if (!tb) throw new Error('Trial balance not found');

    // Group revenues and expenses
    const revenues = tb.accounts.filter((a) => 
      a.type === 'REVENUE'
    );
    const expenses = tb.accounts.filter((a) => 
      a.type === 'EXPENSE'
    );

    // Calculate totals
    const totalRevenue = new Decimal(0);
    const totalExpenses = new Decimal(0);
    const netIncome = totalRevenue.minus(totalExpenses);

    return {
      revenues,
      expenses,
      totalRevenue,
      totalExpenses,
      netIncome,
    };
  },

  generateCashFlow: async (trialBalanceId, language) => {
    // Implementation for cash flow statement generation
    // This will require comparing two trial balances to calculate changes
    return {
      operatingActivities: [],
      investingActivities: [],
      financingActivities: [],
      netCashFlow: new Decimal(0),
    };
  },
}));