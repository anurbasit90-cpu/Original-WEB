import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You could send this to your logging infra
    // ErrorBoundary caught an error: error, info
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Terjadi kesalahan</h1>
          <p className="text-gray-600 mb-4">Maaf, ada kendala saat memuat halaman. Silakan coba muat ulang.</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded">Muat Ulang</button>
        </div>
      );
    }
    return this.props.children;
  }
}
