import React from 'react';
import { TrainerProfile, CardTheme, GymLeaderAccount } from '../types/pokemon';
import { PWAInstallButton } from './PWAInstallButton';
import type { User } from 'firebase/auth';
import {
  Volume2,
  VolumeX,
  Shield,
  PlusCircle,
  Crown,
  Swords,
  CreditCard,
  Users,
  Cloud,
  LogOut,
} from 'lucide-react';

interface Props {
  currentTab: 'card' | 'gyms';
  onTabChange: (tab: 'card' | 'gyms') => void;
  trainer: TrainerProfile;
  allTrainers: TrainerProfile[];
  activeLeader: GymLeaderAccount | null;
  activeChallengesCount: number;
  onSelectTrainer: (id: string) => void;
  onOpenRegister: () => void;
  onOpenLeaderPortal: () => void;
  onOpenSuperAdmin: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onChangeTheme: (theme: CardTheme) => void;
  cloudEnabled?: boolean;
  cloudUser?: User | null;
  onSignInCloud?: () => void;
  onSignOutCloud?: () => void;
}

export const PokedexHeader: React.FC<Props> = ({
  currentTab,
  onTabChange,
  trainer,
  allTrainers,
  activeLeader,
  activeChallengesCount,
  onSelectTrainer,
  onOpenRegister,
  onOpenLeaderPortal,
  onOpenSuperAdmin,
  soundEnabled,
  onToggleSound,
  onChangeTheme,
  cloudEnabled = false,
  cloudUser = null,
  onSignInCloud,
  onSignOutCloud,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b-2 border-red-700/60 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 space-y-2">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Classic Pokédex Sensor & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Big Blue Glass Lens */}
            <div className="relative group cursor-pointer" onClick={() => onTabChange('card')}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border-2 border-white/80 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-radial from-cyan-300 via-sky-500 to-blue-700 shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-pulse flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1 left-1.5 w-3 h-2 rounded-full bg-white/70 rotate-[-25deg]" />
                </div>
              </div>
            </div>

            {/* 3 Status LEDs */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] border border-red-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.9)] border border-yellow-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] border border-emerald-900" />
            </div>

            {/* Brand Title */}
            <div className="hidden md:block pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-pokedex font-black text-sm tracking-wider text-white">
                  POKÉCARD <span className="text-red-500">PASS</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-red-950/80 border border-red-500/40 text-[9px] font-mono text-red-300 font-bold">
                  CHAMPIONS
                </span>
              </div>
              <p className="text-[10px] font-tech text-slate-400 leading-none">
                Ficha Oficial de Entrenador & Desafío de Gimnasios
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Trainer Switcher */}
            {allTrainers.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xl text-xs font-tech">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={trainer.id}
                  onChange={(e) => onSelectTrainer(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none max-w-[95px] truncate cursor-pointer"
                >
                  {allTrainers.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Theme Selector */}
            <select
              value={trainer?.theme || 'cyan-league'}
              onChange={(e) => onChangeTheme(e.target.value as CardTheme)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-tech text-slate-200 px-2.5 py-1.5 rounded-xl outline-none cursor-pointer hidden sm:block"
            >
              <option value="cyan-league" className="bg-slate-900">Tema: Cyan New Gen</option>
              <option value="rocket-crimson" className="bg-slate-900">Tema: Rocket Legados</option>
              <option value="kanto-classic" className="bg-slate-900">Tema: Kanto Clásico</option>
              <option value="cyber-emerald" className="bg-slate-900">Tema: Cyber Esmeralda</option>
            </select>

            {/* Portal Líder Button */}
            <button
              onClick={onOpenLeaderPortal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-tech font-bold transition active:scale-95 shadow-md ${
                activeLeader
                  ? 'bg-red-600 text-white border border-red-400 animate-pulse'
                  : 'bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200'
              }`}
              title="Panel individual para cada Líder de Gimnasio con contraseña propia"
            >
              <Shield className="w-3.5 h-3.5 text-red-300" />
              <span>{activeLeader ? (activeLeader.leaderName?.split(' ')[1] || activeLeader.leaderName || 'Líder') : 'Portal Líder'}</span>
            </button>

            {/* Super Admin Button */}
            <button
              onClick={onOpenSuperAdmin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-300 text-xs font-tech font-bold transition active:scale-95 shadow-md"
              title="Super Administrador General: controlar todo, contraseñas, gyms, colores y fichas"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Super Admin</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
              title={soundEnabled ? 'Silenciar sonidos Pokédex' : 'Activar sonidos'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Cloud Sync Button (shown when VITE_FIREBASE_* is configured) */}
            {cloudEnabled && (
              cloudUser ? (
                <button
                  onClick={onSignOutCloud}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-tech font-bold transition"
                  title={`Conectado: ${cloudUser.email || 'Google'} (cerrar sesión)`}
                >
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Nube Activa</span>
                  <LogOut className="w-3 h-3 opacity-75" />
                </button>
              ) : (
                <button
                  onClick={onSignInCloud}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-500/40 text-sky-300 text-xs font-tech font-bold transition"
                  title="Conectar con Google para guardar fichas en Firebase"
                >
                  <Cloud className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline">Sincronizar</span>
                </button>
              )
            )}

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>

        {/* View Switcher Tabs: Card View vs Gyms Arena */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs font-tech">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('card')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold transition ${
                currentTab === 'card'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Mi Ficha Pokédex</span>
            </button>

            <button
              onClick={() => onTabChange('gyms')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold transition relative ${
                currentTab === 'gyms'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Gimnasios & Desafíos</span>
              {activeChallengesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </div>

          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-tech font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva Ficha</span>
          </button>
        </div>
      </div>
    </header>
  );
};
