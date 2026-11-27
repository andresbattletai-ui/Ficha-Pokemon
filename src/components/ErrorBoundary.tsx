import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || 'Error inesperado al renderizar la Pokédex.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('PokéCard ErrorBoundary caught:', error, info);
  }

  handleClearAndReload = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      }
    } catch {
      // Ignore cache cleanup errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/40 bg-slate-900 p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-950 border border-red-500/40 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h1 className="font-pokedex text-lg font-bold text-white">
              Error al iniciar PokéCard Pass
            </h1>
            <p className="text-xs font-tech text-slate-400 break-words">
              {this.state.message}
            </p>
            <button
              onClick={this.handleClearAndReload}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 px-4 text-xs font-bold text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpiar caché y recargar</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
