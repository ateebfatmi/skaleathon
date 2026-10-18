'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('ErrorBoundary caught a component error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 my-4 rounded-xl border border-red-500/20 bg-red-950/20 text-red-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>Something went wrong loading this section.</span>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
