// components/shared/ErrorBoundary.tsx
"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: undefined,
      errorInfo: undefined
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorInfo: undefined
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    });

    this.setState({
      error,
      errorInfo
    });

    // Optional: Send to your logging service
    // if (process.env.NODE_ENV === 'production') {
    //   logErrorToService(error, errorInfo);
    // }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined,
      errorInfo: undefined 
    });
    this.props.onReset?.();
  };

  handleGoBack = () => {
    window.history.back();
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default elegant error UI
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Card className="w-full max-w-md border-red-200 dark:border-red-800 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Something went wrong
                  </CardTitle>
                  <CardDescription>
                    We apologize for the inconvenience
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Message (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Error: {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              {/* User-friendly message */}
              <p className="text-sm text-muted-foreground">
                The component failed to load. This could be due to a network issue or a temporary glitch.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={this.handleGoBack}
                className="flex-1 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="flex-1 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <Button
                variant="default"
                asChild
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Optional: HOC for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Optional: Hook for manual error handling
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}