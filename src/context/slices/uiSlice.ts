import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState, Notification } from "../../types/global";

const initialState: UIState = {
  notifications: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id">>,
    ) => {
      const newNotification: Notification = {
        id: Math.random().toString(),
        ...action.payload,
      };

      state.notifications.push(newNotification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
  },
});

export const { addNotification, removeNotification } = uiSlice.actions;

export default uiSlice.reducer;
