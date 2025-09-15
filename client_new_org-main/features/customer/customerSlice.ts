// store/customerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    profile: null,
  },
  reducers: {
    setCustomerProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    clearCustomerProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setCustomerProfile, clearCustomerProfile } = customerSlice.actions;
export default customerSlice.reducer;
