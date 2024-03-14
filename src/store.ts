import { configureStore, combineReducers } from "@reduxjs/toolkit";
import calcReducer from "./calcSlice";

const rootReducer = combineReducers({
  calc: calcReducer
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
