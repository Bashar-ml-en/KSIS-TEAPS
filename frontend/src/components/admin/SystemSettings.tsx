import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Settings, Database, Mail, Shield, Bell, Globe, Save, Loader2 } from 'lucide-react';
import { View } from '../../App';
import { toast } from 'sonner';
import configService from '../../services/configService';

interface SystemSettingsProps {
    onNavigate: (view: View) => void;
    onLogout: () => void;
    userName: string;
    userRole: 'admin';
}

export function SystemSettings({ onNavigate, onLogout, userName, userRole }: SystemSettingsProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    const [settings, setSettings] = useState({
        system: {
            siteName: 'Knowledge Sustainability International School (KSIS) - TEAPS',
            siteUrl: 'http://localhost:3000',
            adminEmail: 'admin@ksis.edu',
            timezone: 'Asia/Singapore',
            language: 'en',
        },
        email: {
            smtpHost: 'smtp.gmail.com',
            smtpPort: '587',
            smtpUser: '',
            smtpPassword: '',
            fromEmail: 'noreply@ksis.edu',
            fromName: 'KSIS - Knowledge Sustainability International School',
        },
        notifications: {
            emailNotifications: true,
            evaluationReminders: true,
            performanceAlerts: true,
            systemUpdates: false,
        },
        security: {
            sessionTimeout: '30',
            maxLoginAttempts: '5',
            passwordMinLength: '8',
            requireStrongPassword: true,
            twoFactorAuth: false,
        },
        performance: {
            cacheEnabled: true,
            logLevel: 'info',
            debugMode: false,
        },
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);

            // Promise.allSettled guarantees we proceed even if some fail
            const results = await Promise.allSettled([
                configService.getConfig('system'),
                configService.getConfig('email'),
                configService.getConfig('notifications'),
                configService.getConfig('security'),
                configService.getConfig('performance'),
            ]);

            const [system, email, notif, sec, perf] = results;

            // Helper to extract value safely
            const getValue = (res: any) => (res.status === 'fulfilled' && res.value?.value) ? res.value.value : null;

            setSettings(prev => ({
                ...prev,
                system: { ...prev.system, ...getValue(system) },
                email: { ...prev.email, ...getValue(email) },
                notifications: { ...prev.notifications, ...getValue(notif) },
                security: { ...prev.security, ...getValue(sec) },
                performance: { ...prev.performance, ...getValue(perf) },
            }));

        } catch (error: any) {
            console.error('Failed to load settings:', error);
            // Don't toast error on load, just use defaults
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section: string) => {
        try {
            setSaving(section);
            const sectionKey = section.toLowerCase();
            const sectionData = settings[sectionKey as keyof typeof settings];

            await configService.updateConfig(sectionKey, sectionData, `${section} settings updated`);

            toast.success(`${section} settings saved successfully!`);
        } catch (error: any) {
            console.error(`Failed to save ${section} settings:`, error);
            toast.error(error.response?.data?.message || `Failed to save ${section} settings`);
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                role={userRole}
                currentView="admin-settings"
                onNavigate={onNavigate}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    userName={userName}
                    userRole={userRole}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Settings className="w-8 h-8 text-blue-600" />
                            System Settings
                        </h1>
                        <p className="text-gray-600 mt-1">Configure system parameters and preferences</p>
                    </div>

                    <div className="space-y-6">
                        {/* General Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-6 h-6 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.system.siteName}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            system: { ...settings.system, siteName: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.system.siteUrl}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            system: { ...settings.system, siteUrl: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.system.adminEmail}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            system: { ...settings.system, adminEmail: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={settings.system.timezone}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            system: { ...settings.system, timezone: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Asia/Singapore">Asia/Singapore</option>
                                        <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSave('System')}
                                disabled={saving === 'System'}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving === 'System' ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save General Settings</>
                                )}
                            </button>
                        </div>

                        {/* Email Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="w-6 h-6 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Email Configuration</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SMTP Host
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.email.smtpHost}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            email: { ...settings.email, smtpHost: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SMTP Port
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.email.smtpPort}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            email: { ...settings.email, smtpPort: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.email.fromEmail}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            email: { ...settings.email, fromEmail: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.email.fromName}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            email: { ...settings.email, fromName: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => handleSave('Email')}
                                disabled={saving === 'Email'}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving === 'Email' ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save Email Settings</>
                                )}
                            </button>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="w-6 h-6 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.emailNotifications}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Enable Email Notifications</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.evaluationReminders}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, evaluationReminders: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Send Evaluation Reminders</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.performanceAlerts}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, performanceAlerts: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Performance Alert Notifications</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.systemUpdates}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, systemUpdates: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">System Update Notifications</span>
                                </label>
                            </div>
                            <button
                                onClick={() => handleSave('Notifications')}
                                disabled={saving === 'Notifications'}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving === 'Notifications' ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save Notification Settings</>
                                )}
                            </button>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-6 h-6 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Session Timeout (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            security: { ...settings.security, sessionTimeout: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Login Attempts
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.security.maxLoginAttempts}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            security: { ...settings.security, maxLoginAttempts: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password Min Length
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.security.passwordMinLength}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            security: { ...settings.security, passwordMinLength: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 mt-4">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.security.requireStrongPassword}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            security: { ...settings.security, requireStrongPassword: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Require Strong Passwords</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.security.twoFactorAuth}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            security: { ...settings.security, twoFactorAuth: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
                                </label>
                            </div>
                            <button
                                onClick={() => handleSave('Security')}
                                disabled={saving === 'Security'}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving === 'Security' ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save Security Settings</>
                                )}
                            </button>
                        </div>

                        {/* Performance Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="w-6 h-6 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Performance & Debug</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.performance.cacheEnabled}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            performance: { ...settings.performance, cacheEnabled: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Enable Caching</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.performance.debugMode}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            performance: { ...settings.performance, debugMode: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Debug Mode</span>
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Log Level
                                    </label>
                                    <select
                                        value={settings.performance.logLevel}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            performance: { ...settings.performance, logLevel: e.target.value }
                                        })}
                                        className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="debug">Debug</option>
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSave('Performance')}
                                disabled={saving === 'Performance'}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving === 'Performance' ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save Performance Settings</>
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
