import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"; // Adjust the path as necessary
import uiReducer from "../slices/uiSlice"; // Adjust the path as necessary

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
