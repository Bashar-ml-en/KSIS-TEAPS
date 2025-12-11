import api, { User, LoginResponse, ApiError } from './api';
import { AxiosError } from 'axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'hr_admin' | 'principal' | 'teacher';
    department_id?: number;
}

class AuthService {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/login', credentials);

            // Store token and user in localStorage
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(
                axiosError.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        }
    }

    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/register', data);

            // Store token and user in localStorage
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(
                axiosError.response?.data?.message || 'Registration failed.'
            );
        }
    }

    /**
     * Logout the current user
     */
    async logout(): Promise<void> {
        try {
            await api.post('/logout');
        } catch (error) {
            // Even if the API call fails, clear local storage
            console.error('Logout API call failed:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    }

    /**
     * Get the current user's profile
     */
    async getProfile(): Promise<User> {
        try {
            const response = await api.get<User>('/user'); // Backend returns User model directly or inside keys depending on controller
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(
                axiosError.response?.data?.message || 'Failed to fetch profile.'
            );
        }
    }

    async updateProfilePhoto(file: File): Promise<{ message: string, user: User, photo_url: string }> {
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await api.post<{ message: string, user: User, photo_url: string }>('/user/profile-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Update local storage
            const storedUser = this.getStoredUser();
            if (storedUser) {
                const updatedUser = { ...storedUser, profile_photo_url: response.data.photo_url };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(
                axiosError.response?.data?.message || 'Failed to upload photo.'
            );
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    /**
     * Get stored user from localStorage
     */
    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr) as User;
            } catch {
                return null;
            }
        }
        return null;
    }

    /**
     * Get stored auth token
     */
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }
}

export const authService = new AuthService();
export default authService;
