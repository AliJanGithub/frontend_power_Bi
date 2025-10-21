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
  FileText, 
  Heart, 
  Eye, 
  Filter,
  Calendar,
  User,
  Grid3X3,
  List
} from '../icons/Icons';
import { useUserManagement } from '../hooks/useUserManagement';

export function ReportBrowser() {
  // const { user } = useAuth();
  const {users}=useUserManagement()
  const { showToast } = useToast();
  const { preferences, updatePreferences } = useSettings();
  const { 
    // getUserAccessibleReports, 
    departments, 
    reportFavorites, 
    toggleReportFavorite, 
    
  } = useData();
  
  const allUsers = users;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const viewMode = preferences.viewMode;

  const accessibleReports = [
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

  // Filter reports based on search and filters
  const filteredReports = useMemo(() => {
    return accessibleReports.filter(report => {
      const matchesSearch = !searchQuery || 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || report.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [accessibleReports, searchQuery, selectedDepartment]);

  const handleViewReport = (reportId) => {
    trackReportUsage(reportId, 'view');
    (window ).navigate('view-report', { id: reportId });
  };

  const handleToggleFavorite = (reportId , title) => {
    const isFavorite = reportFavorites.includes(reportId);
    toggleReportFavorite(reportId);
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
        <h1 className="text-2xl text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Discover and explore available Excel reports</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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
            </Select>

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

      {/* Report Display */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg text-gray-900 mb-2">
                  {hasActiveFilters ? 'No reports match your filters' : 'No reports available'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasActiveFilters 
                    ? 'Try adjusting your search criteria or clearing the filters'
                    : 'You don\'t have access to any reports yet. Contact your administrator for access.'
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
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Report</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(report.id, report.title)}
                    className={`${
                      reportFavorites.includes(report.id)
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-gray-400 hover:text-red-600'
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        reportFavorites.includes(report.id) ? 'fill-current' : ''
                      }`} 
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm truncate">{report.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Created by Admin
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last Modified
                    </span>
                    <span>{new Date(report.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleViewReport(report.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Report
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
              <div className="col-span-4">Report</div>
              <div className="col-span-3">Department</div>
              <div className="col-span-4">Accessed by</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          
          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {filteredReports.map((report) => (
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
                  
                  {/* Access Users - 4 cols */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Accessed by</span>
                      <div className="flex -space-x-1">
                        {report.accessUsers.slice(0, 4).map((userId, index) => {
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
                        {report.accessUsers.length > 4 && (
                          <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{report.accessUsers.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions - 1 col */}
                  <div className="col-span-1 flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(report.id, report.title)}
                      className={`h-8 w-8 p-1 ${
                        reportFavorites.includes(report.id)
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          reportFavorites.includes(report.id) ? 'fill-current' : ''
                        }`} 
                      />
                    </Button>
                    <Button 
                      onClick={() => handleViewReport(report.id)}
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