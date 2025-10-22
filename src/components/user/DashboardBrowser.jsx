import React, { useState, useMemo } from 'react';
import { useData } from '../DataContext';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastProvider';
import { useSettings } from '../SettingsContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  Search, 
  Monitor, 
  Heart, 
  Eye, 
  Filter,
  Calendar,
  User,
  Grid3X3,
  List
} from '../icons/Icons';
import { useDashboards } from '../DashboardContext';
import { useNavigate } from 'react-router-dom';

export function DashboardBrowser() {
  // existing
  const navigate=useNavigate()
// NEW: a separate input state so Search button actually applies the query
const [pendingSearch, setPendingSearch] = useState('');

  // const { user } = useAuth();
  const { showToast } = useToast();
  const { preferences, updatePreferences } = useSettings();
  const { 
    getUserAccessibleDashboards, 
    departments, 
    favorites, 
    toggleFavorite, 
    trackUsage,
    getAllUsers
  } = useData();
  const {user}=useAuth()
  console.log("user dashboarduser user role user",user)
  // const allUsers = getAllUsers();
  const {dashboards}=useDashboards()
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const viewMode = preferences.viewMode;
console.log("dashboards    itttt",dashboards)
   const handleSearch = () => {
  // apply trimmed value to the real searchQuery which powers the list
  setSearchQuery(pendingSearch.trim());
};

const handleInputKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSearch();
  }
};


  // Filter dashboards based on search and filters
  const filteredDashboards = useMemo(() => {
    return dashboards.filter(dashboard => {
      const matchesSearch = !searchQuery || 
        dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dashboard.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // const matchesDepartment = !selectedDepartment || dashboard.department === selectedDepartment;

      return matchesSearch ;
    });
  }, [dashboards, searchQuery]);

// const handleViewDashboard = (dashboardId) => {
//   // Removed trackUsage() since it doesn't exist
//   if (window?.navigate) {
//     window.navigate('view-dashboard', { id: dashboardId });
//   } else {
//     // fallback if your router uses URL navigation
//     window.location.href = `/view-dashboard/id=${dashboardId}`;
//   }
// };
  const handleViewDashboard = (dashboardId) => {
    // ✅ Correct navigation to dashboard viewerifra
    navigate(`/view-dashboard/${dashboardId}`);
  };




  const handleToggleFavorite = (dashboardId, title) => {
    const isFavorite = favorites.includes(dashboardId);
    toggleFavorite(dashboardId);
    showToast(
      isFavorite ? `Removed "${title}" from favorites` : `Added "${title}" to favorites`
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
  };

  const hasActiveFilters = searchQuery || selectedDepartment;

  return (
    <TooltipProvider>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">Dashboards</h1>
        <p className="text-gray-600">Discover and explore available Power BI dashboards</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search dashboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div> */}
 <div className="flex items-center space-x-2">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
      placeholder="Search dashboards..."
      // controlled by pendingSearch now
      value={pendingSearch}
      onChange={(e) => setPendingSearch(e.target.value)}
      onKeyDown={handleInputKeyDown}
      className="pl-10 h-9"
    />
  </div>

  <Button
    variant="default"
    size="sm"
    onClick={handleSearch}
    disabled={!pendingSearch.trim()}
  >
    <Search className="h-4 w-4 mr-2" />
    Search
  </Button>
</div>


            
            {/* <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <div className="flex space-x-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle and Results */}
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

      </div>

      {/* Dashboard Display */}
      {filteredDashboards.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Monitor className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg text-gray-900 mb-2">
                  {hasActiveFilters ? 'No dashboards match your filters' : 'No dashboards available'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasActiveFilters 
                    ? 'Try adjusting your search criteria or clearing the filters'
                    : 'You don\'t have access to any dashboards yet. Contact your administrator for access.'
                  }
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>Clear Filters</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDashboards.map((dashboard) => (
            <Card key={dashboard._id} className="hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Dashboard</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(dashboard._id, dashboard.title)}
                    className={`${
                      favorites.includes(dashboard._id)
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-gray-400 hover:text-red-600'
                    }`}
                  >
                    {/* <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(dashboard._id) ? 'fill-current' : ''
                      }`} 
                    /> */}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm truncate">{dashboard?.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Created by 
                    </span>
                    <span>{dashboard?.createdBy?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Created at
                    </span>
                    <span>{new Date(dashboard?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleViewDashboard(dashboard._id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
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
              <div className="col-span-3">company</div>
              <div className="col-span-4">Accessed by</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          
          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {filteredDashboards.map((dashboard) => (
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
                  
                  {/* Access Users - 4 cols */}
                  {/* <div className="col-span-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Accessed by</span>
                      <div className="flex -space-x-1">
                        {dashboard.accessUsers.slice(0, 4).map((user, index) => {
                          const users = user.find(u => u._id === userId);
                          return (
                            <Tooltip key={user?._id}>
                              <TooltipTrigger asChild>
                                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                                  <span className="text-xs text-gray-600 font-medium">
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() }
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-sm">{user?.name || 'Unknown User'}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                        {dashboard.accessUsers.length > 4 && (
                          <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{dashboard.accessUsers.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}
                  {/* Access Users - 4 cols */}
{dashboard?.accessUsers && dashboard.accessUsers.length > 0 ? (
  <div className="col-span-4">
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-500">Accessed by</span>
      <div className="flex -space-x-1">
        {dashboard.accessUsers.slice(0, 4).map((accessUser, index) => {
          const initials = accessUser?.name
            ? accessUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
            : '?';
          return (
            <Tooltip key={accessUser._id || index}>
              <TooltipTrigger asChild>
                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                  <span className="text-xs text-gray-600 font-medium">
                    {initials}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-sm">{accessUser?.name || 'Unknown User'}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {dashboard.accessUsers.length > 4 && (
          <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-xs text-gray-500">
              +{dashboard.accessUsers.length - 4}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
) : (
  <p className="text-xs text-gray-400">No access users found</p>
)}

                  
                  {/* Actions - 1 col */}
                  <div className="col-span-1 flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(dashboard._id, dashboard.title)}
                      className={`h-8 w-8 p-1 ${
                        favorites.includes(dashboard?._id)
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          favorites.includes(dashboard._id) ? 'fill-current' : ''
                        }`} 
                      />
                    </Button>
                    <Button 
                      onClick={() => handleViewDashboard(dashboard._id)}
                      size="sm"
                      className="h-8 px-3"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </TooltipProvider>
  );
}