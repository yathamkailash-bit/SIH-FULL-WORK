import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[KalaKriti Error Boundary]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FAF7F2] text-center select-none min-h-screen">
          <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mb-4 border-2 border-red-200">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 mb-1">
            Something went wrong
          </h2>
          <p className="text-xs font-semibold text-stone-500 max-w-xs mb-6">
            KalaKriti encountered an unexpected error. Don't worry, your data is saved.
          </p>
          <button
            onClick={this.handleReload}
            className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center gap-2 transition"
          >
            <RefreshCw size={18} />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
