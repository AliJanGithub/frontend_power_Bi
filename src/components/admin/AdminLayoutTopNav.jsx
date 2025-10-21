import React from 'react';
import { useAuth } from '../AuthContext';
import { Button } from '../ui/button';
import { Logo } from '../Logo';
import { NotificationButton } from '../NotificationButton';
import { UserDropdown } from '../UserDropdown';
import { 
  Users, 
  Monitor, 
  Settings,
  Home,
  FileText
} from '../icons/Icons';


export function AdminLayoutTopNav({ children, currentTab, setCurrentTab }) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'dashboards', icon: Monitor, label: 'Dashboards' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div id='legacy-design-wrapper' className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Logo size="md" />
              
              {/* Navigation Menu */}
              <nav className="flex items-center space-x-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                        currentTab === item.id
                          ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25'
                          : 'text-gray-700 hover:bg-primary/5 hover:text-primary hover:shadow-sm'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Right: User Actions */}
            <div className="flex items-center space-x-2">
              <NotificationButton />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}