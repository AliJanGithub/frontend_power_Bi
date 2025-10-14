import React, { createContext, useContext, useState, useEffect } from 'react';






const defaultSettings = {
  companyName: 'BI Portal 365',
  companyLogo: null,
  primaryColor: '#4472C4',
  secondaryColor: '#5CB85C'
};

const defaultPreferences = {
  viewMode: 'grid'
};

const SettingsContext = createContext(undefined);

export function SettingsProvider({ children } ) {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portal365-org-settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  const [preferences, setPreferences] = useState(() => {
    // Load preferences from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portal365-user-preferences');
      if (saved) {
        try {
          return { ...defaultPreferences, ...JSON.parse(saved) };
        } catch {
          return defaultPreferences;
        }
      }
    }
    return defaultPreferences;
  });

  // Update CSS variables when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--primary', settings.primaryColor);
      root.style.setProperty('--color-primary', settings.primaryColor);
      root.style.setProperty('--success', settings.secondaryColor);
      root.style.setProperty('--color-success', settings.secondaryColor);
      root.style.setProperty('--ring', settings.primaryColor);
      root.style.setProperty('--color-ring', settings.primaryColor);
      root.style.setProperty('--chart-1', settings.primaryColor);
      root.style.setProperty('--color-chart-1', settings.primaryColor);
      root.style.setProperty('--chart-2', settings.secondaryColor);
      root.style.setProperty('--color-chart-2', settings.secondaryColor);
      root.style.setProperty('--sidebar-primary', settings.primaryColor);
      root.style.setProperty('--color-sidebar-primary', settings.primaryColor);
      root.style.setProperty('--sidebar-ring', settings.primaryColor);
      root.style.setProperty('--color-sidebar-ring', settings.primaryColor);
    }
  }, [settings.primaryColor, settings.secondaryColor]);

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('portal365-org-settings', JSON.stringify(updatedSettings));
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portal365-org-settings');
    }
  };

  const updatePreferences = (newPreferences) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('portal365-user-preferences', JSON.stringify(updatedPreferences));
    }
  };

  const value = {
    settings,
    updateSettings,
    resetToDefaults,
    preferences,
    updatePreferences
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}