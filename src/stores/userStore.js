import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  token: null,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },
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
    localStorage.removeItem('user');
  },

  // localStorage에서 토큰 및 사용자 정보 로드 (앱 초기화 시)
  loadToken: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token) {
      set({ token });
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user });
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        localStorage.removeItem('user');
      }
    }
  }
}));

export default useUserStore;
