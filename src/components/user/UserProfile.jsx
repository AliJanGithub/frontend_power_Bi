import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastProvider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { User, Edit, Check, X, Lock, Key, Shield } from '../icons/Icons';
import api from '../../lib/api';

export function UserProfile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [loading,setLoading]=useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const handleSave = async () => {
  if (!formData.name.trim()) {
    showToast('Name is required', 'error');
    return;
  }

  setLoading(true);

  try {
    const response = await api.put('/users/update/name', { name: formData.name });

    if (response?.data?.success) {
      showToast('Settings updated successfully', 'success');
      console.log('Name updated:', response.data.data);
    } else {
      showToast(response?.data?.message || 'Failed to update name', 'error');
    }
  } catch (err) {
    console.error('Update name failed:', err);
    showToast(err.response?.data?.message || err.message, 'error');
  } finally {
    setLoading(false);
    setIsEditing(false);
  }
};


  const handleCancel = () => {
    setFormData({
      name: user?.name || ''
    });
    setIsEditing(false);
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handlePasswordReset = async (e) => {
  e.preventDefault();
  
  if (!validatePassword()) return;

  setIsSubmittingPassword(true);
  const { currentPassword, newPassword } = passwordData;

  try {
    const response = await api.post("auth/change-password", {
      currentPassword,
      newPassword,
    });

    console.log("Password change response:", response);

    showToast('Password updated successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({});
    setIsPasswordDialogOpen(false);
  } catch (error) {
    console.error("Password change failed:", error);
    showToast('Failed to update password', 'error');
  } finally {
    setIsSubmittingPassword(false);
  }
};

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Picture Upload */}
          <ProfilePictureUpload />
          
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Profile Information
                </CardTitle>
                {/* {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )} */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-sm bg-gray-50 p-3 rounded-md border">{user?.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <p className="text-sm bg-gray-100 p-3 rounded-md border text-gray-600">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  Email addresses are managed by administrators and cannot be changed by users.
                </p>
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave}>
                    <Check className="h-4 w-4 mr-2" />
                    {loading ? "Saving " : "Save Changes"   }
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Password</p>
                    <p className="text-xs text-gray-500">Change your account password</p>
                  </div>
                </div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={resetPasswordForm}>
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Key className="h-5 w-5 mr-2 text-primary" />
                        Change Password
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter new password"
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>

                      <Alert>
                        <AlertDescription className="text-sm">
                          Password must be at least 6 characters long and different from your current password.
                        </AlertDescription>
                      </Alert>

                      <div className="flex space-x-2 pt-4">
                        <Button type="submit" disabled={isSubmittingPassword}>
                          {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsPasswordDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500">Role</Label>
                <div className="mt-1">
                  <Badge variant={user?.role === 'admin' ? 'default' : 'success'}>
                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm text-gray-500">User ID</Label>
                <p className="text-sm mt-1 text-gray-700">{user?._id}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Member Since</Label>
                <p className="text-sm mt-1 text-gray-700">{user?.createdAt}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Last Login</Label>
                <p className="text-sm mt-1 text-gray-700">Today</p>
              </div>

              <Separator />

              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="text-xs text-primary">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Your account is secured with BI Portal 365
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}