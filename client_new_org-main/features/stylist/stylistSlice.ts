// store/stylistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const stylistSlice = createSlice({
  name: 'stylist',
  initialState: {
    profile: null,
  },
  reducers: {
    setStylistProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    clearStylistProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setStylistProfile, clearStylistProfile } = stylistSlice.actions;
export default stylistSlice.reducer;
