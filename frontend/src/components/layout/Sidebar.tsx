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
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Fixed Position on Mobile, Static on Desktop */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 shadow-2xl ${isDesktop || isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full w-full">
          {/* Logo Header - Standard Size */}
          <div className="p-6 flex justify-between items-center bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-0.5 flex items-center justify-center overflow-hidden shadow-lg ring-1 ring-blue-500/20">
                <img src={logo} alt="KSIS Logo" className="w-full h-full object-contain rounded-md bg-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-white font-bold tracking-tight text-lg leading-none font-sans">KSIS</h2>
                <p className="text-blue-400 text-[10px] font-bold tracking-widest uppercase mt-1">TEAPS System</p>
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
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
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
                  className={`relative group w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-blue-600/10 text-white'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}

                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
                  <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto text-blue-500 opacity-50" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}