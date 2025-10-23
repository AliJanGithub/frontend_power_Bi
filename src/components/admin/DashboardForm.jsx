// src/components/DashboardForm.jsx

import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Trash2 } from '../icons/Icons'; // Assuming you have an Icons file

// Helper functions (re-imported or defined here)
// You must move parseTags and validateTags here or import them.
// For simplicity, I'm assuming you will define them here.

// helper to parse and sanitize raw tags string -> array




// -----------------------------------------------------------

const DashboardForm = ({
  formData,
  formErrors,

  handleChange,
  handleSubmit,
  editingDashboard,
  dashboards,
  handleDelete,
  setIsEditDialogOpen,
  setEditingDashboard,
  resetForm,
  // We also need the function used in onBlur/onKeyDown for tags
//   updateFormDataTags,
}) => {

  // Function to handle keydown (like 'Enter') for the tags input
//   const handleTagsKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       updateFormDataTags(tagsInput); // Call the prop function to update formData
//     }
//   };
  
  // Function to handle blur for the tags input
//   const handleTagsBlur = () => {
//     updateFormDataTags(tagsInput); // Call the prop function to update formData
//   };

  return (
    <div id='dashboard-form-wrapper' className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dashboard Title */}
        <div className="space-y-3">
          <Label htmlFor="title" className="text-sm font-medium text-gray-900">
            Dashboard Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter dashboard title"
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
            placeholder="Enter a detailed description of what this dashboard contains..."
            rows={4}
            className="px-4 py-3 resize-none"
          />
          {formErrors.description && (
            <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
          )}
        </div>

        


        {/* Power BI Embed URL */}
        <div className="space-y-3">
          <Label htmlFor="embedUrl" className="text-sm font-medium text-gray-900">
            Power BI Embed URL *
          </Label>
          <Input
            id="embedUrl"
            value={formData.embedUrl}
            onChange={(e) => handleChange('embedUrl', e.target.value)}
            placeholder="https://app.powerbi.com/view?r=..."
            className="h-11 px-4 font-mono text-sm"
          />
          {formErrors.embedUrl && (
            <p className="text-sm text-red-600 mt-1">{formErrors.embedUrl}</p>
          )}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 leading-relaxed">
              💡 <strong>How to get the embed URL:</strong><br />
              1. Open your Power BI dashboard<br />
              2. Go to File → Embed → Publish to web<br />
              3. Copy the provided embed URL
            </p>
          </div>
        </div>
 
      {/* Department Selection */}
<div className="space-y-3">
  <Label htmlFor="department" className="text-sm font-medium text-gray-900">
    Department *
  </Label>
  <select
    id="department"
    value={formData.department}
    onChange={(e) => handleChange('department', e.target.value)}
    className="h-11 px-4 w-full border border-gray-300 rounded-md text-sm"
  >
    <option value="">Select a department</option>
    <option value="FINANCE">Finance</option>
    <option value="SALES">Sales</option>
    <option value="MARKETING">Marketing</option>
    <option value="GENERAL">General</option>
    <option value="OTHER">Other</option>
    <option value="HR">HR</option>
  </select>
  {formErrors.department && (
    <p className="text-sm text-red-600 mt-1">{formErrors.department}</p>
  )}
</div>

        
        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8 -mx-6 px-6">
          {editingDashboard ? (
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => {
                const dashboardToDelete = dashboards.find(d => d._id === editingDashboard);
                if (dashboardToDelete && window.confirm(`Are you sure you want to delete "${dashboardToDelete.title}"?`)) {
                  handleDelete(editingDashboard, dashboardToDelete.title);
                  setIsEditDialogOpen(false);
                  setEditingDashboard(null);
                  resetForm();
                }
              }}
              className="px-6 py-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Dashboard
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
                setIsEditDialogOpen(false);
                setEditingDashboard(null);
              }}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 py-2"
            >
              {editingDashboard ? 'Update Dashboard' : 'Add Dashboard'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders when parent state changes 
// (e.g., isAddDialogOpen or isEditDialogOpen) but none of the form props do.
export default React.memo(DashboardForm);