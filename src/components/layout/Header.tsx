import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({ title, userName = 'User', onMenuClick }: HeaderProps) {
  return (
    <header className="bg-black border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900">{title}</h1>
        </div>
       <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-gray-900">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-900 rounded-full text-black text-xs flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <span className="hidden sm:inline text-white/90">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}