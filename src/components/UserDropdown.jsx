import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { User, ChevronDown, LogOut, Settings, Mail2, Shield } from './icons/Icons';
import { useNavigate } from 'react-router-dom';

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
const navigate=useNavigate()
  // Calculate dropdown position
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const newPosition = {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      };
      setDropdownPosition(newPosition);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target )) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown && !dropdown.contains(event.target )) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('login');
    setIsOpen(false);
  };

  const handleSettings = () => {
    if (user?.role === 'admin') {
      // Navigate to admin settings or keep current admin interface
      setIsOpen(false);
    } else {
      (window ).navigate('user-settings');
      setIsOpen(false);
    }
  };

  if (!user) return null;

  // Dropdown component
  const DropdownContent = () => (
    <div 
      id="user-dropdown"
      className="fixed w-72"
      style={{
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
        zIndex: 9999
      }}
    >
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-in fade-in-80 slide-in-from-top-2">
        <CardContent className="p-0">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {/* Larger Profile Picture */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-success/10 border-2 border-primary/20 flex-shrink-0">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary/60" />
                  </div>
                )}
              </div>
              
              {/* User Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail2 className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Shield className="h-3 w-3 text-gray-400" />
                  <Badge 
                    variant={user.role === 'admin' ? 'default' : 'success'} 
                    className="text-xs px-2 py-0"
                  >
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="p-2">
            {user.role === 'user' && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto text-left hover:bg-primary/5"
                  onClick={handleSettings}
                >
                  <Settings className="h-4 w-4 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Settings</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </Button>
                <Separator className="my-1" />
              </>
            )}
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-red-50 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-red-500">Sign out of BI Portal 365</p>
              </div>
            </Button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              BI Portal 365 • Version 1.0
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {/* Profile Picture Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        className="p-1 h-auto hover:bg-primary/5 transition-colors"
        onClick={() => {
          if (!isOpen) {
            updatePosition();
          }
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center space-x-2">
          {/* Profile Picture */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-success/10 border border-primary/20">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary/60" />
              </div>
            )}
          </div>
          
          {/* Chevron Icon */}
          <ChevronDown 
            className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </Button>

      {/* Portal-rendered Dropdown Menu */}
      {isOpen && createPortal(<DropdownContent />, document.body)}
    </>
  );
}