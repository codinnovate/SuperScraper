import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Async thunk: get all notifications
export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/notifications');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Async thunk: mark notification as read
export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, thunkAPI) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      return { id: notificationId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Async thunk: get unread count
export const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/notifications/unread/count');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getNotifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markAsRead
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.id === action.payload.id);
        if (notif) notif.isRead = true;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // getUnreadCount
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetError } = notificationsSlice.actions;

export default notificationsSlice.reducer;
