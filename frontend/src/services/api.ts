import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api', // Relative path for single-domain deployment
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear storage and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;

// Type definitions for API responses
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'hr_admin' | 'principal' | 'teacher';
    department_id?: number;
    profile_photo_url?: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    message: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
