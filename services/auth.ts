/**
 * Auth Service
 * Mock implementation for Phase 3 - simulates backend auth
 */

import { mockUser, type User } from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Mock login - accepts any credentials with demo data
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(800); // Simulate network latency

  // Simulate validation
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }

  if (credentials.password.length < 6) {
    throw new Error('Invalid credentials');
  }

  // Return mock user
  return {
    user: {
      ...mockUser,
      email: credentials.email,
    },
    token: `mock-jwt-${Date.now()}`,
  };
}

/**
 * Mock register - accepts any valid data
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  await delay(1000); // Simulate network latency

  // Simulate validation
  if (!credentials.email || !credentials.password || !credentials.name) {
    throw new Error('All fields are required');
  }

  if (credentials.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  if (!credentials.email.includes('@')) {
    throw new Error('Invalid email address');
  }

  // Return new mock user
  return {
    user: {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date().toISOString(),
    },
    token: `mock-jwt-${Date.now()}`,
  };
}

/**
 * Mock logout
 */
export async function logout(): Promise<void> {
  await delay(300);
  // In production: clear token from server
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<User | null> {
  await delay(500);
  // In production: validate token and fetch user
  // For mock: return mock user if "logged in"
  return mockUser;
}
