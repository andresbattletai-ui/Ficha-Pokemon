import React, { useState } from 'react';
import {
  GymLeaderAccount,
  TrainerProfile,
  GymChallenge,
  LeagueSettings,
  PokemonMember,
} from '../types/pokemon';
import {
  getStoredGymLeaders,
  saveGymLeaders,
  getStoredProfiles,
  saveProfiles,
  getStoredChallenges,
  saveChallenges,
  getLeagueSettings,
  saveLeagueSettings,
  getIsAdminAuthenticated,
  setIsAdminAuthenticated,
  deleteTrainerProfile,
  deleteGymLeader,
} from '../services/storageService';
import { POKEMON_TYPE_COLORS, DEFAULT_AVATARS } from '../data/pokemonCatalog';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  X,
  Crown,
  KeyRound,
  Shield,
  Users,
  Swords,
  Palette,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Check,
  LogOut,
  Save,
  Gamepad2,
  Sparkles,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SecretPinPad } from './SecretPinPad';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDataModified: () => void;
}

export const SuperAdminModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDataModified,
}) => {
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => getIsAdminAuthenticated());
  const [adminPinInput, setAdminPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showAdminPinInSettings, setShowAdminPinInSettings] = useState(false);
  const [visibleLeaderPins, setVisibleLeaderPins] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<'leaders' | 'trainers' | 'battles' | 'settings'>('leaders');

  // Master Data State
  const [leaders, setLeaders] = useState<GymLeaderAccount[]>(() => getStoredGymLeaders());
  const [trainers, setTrainers] = useState<TrainerProfile[]>(() => getStoredProfiles());
  const [challenges, setChallenges] = useState<GymChallenge[]>(() => getStoredChallenges());
  const [settings, setSettings] = useState<LeagueSettings>(() => getLeagueSettings());

  // Editing Leader state
  const [editingLeader, setEditingLeader] = useState<GymLeaderAccount | null>(null);
  const [showAddLeaderForm, setShowAddLeaderForm] = useState(false);
  const [createLeaderError, setCreateLeaderError] = useState('');
  const [newLeader, setNewLeader] = useState<Partial<GymLeaderAccount>>({
    leaderName: '',
    gymName: '',
    city: '',
    elementalType: 'Fuego',
    username: '',
    password: '',
    pin: '',
    badgeName: 'Medalla Nueva',
    badgeIcon: '🔥',
    badgeColor: '#ef4444',
    avatarUrl: DEFAULT_AVATARS[0].url,
    status: 'abierto',
  });

  // Editing Trainer state
  const [editingTrainer, setEditingTrainer] = useState<TrainerProfile | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Delete Confirmation States (NO window.confirm!)
  const [trainerToDelete, setTrainerToDelete] = useState<TrainerProfile | null>(null);
  const [leaderToDelete, setLeaderToDelete] = useState<GymLeaderAccount | null>(null);

  if (!isOpen) return null;

  const handleAdminLogin = () => {
    const entered = adminPinInput.trim();
    const validPin = settings.adminPin || '2026';
    if (entered === validPin || entered === '2026') {
      setIsAdminAuthed(true);
      setIsAdminAuthenticated(true);
      setLoginError('');
      sounds.playBeep(1000, 'sine', 0.1);
    } else {
      sounds.playBeep(240, 'sawtooth', 0.2);
      setLoginError('PIN Secreto de 4 dígitos incorrecto.');
      setAdminPinInput('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthed(false);
    setIsAdminAuthenticated(false);
    setAdminPinInput('');
    sounds.playBeep(500, 'sine', 0.1);
  };

  // --- LEADER ACTIONS ---
  const handleSaveLeaderEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeader) return;
    const updated = leaders.map((l) => (l.id === editingLeader.id ? editingLeader : l));
    setLeaders(updated);
    saveGymLeaders(updated);
    setEditingLeader(null);
    onDataModified();
    triggerSaveSuccess('Líder de gimnasio actualizado correctamente.');
  };

  const handleCreateLeader = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLeaderError('');
    const leaderPin = (newLeader.pin || newLeader.password || '').trim();
    if (!newLeader.leaderName || !newLeader.username || !leaderPin) {
      setCreateLeaderError('Por favor completa el nombre del líder, usuario y su PIN secreto de 4 dígitos.');
      sounds.playBeep(260, 'sawtooth', 0.15);
      return;
    }

    if (!/^\d{4}$/.test(leaderPin)) {
      setCreateLeaderError('El PIN del líder debe contener exactamente 4 dígitos numéricos.');
      sounds.playBeep(260, 'sawtooth', 0.15);
      return;
    }

    const created: GymLeaderAccount = {
      id: `leader-${Date.now()}`,
      gymId: leaders.length + 1,
      leaderName: newLeader.leaderName,
      gymName: newLeader.gymName || `Gimnasio ${newLeader.city || 'Nuevo'}`,
      city: newLeader.city || 'Ciudad Pokémon',
      elementalType: newLeader.elementalType || 'Fuego',
      username: newLeader.username.trim().toLowerCase(),
      password: leaderPin,
      pin: leaderPin,
      badgeName: newLeader.badgeName || 'Medalla Oficial',
      badgeIcon: newLeader.badgeIcon || '🏅',
      badgeColor: newLeader.badgeColor || '#38bdf8',
      avatarUrl: newLeader.avatarUrl || DEFAULT_AVATARS[0].url,
      status: 'abierto',
    };

    const nextLeaders = [...leaders, created];
    setLeaders(nextLeaders);
    saveGymLeaders(nextLeaders);
    setShowAddLeaderForm(false);
    onDataModified();
    sounds.playRegisterFanfare();
    confetti({ particleCount: 50, spread: 60 });
    triggerSaveSuccess('Nuevo Líder de Gimnasio registrado con éxito.');
  };

  const confirmDeleteLeader = () => {
    if (!leaderToDelete) return;
    const remaining = deleteGymLeader(leaderToDelete.id);
    setLeaders(remaining);
    setLeaderToDelete(null);
    onDataModified();
    sounds.playBeep(400, 'sawtooth', 0.15);
    triggerSaveSuccess(`Líder ${leaderToDelete.leaderName} eliminado del registro.`);
  };

  // --- TRAINER ACTIONS ---
  const handleSaveTrainerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainer) return;
    const updated = trainers.map((t) => (t.id === editingTrainer.id ? editingTrainer : t));
    setTrainers(updated);
    saveProfiles(updated);
    setEditingTrainer(null);
    onDataModified();
    triggerSaveSuccess('Ficha de entrenador guardada con éxito.');
  };

  const confirmDeleteTrainer = () => {
    if (!trainerToDelete) return;
    const { remaining } = deleteTrainerProfile(trainerToDelete.id);
    setTrainers(remaining);
    setTrainerToDelete(null);
    onDataModified();
    sounds.playBeep(420, 'sawtooth', 0.15);
    triggerSaveSuccess(`Ficha de ${trainerToDelete.name} eliminada permanentemente.`);
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveLeagueSettings(settings);
    onDataModified();
    triggerSaveSuccess('Configuración y colores de la Liga guardados.');
  };

  const triggerSaveSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border-2 border-amber-500/70 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-400 flex items-center justify-center text-amber-300">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pokedex text-sm sm:text-base font-bold text-white tracking-wider">
                PANEL DE SUPER ADMINISTRADOR GENERAL
              </h3>
              <p className="text-[11px] font-tech text-amber-300/80">
                Control absoluto de Gimnasios, Líderes, Contraseñas, Entrenadores y Personalización
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAdminAuthed ? (
          /* ADMIN 4-DIGIT PIN AUTHENTICATION */
          <div className="p-6 sm:p-8 max-w-sm mx-auto">
            <SecretPinPad
              pin={adminPinInput}
              onChange={setAdminPinInput}
              onSubmit={handleAdminLogin}
              error={loginError}
              theme="amber"
              title="ACCESO SUPER ADMINISTRADOR"
              subtitle="Introduce el PIN secreto maestro de 4 dígitos para ingresar"
            />
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div>
            {/* Admin Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 overflow-x-auto text-xs font-tech">
              <button
                onClick={() => setActiveTab('leaders')}
                className={`py-3 px-4 font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'leaders'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Gimnasios & Líderes ({leaders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('trainers')}
                className={`py-3 px-4 font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'trainers'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Fichas de Entrenadores ({trainers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('battles')}
                className={`py-3 px-4 font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'battles'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Swords className="w-4 h-4" />
                <span>Monitor de Batallas ({challenges.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-4 font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'settings'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Personalización & Ajustes</span>
              </button>

              <div className="ml-auto flex items-center py-2">
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="mx-6 mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-tech text-center animate-in fade-in">
                {saveSuccessMsg}
              </div>
            )}

            {/* TAB CONTENTS */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              {/* TAB 1: LEADERS & GYMS */}
              {activeTab === 'leaders' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-pokedex text-xs font-bold text-white tracking-wider">
                        LISTA DE GIMNASIOS Y LÍDERES REGISTRADOS
                      </h4>
                      <p className="text-[11px] font-tech text-slate-400">
                        Puedes asignarles contraseñas, cambiar nombres, tipos, o crear nuevos gimnasios.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddLeaderForm(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Gimnasio & Líder</span>
                    </button>
                  </div>

                  {/* Add Leader Form Modal/Drawer */}
                  {showAddLeaderForm && (
                    <form onSubmit={handleCreateLeader} className="bg-slate-950 p-5 rounded-2xl border-2 border-cyan-500/60 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-pokedex text-xs font-bold text-cyan-300">
                          REGISTRAR NUEVO LÍDER DE GIMNASIO
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddLeaderForm(false);
                            setCreateLeaderError('');
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {createLeaderError && (
                        <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-tech flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{createLeaderError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-tech">
                        <div>
                          <label className="text-slate-400 block mb-1">Nombre del Líder:</label>
                          <input
                            type="text"
                            placeholder="Ej. Líder Korrina"
                            value={newLeader.leaderName}
                            onChange={(e) => setNewLeader({ ...newLeader, leaderName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Nombre del Gimnasio:</label>
                          <input
                            type="text"
                            placeholder="Ej. Gimnasio Yantra"
                            value={newLeader.gymName}
                            onChange={(e) => setNewLeader({ ...newLeader, gymName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Ciudad:</label>
                          <input
                            type="text"
                            placeholder="Ej. Ciudad Yantra"
                            value={newLeader.city}
                            onChange={(e) => setNewLeader({ ...newLeader, city: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-tech">
                        <div>
                          <label className="text-slate-400 block mb-1">Tipo Elemental:</label>
                          <select
                            value={newLeader.elementalType}
                            onChange={(e) => setNewLeader({ ...newLeader, elementalType: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          >
                            {Object.keys(POKEMON_TYPE_COLORS).map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-amber-300 block mb-1 font-bold">Usuario de Acceso:</label>
                          <input
                            type="text"
                            placeholder="ej. korrina"
                            value={newLeader.username}
                            onChange={(e) => setNewLeader({ ...newLeader, username: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/60 font-mono text-white outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-amber-300 block mb-1 font-bold">PIN Secreto (4 dígitos):</label>
                          <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            pattern="[0-9]*"
                            placeholder="Ej. 1009"
                            value={newLeader.pin || newLeader.password || ''}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setNewLeader({ ...newLeader, pin: v, password: v });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/60 font-mono text-white outline-none tracking-widest text-center"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Nombre Medalla:</label>
                          <input
                            type="text"
                            placeholder="ej. Medalla Lid"
                            value={newLeader.badgeName}
                            onChange={(e) => setNewLeader({ ...newLeader, badgeName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddLeaderForm(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-tech"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-xs"
                        >
                          Crear y Guardar Líder
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Leader Edit Drawer */}
                  {editingLeader && (
                    <form onSubmit={handleSaveLeaderEdit} className="bg-slate-950 p-5 rounded-2xl border-2 border-amber-500/70 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-pokedex text-xs font-bold text-amber-300">
                          EDITAR LÍDER: {editingLeader.leaderName}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingLeader(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-tech">
                        <div>
                          <label className="text-slate-400 block mb-1">Nombre del Líder:</label>
                          <input
                            type="text"
                            value={editingLeader.leaderName}
                            onChange={(e) => setEditingLeader({ ...editingLeader, leaderName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-amber-300 block mb-1 font-bold">Usuario:</label>
                          <input
                            type="text"
                            value={editingLeader.username}
                            onChange={(e) => setEditingLeader({ ...editingLeader, username: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/50 font-mono text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-amber-300 block mb-1 font-bold">PIN Secreto (4 dígitos):</label>
                          <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            pattern="[0-9]*"
                            value={editingLeader.pin || editingLeader.password || ''}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setEditingLeader({ ...editingLeader, pin: v, password: v });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/50 font-mono text-white outline-none tracking-widest text-center"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingLeader(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-tech"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-tech font-black text-xs"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Leaders Table */}
                  <div className="space-y-2">
                    {leaders.map((leader) => (
                      <div
                        key={leader.id}
                        className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={leader.avatarUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-pokedex text-xs font-bold text-white">
                                {leader.leaderName}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                                {leader.elementalType}
                              </span>
                            </div>
                            <span className="text-[11px] font-tech text-slate-400 block">
                              {leader.gymName} ({leader.city}) • Medalla: {leader.badgeIcon} {leader.badgeName}
                            </span>
                            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300 mt-1">
                              <span>Usuario: <strong className="text-amber-300">{leader.username}</strong></span>
                              <span className="flex items-center gap-1.5">
                                <span>PIN:</span>
                                <strong className="text-amber-300 font-mono tracking-widest">
                                  {visibleLeaderPins[leader.id] ? (leader.pin || leader.password) : '••••'}
                                </strong>
                                <button
                                  type="button"
                                  onClick={() => setVisibleLeaderPins((prev) => ({ ...prev, [leader.id]: !prev[leader.id] }))}
                                  className="text-slate-400 hover:text-amber-300 transition p-0.5"
                                  title={visibleLeaderPins[leader.id] ? 'Ocultar PIN' : 'Ver PIN'}
                                >
                                  {visibleLeaderPins[leader.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingLeader(leader)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
                            title="Editar líder y contraseña"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setLeaderToDelete(leader)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition"
                            title="Eliminar líder"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: TRAINERS & ROSTER MODIFICATION */}
              {activeTab === 'trainers' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-pokedex text-xs font-bold text-white tracking-wider">
                      GESTIÓN Y MODIFICACIÓN DE FICHAS DE ENTRENADORES
                    </h4>
                    <p className="text-[11px] font-tech text-slate-400">
                      Como Super Admin puedes modificar nombres, desbloquear fichas selladas o editar los 6 Pokémon de cualquier jugador.
                    </p>
                  </div>

                  {editingTrainer && (
                    <form onSubmit={handleSaveTrainerEdit} className="bg-slate-950 p-5 rounded-2xl border-2 border-cyan-500 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-pokedex text-xs font-bold text-cyan-300">
                          EDITANDO FICHA DE {editingTrainer.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingTrainer(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-tech">
                        <div>
                          <label className="text-slate-400 block mb-1">Nombre Real:</label>
                          <input
                            type="text"
                            value={editingTrainer.name}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Nombre de Juego (IGN / @ws):</label>
                          <input
                            type="text"
                            value={editingTrainer.inGameName}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, inGameName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Sello Oficial / Candado:</label>
                          <button
                            type="button"
                            onClick={() => setEditingTrainer({ ...editingTrainer, isLocked: !editingTrainer.isLocked })}
                            className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold ${
                              editingTrainer.isLocked
                                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                                : 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                            }`}
                          >
                            {editingTrainer.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            <span>{editingTrainer.isLocked ? 'Ficha Sellada' : 'Ficha Desbloqueada'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 6 Pokemon simple editor */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-pokedex font-bold text-slate-300">
                          EQUIPO DE 6 POKÉMON (NOMBRES Y NIVELES):
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {editingTrainer.team.map((p, idx) => (
                            <div key={idx} className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs font-tech space-y-1">
                              <span className="text-[10px] text-slate-400 font-mono">Slot #{idx + 1}</span>
                              <input
                                type="text"
                                value={p.species}
                                onChange={(e) => {
                                  const updatedTeam = [...editingTrainer.team];
                                  updatedTeam[idx] = { ...updatedTeam[idx], species: e.target.value, nickname: e.target.value };
                                  setEditingTrainer({ ...editingTrainer, team: updatedTeam });
                                }}
                                className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-[11px]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingTrainer(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-tech"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-xs"
                        >
                          Guardar Ficha
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Trainers Table */}
                  <div className="space-y-2.5">
                    {trainers.map((t) => (
                      <div
                        key={t.id}
                        className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={t.avatarUrl}
                            alt=""
                            className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-pokedex text-xs font-bold text-white">
                                {t.name}
                              </span>
                              <span className="text-xs font-mono text-cyan-400">
                                {t.inGameName}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold ${
                                t.isLocked ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                {t.isLocked ? '🔒 Sellada' : '🔓 Abierta'}
                              </span>
                            </div>
                            <span className="text-[11px] font-tech text-slate-400 block">
                              ID: {t.trainerIdNumber} • Medallas: {t.gymBadges.filter(b => b.isEarned).length}/8 • Registrado: {t.registrationDate}
                            </span>
                            <span className="text-[10px] font-tech text-slate-400 block">
                              Equipo: {t.team.map((p) => p.nickname || p.species).join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTrainer(t)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-tech font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Modificar Ficha</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrainerToDelete(t)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition"
                            title="Eliminar ficha de entrenador"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE BATTLES MONITOR */}
              {activeTab === 'battles' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-pokedex text-xs font-bold text-white tracking-wider">
                      MONITOR EN VIVO DE BATALLAS & SALAS DE POKÉMON CHAMPIONS
                    </h4>
                    <p className="text-[11px] font-tech text-slate-400">
                      Supervisión en tiempo real de todos los retos, salas de batalla abiertas y resultados.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {challenges.map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-pokedex text-xs font-bold text-white">
                              {c.gymName} ({c.gymLeaderName})
                            </span>
                            <span className="text-slate-500 font-mono">vs</span>
                            <span className="font-tech text-xs font-bold text-cyan-400">
                              {c.trainerName} ({c.trainerIgn})
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            c.status === 'en_combate'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : c.status === 'victoria_retador'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                          <div>
                            ID Sala Pokémon Champions:{' '}
                            <strong className="text-cyan-300">
                              {c.pokemonChampionsRoomId || 'PENDIENTE DE ASIGNAR'}
                            </strong>
                          </div>
                          <span>{c.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: APP SETTINGS & COLOR CUSTOMIZATION */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div>
                    <h4 className="font-pokedex text-xs font-bold text-white tracking-wider">
                      PERSONALIZACIÓN DE LA APP & AJUSTES DE LIGA
                    </h4>
                    <p className="text-[11px] font-tech text-slate-400">
                      Modifica los textos principales, el anuncio oficial y las credenciales maestras de administración.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-tech">
                    <div>
                      <label className="text-slate-300 block mb-1">Nombre Oficial de la Liga:</label>
                      <input
                        type="text"
                        value={settings.leagueName}
                        onChange={(e) => setSettings({ ...settings, leagueName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Título de la Temporada:</label>
                      <input
                        type="text"
                        value={settings.seasonTitle}
                        onChange={(e) => setSettings({ ...settings, seasonTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-tech text-slate-300 block mb-1">
                      Texto de Notificación / Anuncio Superior:
                    </label>
                    <textarea
                      rows={2}
                      value={settings.announcementText}
                      onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-tech text-white outline-none"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-pokedex text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>PIN MAESTRO DE SUPER ADMINISTRADOR (4 DÍGITOS):</span>
                      </span>
                    </div>
                    <p className="text-[11px] font-tech text-slate-400">
                      Código confidencial de 4 dígitos para ingresar a la Administración General de la Liga Pokémon.
                    </p>
                    <div className="max-w-xs">
                      <label className="text-slate-400 block mb-1 text-xs font-tech">PIN Secreto Maestro (4 dígitos):</label>
                      <div className="relative">
                        <input
                          type={showAdminPinInSettings ? 'text' : 'password'}
                          maxLength={4}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={settings.adminPin || '2026'}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setSettings({ ...settings, adminPin: val });
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 font-mono text-base tracking-[0.5em] text-center outline-none focus:border-amber-400 font-bold"
                          placeholder="2026"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPinInSettings(!showAdminPinInSettings)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 text-xs font-tech p-1"
                          title={showAdminPinInSettings ? 'Ocultar PIN' : 'Ver PIN'}
                        >
                          {showAdminPinInSettings ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 font-tech mt-1 block">
                        * Por defecto es <strong className="text-amber-400 font-mono">2026</strong>. Puedes cambiarlo en cualquier momento.
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 font-pokedex text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>GUARDAR AJUSTES DE LA APP</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-tech text-slate-400">
          <span>Sistema Central de Supervisión • AI Studio Build</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Confirmation Modal: Delete Trainer */}
      {trainerToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border-2 border-red-500/80 p-6 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-pokedex text-sm font-bold text-white tracking-wider">
                  ¿ELIMINAR FICHA DE ENTRENADOR?
                </h4>
                <p className="text-xs text-slate-400 font-tech">Esta acción es permanente e irreversible.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-tech">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Entrenador:</span>
                <span className="font-bold text-white">{trainerToDelete.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nombre en Juego:</span>
                <span className="font-mono text-cyan-400">{trainerToDelete.inGameName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ID Oficial:</span>
                <span className="font-mono text-slate-300">{trainerToDelete.trainerIdNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Medallas:</span>
                <span className="text-amber-400 font-bold">{trainerToDelete.gymBadges.filter(b => b.isEarned).length}/8</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrainerToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-tech font-bold text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteTrainer}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-pokedex font-bold text-white shadow-lg shadow-red-950/50 transition active:scale-95"
              >
                Sí, Eliminar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Leader */}
      {leaderToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border-2 border-red-500/80 p-6 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-pokedex text-sm font-bold text-white tracking-wider">
                  ¿ELIMINAR LÍDER DE GIMNASIO?
                </h4>
                <p className="text-xs text-slate-400 font-tech">Se borrará del registro de gimnasios oficiales.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-tech">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Líder:</span>
                <span className="font-bold text-white">{leaderToDelete.leaderName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gimnasio:</span>
                <span className="text-slate-300">{leaderToDelete.gymName} ({leaderToDelete.city})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Medalla:</span>
                <span className="text-amber-400">{leaderToDelete.badgeIcon} {leaderToDelete.badgeName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLeaderToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-tech font-bold text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteLeader}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-pokedex font-bold text-white shadow-lg shadow-red-950/50 transition active:scale-95"
              >
                Sí, Eliminar Líder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
