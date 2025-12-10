import api from './api';

export interface ConfigValue {
    [key: string]: any;
}

export interface Configuration {
    id: number;
    key: string;
    value: ConfigValue;
    description?: string;
    updated_by?: number;
    created_at: string;
    updated_at: string;
}

export interface ConfigHistory {
    version: number;
    value: ConfigValue;
    updated_by: string;
    updated_at: string;
    description?: string;
}

class ConfigService {
    /**
     * Get configuration by key
     */
    async getConfig(key: string): Promise<Configuration> {
        try {
            const response = await api.get<Configuration>(`/config/${key}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to get config ${key}:`, error);
            throw error;
        }
    }

    /**
     * Update configuration
     */
    async updateConfig(key: string, value: ConfigValue, description?: string): Promise<{ message: string; config: Configuration }> {
        try {
            const response = await api.post<{ message: string; config: Configuration }>(`/config/${key}`, {
                value,
                description,
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to update config ${key}:`, error);
            throw error;
        }
    }

    /**
     * Get configuration history
     */
    async getConfigHistory(key: string): Promise<ConfigHistory[]> {
        try {
            const response = await api.get<ConfigHistory[]>(`/config/${key}/history`);
            return response.data;
        } catch (error) {
            console.error(`Failed to get config history for ${key}:`, error);
            throw error;
        }
    }

    /**
     * Restore configuration to previous version
     */
    async restoreConfig(key: string, version: number): Promise<{ message: string; config: Configuration }> {
        try {
            const response = await api.post<{ message: string; config: Configuration }>(`/config/${key}/restore/${version}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to restore config ${key} to version ${version}:`, error);
            throw error;
        }
    }

    /**
     * Batch update multiple configurations
     */
    async updateMultipleConfigs(configs: Array<{ key: string; value: ConfigValue; description?: string }>): Promise<void> {
        try {
            await Promise.all(
                configs.map((config) => this.updateConfig(config.key, config.value, config.description))
            );
        } catch (error) {
            console.error('Failed to update multiple configs:', error);
            throw error;
        }
    }
}

export default new ConfigService();
