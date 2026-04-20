import { createSlice } from '@reduxjs/toolkit';
import { mockData } from '../data/mockData';

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: mockData.appointments,
  reducers: {
    updateAppointment: (state, action) => {
      const index = state.findIndex(a => a.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    addAppointment: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { updateAppointment, addAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;