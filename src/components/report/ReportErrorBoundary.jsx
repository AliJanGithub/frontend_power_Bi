import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, RefreshCw } from '../icons/Icons';



export class ReportErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details silently (you could send to error reporting service)
    console.debug('ReportViewer error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="bg-orange-500 p-3 rounded-lg mx-auto w-fit">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg text-orange-900 mb-2">Report Loading Issue</h3>
                <p className="text-orange-800 text-sm mb-4">
                  There was an issue loading the report viewer. This is often due to SharePoint security restrictions.
                </p>
                <div className="space-y-2">
                  {this.props.reportUrl && (
                    <Button 
                      onClick={() => window.open(this.props.reportUrl, '_blank')}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in SharePoint
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      this.setState({ hasError: false });
                      window.location.reload();
                    }}
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}