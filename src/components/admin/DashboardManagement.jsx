import React, { useState,useEffect,useCallback } from 'react';
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
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import DashboardForm from './DashboardForm';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Calendar,
  Grid3X3,
  List,
  Monitor,
  Building
} from '../icons/Icons';

import { useToast } from '../ToastProvider';


import { useDashboards } from '../DashboardContext';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '../hooks/useUserManagement';

export function DashboardManagement() {
  const { user,userRoleUser,loadings } = useAuth();
  console.log("userroelUsers",userRoleUser)
  const navigate=useNavigate()
    const { dashboards,
        loading,
        error,
        fetchDashboards,
        createDashboard,
        getDashboardById,
        updateDashboard,
        deleteDashboard,
        assignDashboard,
        unassignDashboard, }=useDashboards()
  const {users}=useUserManagement()
  const { showToast } = useToast();
  const { preferences, updatePreferences } = useSettings();
  const { departments, addDashboard,  } = useData();





  const allUsers = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    dashboardId: '1',
    dashboardTitle: 'Sales Performance Dashboard',
    action: 'view',
    timestamp: '2024-01-25T10:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    userName: 'Jane Smith',
    dashboardId: '2',
    dashboardTitle: 'Marketing Analytics',
    action: 'view',
    timestamp: '2024-01-25T11:45:00Z'
  },]

console.log("my dashboard users",users)
console.log("my dashboard in dashboard management ",dashboards)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState(null);
  
// 🆕 Add these new states
const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
const [selectedDashboardId, setSelectedDashboardId] = useState(null);
const [selectedUserIds, setSelectedUserIds] = useState([]);
  const viewMode = preferences.viewMode;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    embedUrl: '',
    
  });

  const [formErrors, setFormErrors] = useState({});



// 🆕 Handler to open the dialog
const handleAddUsersClick = (dashboardId) => {
  setSelectedDashboardId(dashboardId);
  setIsUserDialogOpen(true);
};

// 🆕 Handler for selecting users
const toggleUserSelection = (userId) => {
  setSelectedUserIds((prev) =>
    prev.includes(userId)
      ? prev.filter((id) => id !== userId)
      : [...prev, userId]
  );
};

// 🆕 Function to assign selected users
const handleAssignUsers = async () => {
  if (!selectedDashboardId || selectedUserIds.length === 0) {
    showToast('⚠️ Please select at least one user.');
    return;
  }

  try {
    await assignDashboard(selectedDashboardId, selectedUserIds);
    showToast('✅ Users assigned successfully!');
    setIsUserDialogOpen(false);
    setSelectedUserIds([]);
    // await fetchDashboards(); // refresh dashboard list
  } catch (error) {
    showToast(`❌ Failed to assign users: ${error.message || error}`);
  }
};











  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.embedUrl.trim()) errors.embedUrl = 'Embed URL is required';
    // if (!formData.department) errors.department = 'Department is required';
    
    // Validate Power BI embed URL format
    // if (formData.embedUrl && !formData.embedUrl.includes('powerbi.com')) {
    //   errors.embedUrl = 'Please enter a valid Power BI embed URL';
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };








  const handleSubmit = async(e) => {
    e.preventDefault();
 
 if (!validateForm()) return;
    const dashboardData = {
      title: formData.title,
      description: formData.description,
      embedUrl: formData.embedUrl,
      // department: formData.department,
      // createdBy: user?.id || '1',
      // isActive: true,
      // accessUsers: [] // Start with no access, admin can grant later
    };

    if (editingDashboard) {
      try {
      await   updateDashboard(editingDashboard, dashboardData);
      // if (result && (result.success || result._id)) {
       await fetchDashboards();
        showToast('Dashboard updated successfully');
       
      setIsEditDialogOpen(false);
      setEditingDashboard(null);
      // }else{
        // showToast(`error occured in updating the dashboard ${error}`)
      // }
      
      } catch (error) {
        showToast(`error occured in editing the dashboard ${error}`)
      }
     
    } else {
      try {
         const result=await createDashboard(dashboardData);
         console.log("resultttttttttt",result)
 if (result.success ) {
  showToast('✅ Dashboard added successfully');
  await fetchDashboards();
  setIsAddDialogOpen(false);
  resetForm();
} else {
  showToast('❌ Failed to create dashboard');
}

   
     
      } catch (error) {
            showToast(`error occured in creating a dashboard ${error}`)

      }
     
    }

    resetForm();
  };




