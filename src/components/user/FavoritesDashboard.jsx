import React, { useEffect, useMemo } from 'react';
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
import { useDashboards } from '../DashboardContext';
import { useNavigate } from 'react-router-dom';



export function FavoritesDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { 
    favorites, 
    reportFavorites,
    // getUserAccessibleDashboards, 
    // getUserAccessibleReports,
    toggleFavorite, 
    toggleReportFavorite,
    trackUsage,
    trackReportUsage
  } = useData();
  const {fetchDashboards,dashboards,loading}=useDashboards()
console.log("dashboardssssssssssss",dashboards)
  const accessibleDashboards = dashboards

  
  // useEffect(()=>{
  //   done()
  // },[])
  const accessibleReports =  [
  {
    id: '1',
    title: 'Income Statement Report',
    description: 'Comprehensive income statement with revenue, expenses, and profit analysis',
    embedUrl: 'https://globaldata365-my.sharepoint.com/personal/haseeb_tariq_globaldata365_com/_layouts/15/Doc.aspx?sourcedoc={48a9e4a5-4ad9-4210-875e-898cf80ec2f5}&action=embedview&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True',
    department: 'Finance',
    createdBy: '1',
    createdAt: '2024-01-01',
    lastModified: '2024-01-25',
    isActive: true,
    accessUsers: ['1', '2', '3']
  },
  {
    id: '2',
    title: 'Balance Sheet Report',
    description: 'Detailed balance sheet analysis with assets, liabilities, and equity breakdown',
    embedUrl: 'https://example.sharepoint.com/:x:/s/finance/balance-sheet-2024',
    department: 'Finance',
    createdBy: '1',
    createdAt: '2024-01-05',
    lastModified: '2024-01-28',
    isActive: true,
    accessUsers: ['1', '2']
  },
  {
    id: '3',
    title: 'Sales Performance Report',
    description: 'Monthly sales analysis with detailed performance metrics by region and product',
    embedUrl: 'https://example.sharepoint.com/:x:/s/sales/performance-report',
    department: 'Sales',
    createdBy: '1',
    createdAt: '2024-01-08',
    lastModified: '2024-01-30',
    isActive: true,
    accessUsers: ['1', '2', '3']
  },
  {
    id: '4',
    title: 'HR Analytics Report',
    description: 'Employee analytics including headcount, turnover, and performance metrics',
    embedUrl: 'https://example.sharepoint.com/:x:/s/hr/analytics-2024',
    department: 'Human Resources',
    createdBy: '1',
    createdAt: '2024-01-12',
    lastModified: '2024-02-01',
    isActive: true,
    accessUsers: ['1', '3']
  }
];
  // const favoriteDashboards = accessibleDashboards.filter(d => favorites.includes(d._id));
  const favoriteReports = accessibleReports.filter(r => reportFavorites.includes(r.id));
const navigate=useNavigate()
  // Combine and sort favorites by last modified date
  const allFavorites = useMemo(() => {
    const dashboardItems = accessibleDashboards.map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      // type: 'dashboard' ,
      // lastModified: d.lastModified,
      // department: d.department
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
  }, [ favoriteReports]);

  const handleViewItem = (item) => {
    console.log("itemmmmm",item)
    if (item.type === 'reportss') {
        trackReportUsage(item._id, 'view');
      (window ).navigate('view-report', { id: item._id });
    } else {
        // trackUsage(item?._id, 'view');
      // navigate('view-dashboard', { id: item._id });
       navigate(`/view-dashboard/${item._id}`);
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
  if (loading) {
    return(
      <p>Loading Dashboard</p>
    )
  }
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
          {dashboards?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {dashboards?.length} favorite{dashboards?.length !== 1 ? 's' : ''}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Monitor className="h-3 w-3 text-primary" />
                  <span>{dashboards?.length}</span>
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

      {dashboards.length === 0 ? (
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
          {dashboards?.map((item) => (
            <Card key={`${item?.type}-${item?._id}`} className="hover:shadow-xl transition-all duration-200 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{item?.title}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={
                        item.type === 'dashboard' 
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-success/10 text-success border-success/20"
                      }
                    >
                      {/* {item.type === 'dashboard' ? 'Dashboard' : 'Report'} */}
                        Dashboard
                    </Badge>
                  </div>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFavorite(item)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm truncate">{item?.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Created by 
                    </span>
                        <span>{item?.createdBy?.name}</span>
                  </div>
                  {item?.company?.name && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Monitor className="h-3 w-3 mr-1" />
                        Department
                      </span>
                      <span>{item?.company?.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Created at
                    </span>
                    <span>{new Date(item?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleViewItem(item)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {/* View {item.type === 'dashboard' ? 'Dashboard' : 'Report'} */}
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}