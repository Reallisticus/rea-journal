import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthState, PublicUser, UserStatus } from "../../types/global";

const initialState: AuthState = {
  isAuthenticated: false,
  userStatus: "UNVERIFIED",
  userDetails: null,
  isLoginView: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserStatus: (state, action: PayloadAction<UserStatus>) => {
      state.userStatus = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<PublicUser>) => {
      state.userDetails = action.payload;
    },
    toggleLoginView: (state, action: PayloadAction<boolean>) => {
      state.isLoginView = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setIsAuthenticated,
  setUserStatus,
  setUserDetails,
  toggleLoginView,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;
