import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Start a conversation
export const startConversation = createAsyncThunk(
  'chat/startConversation',
  async ({ participant1_id, participant2_id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/chat/conversations/start', {
        participant1_id,
        participant2_id,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all conversations for a user
export const getConversations = createAsyncThunk(
  'chat/getConversations',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/chat/conversations/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/chat/messages', messageData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.conversations = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startConversation.fulfilled, (state, action) => {
        state.conversations.push(action.payload);
      })
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