// const handleSubmit = async(e) => {
//     e.preventDefault();
//     
//     // IMPORTANT: Ensure the final tags state is set before validation and submission
//  

//     if (!validateForm()) return;
//     // ... (Rest of your handleSubmit logic)
//   };


  const resetForm = useCallback(() => {
     setFormData({
      title: '',
      description: '',
      embedUrl: '',
    
    });
    setFormErrors({});
  
  }, []);





  const handleEdit = (dashboard) => {
    setFormData({
      title: dashboard.title,
      description: dashboard.description,
      embedUrl: dashboard.embedUrl,
    });
    setEditingDashboard(dashboard._id);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async(id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
         const result=await deleteDashboard(id);
         if (result.success) {
                showToast('Dashboard deleted successfully');

         }
         else{
                showToast('Dashboard deletion  unsuccessfully');

         }
      } catch (error) {
        showToast(`somethng went wrong ${error}`)
      }
     
    }
  };

const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]); // Dependency on formErrors is necessary here

//   const DashboardForm = () => (
//     <div id='legacy-design-wrapper' className="space-y-6">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Dashboard Title */}
//         <div className="space-y-3">
//           <Label htmlFor="title" className="text-sm font-medium text-gray-900">
//             Dashboard Title *
//           </Label>
//           <Input
//             id="title"
//             value={formData.title}
//             onChange={(e) => handleChange('title', e.target.value)}
//             placeholder="Enter dashboard title"
//             className="h-11 px-4"
//           />
//           {formErrors.title && (
//             <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>
//           )}
//         </div>

//         {/* Description */}
//         <div className="space-y-3">
//           <Label htmlFor="description" className="text-sm font-medium text-gray-900">
//             Description *
//           </Label>
//           <Textarea
//             id="description"
//             value={formData.description}
//             onChange={(e) => handleChange('description', e.target.value)}
//             placeholder="Enter a detailed description of what this dashboard contains..."
//             rows={4}
//             className="px-4 py-3 resize-none"
//           />
//           {formErrors.description && (
//             <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
//           )}
//         </div>
// {/* Tags */}
// {/* Tags */}
// <div className="space-y-3">
//   <Label htmlFor="tags" className="text-sm font-medium text-gray-900">
//     Tags (comma-separated)
//   </Label>

//   <Input
//     id="tags"
//     value={tagsInput}
//     onChange={(e) => {
//       // allow user to type commas freely — update tagsInput only
//       setTagsInput(e.target.value);
//       // clear tag field errors live if any
//       if (formErrors.tags) setFormErrors(prev => ({ ...prev, tags: undefined }));
//     }}
//     onBlur={() => {
//       // On blur, parse & save into formData.tags
//       const parsed = parseTags(tagsInput);
//       setFormData(prev => ({ ...prev, tags: parsed }));
//     }}
//     onKeyDown={(e) => {
//       // optional: if user presses Enter, parse immediately
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         const parsed = parseTags(tagsInput);
//         setFormData(prev => ({ ...prev, tags: parsed }));
//       }
//     }}
//     placeholder="Enter tags like: sales, finance, hr"
//     className="h-11 px-4"
//   />

//   {formErrors.tags && (
//     <p className="text-sm text-red-600 mt-1">{formErrors.tags}</p>
//   )}
// </div>


//         {/* Power BI Embed URL */}
//         <div className="space-y-3">
//           <Label htmlFor="embedUrl" className="text-sm font-medium text-gray-900">
//             Power BI Embed URL *
//           </Label>
//           <Input
//             id="embedUrl"
//             value={formData.embedUrl}
//             onChange={(e) => handleChange('embedUrl', e.target.value)}
//             placeholder="https://app.powerbi.com/view?r=..."
//             className="h-11 px-4 font-mono text-sm"
//           />
//           {formErrors.embedUrl && (
//             <p className="text-sm text-red-600 mt-1">{formErrors.embedUrl}</p>
//           )}
//           <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-xs text-blue-700 leading-relaxed">
//               💡 <strong>How to get the embed URL:</strong><br />
//               1. Open your Power BI dashboard<br />
//               2. Go to File → Embed → Publish to web<br />
//               3. Copy the provided embed URL
//             </p>
//           </div>
//         </div>

