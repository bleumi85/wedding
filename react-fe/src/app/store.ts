import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({});

// exports
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  });
}
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
