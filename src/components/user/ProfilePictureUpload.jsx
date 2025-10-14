import React, { useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastProvider';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { User, Camera, Upload, Trash2, Check, X } from '../icons/Icons';



export function ProfilePictureUpload({ className = "" }) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result );
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewImage || !user) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update user with new profile picture
      updateUser({
        ...user,
        profilePicture: previewImage
      });

      showToast('Profile picture updated successfully');
      setIsDialogOpen(false);
      setPreviewImage(null);
    } catch (error) {
      showToast('Failed to upload profile picture', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    setIsUploading(true);
    try {
      // Simulate removal delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove profile picture from user
      updateUser({
        ...user,
        profilePicture: undefined
      });

      showToast('Profile picture removed');
      setIsDialogOpen(false);
    } catch (error) {
      showToast('Failed to remove profile picture', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const resetDialog = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {/* Current Profile Picture */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-success/10 border-2 border-primary/20">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary/60" />
                </div>
              )}
            </div>
            {user?.profilePicture && (
              <Badge 
                variant="success" 
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
              >
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">Profile Picture</h3>
            <p className="text-sm text-gray-600 mb-3">
              {user?.profilePicture 
                ? 'Update your profile picture' 
                : 'Add a profile picture to personalize your account'
              }
            </p>
            
            <div className="flex space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={resetDialog}>
                    <Camera className="h-4 w-4 mr-2" />
                    {user?.profilePicture ? 'Change Picture' : 'Add Picture'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-primary" />
                      {user?.profilePicture ? 'Update Profile Picture' : 'Add Profile Picture'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Current/Preview Image */}
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-success/10 border-2 border-primary/20">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-12 w-12 text-primary/60" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Area */}
                    <div className="space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose New Image
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Supported formats: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      {previewImage && (
                        <Button 
                          onClick={handleUpload} 
                          disabled={isUploading}
                          className="flex-1"
                        >
                          {isUploading ? 'Uploading...' : 'Save Picture'}
                        </Button>
                      )}
                      
                      {user?.profilePicture && !previewImage && (
                        <Button 
                          variant="destructive"
                          onClick={handleRemove}
                          disabled={isUploading}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isUploading ? 'Removing...' : 'Remove Picture'}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isUploading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {user?.profilePicture && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsDialogOpen(true);
                    resetDialog();
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}