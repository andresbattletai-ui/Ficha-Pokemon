import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  // If already running as an installed PWA, render a subtle installed badge or nothing
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-tech">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Pokédex Instalada</span>
        <span className="sm:hidden">App Activa</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          const res = await install();
          if (res) setInstallSuccess(true);
        }}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-red-900/40 border border-red-400/40 transition active:scale-95 animate-pulse"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Instalar App</span>
        <Sparkles className="w-3 h-3 text-yellow-300" />
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-950/60 hover:bg-red-900/80 px-2.5 py-1.5 text-xs font-medium text-red-200 transition active:scale-95"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-400" />
          <span>Instalar en iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-red-500/50 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <h3 className="font-pokedex text-sm font-bold text-red-400 tracking-wider">
                    INSTALAR POKÉDEX EN iOS
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Para guardar tu Ficha de Entrenador Pokémon como una app en la pantalla de inicio de tu iPhone o iPad:
                </p>
                <div className="space-y-2.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha arriba) en Safari.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Baja por el menú y selecciona <strong>"Agregar a Inicio"</strong> (Add to Home Screen).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Toca <strong>"Agregar"</strong> en la esquina superior derecha.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 text-xs font-bold text-white shadow-lg hover:from-red-500 hover:to-rose-500 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback direct button for browsers where prompt isn't fired yet
  return (
    <>
      <button
        onClick={() => setShowGenericGuide(true)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-2.5 py-1 text-xs font-tech text-slate-300 transition"
        title="Instalar como app móvil"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Instalar App</span>
      </button>

      {showGenericGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/50 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                  P
                </div>
                <h3 className="font-pokedex text-sm font-bold text-cyan-400 tracking-wider">
                  INSTALAR POKÉDEX
                </h3>
              </div>
              <button
                onClick={() => setShowGenericGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                Para instalar esta aplicación en tu teléfono o computadora:
              </p>
              <div className="space-y-2.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Abre el menú de opciones (tres puntos ⋮ en Chrome o navegador móvil).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGenericGuide(false)}
              className="mt-5 w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
