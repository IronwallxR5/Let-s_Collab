import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => {
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
      },
      
      loadUser: () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
