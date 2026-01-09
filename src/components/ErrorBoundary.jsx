import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 m-4 bg-red-900/20 border border-red-500 rounded-lg text-white font-mono">
                    <h2 className="text-xl font-bold mb-4 text-red-400">Something went wrong in the dashboard.</h2>
                    <div className="mb-4">
                        <p className="font-bold text-red-300">Error:</p>
                        <p className="text-sm bg-black/50 p-2 rounded">{this.state.error && this.state.error.toString()}</p>
                    </div>
                    <div>
                        <p className="font-bold text-red-300">Component Stack:</p>
                        <pre className="text-xs bg-black/50 p-2 rounded overflow-auto max-h-64">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
