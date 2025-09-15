import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  storeToken,
  storeRefreshToken,
  clearTokens,
  getRefreshToken,
} from "../../utils/authStorage";
import axiosInstance from "@/api/axiosInstance";

interface User {
  fullname: string;
  email: string;
  user_type: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

interface SignupFormValues {
  fullname: string;
  email: string;
  address: string;
  password: string;
  user_type: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (formValues: SignupFormValues, { rejectWithValue }) => {
    try {
      const payload = {
        fullname: formValues.fullname,
        email: formValues.email,
        address: formValues.address,
        password: formValues.password,
        user_type: formValues.user_type, // required
      };

      const response = await axiosInstance.post("/auth/register", payload);

      // const { access_token, refresh_token, user } = response.data;
      const { email_verification_sent, message, user_id, verification_id } = response.data;

      // await storeToken(access_token);
      // await storeRefreshToken(refresh_token);

      return { email_verification_sent, message, user_id, verification_id };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Login Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formValues: LoginFormValues, { rejectWithValue }) => {
    console.log("Dispatching loginUser with:", formValues);
    try {
      const payload = {
        email: formValues.email,
        password: formValues.password,
      }

      const response = await axiosInstance.post("/auth-login", payload);

      const { access_token, refresh_token } = response.data;

      await storeToken(access_token); // Save token securely
      await storeRefreshToken(refresh_token); // Save refresh token securely

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (err: any) {
      if (err.response) {
        console.error("🔴 Server responded with status:", err.response.status);
        console.error("🔴 Data:", err.response.data);
      } else if (err.request) {
        console.error("🔴 No response received:", err.request);
      } else {
        console.error("🔴 Error setting up request:", err.message);
      }
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

// Get User Thunk
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/user");

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// Refresh Token Thunk
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = await getRefreshToken();
      if (!refresh_token) throw new Error("No refresh token available");

      const response = await axiosInstance.post("/auth/refresh", {
        refresh_token,
      });

      const { access_token } = response.data;
      await storeToken(access_token);

      return access_token;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

// Google Login Thunk
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (id_token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/google", { id_token });
      const { user, access_token, refresh_token } = response.data;
      await storeToken(access_token);
      await storeRefreshToken(refresh_token);
      return { user, accessToken: access_token, refreshToken: refresh_token };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Google login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserField(
      state,
      action: PayloadAction<{ field: keyof User; value: any }>
    ) {
      if (state.user) {
        const { field, value } = action.payload;
        state.user[field] = value;
      }
    },
    resetForm(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setAuthToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearTokens();
    },
  },

  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserField, resetForm, setAuthToken, logout } = authSlice.actions;

export default authSlice.reducer;
