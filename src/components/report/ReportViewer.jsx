import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../DataContext';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastProvider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { UserMention } from '../UserMention';
import { Logo } from '../Logo';
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Send,
  ExternalLink,
  Calendar,
  User,
  Trash2,
  AtSign,
  Building
} from '../icons/Icons';


export function ReportViewer({ reportId }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { 
    reports, 
    comments, 
    reportFavorites, 
    toggleReportFavorite, 
    addReportComment, 
    deleteComment, 
    trackReportUsage,
    getAllUsers
  } = useData();

  const [newComment, setNewComment] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasTrackedView = useRef(false);

  const report = reports.find(r => r.id === reportId);
  const reportComments = comments
    .filter(c => c.reportId === reportId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const isFavorite = report ? reportFavorites.includes(report.id) : false;

  useEffect(() => {
    if (report && user && !hasTrackedView.current) {
      // Track page view only once
      trackReportUsage(report.id, 'view');
      hasTrackedView.current = true;
    }
  }, [report?.id, user?.id, trackReportUsage]);

  // Reset loading state when report changes
  useEffect(() => {
    if (report) {
      setIsLoading(true);
      setHasError(false);
      hasTrackedView.current = false;
      
      // Set a timeout to show error if iframe doesn't load within 8 seconds
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
        // Silently handle timeout - no console logging to avoid React error boundary issues
      }, 8000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [report?.id]);



  const handleToggleFavorite = () => {
    if (!report) return;
    
    toggleReportFavorite(report.id);
    showToast(
      isFavorite ? `Removed "${report.title}" from favorites` : `Added "${report.title}" to favorites`
    );
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !report) return;

    setIsSubmittingComment(true);
    try {
      addReportComment(report.id, newComment.trim(), taggedUsers);
      setNewComment('');
      setTaggedUsers([]);
      showToast('Comment added successfully');
    } catch (error) {
      showToast('Failed to add comment', 'error');
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
    return user?.id === comment.userId || user?.role === 'admin';
  };



  const renderCommentContent = (content, taggedUserIds) => {
    const users = getAllUsers();
    
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

  const allUsers = getAllUsers();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl text-gray-900 mb-2">Report Not Found</h2>
            <p className="text-gray-600 mb-4">
              The report you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => (window ).navigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has access to this report
  const hasAccess = user?.role === 'admin' || report.accessUsers.includes(user?.id || '');
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to view this report. Contact your administrator for access.
            </p>
            <Button onClick={() => (window ).navigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Title and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (user?.role === 'admin') {
                (window ).navigate('admin', { tab: 'reports' });
              } else {
                (window ).navigate('user', { tab: 'reports' });
              }
            }}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl text-gray-900">{report.title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            className={isFavorite ? 'text-red-600 border-red-200' : ''}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button> */}

          <Button 
            onClick={() => window.open(report.embedUrl, '_blank')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in SharePoint
          </Button>
        </div>
      </div>



        {/* Report Embed - Full Width */}
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center z-10">
                  <div className="text-center space-y-4">
                    <div className="bg-primary p-3 rounded-lg mx-auto w-fit">
                      <ExternalLink className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg text-blue-900 mb-2">Loading Report...</h3>
                      <p className="text-blue-700 text-sm">
                        Please wait while we load the Excel report
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Excel Embedded Report */}
              <iframe
                src={report.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                title={`${report.title} - Excel Report`}
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={(e) => {
                  const iframe = e.target ;
                  
                  // Simple success detection - if onLoad fires, assume it worked
                  // SharePoint will block content access but onLoad still fires for successful embedding
                  setTimeout(() => {
                    setIsLoading(false);
                    setHasError(false);
                    // Successfully loaded iframe
                  }, 1000);
                }}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                  // Handle iframe error silently
                }}
              />
              
              {/* Error overlay with better messaging */}
              {hasError && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center z-10">
                  <div className="text-center space-y-6 p-6 max-w-2xl">
                    <div className="bg-blue-600 p-4 rounded-lg mx-auto w-fit">
                      <ExternalLink className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl text-blue-900 mb-3">SharePoint Security Restrictions</h3>
                      <p className="text-blue-800 mb-4 text-sm leading-relaxed">
                        SharePoint has blocked this Excel file from being embedded in external websites for security reasons. 
                        This is normal behavior and protects your organization's data.
                      </p>
                      
                      {/* Alternative access methods */}
                      <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4 text-left">
                        <h4 className="font-semibold text-blue-900 mb-3 text-sm">💡 Alternative Access Methods:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-800">
                          <div className="border border-blue-100 rounded p-3">
                            <strong>🔗 Direct Link</strong>
                            <p>Open the Excel file directly in SharePoint Online</p>
                          </div>
                          <div className="border border-blue-100 rounded p-3">
                            <strong>📱 SharePoint App</strong>
                            <p>Use the SharePoint mobile app for better access</p>
                          </div>
                          <div className="border border-blue-100 rounded p-3">
                            <strong>💻 Desktop Excel</strong>
                            <p>Open with Excel desktop application</p>
                          </div>
                          <div className="border border-blue-100 rounded p-3">
                            <strong>🌐 New Tab</strong>
                            <p>View in a dedicated browser tab</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="space-y-3">
                        <Button 
                          onClick={() => window.open(report.embedUrl, '_blank')}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Excel Report in SharePoint
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Button 
                            onClick={() => {
                              // Try opening with Excel Online directly
                              const excelOnlineUrl = report.embedUrl.replace('&action=embedview', '&action=view');
                              window.open(excelOnlineUrl, '_blank');
                            }}
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Open in Excel Online
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsLoading(true);
                              setHasError(false);
                              // Force iframe reload
                              const iframe = document.querySelector(`iframe[title*="${report.title}"]`) ;
                              if (iframe) {
                                iframe.src = iframe.src;
                              }
                            }}
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                      
                      {/* Technical note */}
                      <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded text-xs text-blue-700">
                        <strong>Technical Note:</strong> SharePoint uses X-Frame-Options headers to prevent embedding, 
                        which protects against clickjacking attacks. This is expected behavior for organizational security.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Info and Comments Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-600 mb-1">{report.description}</p>
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
                  <span>{report.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Last Modified
                  </span>
                  <span>{new Date(report.lastModified).toLocaleDateString()}</span>
                </div>
                


              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments ({reportComments.length})
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
                    
                    <form onSubmit={handleSubmitComment} className="flex flex-col flex-1">
                      <div className="flex-1 mb-4">
                        <UserMention
                          value={newComment}
                          onChange={handleCommentChange}
                          placeholder="Add a comment... Use @username to mention someone"
                          rows={6}
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
                    </form>
                  </div>

                  {/* Comments List - Right Side */}
                  <div className="h-full flex flex-col">
                    <div className="pb-3 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">
                        Discussion ({reportComments.length})
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">Recent comments and conversations</p>
                    </div>
                    
                    {/* Fixed height container that shows exactly 2 comments with scroll for more */}
                    <div className="flex-1 mt-4">
                      {reportComments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <MessageSquare className="h-8 w-8 text-gray-400" />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">No comments yet</h4>
                          <p className="text-sm text-gray-500 max-w-sm">
                            Be the first to share your thoughts or ask questions about this report.
                          </p>
                        </div>
                      ) : (
                        <div className="h-full max-h-48 overflow-y-auto space-y-3 pr-2">
                          {reportComments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 group hover:bg-gray-100 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-primary p-1.5 rounded-full">
                                    <User className="h-3 w-3 text-white" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
                                    <p className="text-xs text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
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
                                {renderCommentContent(comment.content, comment.taggedUsers || [])}
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