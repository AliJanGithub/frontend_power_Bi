import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../DataContext';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastProvider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { UserMention } from '../UserMention';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Logo } from '../Logo';
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Send,
  ExternalLink,
  Calendar,
  User,
  Users,
  Trash2,
  AtSign,
  Settings,
  Plus,
  X,
  Building
} from '../icons/Icons';
import { useUserManagement } from '../hooks/useUserManagement';
import { useDashboards } from '../DashboardContext';
import { useNavigate } from 'react-router-dom';

import { useComments } from '../hooks/useComments';



export function DashboardViewer({ dashboardId }) {
  const { user } = useAuth();
  const navigate=useNavigate()
  const { showToast } = useToast();
  const {dashboardById,getDashboardById,loading}=useDashboards()
  useEffect(() => {
    getDashboardById(dashboardId)
  
   
  }, [])
  if(!loading)   console.log("dashboardId",dashboardById)

const {  comments,
    loadingComments,
    error,
    createComment,
    updateComment,
    deleteComment,
    fetchComments,}=useComments(dashboardId)







console.log("comments loading ...................",comments,loadingComments)




  const handleSend = () => {
    if (!newMsg.trim()) return;
    sendComment(dashboardId, newMsg);
    setNewMsg('');
  };
  const { 
    dashboards, 
    // comments, 
    favorites, 
    toggleFavorite, 
    addComment, 
    // deleteComment, 
    trackUsage,
    updateDashboard,
    getAllUsers,
    departments 
  } = useData();

  const [newComment, setNewComment] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isManageAccessOpen, setIsManageAccessOpen] = useState(false);
  const [accessType, setAccessType] = useState('USER');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const hasTrackedView = useRef(false);

  const dashboard = dashboards.find(d => d.id === dashboardId);
  const dashboardComments = comments
    .filter(c => c.dashboardId === dashboardId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const isFavorite = dashboard ? favorites.includes(dashboard.id) : false;

  useEffect(() => {
    if (dashboardById?.dashboard && user && !hasTrackedView.current) {
      // Track page view only once
      // trackUsage(dashboardById?.dashboard?._id, 'view');
      hasTrackedView.current = true;
    }
  }, [dashboardById?.dashboard?.id, user?._id, trackUsage]);

  // Reset loading state when dashboard changes
  useEffect(() => {
    if (dashboardById) {
      setIsLoading(true);
      setHasError(false);
      hasTrackedView.current = false;
    }
  }, [dashboardById?.dashboard?.id]);

  const handleToggleFavorite = () => {
    if (!dashboard) return;
    
    toggleFavorite(dashboard.id);
    showToast(
      isFavorite ? `Removed "${dashboard.title}" from favorites` : `Added "${dashboard.title}" to favorites`
    );
  };

 const handleSubmitComment = async (e) => {
  e.preventDefault();
  // if (!newComment.trim() || dashboard) return;

  setIsSubmittingComment(true);
  try {
    const response=await createComment(newComment); // ✅ only message needed
    setNewComment('');
    console.log(response)
    showToast('Comment added successfully');
  } catch (error) {
    showToast(`Failed to add comment ${error}`);
    console.log(error)
  } finally {
    setIsSubmittingComment(false);
  }
};


  const handleCommentChange = (value, users) => {
    setNewComment(value);
    setTaggedUsers(users);
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
      showToast('Comment deleted');
    }
  };

  const canDeleteComment = (comment) => {
    return user?.id === comment.userId || user?.role === 'ADMIN';
  };

  // Initialize access management state when dialog opens
  useEffect(() => {
    if (isManageAccessOpen && dashboardById) {
      setSelectedUsers([...dashboardById?.dashboard?.accessUsers]);
      setSelectedDepartments([...dashboard.accessDepartments || []]);
    }
  }, [isManageAccessOpen, dashboardById]);

  const handleRemoveUserAccess = (userId) => {
    if (!dashboard) return;
    
    const updatedUsers = dashboard.accessUsers.filter(id => id !== userId);
    updateDashboard(dashboard.id, { accessUsers: updatedUsers });
    showToast('User access removed');
  };

  const handleAddUserAccess = (userId) => {
    if (!dashboard || dashboard.accessUsers.includes(userId)) return;
    
    const updatedUsers = [...dashboard.accessUsers, userId];
    updateDashboard(dashboard.id, { accessUsers: updatedUsers });
    showToast('User access granted');
  };

  const handleSaveAccess = () => {
    if (!dashboard) return;

    const updates = {
      accessUsers: selectedUsers,
      accessDepartments: selectedDepartments
    };

    updateDashboard(dashboard.id, updates);
    setIsManageAccessOpen(false);
    showToast('Access permissions updated successfully');
  };

 
  const {users} = useUserManagement()
  // const {user}=useAuth()
   const allUsers=users
  // const availableUsers = allUsers.filter(u => u.role !== 'ADMIN'); // Don't show admins since they have access to everything

  const renderCommentContent = (content, taggedUserIds) => {
    // const { getAllUsers } = useData();
    // const {users}=useUserManagement()
   
    
    let processedContent = content;
    
    // Replace @username mentions with styled spans
    taggedUserIds.forEach(userId => {
      const user = users.find(u => u.id === userId);
      if (user) {
        const username = user.name.toLowerCase().replace(' ', '');
        const mentionRegex = new RegExp(`@${username}`, 'gi');
        processedContent = processedContent.replace(
          mentionRegex,
          `<span class="inline-flex items-center px-1.5 py-0.5 bg-primary/10 text-primary rounded text-sm font-medium">@${user.name}</span>`
        );
      }
    });
    
    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };
 if (loading  ) {
   return(
    <div>
      loading dashboard
    </div>
   )
 }
  if (!dashboardById) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl text-gray-900 mb-2">Dashboard Not Found</h2>
            <p className="text-gray-600 mb-4">
              The dashboard you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => (window).navigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboards
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
console.log("userrrrrindashboardview",user)
  // Check if user has access to this dashboard
  // const hasAccess = user?.role === 'admin' || dashboard.accessUsers.includes(user?.id || '');
