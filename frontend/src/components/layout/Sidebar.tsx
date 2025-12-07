import { Home, FileText, BarChart3, Settings, Users, LogOut, X, Award, Calculator, Clock, RefreshCw, MessageSquare, Target } from 'lucide-react';
import logo from '../../assets/ksis_logo.jpg';
import { View } from '../../App';

interface SidebarProps {
  role: 'principal' | 'teacher' | 'admin';
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, currentView, onNavigate, onLogout, isOpen = true, onClose }: SidebarProps) {
  const getMenuItems = () => {
    switch (role) {
      case 'principal':
        return [
          { icon: Home, label: 'Dashboard', view: 'principal' },
          { icon: Award, label: 'KPI Information', view: 'kpi-info' },
          { icon: Calculator, label: 'KPI Calculation', view: 'kpi-calculation' },
          { icon: BarChart3, label: 'Reports', view: 'reports' },
          // Re-evaluation removed for Principal (Teacher only)
          { icon: Users, label: 'Teachers', view: 'teacher-list' },
          { icon: MessageSquare, label: 'Evaluation', view: 'teacher-evaluation' },
        ];
      case 'teacher':
        return [
          { icon: Home, label: 'Dashboard', view: 'teacher' },
          { icon: Target, label: 'KPI Requests', view: 'kpi-request' },
          { icon: Clock, label: 'Attendance', view: 'attendance' },
          { icon: BarChart3, label: 'Reports', view: 'reports' },
          { icon: RefreshCw, label: 'Re-evaluation', view: 're-evaluation' },
          { icon: Award, label: 'KPI Info', view: 'kpi-info' },
          { icon: FileText, label: 'My Contract', view: 'my-contract' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', view: 'admin-dashboard' },
          { icon: Users, label: 'User Management', view: 'admin-users' },
          { icon: Clock, label: 'Attendance', view: 'attendance' },
          // Re-evaluation removed for HR
          { icon: Settings, label: 'System Settings', view: 'admin-settings' },
          { icon: BarChart3, label: 'Reports', view: 'reports' },
          // Evaluate Teachers removed for HR (Principal only)
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center">
                  <img src={logo} alt="KSIS Logo" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">KSIS</h2>
                  <p className="text-gray-300 text-xs">Performance System</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;

              // Safe cast for view since we know it matches View type from logic
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view as View);
                    onClose?.();
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-shadow ${isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:shadow-md'
                    }`}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-750" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}