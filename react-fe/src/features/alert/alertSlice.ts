import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AlertPayload, AlertState, AlertStatus } from './alertTypes';

// create slice
const name = 'alert';
const initialState: AlertState[] = [];
const reducers = createReducers();
const alertSlice = createSlice({
  name,
  initialState,
  reducers,
});

// implementation
function createReducers() {
  return {
    error,
    reset,
    success,
  };

  function error(state: AlertState[], action: PayloadAction<AlertPayload>) {
    reducerHelper(state, action, AlertStatus.ERROR);
  }

  function success(state: AlertState[], action: PayloadAction<AlertPayload>) {
    reducerHelper(state, action, AlertStatus.SUCCESS);
  }

  function reset() {
    return initialState;
  }

  function reducerHelper(state: AlertState[], action: PayloadAction<AlertPayload>, status: AlertStatus) {
    state.push({
      status,
      id: action.payload.id ?? 'alert-0',
      title: action.payload.title,
      description: action.payload.description,
      duration: action.payload.duration,
      isClosable: action.payload.isClosable,
      type: action.payload.type ?? 'string',
    });
  }
}

// exports
export const alertActions = { ...alertSlice.actions };
export default alertSlice.reducer;
