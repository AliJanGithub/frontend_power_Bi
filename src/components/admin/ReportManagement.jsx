import React, { useState } from 'react';
import { useData } from '../DataContext';
import { useAuth } from '../AuthContext';
import { useSettings } from '../SettingsContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Calendar,
  Grid3X3,
  List,
  FileText,
  Building
} from '../icons/Icons';
import { useToast } from '../ToastProvider';


export function ReportManagement() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { preferences, updatePreferences } = useSettings();
  const { reports, departments, addReport, updateReport, deleteReport, getAllUsers } = useData();
  const allUsers = getAllUsers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const viewMode = preferences.viewMode;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    embedUrl: '',
    department: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.embedUrl.trim()) errors.embedUrl = 'Embed URL is required';
    if (!formData.department) errors.department = 'Department is required';
    
    // Validate SharePoint embed URL format
    if (formData.embedUrl) {
      if (!formData.embedUrl.includes('sharepoint.com')) {
        errors.embedUrl = 'Please enter a valid SharePoint URL';
      } else if (formData.embedUrl.includes(':x:/')) {
        errors.embedUrl = 'This appears to be a sharing link. Please use the embed URL instead (see instructions above)';
      } else if (!formData.embedUrl.includes('_layouts/15/Doc.aspx') || !formData.embedUrl.includes('action=embedview')) {
        errors.embedUrl = 'This doesn\'t appear to be a proper SharePoint embed URL. Please follow the instructions above.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const reportData = {
      title: formData.title,
      description: formData.description,
      embedUrl: formData.embedUrl,
      department: formData.department,
      createdBy: user?.id || '1',
      isActive: true,
      accessUsers: [] // Start with no access, admin can grant later
    };

    if (editingReport) {
      updateReport(editingReport, reportData);
      showToast('Report updated successfully');
      setIsEditDialogOpen(false);
      setEditingReport(null);
    } else {
      addReport(reportData);
      showToast('Report added successfully');
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      embedUrl: '',
      department: ''
    });
    setFormErrors({});
  };

  const handleEdit = (report) => {
    setFormData({
      title: report.title,
      description: report.description,
      embedUrl: report.embedUrl,
      department: report.department
    });
    setEditingReport(report.id);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteReport(id);
      showToast('Report deleted successfully');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };



  const ReportForm = () => (
    <div id='legacy-design-wrapper' className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Title */}
        <div className="space-y-3">
          <Label htmlFor="title" className="text-sm font-medium text-gray-900">
            Report Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter report title"
            className="h-11 px-4"
          />
          {formErrors.title && (
            <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-medium text-gray-900">
            Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter a detailed description of what this report contains..."
            rows={4}
            className="px-4 py-3 resize-none"
          />
          {formErrors.description && (
            <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
          )}
        </div>

        {/* SharePoint Embed URL */}
        <div className="space-y-3">
          <Label htmlFor="embedUrl" className="text-sm font-medium text-gray-900">
            SharePoint Excel Embed URL *
          </Label>
          <Input
            id="embedUrl"
            value={formData.embedUrl}
            onChange={(e) => handleChange('embedUrl', e.target.value)}
            placeholder="https://company-my.sharepoint.com/personal/user/_layouts/15/Doc.aspx?sourcedoc=..."
            className="h-11 px-4 font-mono text-sm"
          />
          {formErrors.embedUrl && (
            <p className="text-sm text-red-600 mt-1">{formErrors.embedUrl}</p>
          )}
          
          {/* Warning for sharing links */}
          {formData.embedUrl && formData.embedUrl.includes(':x:/') && (
            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-700 leading-relaxed">
                ⚠️ <strong>Warning:</strong> This looks like a sharing link, not an embed URL. 
                Sharing links cannot be embedded due to SharePoint security restrictions.
              </p>
            </div>
          )}
          
          <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 leading-relaxed mb-3">
              📊 <strong>How to get the correct embed URL:</strong>
            </p>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside mb-3">
              <li>Open your Excel file in SharePoint Online</li>
              <li>Click <strong>"File"</strong> in the ribbon</li>
              <li>Select <strong>"Share"</strong> → <strong>"Embed"</strong></li>
              <li>In the embed dialog, click <strong>"Generate"</strong></li>
              <li>Copy the <strong>src</strong> attribute from the iframe code</li>
            </ol>
            <div className="bg-white border border-blue-300 rounded p-2 font-mono text-xs text-blue-900">
              Example: https://company-my.sharepoint.com/personal/user/_layouts/15/Doc.aspx?sourcedoc=&#123;guid&#125;&action=embedview
            </div>
          </div>
        </div>

        {/* Department */}
        <div className="space-y-3">
          <Label htmlFor="department" className="text-sm font-medium text-gray-900">
            Department *
          </Label>
          <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
            <SelectTrigger className="h-11 px-4">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.department && (
            <p className="text-sm text-red-600 mt-1">{formErrors.department}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8 -mx-6 px-6">
          {editingReport ? (
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => {
                const reportToDelete = reports.find(r => r.id === editingReport);
                if (reportToDelete && window.confirm(`Are you sure you want to delete "${reportToDelete.title}"?`)) {
                  handleDelete(editingReport, reportToDelete.title);
                  setIsEditDialogOpen(false);
                  setEditingReport(null);
                  resetForm();
                }
              }}
              className="px-6 py-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Report
            </Button>
          ) : (
            <div></div>
          )}
          
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setEditingReport(null);
              }}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 py-2"
            >
              {editingReport ? 'Update Report' : 'Add Report'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <TooltipProvider>
      <div id='legacy-design-wrapper' className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-gray-900">Report Management</h1>
          <p className="text-gray-600">Add, edit, and manage Excel reports</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader className="pb-6 border-b border-gray-200 -mx-6 px-6">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Add New Report
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Create a new Excel report for your organization
              </p>
            </DialogHeader>
            <div className="py-6 -mx-6 px-6">
              <ReportForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Toggle */}
      {reports.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="border border-gray-200 rounded-lg p-1 bg-white">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updatePreferences({ viewMode: 'grid' })}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updatePreferences({ viewMode: 'list' })}
                className="h-8 px-3"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg text-gray-900 mb-2">No Reports Yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first Excel report
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Report</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm truncate">{report.description}</p>
                
                <Separator />

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      Department
                    </span>
                    <span>{report.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Access Users
                    </span>
                    <span>{report.accessUsers.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last Modified
                    </span>
                    <span>{new Date(report.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => (window).navigate('view-report', { id: report.id })}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(report)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-12 gap-4 items-center text-sm text-gray-600">
              <div className="col-span-4">Report</div>
              <div className="col-span-3">Department</div>
              <div className="col-span-3">Accessed by</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
          
          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Report Info - 4 cols */}
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-success" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{report.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{report.description}</p>
                    </div>
                  </div>
                  
                  {/* Department - 3 cols */}
                  <div className="col-span-3">
                    <div className="text-sm text-gray-900">{report.department}</div>
                    <div className="text-xs text-gray-500">Internal</div>
                  </div>
                  
                  {/* Access Users - 3 cols */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        {report.accessUsers.slice(0, 3).map((userId, index) => {
                          const user = allUsers.find(u => u.id === userId);
                          return (
                            <Tooltip key={userId}>
                              <TooltipTrigger asChild>
                                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                                  <span className="text-xs text-gray-600 font-medium">
                                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-sm">{user?.name || 'Unknown User'}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                        {report.accessUsers.length > 3 && (
                          <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{report.accessUsers.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{report.accessUsers.length} users</span>
                    </div>
                  </div>
                  
                  {/* Actions - 2 cols */}
                  <div className="col-span-2 flex items-center justify-end space-x-2">
                    <Button
                      onClick={() => (window).navigate('view-report', { id: report.id })}
                      size="sm"
                      className="h-8 px-3 text-xs"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(report)}
                      className="h-8 px-3 text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="pb-6 border-b border-gray-200 -mx-6 px-6">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Edit Report
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Update the report information and settings
            </p>
          </DialogHeader>
          <div className="py-6 -mx-6 px-6">
            <ReportForm />
          </div>
        </DialogContent>
      </Dialog>


      </div>
    </TooltipProvider>
  );
}