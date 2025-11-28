import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  isAuthenticated: boolean;
}

// Get token from cookie or localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('token') || localStorage.getItem('token') || null;
};

const initialState: AuthState = {
  token: getToken(),
  user: null,
  isAuthenticated: !!getToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; email: string; firstName: string; lastName: string }>) => {
      state.token = action.payload.token;
      state.user = {
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
      state.isAuthenticated = true;
      // Save token to both cookie and localStorage for reliability
      Cookies.set('token', action.payload.token, { expires: 7 });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

