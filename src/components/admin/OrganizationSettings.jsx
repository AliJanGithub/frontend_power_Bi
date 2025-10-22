import React, { useState, useRef } from 'react';
import { useSettings } from '../SettingsContext';
import { useToast } from '../ToastProvider';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Settings,
  Building,
  Palette,
  Upload,
  Image,
  RotateCcw,
  Save,
  Info
} from '../icons/Icons';
import { useAuth } from '../AuthContext';

export function OrganizationSettings() {
  const { settings, updateSettings, resetToDefaults } = useSettings();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const {user}=useAuth()
  console.log("user organization ,admin here ,",user,user.company.name)
  const [formData, setFormData] = useState({
    companyName: settings.companyName,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor
  });
  
  const [previewLogo, setPreviewLogo] = useState(settings.companyLogo);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast('Logo file must be less than 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result ;
        setPreviewLogo(result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setPreviewLogo(null);
    setHasChanges(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    updateSettings({
      companyName: formData.companyName,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      companyLogo: previewLogo
    });
    setHasChanges(false);
    showToast('Organization settings saved successfully');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This will remove your custom logo and colors.')) {
      resetToDefaults();
      setFormData({
        companyName: 'BI Portal 365',
        primaryColor: '#4472C4',
        secondaryColor: '#5CB85C'
      });
      setPreviewLogo(null);
      setHasChanges(false);
      showToast('Settings reset to defaults');
    }
  };

  const presetColors = [
    { name: 'Default Blue', primary: '#4472C4', secondary: '#5CB85C' },
    { name: 'Corporate Red', primary: '#DC2626', secondary: '#059669' },
    { name: 'Modern Purple', primary: '#7C3AED', secondary: '#F59E0B' },
    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#10B981' },
    { name: 'Forest Green', primary: '#059669', secondary: '#3B82F6' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#8B5CF6' }
  ];

  return (
    <div   id='legacy-design-wrapper' className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">Organization Settings</h1>
        <p className="text-gray-600">Customize your organization's branding and appearance</p>
      </div>{/* Company Information */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Building className="h-5 w-5 text-blue-600" />
      <span className="text-lg font-semibold">Company Information</span>
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <span className="text-sm text-gray-500">Company Name</span>
        <span className="font-medium text-gray-800">
          {user?.company?.name || 'N/A'}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2">
        <span className="text-sm text-gray-500">Created By</span>
        <span className="font-medium text-gray-800">
          {user?.company?.createdBy?.name || 'N/A'}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2">
        <span className="text-sm text-gray-500">Creator Role</span>
        <span className="font-medium text-gray-800">
          {user?.company?.createdBy?.role || 'N/A'}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2">
        <span className="text-sm text-gray-500">Creator Email</span>
        <span className="font-medium text-gray-800">
          {user?.company?.createdBy?.email || 'N/A'}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2">
        {/* <span className="text-sm text-gray-500">Status</span> */}
        <span
          className={`font-semibold px-2 py-1 rounded-lg ${
            user?.company?.isActive
              ? 'text-green-700 bg-green-100'
              : 'text-red-700 bg-red-100'
          }`}
        >
          {/* {user?.company?.status ? 'Active' : 'Inactive'} */}
        </span>
      </div>
    </div>
  </CardContent>
</Card>


      {/* Company Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="h-5 w-5" />
            <span>Company Logo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {previewLogo ? (
                  <img
                    src={previewLogo}
                    alt="Company Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Image className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">No logo</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Logo</span>
                  </Button>
                  {previewLogo && (
                    <Button variant="outline" onClick={removeLogo}>
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Upload a square logo (recommended 200x200px, max 2MB)
                  <br />
                  Supported formats: PNG, JPG, SVG
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Brand Colors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Choose colors that represent your brand. These will be applied throughout the portal for all users.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-3">
                <input
                  id="primary-color"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#4472C4"
                  className="font-mono text-sm"
                />
              </div>
              <p className="text-sm text-gray-500">Used for buttons, links, and highlights</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center space-x-3">
                <input
                  id="secondary-color"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  placeholder="#5CB85C"
                  className="font-mono text-sm"
                />
              </div>
              <p className="text-sm text-gray-500">Used for success states and accents</p>
            </div>
          </div>

        
          <div className="space-y-3">
            <Label>Color Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presetColors.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    handleInputChange('primaryColor', preset.primary);
                    handleInputChange('secondaryColor', preset.secondary);
                  }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                >
                  <div className="flex space-x-1">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span className="text-sm font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Actions */}
      {/* <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Defaults</span>
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div> */}
    </div>
  );
}