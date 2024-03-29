import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthState, LoginData, UpdateGuestDto } from './authTypes';
import { authService } from './authService';
import { alertActions } from '../alert/alertSlice';

const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY;

// create slice
const name = 'auth';
const initialState: AuthState = createInitialState();
const reducers = createReducers();
const authSlice = createSlice({
  name,
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.invitation = action.payload!;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.invitation = null;
    });
  },
});

function createReducers() {
  return {
    updateInvitation,
  };

  function updateInvitation(state: AuthState, action: PayloadAction<UpdateGuestDto[]>) {
    const currentGuests = state.invitation!.guests;
    const updatedGuests = action.payload.map((guest) => {
      const foundGuest = currentGuests.find((g) => g.id === guest.id)!;
      return { ...foundGuest, responseStatus: guest.responseStatus, mealRequest: guest.mealRequest };
    });
    state.invitation!.guests = updatedGuests;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ invitation: state.invitation }));
  }
}

function createInitialState(): AuthState {
  const storedAuthData = localStorage.getItem(LOCAL_STORAGE_KEY);
  let parsedAuthData: AuthState | null = null;
  if (storedAuthData) {
    parsedAuthData = JSON.parse(storedAuthData) as AuthState;
  }
  return parsedAuthData || { invitation: null };
}

const login = createAsyncThunk(`${name}/login`, async (loginData: LoginData, { dispatch }) => {
  try {
    const { data } = await authService.login(loginData);

    // store invitation details and jwt token in local storage to keep guest logged in between page refreshes
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ invitation: data }));

    return data;
  } catch (err) {
    dispatch(
      alertActions.error({
        title: 'Login fehlgeschlagen',
        description: 'Du hast offenbar die falschen Zugangsdaten eingegeben',
        type: 'string',
      }),
    );
    console.error(err);
  }
});

const logout = createAsyncThunk(`${name}/logout`, async () => {
  try {
    await authService.logout();
  } finally {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
});

// exports
export const authActions = { ...authSlice.actions, login, logout };
export default authSlice.reducer;
