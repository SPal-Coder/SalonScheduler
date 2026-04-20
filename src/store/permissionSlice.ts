import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  permissions: ['appt.read', 'appt.move', 'appt.create', 'staff.read'],
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    togglePermission: (state, action) => {
      const perm = action.payload;

      if (state.permissions.includes(perm)) {
        state.permissions = state.permissions.filter(p => p !== perm);
      } else {
        state.permissions.push(perm);
      }
    },
  },
});

export const { togglePermission } = permissionSlice.actions;
export default permissionSlice.reducer;