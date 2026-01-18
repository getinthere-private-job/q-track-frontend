import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  token: null,
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  },
  
  // localStorage에서 토큰 로드 (앱 초기화 시)
  loadToken: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token });
    }
  }
}));

export default useUserStore;