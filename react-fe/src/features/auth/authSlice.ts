import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthState, LoginData } from './authTypes';
import { authService } from './authService';

const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY;

// create slice
const name = 'auth';
const initialState: AuthState = createInitialState();
const authSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.invitation = action.payload!;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.invitation = null;
    });
  },
});

function createInitialState(): AuthState {
  const storedAuthData = localStorage.getItem(LOCAL_STORAGE_KEY);
  let parsedAuthData: AuthState | null = null;
  if (storedAuthData) {
    parsedAuthData = JSON.parse(storedAuthData) as AuthState;
  }
  return parsedAuthData || { invitation: null };
}

const login = createAsyncThunk(`${name}/login`, async (loginData: LoginData) => {
  try {
    const { data } = await authService.login(loginData);

    // store invitation details and jwt token in local storage to keep guest logged in between page refreshes
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ invitation: data }));

    // history.navigate && history.navigate('/');

    return data;
  } catch (err) {
    console.error(err);
  }
});

const logout = createAsyncThunk(`${name}/logout`, async () => {});

// exports
export const authActions = { ...authSlice.actions, login, logout };
export default authSlice.reducer;