//         {/* Department */}
//       {/*    <div className="space-y-3">
//           <Label htmlFor="department" className="text-sm font-medium text-gray-900">
//             Department *
//           </Label>
//           <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
//             <SelectTrigger className="h-11 px-4">
//               <SelectValue placeholder="Select a department" />
//             </SelectTrigger>
//             <SelectContent>
//               {departments.map((department) => (
//                 <SelectItem key={department} value={department}>
//                   {department}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {formErrors.department && (
//             <p className="text-sm text-red-600 mt-1">{formErrors.department}</p>
//           )}
//         </div>
// */}
//         {/* Form Actions */}
//         <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8 -mx-6 px-6">
//           {editingDashboard ? (
//             <Button 
//               type="button" 
//               variant="destructive"
//               onClick={() => {
//                 const dashboardToDelete = dashboards.find(d => d._id === editingDashboard);
//                 if (dashboardToDelete && window.confirm(`Are you sure you want to delete "${dashboardToDelete.title}"?`)) {
//                   handleDelete(editingDashboard, dashboardToDelete.title);
//                   setIsEditDialogOpen(false);
//                   setEditingDashboard(null);
//                   resetForm();
//                 }
//               }}
//               className="px-6 py-2"
//             >
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete Dashboard
//             </Button>
//           ) : (
//             <div></div>
//           )}
          
