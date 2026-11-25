import React, { useState } from 'react';
import { TrainerProfile } from '../types/pokemon';
import { sounds } from '../utils/soundEffects';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trainer: TrainerProfile;
}

export const ShareExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  trainer,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const earnedCount = trainer.gymBadges.filter((b) => b.isEarned).length;
  const eliteCount = trainer.eliteFour.filter((e) => e.isEarned).length;

  const shareText = `🔴 PASAPORTE OFICIAL DE ENTRENADOR POKÉMON 🔴
👤 Entrenador: ${trainer.name} (${trainer.inGameName})
🆔 Registro: ${trainer.trainerIdNumber}
📍 Liga: ${trainer.region}
🏅 Medallas de Gimnasio: ${earnedCount}/8
⭐ Alto Mando: ${eliteCount}/4
👑 Rango: ${trainer.champion.isChampion ? '¡CAMPEÓN DE LA LIGA!' : 'Aspirante Oficial'}
⚔️ Equipo Registrado (6):
${trainer.team.map((p, idx) => `  ${idx + 1}. ${p.nickname || p.species} (Nv. ${p.level}) [${p.types.join('/')}]`).join('\n')}
🔒 Estado: FICHA SELLADA Y CERTIFICADA`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    sounds.playBeep(980, 'sine', 0.1);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // QR Code URL via public SVG QR generator
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `POKECARD-PASS:${trainer.trainerIdNumber}:${trainer.name}:${trainer.inGameName}`
  )}&bgcolor=020617&color=38bdf8`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-cyan-500/60 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pokedex text-sm font-bold text-white tracking-wider">
                COMPARTIR & VERIFICACIÓN QR
              </h3>
              <p className="text-[11px] font-tech text-slate-400">
                Ficha Oficial N.° {trainer.trainerIdNumber}
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
        <div className="p-6 space-y-6">
          {/* Official Pass QR verification card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-400/50 shadow-lg shadow-cyan-950/40">
              <img
                src={qrUrl}
                alt="QR Pass"
                className="w-36 h-36 rounded-xl object-contain"
              />
            </div>
            <div>
              <span className="font-pokedex text-xs font-bold text-cyan-400 tracking-wider">
                CÓDIGO DE VERIFICACIÓN PARA TORNEOS
              </span>
              <p className="text-[11px] font-tech text-slate-400 mt-1">
                Escanear para comprobar el registro oficial del equipo de 6 criaturas y las medallas acreditadas.
              </p>
            </div>
          </div>

          {/* Quick summary box */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
            <p className="text-cyan-300 font-bold font-pokedex text-[11px]">RESUMEN DE REGISTRO:</p>
            <p>• Entrenador: {trainer.name} ({trainer.inGameName})</p>
            <p>• Medallas: {earnedCount}/8 | Alto Mando: {eliteCount}/4</p>
            <p>• Equipo: {trainer.team.map((p) => p.nickname || p.species).join(', ')}</p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs font-tech text-white flex items-center justify-center gap-2 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Ficha para WhatsApp</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs font-tech text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
