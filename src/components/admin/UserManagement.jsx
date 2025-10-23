import React, { useEffect, useState } from 'react';
import { useData } from '../DataContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { 
  Mail, 
  Plus, 
  Users, 
  Check, 
  X, 
  Clock,
  Eye,
  Settings,
  Trash2,
  Edit,
  Key,
  ChevronRight,
  ChevronDown,
  Shield,
  Monitor,
  FileText
} from '../icons/Icons';
import { useToast } from '../ToastProvider';
import { useUserManagement } from '../hooks/useUserManagement';
import { useDashboards } from '../DashboardContext';
import { set } from 'react-hook-form';


// Mock users data (in real app this would come from backend)
const initialMockUsers = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-25T10:30:00Z',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '2',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-24T14:15:00Z',
    createdAt: '2024-01-15T11:30:00Z'
  },
  {
    id: '3',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-23T16:45:00Z',
    createdAt: '2024-01-20T13:20:00Z'
  }
];

export function UserManagement() {
  const { showToast } = useToast();
  const { 
    invitations, 
    sendInvitation, 
    deleteInvitation, 
    dashboards, 
    reports,
    grantAccess, 
    revokeAccess,
    grantReportAccess,
    revokeReportAccess,
    // departments 
  } = useData();
  const {addUser,error,getUsers,inviteUser,users,deleteUser}=useUserManagement()
  // const [users, setUsers] = useState(initialMockUsers);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

  const [managingAccessUser, setManagingAccessUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('user');
  const [pendingNumbers,setPendingNumbers]=useState([])
  const [inviteEmail, setInviteEmail] = useState('');
  const [name,setname]=useState("")
  const [inviteRole, setInviteRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [departmentAccess, setDepartmentAccess] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState([]);
  const [expandedContentSections, setExpandedContentSections] = useState([]);

 const { assignDashboard ,loading} =useDashboards()
  const [open, setOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [id,setId]=useState(null)













  
  const fetchUsers = async () => {
    try {
      const data = await getUsers(); // ✅ using your hook function
      console.log('Fetched users:', data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

const invitationCheck=()=>{
  const res=users.length >0 ? users.filter((obj)=>obj.isActive!=true) : [];
  setPendingNumbers(res)

}

  useEffect(() => {
    fetchUsers();
    invitationCheck()
  }, []);

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setEmailError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    

    try {
      const result = await inviteUser(inviteEmail, name);
      if (result.success) {
        showToast(`User invitation sent successfully`);
        setInviteEmail('');
        setname('');
        setIsInviteDialogOpen(false);
      } else {
        setEmailError(result.error || 'Failed to send invitation');
      }
    } catch (error) {
      setEmailError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvitation = (id, email) => {
    if (window.confirm(`Are you sure you want to delete the invitation for ${email}?`)) {
      deleteInvitation(id);
      showToast('Invitation deleted');
    }
  };





  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      showToast(`User "${userName}" has been deleted`, 'success');
    }
  };

  const handleDeleteMyUser = async(userId) => {
    try {
       const user=await deleteUser(userId)
      showToast("User Deleted Succesfully")
    } catch (error) {
      showToast(error)
    }
   
   
  };

  const handleUpdateRole = () => {
    if (!editingUser) return;
    
    const user = users.find(u => u.id === editingUser);
    if (!user) return;

    setUsers(prev => prev.map(u => 
      u.id === editingUser ? { ...u, role: newRole } : u
    ));

    showToast(`${user.name}'s role updated to ${newRole === 'admin' ? 'Administrator' : 'User'}`, 'success');
    setIsEditUserDialogOpen(false);
    setEditingUser(null);
    setNewRole('user');
  };

  const handleResetPassword = () => {
    if (!editingUser) return;
    
    const user = users.find(u => u.id === editingUser);
    if (!user) return;

    if (window.confirm(`Are you sure you want to reset the password for ${user.name}? They will receive an email with a new temporary password.`)) {
      showToast(`Password reset email sent to ${user.email}`, 'success');
    }
  };
   
    const departments = ["FINANCE", "SALES", "MARKETING", "GENERAL", "OTHER", "HR"];
 const handleManageAccesss = (user) => {
    setOpen(true); // open dialog
    setId(user)
  };

  const handleConfirms = async() => {
    if (!selectedDept) return alert("Please select a department first!");
    try {
       await assignDashboard([id._id], selectedDept); // call context function
    
        showToast("succesfully assigned to user")
    
    setOpen(false);
    setSelectedDept("");
    } catch (error) {
      showToast('error')
    }
    

  };
  // New comprehensive access management functions
  // const handleManageAccess = (user) => {
  //   setManagingAccessUser(user);
    
  //   // Calculate current department access
  //   const currentAccess = {};
    
  //   departments.forEach(dept => {
  //     const deptDashboards = dashboards.filter(d => d.department === dept);
  //     // const deptReports = reports.filter(r => r.department === dept);
      
  //     const userHasDashboardAccess = deptDashboards.length > 0 && 
  //       deptDashboards.every(d => d.accessUsers.includes(user.id));
      
  //     const userHasReportAccess = deptReports.length > 0 && 
  //       deptReports.every(r => r.accessUsers.includes(user.id));
      
  //     currentAccess[dept] = {
  //       dashboards: userHasDashboardAccess,
  //       reports: userHasReportAccess
  //     };
  //   });
    
  //   setDepartmentAccess(currentAccess);
  //   setIsAccessDialogOpen(true);
  // };

  const handleDepartmentToggle = (department, type, granted) => {
    if (!managingAccessUser) return;

    if (type === 'dashboards') {
      const deptDashboards = dashboards.filter(d => d.department === department);
      deptDashboards.forEach(dashboard => {
        if (granted) {
          grantAccess(managingAccessUser.id, dashboard.id);
        } else {
          revokeAccess(managingAccessUser.id, dashboard.id);
        }
      });
    } else {
      const deptReports = reports.filter(r => r.department === department);
      deptReports.forEach(report => {
        if (granted) {
          grantReportAccess(managingAccessUser.id, report.id);
        } else {
          revokeReportAccess(managingAccessUser.id, report.id);
        }
      });
    }

    // Update local state
    setDepartmentAccess(prev => ({
      ...prev,
      [department]: {
        ...prev[department],
        [type]: granted
      }
    }));

    const actionText = granted ? 'granted' : 'revoked';
    const contentType = type === 'dashboards' ? 'dashboards' : 'reports';
    showToast(`${department} ${contentType} access ${actionText} for ${managingAccessUser.name}`);
  };

  const getDepartmentCounts = (department) => {
    const dashboardCount = dashboards.filter(d => d.department === department).length;
    const reportCount = reports.filter(r => r.department === department).length;
    return { dashboardCount, reportCount };
  };

  const toggleDepartmentExpansion = (department) => {
    setExpandedDepartments(prev => 
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleDepartmentAccess = (department, granted) => {
    // Grant/revoke access to all dashboards and reports in the department
    handleDepartmentToggle(department, 'dashboards', granted);
    handleDepartmentToggle(department, 'reports', granted);
  };

  const isDepartmentFullyGranted = (department) => {
    const currentAccess = departmentAccess[department] || { dashboards: false, reports: false };
    const { dashboardCount, reportCount } = getDepartmentCounts(department);
    
    const dashboardsGranted = dashboardCount === 0 || currentAccess.dashboards;
    const reportsGranted = reportCount === 0 || currentAccess.reports;
    
    return dashboardsGranted && reportsGranted;
  };

  const isDepartmentPartiallyGranted = (department) => {
    const currentAccess = departmentAccess[department] || { dashboards: false, reports: false };
    return currentAccess.dashboards || currentAccess.reports;
  };

  const toggleContentSectionExpansion = (sectionKey) => {
    setExpandedContentSections(prev => 
      prev.includes(sectionKey)
        ? prev.filter(s => s !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleIndividualItemAccess = (itemId, itemType, granted) => {
    if (!managingAccessUser) return;

    if (itemType === 'dashboard') {
      if (granted) {
        grantAccess(managingAccessUser.id, itemId);
      } else {
        revokeAccess(managingAccessUser.id, itemId);
      }
    } else {
      if (granted) {
        grantReportAccess(managingAccessUser.id, itemId);
      } else {
        revokeReportAccess(managingAccessUser.id, itemId);
      }
    }

    showToast(`${itemType === 'dashboard' ? 'Dashboard' : 'Report'} access ${granted ? 'granted' : 'revoked'}`);
  };

  const isItemAccessGranted = (itemId, itemType) => {
    if (!managingAccessUser) return false;

    if (itemType === 'dashboard') {
      const dashboard = dashboards.find(d => d.id === itemId);
      return dashboard ? dashboard.accessUsers.includes(managingAccessUser.id) : false;
    } else {
      const report = reports.find(r => r.id === itemId);
      return report ? report.accessUsers.includes(managingAccessUser.id) : false;
    }
  };




  const getUserAccess = (userId) => {
    return dashboards.filter(d => d.accessUsers.includes(userId));
  };

  const mockUsers = users; // Use state-managed users instead of static mock data

  const getStatusBadge = (status) => {
    switch (status) {
      case true:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case false:
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInvitationStatusBadge = (status) => {
    switch (status) {
      case true:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case false:
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><X className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div id='legacy-design-wrapper' className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users and their dashboard access</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger  asChild>
            <Button>
              <Mail  className="legacy-design-wrapper h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-8">
            <DialogHeader className="text-center space-y-4 mb-6">
              <DialogTitle className="text-xl font-semibold">Invite New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendInvitation} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@company.com"
                    required
                    disabled={isLoading}
                    className="h-12 px-4 text-sm"
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 mt-2">{emailError}</p>
                  )}
                </div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    placeholder="john doe"
                    required
                    disabled={isLoading}
                    className="h-12 px-4 text-sm"
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 mt-2">{emailError}</p>
                  )}
                

                {/* <div className="space-y-3">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </Label>
                  <Select value={inviteRole} onValueChange={setInviteRole} disabled={isLoading}>
                    <SelectTrigger className="h-12 px-4 text-sm">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
              
              <Alert className="bg-blue-50 border-blue-200 p-4 mt-6">
                <AlertDescription className="text-sm text-gray-600 leading-relaxed">
                  The user will receive an email with instructions to set up their account and password.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-3 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsInviteDialogOpen(false);
                    setInviteEmail('');
                    setInviteRole('user');
                    setEmailError('');
                  }}
                  disabled={isLoading}
                  className="min-w-[100px] h-11 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !inviteEmail}
                  className="min-w-[140px] h-11 px-6"
                >
                  {isLoading ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Active Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(user.isActive)}
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* <div className="text-right space-y-1">
                  <p className="text-xs text-gray-500">
                    Last login: {new Date(user.lastLogin).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Access to {getUserAccess(user.id).length} dashboard(s)
                  </p>
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    {user.role !== 'ADMIN' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManageAccess(user)}
                        className="h-8"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Manage Access
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMyUser(user._id)}
                      className="h-8 px-3 text-xs"
                    >
                     {loading ? 'Deleting…' : 'Delete user'}
                    </Button>
                  </div>
                </div> */}


 <div className="text-right space-y-1">
      <p className="text-xs text-gray-500">
        Last login: {new Date(user.lastLogin).toLocaleDateString()}
      </p>
      <p className="text-xs text-gray-500">
        Access to {getUserAccess(user.id).length} dashboard(s)
      </p>

      <div className="flex items-center justify-end space-x-2 mt-2">
        {user.role !== "ADMIN" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleManageAccesss(user)}
            className="h-8"
          >
            <Settings className="h-3 w-3 mr-1" />
            Manage Access
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteMyUser(user._id)}
          className="h-8 px-3 text-xs"
        >
          {loading ? "Deleting…" : "Delete user"}
        </Button>
      </div>

      {/* Department Selection Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[60vh] overflow-y-auto p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl">Select Department</DialogTitle>
            {id && (
              <p className="text-gray-600 text-sm mt-2">
                Assigning access for:{" "}
                <span className="font-medium text-gray-900">
                  {id.name}
                </span>
              </p>
            )}
          </DialogHeader>

          {/* Department Selection Buttons */}
          <div className="flex flex-wrap gap-3 justify-center py-6">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDept === dept ? "default" : "outline"}
                onClick={() => setSelectedDept(dept)}
                className={`px-6 py-3 text-sm rounded-xl ${
                  selectedDept === dept
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {dept}
              </Button>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setSelectedDept("");
                id(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirms} disabled={!selectedDept}>
              {loading ? "conFirming " : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>



              </div>
            ))}
          </div>
        </CardContent>






      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Pending Invitations ({pendingNumbers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingNumbers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending invitations</p>
          ) : (
            <div className="space-y-4">
              {pendingNumbers.map((invitation) => (
                <div key={invitation._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-900">{invitation.email}</h3>
                      <p className="text-xs text-gray-500">
                        Invited on {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-1">
                        {getInvitationStatusBadge(invitation.isActive)}
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="text-right space-y-1">
                    <p className="text-xs text-gray-500">
                      Expires: {new Date(invitation.inviteExpiresAt).toLocaleDateString()}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteInvitation(invitation.id, invitation.email)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Hierarchical Access Management Dialog */}
      <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[60vh] overflow-y-auto p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl">Manage Dashboard & Report Access</DialogTitle>
            {managingAccessUser && (
              <p className="text-gray-600 text-sm mt-2">
                Managing access for: <span className="font-medium text-gray-900">{managingAccessUser.name}</span>
              </p>
            )}
          </DialogHeader>
          
          {managingAccessUser && (
            <div className="flex flex-col h-full">
              <div className="px-1 pb-4">
                <p className="text-sm text-gray-600">
                  Select departments to grant access to all dashboards and reports, or expand to choose individual items.
                </p>
              </div>

              {/* Fixed Height Scrollable Department List */}
              <div className="flex-1 overflow-y-auto px-1 space-y-4 max-h-[300px]">
                {departments.map((department) => {
                  const { dashboardCount, reportCount } = getDepartmentCounts(department);
                  const currentAccess = departmentAccess[department] || { dashboards: false, reports: false };
                  const isExpanded = expandedDepartments.includes(department);
                  const isFullyGranted = isDepartmentFullyGranted(department);
                  const isPartiallyGranted = isDepartmentPartiallyGranted(department);
                  
                  return (
                    <div key={department} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Department Header */}
                      <div 
                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleDepartmentExpansion(department)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={isFullyGranted}
                            ref={(el) => {
                              if (el && isPartiallyGranted && !isFullyGranted) {
                                el.indeterminate = true;
                              }
                            }}
                            onCheckedChange={(checked) => {
                              handleDepartmentAccess(department, !!checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{department}</h4>
                            <p className="text-xs text-gray-500">
                              {dashboardCount} dashboard{dashboardCount !== 1 ? 's' : ''}, {reportCount} report{reportCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 bg-gray-50">
                          {/* Dashboards Section */}
                          <div className="bg-white rounded-lg border overflow-hidden">
                            <div 
                              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => toggleContentSectionExpansion(`${department}-dashboards`)}
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={currentAccess.dashboards}
                                  onCheckedChange={(checked) => 
                                    handleDepartmentToggle(department, 'dashboards', !!checked)
                                  }
                                  disabled={dashboardCount === 0}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <Monitor className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Dashboards</p>
                                  <p className="text-xs text-gray-500">{dashboardCount} item{dashboardCount !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                              <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                                expandedContentSections.includes(`${department}-dashboards`) ? 'rotate-90' : ''
                              }`} />
                            </div>

                            {/* Individual Dashboards */}
                            {expandedContentSections.includes(`${department}-dashboards`) && dashboardCount > 0 && (
                              <div className="px-3 pb-3 space-y-2 bg-gray-50">
                                {dashboards
                                  .filter(d => d.department === department)
                                  .map((dashboard) => (
                                    <div key={dashboard.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                          <p className="text-sm font-medium">{dashboard.title}</p>
                                        </div>
                                      </div>
                                      <Checkbox
                                        checked={isItemAccessGranted(dashboard.id, 'dashboard')}
                                        onCheckedChange={(checked) => 
                                          handleIndividualItemAccess(dashboard.id, 'dashboard', !!checked)
                                        }
                                      />
                                    </div>
                                  ))
                                }
                              </div>
                            )}
                          </div>

                         
                          <div className="bg-white rounded-lg border overflow-hidden">
                            <div 
                              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => toggleContentSectionExpansion(`${department}-reports`)}
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={currentAccess.reports}
                                  onCheckedChange={(checked) => 
                                    handleDepartmentToggle(department, 'reports', !!checked)
                                  }
                                  disabled={reportCount === 0}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="bg-green-100 p-2 rounded-lg">
                                  <FileText className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Reports</p>
                                  <p className="text-xs text-gray-500">{reportCount} item{reportCount !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                              <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                                expandedContentSections.includes(`${department}-reports`) ? 'rotate-90' : ''
                              }`} />
                            </div>

                           
                            {expandedContentSections.includes(`${department}-reports`) && reportCount > 0 && (
                              <div className="px-3 pb-3 space-y-2 bg-gray-50">
                                {reports
                                  .filter(r => r.department === department)
                                  .map((report) => (
                                    <div key={report.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div>
                                          <p className="text-sm font-medium">{report.title}</p>
                                        </div>
                                      </div>
                                      <Checkbox
                                        checked={isItemAccessGranted(report.id, 'report')}
                                        onCheckedChange={(checked) => 
                                          handleIndividualItemAccess(report.id, 'report', !!checked)
                                        }
                                      />
                                    </div>
                                  ))
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {departments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No departments available</p>
                  </div>
                )}
              </div>

              
              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 px-1">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsAccessDialogOpen(false);
                    setManagingAccessUser(null);
                    setDepartmentAccess({});
                    setExpandedDepartments([]);
                    setExpandedContentSections([]);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    setIsAccessDialogOpen(false);
                    setManagingAccessUser(null);
                    setDepartmentAccess({});
                    setExpandedDepartments([]);
                    setExpandedContentSections([]);
                    showToast(`Access permissions updated for ${managingAccessUser.name}`);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-lg p-8">
          <DialogHeader className="text-center space-y-4 mb-6">
            <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-6">
              {/* User Info Section */}
              <div className="text-center pb-4 border-b border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-gray-500" />
                </div>
                <p className="font-medium text-gray-900 text-lg">
                  {users.find(u => u.id === editingUser)?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {users.find(u => u.id === editingUser)?.email}
                </p>
                <Badge variant={users.find(u => u.id === editingUser)?.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                  {users.find(u => u.id === editingUser)?.role === 'admin' ? 'Administrator' : 'User'}
                </Badge>
              </div>

              {/* Actions Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">User Management</h3>
                
                {/* Change Role */}
                <div className="space-y-3">
                  <Label htmlFor="new-role" className="text-sm font-medium text-gray-700">
                    Change Role
                  </Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="h-12 px-4 text-sm">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  {newRole !== users.find(u => u.id === editingUser)?.role && (
                    <Alert className="bg-amber-50 border-amber-200 p-3">
                      <AlertDescription className="text-xs text-amber-700">
                        {newRole === 'admin' 
                          ? 'This user will have full administrative access to manage dashboards, users, and system settings.'
                          : 'This user will have standard access to view assigned dashboards and manage their profile.'
                        }
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Password Reset */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Key className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reset Password</p>
                        <p className="text-xs text-gray-500">Send a password reset email to the user</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleResetPassword}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 hover:border-orange-300"
                    >
                      Reset Password
                    </Button>
                  </div>
                </div>

                {/* Delete User */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delete User</p>
                        <p className="text-xs text-gray-500">Permanently remove this user account</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const userToDelete = users.find(u => u.id === editingUser);
                        if (userToDelete && window.confirm(`Are you sure you want to delete "${userToDelete.name}"? This action cannot be undone.`)) {
                          handleDeleteUser(editingUser, userToDelete.name);
                          setIsEditUserDialogOpen(false);
                          setEditingUser(null);
                          setNewRole('user');
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditUserDialogOpen(false);
                    setEditingUser(null);
                    setNewRole('user');
                  }}
                  className="min-w-[100px] h-11 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateRole}
                  disabled={newRole === users.find(u => u.id === editingUser)?.role}
                  className="min-w-[120px] h-11 px-6"
                >
                  {newRole === users.find(u => u.id === editingUser)?.role ? 'No Changes' : 'Update User'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}