//           <div className="flex space-x-3">
//             <Button 
//               type="button" 
//               variant="outline" 
//               onClick={() => {
//                 resetForm();
//                 setIsAddDialogOpen(false);
//                 setIsEditDialogOpen(false);
//                 setEditingDashboard(null);
//               }}
//               className="px-6 py-2"
//             >
//               Cancel
//             </Button>
//             <Button 
//               type="submit"
//               className="px-6 py-2"
//             >
//               {editingDashboard ? 'Update Dashboard' : 'Add Dashboard'}
//             </Button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );

  return (
    <TooltipProvider>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-gray-900">Dashboard Management</h1>
          <p className="text-gray-600">Add, edit, and manage Power BI dashboards</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader className="pb-6 border-b border-gray-200 -mx-6 px-6">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Add New Dashboard
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Create a new Power BI dashboard for your organization
              </p>
            </DialogHeader>
            <div className="py-6 -mx-6 px-6">
              <DashboardForm
            formData={formData}
            formErrors={formErrors}
            
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingDashboard={editingDashboard}
            dashboards={dashboards}
            handleDelete={handleDelete}
            setIsEditDialogOpen={setIsAddDialogOpen} // Use setIsAddDialogOpen for ADD dialog
            setEditingDashboard={setEditingDashboard}
            resetForm={resetForm}
           // Pass the new tags update function
          />
        </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Toggle */}
      {dashboards.length > 0 && (
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
            {dashboards.length} dashboard{dashboards.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {dashboards.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg text-gray-900 mb-2">No Dashboards Yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first Power BI dashboard
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboards.length>0 && dashboards.map((dashboard) => (
            <Card key={dashboard?._id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="text-lg">{dashboard?.title || "untitled "}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Dashboard</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm truncate">{dashboard?.description || "undescriptin "}</p>
                
                <Separator />

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      Department
                    </span>
                    <span>{dashboard?.company?.name || " no company"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Access Users
                    </span>
                    <span>{dashboard?.accessUsers?.length || " 0 "}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      created at
                    </span>
                    <span>{new Date(dashboard?.createdAt).toLocaleDateString()  || "not available "}</span>
                  </div>
                </div>

                {/* <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => (window).navigate('view-dashboard', { id: dashboard._id })}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(dashboard)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
  variant="secondary"
  onClick={() => handleAddUsersClick(dashboard._id)}
  className="w-full mt-2"
></Button> */}
                {/* </div> */}
                <div className="grid grid-cols-2 gap-2">
  <Button
    onClick={() =>navigate(`view-dashboard/${dashboard?._id}`)}
  >
    <Eye className="h-4 w-4 mr-2" />
    View
  </Button>

  <Button
    variant="outline"
    onClick={() => handleEdit(dashboard)}
  >
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </Button>

  {/* 🆕 Add User Button */}
 {
  users.length!=0 ? 
  (  <Button
    variant="outline"
    onClick={() => handleAddUsersClick(dashboard._id)}
    className="w-full mt-2 col-span-2 disabl"
  >
    <Users className="h-4 w-4 mr-2" />
    Add Users
  </Button>)
  : (
    <Button
    variant="outline"
    onClick={() => handleAddUsersClick(dashboard._id)}
    className="w-full mt-2 col-span-2 bg-green-100"
  >
    <Users className="h-4 w-4 mr-2" />
    Add Users
  </Button>
  )
 } 
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
              <div className="col-span-4">Dashboard</div>
              <div className="col-span-3">Department</div>
              <div className="col-span-3">Accessed by</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
          
          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {dashboards.map((dashboard) => (
              <div key={dashboard._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Dashboard Info - 4 cols */}
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Monitor className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{dashboard.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{dashboard.description}</p>
                    </div>
                  </div>
                  
                  {/* Department - 3 cols */}
                  <div className="col-span-3">
                    <div className="text-sm text-gray-900">{dashboard.company.name}</div>
                    <div className="text-xs text-gray-500">Internal</div>
                  </div>
                  
                  {/* Access Users - 3 cols */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        {dashboard?.accessUsers?.length > 0 && dashboard?.accessUsers.slice(0, 3).map((userId, index) => {
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
                        {dashboard.accessUsers.length > 3 && (
                          <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{dashboard.accessUsers.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{dashboard?.accessUsers?.length} users</span>
                    </div>
                  </div>
                  
                  {/* Actions - 2 cols */}
                  <div className="col-span-2 flex items-center justify-end space-x-2">
                    <Button
                      onClick={() => navigate(`view-dashboard/${dashboard?._id}`)}
                      size="sm"
                      className="h-8 px-3 text-xs"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dashboard)}
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
              Edit Dashboard
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Update the dashboard information and settings
            </p>
          </DialogHeader>
          <div className="py-6 -mx-6 px-6">
            <DashboardForm
            formData={formData}
            formErrors={formErrors}
         
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingDashboard={editingDashboard}
            dashboards={dashboards}
            handleDelete={handleDelete}
            setIsEditDialogOpen={setIsEditDialogOpen} // Use setIsEditDialogOpen for EDIT dialog
            setEditingDashboard={setEditingDashboard}
            resetForm={resetForm}
         // Pass the new tags update function
          />
        
          </div>
        </DialogContent>
      </Dialog>
      </div>
      {/* 🆕 Assign Users Dialog */}
<Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
  <DialogContent className="max-w-md p-6 space-y-4">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-gray-900">
        Assign Users to Dashboard
      </DialogTitle>
      <p className="text-sm text-gray-500">
        Select users to grant access to this dashboard.
      </p>
    </DialogHeader>

    {/* ✅ User list with checkboxes */}
    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
      {userRoleUser.length > 0 ? (
        userRoleUser.map((user) => (
          <label
            key={user._id}
            className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-800">{user.name}</span>
            </div>
            {selectedUserIds.includes(user._id) && (
              <span className="text-blue-600 text-xs font-medium">
                Selected
              </span>
            )}
          </label>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center py-3">
          No users available to assign.
        </p>
      )}
    </div>

    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
      <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
        Cancel
      </Button>
     
      <Button
        onClick={handleAssignUsers}
        className={`${selectedUserIds.length === 0 ? "disabl" : ""}`}
      >
        {loadings ? "Confirming" : "Confirm"}
      </Button>
    </div>
  </DialogContent>
</Dialog>


    </TooltipProvider>
  );
}