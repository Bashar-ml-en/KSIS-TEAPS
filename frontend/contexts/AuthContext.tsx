import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/api';
import authService from '../services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authService.getStoredUser();
            if (storedUser && authService.isAuthenticated()) {
                setUser(storedUser);
                // Optionally verify token is still valid
                try {
                    const freshUser = await authService.getProfile();
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch {
                    // Token invalid, clear auth state
                    await authService.logout();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await authService.login({ email, password });
            setUser(response.user);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Call backend logout endpoint
            await authService.logout();
        } catch (error) {
            console.error('Logout API call failed:', error);
            // Continue with cleanup even if API call fails
        } finally {
            // Clear all auth state
            setUser(null);

            // Clear all stored data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            sessionStorage.clear();

            // Force redirect to login page with clean state
            window.location.href = '/';
        }
    };


    const refreshUser = async () => {
        try {
            const freshUser = await authService.getProfile();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
