import { createSlice } from '@reduxjs/toolkit';
import { mockData } from '../data/mockData';

const userSlice = createSlice({
  name: 'user',
  initialState: mockData.currentUser,
  reducers: {}
});

export default userSlice.reducer;