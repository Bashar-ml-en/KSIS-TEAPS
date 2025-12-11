import api from './api';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_image?: string;
    department_id?: number;
}

class ProfileService {
    /**
     * Get current user profile
     */
    async getProfile(): Promise<UserProfile> {
        try {
            const response = await api.get<UserProfile>('/user/profile');
            return response.data;
        } catch (error) {
            console.error('Failed to get profile:', error);
            throw error;
        }
    }

    /**
     * Upload profile picture
     */
    async uploadProfilePicture(file: File): Promise<{ profile_image: string }> {
        try {
            const formData = new FormData();
            formData.append('profile_image', file);

            const response = await api.post<{ profile_image: string }>(
                '/user/profile/image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Failed to upload profile picture:', error);
            throw error;
        }
    }

    /**
     * Update profile information
     */
    async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        try {
            const response = await api.put<UserProfile>('/user/profile', data);
            return response.data;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }

    /**
     * Delete profile picture
     */
    async deleteProfilePicture(): Promise<void> {
        try {
            await api.delete('/user/profile/image');
        } catch (error) {
            console.error('Failed to delete profile picture:', error);
            throw error;
        }
    }

    /**
     * Get profile image URL
     */
    getProfileImageUrl(imagePath?: string): string | undefined {
        if (!imagePath) return undefined;

        // If it's already a full URL, return it
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // Otherwise, construct the full URL
        // Safely access Vite environment variable
        const apiUrl = (import.meta as any).env?.VITE_API_URL;
        const baseURL = apiUrl || 'http://localhost:8000';
        const cleanBaseURL = baseURL.replace('/api', ''); // Remove /api if present
        return `${cleanBaseURL}/storage/${imagePath}`;
    }

    /**
     * Create a preview URL from File object
     */
    createPreviewUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    /**
     * Validate image file
     */
    validateImageFile(file: File): { valid: boolean; error?: string } {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)',
            };
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'Image size must be less than 5MB',
            };
        }

        return { valid: true };
    }
}

export default new ProfileService();
