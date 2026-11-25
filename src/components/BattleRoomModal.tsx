import React, { useState, useEffect } from 'react';
import { GymChallenge, GymLeaderAccount, TrainerProfile } from '../types/pokemon';
import {
  addMessageToChallenge,
  awardBadgeFromBattleRoom,
  getStoredChallenges,
} from '../services/storageService';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  X,
  Swords,
  Copy,
  Check,
  Send,
  Award,
  Shield,
  Clock,
  Sparkles,
  Gamepad2,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  challenge: GymChallenge | null;
  currentTrainer: TrainerProfile;
  currentLeader: GymLeaderAccount | null;
  onTrainerUpdated: (trainer: TrainerProfile) => void;
  onChallengeUpdated: (challenge: GymChallenge) => void;
}

export const BattleRoomModal: React.FC<Props> = ({
  isOpen,
  onClose,
  challenge,
  currentTrainer,
  currentLeader,
  onTrainerUpdated,
  onChallengeUpdated,
}) => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [awardNote, setAwardNote] = useState('');
  const [showAwardSuccess, setShowAwardSuccess] = useState(false);

  useEffect(() => {
    if (challenge?.pokemonChampionsRoomId) {
      setRoomIdInput(challenge.pokemonChampionsRoomId);
    }
  }, [challenge]);

  if (!isOpen || !challenge) return null;

  const isLeaderViewing = currentLeader && currentLeader.username === challenge.leaderUsername;

  const handleSetRoomId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomIdInput.trim()) return;

    const updated = addMessageToChallenge(challenge.id, {
      sender: 'leader',
      senderName: challenge.gymLeaderName,
      text: `🔑 ID de Sala en Pokémon Champions configurado: ${roomIdInput.trim().toUpperCase()}. ¡Únete y prepárate para el combate!`,
    });

    if (updated) {
      updated.pokemonChampionsRoomId = roomIdInput.trim().toUpperCase();
      updated.status = 'en_combate';
      const all = getStoredChallenges();
      const idx = all.findIndex((c) => c.id === updated.id);
      if (idx !== -1) {
        all[idx] = updated;
        localStorage.setItem('pokecard_gym_challenges_v2', JSON.stringify(all));
      }
      onChallengeUpdated(updated);
      sounds.playBeep(920, 'square', 0.1);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || msgInput.trim();
    if (!text) return;

    const senderRole = isLeaderViewing ? 'leader' : 'trainer';
    const senderName = isLeaderViewing ? challenge.gymLeaderName : currentTrainer.name;

    const updated = addMessageToChallenge(challenge.id, {
      sender: senderRole,
      senderName,
      text,
    });

    if (updated) {
      onChallengeUpdated(updated);
      setMsgInput('');
      sounds.playBeep(800, 'sine', 0.05);
    }
  };

  const handleCopyRoomId = () => {
    if (!challenge.pokemonChampionsRoomId) return;
    navigator.clipboard.writeText(challenge.pokemonChampionsRoomId);
    setCopied(true);
    sounds.playBeep(1000, 'sine', 0.08);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAwardBadge = () => {
    if (!currentLeader) return;
    const note = awardNote.trim() || `Victoria oficial en Pokémon Champions. Sala: ${challenge.pokemonChampionsRoomId || 'OFICIAL'}`;
    const res = awardBadgeFromBattleRoom(challenge.id, currentLeader, note);
    if (res.success && res.trainer) {
      sounds.playBadgeChime();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#ef4444', '#38bdf8', '#22c55e'],
      });
      setShowAwardSuccess(true);
      onTrainerUpdated(res.trainer);
      const chals = getStoredChallenges();
      const fresh = chals.find((c) => c.id === challenge.id);
      if (fresh) onChallengeUpdated(fresh);
      setTimeout(() => setShowAwardSuccess(false), 4000);
    }
  };

  const handleLeaderWin = () => {
    if (!currentLeader) return;
    const updated = addMessageToChallenge(challenge.id, {
      sender: 'system',
      senderName: 'Veredicto de Combate',
      text: `El Líder de Gimnasio ${currentLeader.leaderName} ha defendido el gimnasio exitosamente. Reto finalizado.`,
    });
    if (updated) {
      updated.status = 'victoria_lider';
      const all = getStoredChallenges();
      const idx = all.findIndex((c) => c.id === updated.id);
      if (idx !== -1) {
        all[idx] = updated;
        localStorage.setItem('pokecard_gym_challenges_v2', JSON.stringify(all));
      }
      onChallengeUpdated(updated);
      sounds.playBeep(400, 'sawtooth', 0.2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-cyan-500/60 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Plate */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-pokedex text-sm sm:text-base font-bold text-white tracking-wider">
                  SALA PRIVADA: {challenge.gymName}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  challenge.status === 'en_combate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : challenge.status === 'victoria_retador'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                }`}>
                  {challenge.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs font-tech text-slate-400">
                Líder: <strong className="text-slate-200">{challenge.gymLeaderName}</strong> vs Retador: <strong className="text-cyan-300">{challenge.trainerName} ({challenge.trainerIgn})</strong>
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

        {/* Room Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* POKÉMON CHAMPIONS ROOM ID BANNER */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/50 shadow-lg shadow-emerald-950/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-emerald-400" />
                <span className="font-pokedex text-xs sm:text-sm font-bold text-emerald-300 tracking-wider">
                  ID DE SALA PRIVADA: POKÉMON CHAMPIONS
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Pega este ID en el juego
              </span>
            </div>

            {challenge.pokemonChampionsRoomId ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-700">
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] text-slate-400 block font-tech">CÓDIGO DE SALA:</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-cyan-300 tracking-wider">
                    {challenge.pokemonChampionsRoomId}
                  </span>
                </div>
                <button
                  onClick={handleCopyRoomId}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-tech font-bold text-white flex items-center gap-1.5 transition active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar ID</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/40 text-xs font-tech text-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Esperando a que el <strong>{challenge.gymLeaderName}</strong> cree la sala en Pokémon Champions y coloque el ID aquí.
                </span>
              </div>
            )}

            {/* If Gym Leader is viewing: Input to set or update Room ID */}
            {isLeaderViewing && (
              <form onSubmit={handleSetRoomId} className="pt-2 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ingresa la ID de la sala de Pokémon Champions (ej. CHAMP-9942)..."
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-tech font-bold text-white transition active:scale-95"
                >
                  Publicar Sala
                </button>
              </form>
            )}
          </div>

          {/* CHAT / BATTLE FEED */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h4 className="font-pokedex text-xs font-bold text-slate-200 tracking-wider">
                CANAL DE COMUNICACIÓN PRIVADO
              </h4>
            </div>

            <div className="h-56 bg-slate-950/90 rounded-2xl border border-slate-800 p-3.5 overflow-y-auto space-y-2.5">
              {challenge.battleMessages.map((msg) => {
                const isSys = msg.sender === 'system';
                const isLeader = msg.sender === 'leader';
                return (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl text-xs font-tech ${
                      isSys
                        ? 'bg-slate-900/60 border border-slate-800 text-slate-400 text-center italic'
                        : isLeader
                        ? 'bg-red-950/40 border border-red-500/30 text-red-100 ml-4'
                        : 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px] opacity-75">
                      <span className="font-bold">{msg.senderName}</span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick response chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[10px] font-tech text-slate-400 shrink-0">Respuestas rápidas:</span>
              <button
                type="button"
                onClick={() => handleSendMessage('¡Ya entré a la sala de Pokémon Champions!')}
                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-tech text-slate-300 whitespace-nowrap"
              >
                🎮 Ya entré a la sala
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('¿Formato 6v6 reglas oficiales de Liga?')}
                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-tech text-slate-300 whitespace-nowrap"
              >
                📜 Confirmar reglas
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('¡GG! Excelente combate de gimnasio.')}
                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-tech text-slate-300 whitespace-nowrap"
              >
                🤝 ¡Buen combate!
              </button>
            </div>

            {/* Message input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isLeaderViewing ? "Enviar mensaje como Líder..." : "Enviar mensaje al Líder..."}
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-tech text-white outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs font-tech text-white flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>

          {/* LEADER CONTROLS: AWARD BADGE OR FINISH DUEL */}
          {isLeaderViewing && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pokedex text-xs font-bold text-amber-300 tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  VEREDICTO OFICIAL DEL LÍDER DE GIMNASIO
                </span>
                {challenge.badgeAwarded && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    MEDALLA ENTREGADA ✓
                  </span>
                )}
              </div>

              {showAwardSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-tech text-center">
                  ¡Medalla otorgada exitosamente! La ficha oficial del entrenador {challenge.trainerName} ha sido actualizada.
                </div>
              )}

              <div>
                <label className="text-[11px] font-tech text-slate-400 block mb-1">
                  Nota del combate (quedará registrada en su ficha):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Victoria 2-1 con gran estrategia en Pokémon Champions..."
                  value={awardNote}
                  onChange={(e) => setAwardNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAwardBadge}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-pokedex text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>OTORGAR MEDALLA OFICIAL</span>
                </button>

                <button
                  type="button"
                  onClick={handleLeaderWin}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-tech font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span>Registrar Victoria del Líder</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-tech text-slate-400">
          <span>Esta sala privada está sincronizada con Pokémon Champions.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
          >
            Cerrar Sala
          </button>
        </div>
      </div>
    </div>
  );
};