const hasAccess =  dashboardById?.dashboard?.accessUsers?.some(
  (u) => u._id === (user?._id || '')
) || user.role==='ADMIN'
console.log("has access",hasAccess)
console.log("dashboard accuess users",dashboardById?.dashboard?.accessUsers)
console.log("dashboad by id",dashboardById)
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to view this dashboard. Contact your administrator for access.
            </p>
            <Button onClick={() => (window).navigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboards
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div id='legacy-design-wrapper' className="space-y-6">
      {/* Dashboard Title and Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">{dashboardById?.dashboard?.title}</h1>
        
        <div className="flex items-center space-x-3">
      <Button 
  variant="ghost" 
  size="sm" 
  onClick={() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboards');   // ✅ Correct route for admin
    } else {
      navigate('/user/browse');         // ✅ Correct route for user
    }
  }}
  className="flex items-center space-x-2"
>
  <ArrowLeft className="h-4 w-4" />
  <span>Back to Dashboards</span>
</Button>

          
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            className={isFavorite ? 'text-red-600 border-red-200' : ''}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button> */}
        </div>
      </div>

        {/* Dashboard Embed - Full Width */}
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
              {/* Power BI Embedded Dashboard */}
              <iframe
                src={dashboardById?.dashboard.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title={`${dashboardById?.dashboard?.title} - Power BI Dashboard`}
                onLoad={() => {
                  setIsLoading(false);
                  setHasError(false);
                  console.log(`Power BI dashboard "${dashboardById?.dashboard?.title}" loaded successfully`);
                }}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                  console.error(`Failed to load Power BI dashboard: ${dashboardById?.dashboard?.title}`);
                }}
              />
              
              {/* Error overlay */}
              {hasError && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center z-10">
                  <div className="text-center space-y-4 p-6 max-w-md">
                    <div className="bg-red-500 p-3 rounded-lg mx-auto w-fit">
                      <ExternalLink className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg text-red-900 mb-2">Unable to Load Dashboard</h3>
                      <p className="text-red-700 mb-4 text-sm">
                        The Power BI dashboard could not be loaded. This might be due to permissions or network issues.
                      </p>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => {
                            setIsLoading(true);
                            setHasError(false);
                            // Force iframe reload
                            const iframe = document.querySelector(`iframe[title*="${dashboardById?.dashboard?.title}"]`) ;
                            if (iframe) {
                              iframe.src = iframe.src;
                            }
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          Try Again
                        </Button>
                        <Button 
                          onClick={() => window.open(dashboardById?.dashboard?.embedUrl, '_blank')}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in Power BI
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Info and Comments Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dashboard Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dashboard Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-600 mb-1">{dashboardById?.dashboard?.description}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Added by
                  </span>
                  <span>Admin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Building className="h-3 w-3 mr-1" />
                    Department
                  </span>
                  <span>{dashboardById?.dashboard?.company?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    createdAt
                  </span>
                  <span>{new Date(dashboardById?.dashboard?.createdAt).toLocaleDateString()}</span>
                </div>
                
                <Separator />
                
                {/* Access Users List */}
               {/* <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-xs font-medium text-gray-700">
                      <Users className="h-3 w-3 mr-1" />
                      Users with Access ({dashboard.accessUsers.length})
                    </span>
                    {user?.role === 'admin' && (
                      <Dialog open={isManageAccessOpen} onOpenChange={setIsManageAccessOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Manage Dashboard Access</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="text-sm text-gray-600">
                              Control who can access "{dashboard.title}"
                            </div>

                            
                            <div className="flex space-x-2 border border-gray-200 rounded-lg p-1 bg-white w-fit">
                              <Button
                                variant={accessType === 'users' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setAccessType('users')}
                                className="h-8 px-3"
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Individual Users
                              </Button>
                              <Button
                                variant={accessType === 'departments' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setAccessType('departments')}
                                className="h-8 px-3"
                              >
                                <Building className="h-4 w-4 mr-2" />
                                Departments
                              </Button>
                            </div>

                            {accessType === 'users' ? (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-3">Select Users</h4>
                                  <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {allUsers.map((availableUser) => (
                                      <div key={availableUser_.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-8 w-8">
                                            {availableUser.profilePicture ? (
                                              <AvatarImage src={availableUser.profilePicture} alt={availableUser.name} />
                                            ) : (
                                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                {availableUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                              </AvatarFallback>
                                            )}
                                          </Avatar>
                                          <div>
                                            <p className="font-medium text-sm">{availableUser.name}</p>
                                            <p className="text-xs text-gray-500">{availableUser.email}</p>
                                            <Badge variant="secondary" className="text-xs mt-1">{availableUser?.company?.name}</Badge>
                                          </div>
                                        </div>
                                        <Button
                                          variant={selectedUsers.includes(availableUser.id) ? 'default' : 'outline'}
                                          size="sm"
                                          onClick={() => {
                                            if (selectedUsers.includes(availableUser.id)) {
                                              setSelectedUsers(prev => prev.filter(id => id !== availableUser.id));
                                            } else {
                                              setSelectedUsers(prev => [...prev, availableUser.id]);
                                            }
                                          }}
                                        >
                                          {selectedUsers.includes(availableUser.id) ? 'Remove' : 'Add'}
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-3">Select Departments</h4>
                                  <div className="space-y-2">
                                    {departments.map((department) => (
                                      <div key={department} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <div className="bg-primary/10 p-2 rounded-lg">
                                            <Building className="h-4 w-4 text-primary" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-sm">{department}</p>
                                            <p className="text-xs text-gray-500">
                                              {allUsers.filter(u => u.department === department && u.role !== 'admin').length} users
                                            </p>
                                          </div>
                                        </div>
                                        <Button
                                          variant={selectedDepartments.includes(department) ? 'default' : 'outline'}
                                          size="sm"
                                          onClick={() => {
                                            if (selectedDepartments.includes(department)) {
                                              setSelectedDepartments(prev => prev.filter(d => d !== department));
                                            } else {
                                              setSelectedDepartments(prev => [...prev, department]);
                                            }
                                          }}
                                        >
                                          {selectedDepartments.includes(department) ? 'Remove' : 'Add'}
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end space-x-2 pt-4 border-t">
                              <Button variant="outline" onClick={() => setIsManageAccessOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveAccess}>
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {(() => {
                      const accessUsers = dashboard.accessUsers.map(userId => 
                        allUsers.find(user => user.id === userId)
                      ).filter(Boolean);
                      
                      return accessUsers.length > 0 ? (
                        accessUsers.map((accessUser) => (
                          <Tooltip key={accessUser.id}>
                            <TooltipTrigger asChild>
                              <div className="relative cursor-pointer group">
                                <Avatar className="h-7 w-7 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                                  {accessUser.profilePicture ? (
                                    <AvatarImage 
                                      src={accessUser.profilePicture} 
                                      alt={accessUser.name}
                                    />
                                  ) : (
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {accessUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                {user?.role === 'admin' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveUserAccess(accessUser.id);
                                    }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                                    title="Remove access"
                                  >
                                    <X className="h-2 w-2" />
                                  </button>
                                )}
                                <TooltipContent side="top">
                                  <div className="text-center">
                                    <p className="font-medium">{accessUser.name}</p>
                                    <p className="text-xs opacity-75 capitalize">{accessUser.role}</p>
                                    {user?.role === 'admin' && (
                                      <p className="text-xs opacity-75 mt-1">Click X to remove access</p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </div>
                            </TooltipTrigger>
                          </Tooltip>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 italic">No specific users assigned</p>
                      );
                    })()}
                    {user?.role === 'admin' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setIsManageAccessOpen(true)}
                            className="h-7 w-7 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-primary/50 transition-colors group"
                          >
                            <Plus className="h-3 w-3 text-gray-400 group-hover:text-primary" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Add user access</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div> */}
              </div> 
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments ({comments?.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
                  {/* Add Comment Form - Left Side */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
                    <div className="pb-3 border-b border-gray-200 mb-4">
                      <h4 className="font-medium text-gray-900">Add Comment</h4>
                      <p className="text-sm text-gray-500 mt-1">Share your thoughts or ask questions</p>
                    </div>
                    
                    {/* <form onSubmit={handleSubmitComment} className="flex flex-col flex-1">
                      <div className="flex-1 mb-4">
                        <UserMention
                          value={newComment}
                          onChange={handleCommentChange}
                          placeholder="Add a comment... Use @username to mention someone"
                          rows={6}
                        />
                            <Input
                            type="text"
                          value={newComment}
                          onChange={handleCommentChange}
                          placeholder="Add a comment... Use @username to mention someone"
                          
                        />
                        
                        {taggedUsers.length > 0 && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-xs text-blue-700 flex items-center">
                              <AtSign className="h-3 w-3 mr-1" />
                              {taggedUsers.length} user{taggedUsers.length !== 1 ? 's' : ''} will be notified
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={!newComment.trim() || isSubmittingComment}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </form> */}
                    <form onSubmit={handleSubmitComment} className="flex flex-col flex-1">
  <div className="flex-1 mb-4">
    <Input
      type="text"
      value={newComment}
      onChange={(e)=>setNewComment(e.target.value)}
      placeholder="Add a comment... Use @username to mention someone"
      disabled={isSubmittingComment}
    />
  </div>

  <Button
    type="submit"
    className="w-full"
    disabled={!newComment.trim() || isSubmittingComment}
    //  disabled={isSubmittingComment}
  >
    <Send className="h-4 w-4 mr-2" />
    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
  </Button>
</form>

                  </div>

                  {/* Comments List - Right Side */}
                  <div className="h-full flex flex-col">
                    <div className="pb-3 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">
                        Discussion ({comments?.length})
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">Recent comments and conversations</p>
                    </div>
                    
                    {/* Fixed height container that shows exactly 2 comments with scroll for more */}
                    <div className="flex-1 mt-4">
                      {comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <MessageSquare className="h-8 w-8 text-gray-400" />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">No comments yet</h4>
                          <p className="text-sm text-gray-500 max-w-sm">
                            Be the first to share your thoughts or ask questions about this dashboard.
                          </p>
                        </div>
                      ) : (
                        <div className="h-full max-h-48 overflow-y-auto space-y-3 pr-2">
                          {comments.map((comment) => (
                            <div key={comment._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 group hover:bg-gray-100 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-primary p-1.5 rounded-full">
                                    <User className="h-3 w-3 text-white" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">{comment?.user?.name.split(' ')[0]}</span>
                                    <p className="text-xs text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                  <div>{comment?.user?.email}</div>
                                </div>
                                {canDeleteComment(comment) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="h-8 w-8 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete comment"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="text-sm text-gray-700 leading-relaxed">
                               <span class="inline-flex items-center px-1.5 py-0.5 bg-primary/10 text-primary rounded text-sm font-medium">{comment?.message}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}