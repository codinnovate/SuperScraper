import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// SecureStore options for better persistence
const secureStoreOptions = {
  keychainService: "eazyfit-keychain",
  sharedPreferencesName: "eazyfit-prefs",
  requireAuthentication: false,
};

export const setAuthTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      return;
    }

    // For mobile platforms, use SecureStore with options
    await SecureStore.setItemAsync("access_token", accessToken, secureStoreOptions);
    await SecureStore.setItemAsync("refresh_token", refreshToken, secureStoreOptions);

  } catch (error) {
    console.error("❌ Error storing auth tokens:", error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("access_token");
    }

    return await SecureStore.getItemAsync("access_token", secureStoreOptions);
  } catch (error) {
    console.error("❌ Error getting access token:", error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("refresh_token");
    }

    return await SecureStore.getItemAsync("refresh_token", secureStoreOptions);
  } catch (error) {
    console.error("❌ Error getting refresh token:", error);
    return null;
  }
};

export const removeAuthTokens = async () => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return;
    }

    await SecureStore.deleteItemAsync("access_token", secureStoreOptions);
    await SecureStore.deleteItemAsync("refresh_token", secureStoreOptions);
  } catch (error) {
    console.error("❌ Error removing auth tokens:", error);
  }
};

export const setUserProfile = async (profile: any) => {
  try {
    const profileString = typeof profile === 'string' ? profile : JSON.stringify(profile);

    if (Platform.OS === "web") {
      localStorage.setItem("user_profile", profileString);
      return;
    }

    await SecureStore.setItemAsync("user_profile", profileString, secureStoreOptions);
  } catch (error) {
    console.error("❌ Error storing user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<any | null> => {
  try {
    let profileString: string | null;

    if (Platform.OS === "web") {
      profileString = localStorage.getItem("user_profile");
    } else {
      profileString = await SecureStore.getItemAsync("user_profile", secureStoreOptions);
    }

    if (!profileString) {
      return null;
    }

    // Try to parse as JSON, fallback to string if it fails
    try {
      return JSON.parse(profileString);
    } catch {
      return profileString;
    }
  } catch (error) {
    console.error("❌ Error getting user profile:", error);
    return null;
  }
};

export const removeUserProfile = async () => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem("user_profile");
      return;
    }

    await SecureStore.deleteItemAsync("user_profile", secureStoreOptions);
  } catch (error) {
    console.error("❌ Error removing user profile:", error);
  }
};

export const setDeviceToken = async (deviceToken: string) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem("device_token", deviceToken);
      return;
    }

    await SecureStore.setItemAsync("device_token", deviceToken, secureStoreOptions);
  } catch (error) {
    console.error("❌ Error storing device token:", error);
    throw error;
  }
};

export const getDeviceToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("device_token");
    }

    return await SecureStore.getItemAsync("device_token", secureStoreOptions);
  } catch (error) {
    console.error("❌ Error getting device token:", error);
    return null;
  }
};

export const removeDeviceToken = async () => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem("device_token");
      return;
    }

    await SecureStore.deleteItemAsync("device_token", secureStoreOptions);
  } catch (error) {
    console.error("❌ Error removing device token:", error);
  }
};

// Utility function to check authentication status
export const checkAuthStatus = async (): Promise<{
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: any | null;
}> => {
  try {
    const [accessToken, refreshToken, userProfile] = await Promise.all([
      getAccessToken(),
      getRefreshToken(),
      getUserProfile(),
    ]);

    const isAuthenticated = !!(accessToken && refreshToken && userProfile);

    return {
      isAuthenticated,
      accessToken,
      refreshToken,
      userProfile,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      userProfile: null,
    };
  }
};

// Clear all stored data
export const clearAllData = async () => {
  try {
    await Promise.all([
      removeAuthTokens(),
      removeUserProfile(),
      removeDeviceToken(),
    ]);
  } catch (error) {
    console.error("❌ Error clearing stored data:", error);
  }
};