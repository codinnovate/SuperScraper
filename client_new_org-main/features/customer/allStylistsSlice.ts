import axiosInstance from '@/api/axiosInstance';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getAllStyles = createAsyncThunk(
  'styles/getAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/all-stylists?page=${page}&limit=${limit}`);
      // const response = await axiosInstance.get('all-stylists');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const stylesSlice = createSlice({
  name: 'styles',
  initialState: {
    styles: [
      {
        id: '9q8y9y49358935',
        stylist_name: 'Ade styles',
        category: 'men',
        rating: 4,
        uri: 'https://image.png'
      }
    ],
    loading: false,
    error: null as null | string,
  },
  reducers: {
    clearStyles(state) {
      state.styles = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllStyles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStyles.fulfilled, (state, action) => {
        state.loading = false;
        state.styles = action.payload;
      })
      .addCase(getAllStyles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStyles } = stylesSlice.actions;
export default stylesSlice.reducer;
