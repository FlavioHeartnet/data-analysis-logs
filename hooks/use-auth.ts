/**
 * Auth Hook
 * Manages authentication state with React Query and secure storage
 */

import {
    getCurrentUser,
    login as loginService,
    logout as logoutService,
    register as registerService,
    type AuthResponse,
    type LoginCredentials,
    type RegisterCredentials,
} from '@/services/auth';
import type { User } from '@/services/mock-data';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Platform-specific storage (SecureStore not available on web)
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export function useAuth() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing token on mount
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await storage.getItem(TOKEN_KEY);
      if (!token) return null;
      
      // Validate token and get user
      try {
        const userData = await storage.getItem(USER_KEY);
        if (userData) {
          return JSON.parse(userData) as User;
        }
        return await getCurrentUser();
      } catch {
        await storage.removeItem(TOKEN_KEY);
        await storage.removeItem(USER_KEY);
        return null;
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!isLoadingUser) {
      setIsInitialized(true);
    }
  }, [isLoadingUser]);

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: loginService,
    onSuccess: async (data) => {
      await storage.setItem(TOKEN_KEY, data.token);
      await storage.setItem(USER_KEY, JSON.stringify(data.user));
      queryClient.setQueryData(['user'], data.user);
    },
  });

  // Register mutation
  const registerMutation = useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: registerService,
    onSuccess: async (data) => {
      await storage.setItem(TOKEN_KEY, data.token);
      await storage.setItem(USER_KEY, JSON.stringify(data.user));
      queryClient.setQueryData(['user'], data.user);
    },
  });

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      await storage.removeItem(TOKEN_KEY);
      await storage.removeItem(USER_KEY);
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    }
  }, [queryClient]);

  return {
    user,
    isAuthenticated: !!user,
    isInitialized,
    isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    logout,
    refetchUser,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
