// src/components/common/ErrorBoundary.jsx
import React, { Component } from 'react';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log to an external service like Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineExclamationCircle className="w-10 h-10 text-red-600" />
            </div>

            {/* Content */}
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-secondary-500 mb-6">
              We're sorry, but something unexpected happened. 
              Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left overflow-auto">
                <p className="text-sm font-mono text-red-700 mb-2">
                  {this.state.error.toString()}
                </p>
                <details className="text-xs text-red-600">
                  <summary className="cursor-pointer hover:text-red-800">
                    Stack trace
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={this.handleReset}
                variant="secondary"
              >
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                icon={HiOutlineRefresh}
              >
                Refresh Page
              </Button>
            </div>

            {/* Support Link */}
            <p className="mt-6 text-sm text-secondary-500">
              Need help?{' '}
              <a 
                href="mailto:support@sprintly.com"
                className="text-primary-600 hover:text-primary-700"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;