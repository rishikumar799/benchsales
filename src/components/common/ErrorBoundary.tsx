import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
          <div className="max-w-md w-full bg-slate-800 border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Application Exception</h2>
              <p className="text-sm text-slate-400 font-medium">An unexpected frontend runtime exception occurred.</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-xs text-red-400 font-mono break-words text-left max-h-40 overflow-y-auto">
              <p className="font-bold">{this.state.error?.toString()}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 text-[10px] opacity-70 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30 transition-all duration-150 text-sm cursor-pointer"
            >
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
