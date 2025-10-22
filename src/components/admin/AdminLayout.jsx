import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { Logo } from '../Logo';
import { NotificationButton } from '../NotificationButton';
import { UserDropdown } from '../UserDropdown';
import { 
  Users, 
  Monitor, 
  Settings,
  Home,
  User,
  ChevronLeft,
  ChevronRight,
  FileText
} from '../icons/Icons';



export function AdminLayout({ children, currentTab, setCurrentTab, initialCollapsed = false }) {
  const { user } = useAuth();
  
  // Initialize from localStorage or use initialCollapsed
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portal365-nav-collapsed');
      return stored !== null ? JSON.parse(stored) : initialCollapsed;
    }
    return initialCollapsed;
  });

  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'dashboards', icon: Monitor, label: 'Dashboards' },
    // { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  // Handle collapse state change and persist to localStorage
  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('portal365-nav-collapsed', JSON.stringify(newCollapsedState));
  };



  return (
    <div id='legacy-design-wrapper' className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            
            <div className="flex items-center space-x-2">
              <NotificationButton />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      <div id='legacy-design-wrapper' className="flex">
        {/* Sidebar */}
        <nav className={`${isCollapsed ? 'w-12' : 'w-44'} bg-white/80 backdrop-blur-sm border-r border-primary/10 min-h-[calc(100vh-73px)] shadow-sm transition-all duration-300`}>
          {/* Collapse Button */}
          <div className="p-3 border-b border-gray-200">
            {isCollapsed ? (
              <button
                onClick={handleCollapseToggle}
                className="w-full flex items-center justify-center px-1 py-2 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-primary/5 hover:text-primary hover:shadow-sm"
                title="Expand Menu"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollapseToggle}
                className="w-full flex items-center px-3 py-3 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Collapse Menu</span>
                </div>
              </Button>
            )}
          </div>

          <div className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'px-3'} py-2 text-sm rounded-lg transition-all duration-200 ${
                    currentTab === item.id
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25'
                      : 'text-gray-700 hover:bg-primary/5 hover:text-primary hover:shadow-sm'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
                  {!isCollapsed && item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}