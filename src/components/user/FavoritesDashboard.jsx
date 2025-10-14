import React, { useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useData } from '../DataContext';
import { useToast } from '../ToastProvider';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Heart, 
  Eye, 
  Calendar,
  User,
  Monitor,
  FileText
} from '../icons/Icons';



export function FavoritesDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { 
    favorites, 
    reportFavorites,
    getUserAccessibleDashboards, 
    getUserAccessibleReports,
    toggleFavorite, 
    toggleReportFavorite,
    trackUsage,
    trackReportUsage
  } = useData();

  const accessibleDashboards = getUserAccessibleDashboards();
  const accessibleReports = getUserAccessibleReports();
  const favoriteDashboards = accessibleDashboards.filter(d => favorites.includes(d.id));
  const favoriteReports = accessibleReports.filter(r => reportFavorites.includes(r.id));

  // Combine and sort favorites by last modified date
  const allFavorites = useMemo(() => {
    const dashboardItems = favoriteDashboards.map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      type: 'dashboard' ,
      lastModified: d.lastModified,
      department: d.department
    }));

    const reportItems = favoriteReports.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: 'report' ,
      lastModified: r.lastModified,
      department: r.department
    }));

    return [...dashboardItems, ...reportItems].sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
  }, [favoriteDashboards, favoriteReports]);

  const handleViewItem = (item) => {
    if (item.type === 'dashboard') {
      trackUsage(item.id, 'view');
      (window ).navigate('view-dashboard', { id: item.id });
    } else {
      trackReportUsage(item.id, 'view');
      (window ).navigate('view-report', { id: item.id });
    }
  };

  const handleRemoveFavorite = (item) => {
    if (item.type === 'dashboard') {
      toggleFavorite(item.id);
    } else {
      toggleReportFavorite(item.id);
    }
    showToast(`Removed "${item.title}" from favorites`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-3">
          {getGreeting()}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back to BI Portal 365
        </p>
      </div>

      {/* Favorites Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-gray-900">Your Favorites</h2>
            <p className="text-gray-600 text-sm">Quick access to your most important dashboards and reports</p>
          </div>
          {allFavorites.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {allFavorites.length} favorite{allFavorites.length !== 1 ? 's' : ''}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Monitor className="h-3 w-3 text-primary" />
                  <span>{favoriteDashboards.length}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <FileText className="h-3 w-3 text-success" />
                  <span>{favoriteReports.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {allFavorites.length === 0 ? (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-success/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center border-2 border-primary/20">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl text-gray-900 mb-3">No favorites yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Discover powerful insights by exploring our dashboards and reports. Add your most important ones to favorites for quick access.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => (window ).navigate('user', { tab: 'browse' })}
                    variant="outline"
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Browse Dashboards
                  </Button>
                  <Button 
                    onClick={() => (window ).navigate('user', { tab: 'reports' })}
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Reports
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allFavorites.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="hover:shadow-xl transition-all duration-200 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={
                        item.type === 'dashboard' 
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-success/10 text-success border-success/20"
                      }
                    >
                      {item.type === 'dashboard' ? 'Dashboard' : 'Report'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFavorite(item)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm truncate">{item.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Created by Admin
                    </span>
                  </div>
                  {item.department && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Monitor className="h-3 w-3 mr-1" />
                        Department
                      </span>
                      <span>{item.department}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last Modified
                    </span>
                    <span>{new Date(item.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleViewItem(item)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View {item.type === 'dashboard' ? 'Dashboard' : 'Report'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}