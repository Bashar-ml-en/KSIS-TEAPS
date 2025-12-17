import { Home, FileText, BarChart3, Settings, Users, LogOut, X, Award, Calculator, Clock, RefreshCw, MessageSquare, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../assets/ksis_logo.jpg';
import { View } from '../../App';

import { useState, useEffect } from 'react';

interface SidebarProps {
  role: 'principal' | 'teacher' | 'admin';
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, currentView, onNavigate, onLogout, isOpen = true, onClose }: SidebarProps) {
  // Always show on desktop, toggle on mobile
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // Helper to get items
  const getItems = () => {
    switch (role) {
      case 'principal':
        return [
          { icon: Home, label: 'Dashboard', view: 'principal' },
          { icon: Target, label: 'KPI Requests', view: 'principal-kpi-requests' },
          { icon: Award, label: 'KPI Guidelines', view: 'kpi-info' },
          { icon: Calculator, label: 'Calculator', view: 'kpi-calculation' },
          { icon: BarChart3, label: 'Reports', view: 'reports' },
          { icon: Users, label: 'Teachers', view: 'teacher-list' },
          { icon: MessageSquare, label: 'Evaluations', view: 'teacher-evaluation' },
        ];
      case 'teacher':
        return [
          { icon: Home, label: 'Dashboard', view: 'teacher' },
          { icon: Target, label: 'KPI Requests', view: 'kpi-request' },
          { icon: Clock, label: 'Attendance', view: 'attendance' },
          { icon: BarChart3, label: 'Reports', view: 'reports' },
          { icon: RefreshCw, label: 'Re-evaluation', view: 're-evaluation' },
          { icon: Award, label: 'KPI Info', view: 'kpi-info' },
          { icon: Calculator, label: 'Calculator', view: 'kpi-calculation' },
          { icon: FileText, label: 'My Contracts', view: 'my-contract' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', view: 'admin-dashboard' },
          { icon: Users, label: 'Users', view: 'admin-users' },
          { icon: Clock, label: 'Attendance', view: 'attendance' },
          { icon: Settings, label: 'Settings', view: 'admin-settings' },
          { icon: FileText, label: 'Contracts', view: 'admin-contracts' },
          { icon: BarChart3, label: 'Reports', view: 'reports' },
          { icon: MessageSquare, label: 'Evaluations', view: 'teacher-evaluation' },
        ];
      default:
        return [];
    }
  };

  const items = getItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Fixed Position on Mobile, Static on Desktop */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ${isDesktop || isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full w-full">
          {/* Logo Header - Standard Size */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
                <img src={logo} alt="KSIS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-white font-bold tracking-tight text-lg leading-none">KSIS</h2>
                <p className="text-blue-400 text-xs font-medium tracking-wide">TEAPS System</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;

              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view as View);
                    onClose?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}