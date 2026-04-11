import { Outlet, Link, useLocation } from 'react-router';
import { Home, Bookmark, FileText, Bell, Search } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/browse', icon: Search, label: 'Browse' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/applications', icon: FileText, label: 'Applications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden" style={{ height: '90vh', maxHeight: '844px' }}>
        {/* Status bar */}
        {/* <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <span className="font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 bg-gray-300 rounded-sm"></div>
            <div className="w-4 h-3 bg-gray-300 rounded-sm"></div>
            <div className="w-6 h-3 bg-gray-800 rounded-sm"></div>
          </div>
        </div> */}

        {/* Main content */}
        <div className="flex flex-col h-full pb-38 overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>

        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2" style={{ borderRadius: '0 0 40px 40px' }}>
          <nav className="flex items-center justify-between max-w-md mx-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-1 py-2 px-3 relative"
                >
                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? 'text-blue-600 fill-blue-600' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}