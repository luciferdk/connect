import { axiosInstance } from './axios';
import { create } from 'zustand';

interface AuthState {
  authUser: object | null;
  isUserAuth: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isUserAuth: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } catch (err) {
      set({ authUser: null });

      console.error('Error while Check',err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
