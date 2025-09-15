import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export const getFavourites = createAsyncThunk(
  'favourites/get',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
        // const response = await axiosInstance.get(`/favourites?page=${page}&limit=${limit}`);
        const response = await axiosInstance.get(`/favourites?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addFavourite = createAsyncThunk(
  'favourites/add',
  async (style_id: string, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/favourites', 
          
        { style_id });

        return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'customerFavourites/remove',
  async (style_id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/favourites/${style_id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const customerFavoritesSlice = createSlice({
  name: 'customerFavourites',
  initialState: {
    favourites: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites(state) {
      state.favourites = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(getFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        // Optional: Optimistically push newly added favorite
        state.favourites.push(action.payload.data);
      })
      .addCase(addFavourite.rejected, (state, action) => {
        state.error = action.payload as any;
      })

       .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loading = false;
        const styleId = action.payload.style_id;
        // const styleId = action.meta.arg; // ✅ use meta.arg from thunk
        state.favourites = state.favourites.filter((style: any) => style.id !== styleId);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = customerFavoritesSlice.actions;
export default customerFavoritesSlice.reducer;
