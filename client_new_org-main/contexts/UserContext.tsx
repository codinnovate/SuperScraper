import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { checkAuthStatus, clearAllData, setUserProfile } from '@/lib/storage/secure-store';
import { getCurrentUser } from '@/lib/api/auth';
import { router } from 'expo-router';

interface UserContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: IUser) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (userData: IUser | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage/API
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const authStatus = await checkAuthStatus();

      if (authStatus.isAuthenticated && authStatus.userProfile) {
        setUser(authStatus.userProfile);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user data globally
  const updateUser = useCallback(async (userData: IUser) => {
    try {
      await setUserProfile(userData);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw new Error('Failed to update user profile');
    }
  }, []);

  // Refresh user data from server
  const refreshUser = useCallback(async () => {
    try {
      const latestUser = await getCurrentUser();
      await updateUser(latestUser);
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
      throw error;
    }
  }, [updateUser]);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await clearAllData();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/onboarding');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/onboarding');
    }
  }, []);

  // Manual user setter for advanced cases
  const setUserData = useCallback((userData: IUser | null) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    updateUser,
    refreshUser,
    logout,
    setUser: setUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use user context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// Simple hook for getting user data (backward compatibility)
export const useUser = () => {
  const { user } = useUserContext();
  return user;
};

// Full user hook (backward compatibility)
export const useCurrentUser = () => {
  const context = useUserContext();
  return {
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    updateUser: context.updateUser,
    logout: context.logout,
    refreshUser: context.refreshUser,
  };
};
