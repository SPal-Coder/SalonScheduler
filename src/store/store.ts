import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './appointmentSlice';
import userReducer from './userSlice';
import permissionReducer from './permissionSlice';
export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    user: userReducer,
     permission: permissionReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;