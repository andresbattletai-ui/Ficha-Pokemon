import React, { useState } from 'react';
import {
  GymLeaderAccount,
  TrainerProfile,
  GymChallenge,
} from '../types/pokemon';
import {
  getStoredGymLeaders,
  saveGymLeaders,
  setActiveLeaderSession,
  getStoredProfiles,
  saveProfiles,
} from '../services/storageService';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  X,
  Shield,
  KeyRound,
  LogOut,
  UserCheck,
  Swords,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeLeader: GymLeaderAccount | null;
  onLeaderLogin: (leader: GymLeaderAccount) => void;
  onLeaderLogout: () => void;
  allChallenges: GymChallenge[];
  onOpenBattleRoom: (challenge: GymChallenge) => void;
  onTrainerUpdated: (trainer: TrainerProfile) => void;
}

export const LeaderPortalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeLeader,
  onLeaderLogin,
  onLeaderLogout,
  allChallenges,
  onOpenBattleRoom,
  onTrainerUpdated,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showCredentialsHelper, setShowCredentialsHelper] = useState(false);

  // Fast manual award state
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [manualNote, setManualNote] = useState('Victoria oficial en combate de gimnasio.');
  const [awardSuccess, setAwardSuccess] = useState('');

  if (!isOpen) return null;

  const gymLeaders = getStoredGymLeaders();
  const allTrainers = getStoredProfiles();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const matched = gymLeaders.find(
      (l) => l.username.toLowerCase() === cleanUser && l.password === cleanPass
    );

    if (matched) {
      sounds.playBeep(980, 'sine', 0.1);
      setErrorMsg('');
      setActiveLeaderSession(matched);
      onLeaderLogin(matched);
    } else {
      sounds.playBeep(260, 'sawtooth', 0.2);
      setErrorMsg('Usuario o contraseña de Líder de Gimnasio incorrecto.');
    }
  };

  const handleStatusChange = (newStatus: 'abierto' | 'en_batalla' | 'cerrado') => {
    if (!activeLeader) return;
    const updatedLeaders = gymLeaders.map((l) =>
      l.id === activeLeader.id ? { ...l, status: newStatus } : l
    );
    saveGymLeaders(updatedLeaders);
    const updatedLeader = { ...activeLeader, status: newStatus };
    setActiveLeaderSession(updatedLeader);
    onLeaderLogin(updatedLeader);
    sounds.playBeep(850, 'sine', 0.05);
  };

  const handleManualAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeader || !selectedTrainerId) return;

    const trainer = allTrainers.find((t) => t.id === selectedTrainerId);
    if (!trainer) return;

    const dateStr = new Date().toLocaleDateString('es-ES');
    const updatedBadges = trainer.gymBadges.map((b) => {
      if (b.number === activeLeader.gymId || b.id === activeLeader.gymId) {
        return {
          ...b,
          isEarned: true,
          earnedDate: dateStr,
          signedByLeader: activeLeader.leaderName,
          battleNotes: manualNote.trim() || `Otorgada directamente por ${activeLeader.leaderName}.`,
        };
      }
      return b;
    });

    const updatedTrainer: TrainerProfile = {
      ...trainer,
      gymBadges: updatedBadges,
    };

    const nextProfiles = allTrainers.map((p) =>
      p.id === updatedTrainer.id ? updatedTrainer : p
    );
    saveProfiles(nextProfiles);
    onTrainerUpdated(updatedTrainer);

    sounds.playBadgeChime();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    setAwardSuccess(`¡${activeLeader.badgeName} otorgada exitosamente a ${trainer.name}!`);
    setTimeout(() => setAwardSuccess(''), 3500);
  };

  // Challenges for this specific leader
  const myGymChallenges = allChallenges.filter(
    (c) => activeLeader && c.leaderUsername === activeLeader.username
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-red-500/60 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-b border-red-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pokedex text-sm sm:text-base font-bold text-white tracking-wider">
                PORTAL INDIVIDUAL DE LÍDERES DE GIMNASIO
              </h3>
              <p className="text-[11px] font-tech text-slate-400">
                {activeLeader
                  ? `${activeLeader.leaderName} • ${activeLeader.gymName}`
                  : 'Ingreso exclusivo para líderes acreditados'}
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
        {!activeLeader ? (
          /* LOGIN FORM FOR INDIVIDUAL LEADER */
          <div className="p-6 sm:p-8 space-y-6 max-w-md mx-auto">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 shadow-inner mb-3">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h4 className="font-pokedex text-base font-bold text-white">
                  INICIAR SESIÓN DE LÍDER
                </h4>
                <p className="text-xs text-slate-400 font-tech">
                  Accede a tu panel para gestionar retadores, asignar salas de Pokémon Champions y acreditar tus medallas.
                </p>
              </div>

              <div>
                <label className="text-xs font-pokedex font-bold text-slate-300 block mb-1">
                  USUARIO DEL LÍDER:
                </label>
                <input
                  type="text"
                  placeholder="Ej. brock, misty, surge, giovanni..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white outline-none focus:border-red-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-pokedex font-bold text-slate-300 block mb-1">
                  CONTRASEÑA ASIGNADA:
                </label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña de líder..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white outline-none focus:border-red-500"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-tech text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-pokedex font-bold tracking-wider text-white shadow-lg shadow-red-900/40 transition active:scale-95"
              >
                ENTRAR A MI GIMNASIO
              </button>
            </form>

            {/* Helper Accordion with Credentials for convenience */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCredentialsHelper(!showCredentialsHelper)}
                className="w-full flex items-center justify-between text-xs font-tech text-cyan-400 hover:text-cyan-300 p-2 rounded-lg bg-slate-950/60"
              >
                <span>🔑 Ver credenciales de prueba de los Líderes</span>
                {showCredentialsHelper ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showCredentialsHelper && (
                <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1 max-h-40 overflow-y-auto">
                  {gymLeaders.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        setUsername(l.username);
                        setPassword(l.password);
                      }}
                      className="p-1 rounded hover:bg-slate-900 cursor-pointer flex justify-between"
                    >
                      <span className="text-slate-200">{l.leaderName} ({l.username}):</span>
                      <span className="text-amber-400 font-bold">{l.password}</span>
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-500 font-tech pt-1">
                    * El Super Administrador puede crear o cambiar estas contraseñas en cualquier momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ACTIVE LEADER DASHBOARD */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Leader Profile Card & Gym Status Switch */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeLeader.avatarUrl}
                  alt={activeLeader.leaderName}
                  className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 object-cover"
                />
                <div>
                  <h4 className="font-pokedex text-base font-bold text-white">
                    {activeLeader.leaderName}
                  </h4>
                  <span className="text-xs font-tech text-cyan-400 block">
                    {activeLeader.gymName} • Tipo {activeLeader.elementalType}
                  </span>
                  <span className="text-[11px] font-tech text-slate-400">
                    Medalla Oficial: {activeLeader.badgeIcon} {activeLeader.badgeName}
                  </span>
                </div>
              </div>

              {/* Status Switcher & Logout */}
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-tech text-slate-400">Estado del Gym:</span>
                  <select
                    value={activeLeader.status}
                    onChange={(e) => handleStatusChange(e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none cursor-pointer"
                  >
                    <option value="abierto">🟢 Abierto para Retar</option>
                    <option value="en_batalla">🔴 En Batalla</option>
                    <option value="cerrado">⚪ Cerrado</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLeaderSession(null);
                    onLeaderLogout();
                    sounds.playBeep(450, 'sine', 0.08);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-tech text-slate-300 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>

            {/* INCOMING RETADORES & ACTIVE BATTLES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pokedex text-xs font-bold text-slate-200 tracking-wider flex items-center gap-2">
                  <Swords className="w-4 h-4 text-cyan-400" />
                  BANDEJA DE RETADORES & SALAS PRIVADAS ({myGymChallenges.length})
                </span>
                <span className="text-[11px] font-tech text-slate-400">
                  Desafíos dirigidos a tu gimnasio
                </span>
              </div>

              {myGymChallenges.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1 text-slate-400 text-xs font-tech">
                  <Clock className="w-6 h-6 mx-auto text-slate-600 mb-1" />
                  <p>No tienes retadores pendientes en este momento.</p>
                  <p className="text-[11px] text-slate-500">
                    Cuando un entrenador presione "Desafiar Gimnasio" aparecerá aquí de inmediato.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myGymChallenges.map((chal) => (
                    <div
                      key={chal.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={chal.trainerAvatar}
                          alt=""
                          className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-pokedex text-xs font-bold text-white">
                              {chal.trainerName}
                            </span>
                            <span className="text-xs font-mono text-cyan-400">
                              {chal.trainerIgn}
                            </span>
                          </div>
                          <span className="text-[11px] font-tech text-slate-400">
                            Estado: <strong className="text-amber-300 uppercase">{chal.status.replace('_', ' ')}</strong> • {chal.createdAt}
                          </span>
                          {chal.pokemonChampionsRoomId && (
                            <span className="text-[11px] font-mono text-emerald-400 block">
                              Sala ID: {chal.pokemonChampionsRoomId}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playBeep(850, 'sine', 0.08);
                          onOpenBattleRoom(chal);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-tech font-bold text-white flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Abrir Sala de Batalla</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DIRECT BADGE GRANT (MANUAL PASS-AWARD) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-pokedex text-xs font-bold text-amber-300 tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                ACREDITAR {activeLeader.badgeName.toUpperCase()} A UN ENTRENADOR
              </span>

              {awardSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-tech text-center">
                  {awardSuccess}
                </div>
              )}

              <form onSubmit={handleManualAward} className="space-y-3">
                <div>
                  <label className="text-xs font-tech text-slate-400 block mb-1">
                    Seleccionar Entrenador Registrado:
                  </label>
                  <select
                    value={selectedTrainerId}
                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-white outline-none cursor-pointer"
                  >
                    <option value="">-- Elige un entrenador --</option>
                    {allTrainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.inGameName}) - ID: {t.trainerIdNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-tech text-slate-400 block mb-1">
                    Veredicto / Nota de Victoria:
                  </label>
                  <input
                    type="text"
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-slate-200 outline-none"
                    placeholder="Ej. Combate 6v6 ganado con honores en Pokémon Champions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedTrainerId}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-pokedex text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-40"
                >
                  <Award className="w-4 h-4" />
                  <span>ESTAMPAR Y OTORGAR MEDALLA OFICIAL</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-tech text-slate-400">
          <span>Panel de Acreditación Oficial • Pokémon Champions</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
