// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';
import api from '../api/axiosConfig';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id: number;
  name: string;
}


interface JwtPayload {
  user_id:number
  first_name: string;
  last_name: string;
  role: string;
  exp: number;
}

interface LoginCredentials {
  username: string;
  password: string;
}

// Inicjalny stan

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  token: null,
  loading: false,
  error: null,
};

// Asynchroniczna akcja logowania
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      const bearer = response.headers['authorization'] || response.headers['Authorization'];
      if (!bearer) {
        throw new Error('No authorization header in response');
      }
      const token = bearer.startsWith('Bearer ') ? bearer.substring(7) : bearer;
      return token;
    } catch (err: unknown) {
      console.error('Login error:', err);
      return rejectWithValue('Błąd logowania');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = null;
      localStorage.removeItem('authToken');
    },
    loadUserFromStorage(state) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded: JwtPayload = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            state.isAuthenticated = true;
            state.user = { id: decoded.user_id, name: `${decoded.first_name} ${decoded.last_name}`};
            state.role = decoded.role;
            state.token = token;
          } else {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
            state.token = null;
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          state.isAuthenticated = false;
          state.user = null;
          state.role = null;
          state.token = null;
          localStorage.removeItem('authToken');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        const token = action.payload;
        try {
          const decoded: JwtPayload = jwtDecode(token);
          state.isAuthenticated = true;
          state.user = { id: decoded.user_id, name: `${decoded.first_name} ${decoded.last_name}`};
          state.role = decoded.role;
          state.token = token;
          state.loading = false;
          localStorage.setItem('authToken', token);
          // toast.success('Zalogowano pomyślnie!');
        } catch (error) {
          console.error('Error decoding token:', error);
          state.isAuthenticated = false;
          state.user = null;
          state.role = null;
          state.token = null;
          state.loading = false;
          state.error = 'Invalid token';
        }
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = action.payload as string;
        // toast.error(action.payload);
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
