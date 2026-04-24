import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // API call here
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => set({ user: null, token: null }),
}));

export const useExpenseStore = create((set) => ({
  expenses: [],
  filters: {
    category: null,
    startDate: null,
    endDate: null,
  },

  setExpenses: (expenses) => set({ expenses }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));

export const useBudgetStore = create((set) => ({
  budgets: [],
  selectedBudget: null,

  setBudgets: (budgets) => set({ budgets }),
  setSelectedBudget: (budget) => set({ selectedBudget: budget }),
}));
