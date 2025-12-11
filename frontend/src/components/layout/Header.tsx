import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, X, Settings, ChevronDown, Camera } from 'lucide-react';
import notificationService, { Notification } from '../../services/notificationService';

interface HeaderProps {
  title?: string;
  userName?: string;
  userRole?: 'principal' | 'teacher' | 'admin';
  onMenuClick?: () => void;
  userProfileImage?: string;
  onProfileImageChange?: (file: File) => void;
}

export function Header({ title, userName = 'User', userRole, onMenuClick, userProfileImage, onProfileImageChange }: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load unread count on mount
  useEffect(() => {
    loadUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(1, 10);
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false); // Close profile menu
    if (!showNotifications) {
      await loadNotifications();
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false); // Close notifications
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onProfileImageChange) {
      onProfileImageChange(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="bg-black border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          {title && <h1 className="text-white text-lg font-semibold">{title}</h1>}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationDropdownRef}>
            <button
              onClick={handleBellClick}
              className="relative text-white hover:text-gray-300 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50' : ''
                            }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${!notification.is_read ? 'bg-blue-600' : 'bg-transparent'
                                }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notificationService.formatTime(notification.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
            >
              {/* Profile Image */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {userProfileImage ? (
                  <img
                    src={userProfileImage}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <span className="hidden sm:inline text-white/90 font-medium">{userName}</span>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {userProfileImage ? (
                          <img
                            src={userProfileImage}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      {/* Change Photo Button (appears on large avatar) */}
                      <button
                        onClick={triggerImageUpload}
                        className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                        title="Change profile picture"
                      >
                        <Camera className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {userRole === 'admin' ? 'HR Admin' : userRole}
                      </p>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Change Photo Button (visible button) */}
                  <button
                    onClick={triggerImageUpload}
                    className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Change Profile Picture</span>
                  </button>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to settings if you have it
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                </div>

                {/* Note: Logout is in the sidebar */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    Use sidebar to logout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}