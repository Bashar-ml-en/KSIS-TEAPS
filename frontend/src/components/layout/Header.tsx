import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, X, Settings, ChevronDown, Camera } from 'lucide-react';
import notificationService, { Notification } from '../../services/notificationService';
import { ModeToggle } from '../mode-toggle';

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
    <header className="bg-white sticky top-0 z-30 transition-all duration-300 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          {title && <h1 className="text-gray-900 text-lg font-bold tracking-tight">{title}</h1>}
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {/* Notifications */}
          <div className="relative" ref={notificationDropdownRef}>
            <button
              onClick={handleBellClick}
              className="relative text-gray-500 hover:text-gray-700 transition-all p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[28rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                  {loading ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                      <p className="text-sm font-medium">Loading updates...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium">No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors relative group ${!notification.is_read ? 'bg-blue-50/30' : ''
                            }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-opacity ${!notification.is_read ? 'bg-blue-600' : 'bg-transparent'
                                }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'} truncate`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
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
                  <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline">
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
              className={`flex items-center gap-3 px-2 py-1.5 rounded-full transition-all duration-200 border ${showProfileMenu ? 'bg-gray-100 border-gray-200' : 'border-transparent hover:bg-gray-100 hover:border-gray-200'}`}
            >
              {/* Profile Image */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200 flex items-center justify-center text-gray-500">
                {userProfileImage ? (
                  <img
                    src={userProfileImage}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start pr-1">
                <span className="text-sm font-semibold text-gray-900 leading-tight">{userName}</span>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{userRole}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-transparent">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative group cursor-pointer" onClick={triggerImageUpload}>
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-white ring-2 ring-gray-200 shadow-md flex items-center justify-center text-gray-500">
                        {userProfileImage ? (
                          <img
                            src={userProfileImage}
                            alt={userName}
                            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                          />
                        ) : (
                          <User className="w-7 h-7" />
                        )}
                      </div>
                      {/* Change Photo Overlay */}
                      <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate text-lg">{userName}</p>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider bg-blue-50 inline-block px-2 py-0.5 rounded-full border border-blue-100">
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
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Profile Picture</span>
                  </button>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to settings if you have it
                    }}
                    className="w-full px-3 py-2.5 text-left text-gray-700 hover:bg-gray-100/80 rounded-lg flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors shadow-sm">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium text-sm block">Profile Settings</span>
                      <span className="text-[10px] text-gray-400">Manage your account</span>
                    </div>
                  </button>
                </div>

                {/* Note: Logout is in the sidebar */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-center">
                  <p className="text-[10px] text-gray-400 font-medium">
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