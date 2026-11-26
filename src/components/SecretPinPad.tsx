import React, { useRef, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';
import { Shield, Lock, Delete, ArrowRight } from 'lucide-react';

interface SecretPinPadProps {
  pin: string;
  onChange: (pin: string) => void;
  onSubmit: () => void;
  error?: string;
  theme?: 'amber' | 'red';
  title?: string;
  subtitle?: string;
  autoFocus?: boolean;
}

export const SecretPinPad: React.FC<SecretPinPadProps> = ({
  pin,
  onChange,
  onSubmit,
  error,
  theme = 'amber',
  title = 'INGRESA EL PIN SECRETO',
  subtitle = 'Introduce el código numérico confidencial de 4 dígitos',
  autoFocus = true,
}) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [autoFocus]);

  const isAmber = theme === 'amber';
  const glowColor = isAmber ? 'bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.9)]' : 'bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)]';
  const borderActiveColor = isAmber ? 'border-amber-400' : 'border-red-500';
  const keyHoverColor = isAmber
    ? 'hover:bg-amber-950/60 hover:border-amber-400/80 text-amber-200'
    : 'hover:bg-red-950/60 hover:border-red-500/80 text-red-200';

  const handleDigitPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      sounds.playBeep(650 + nextPin.length * 70, 'sine', 0.06);
      onChange(nextPin);
      if (nextPin.length === 4) {
        // Auto submit when 4 digits are completed
        setTimeout(() => {
          onSubmit();
        }, 120);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      sounds.playBeep(380, 'sine', 0.05);
      onChange(pin.slice(0, -1));
    }
  };

  const handleClear = () => {
    sounds.playBeep(300, 'sawtooth', 0.08);
    onChange('');
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > pin.length) {
      sounds.playBeep(650 + raw.length * 70, 'sine', 0.06);
    }
    onChange(raw);
    if (raw.length === 4) {
      setTimeout(() => {
        onSubmit();
      }, 120);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className="space-y-5 select-none"
      onClick={() => hiddenInputRef.current?.focus()}
    >
      {/* Title & Security Header */}
      <div className="text-center space-y-1">
        <div
          className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border shadow-inner ${
            isAmber
              ? 'bg-amber-950/70 border-amber-500/50 text-amber-400'
              : 'bg-red-950/70 border-red-500/50 text-red-400'
          }`}
        >
          <Lock className="w-7 h-7 animate-pulse" />
        </div>
        <h4 className="font-pokedex text-sm sm:text-base font-bold text-white tracking-wider pt-1">
          {title}
        </h4>
        <p className="text-xs text-slate-400 font-tech">
          {subtitle}
        </p>
      </div>

      {/* Hidden input to catch keyboard events on desktop/mobile */}
      <input
        ref={hiddenInputRef}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={pin}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="sr-only"
        autoComplete="off"
        aria-label="PIN Secreto de 4 dígitos"
      />

      {/* 4 Masked Security Dots (Never visible digits!) */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
        {[0, 1, 2, 3].map((slotIdx) => {
          const isFilled = slotIdx < pin.length;
          const isCurrent = slotIdx === pin.length;

          return (
            <div
              key={slotIdx}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-slate-950 border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isFilled
                  ? `${borderActiveColor} shadow-lg scale-105`
                  : isCurrent
                  ? 'border-slate-500 shadow-md animate-pulse'
                  : 'border-slate-800'
              } ${error ? 'border-rose-500 animate-shake' : ''}`}
            >
              {isFilled ? (
                <span
                  className={`w-4 h-4 rounded-full ${glowColor} transform scale-110 transition-transform`}
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-800" />
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs font-tech text-rose-300 text-center animate-shake flex items-center justify-center gap-1.5">
          <Shield className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Security notice indicator */}
      <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>PIN PROTEGIDO • CARACTERES OCULTOS</span>
      </div>

      {/* Cyberpunk Numeric Touch Keypad (Optimized for Mobile PWA) */}
      <div className="max-w-[270px] mx-auto grid grid-cols-3 gap-2 pt-1 font-pokedex">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDigitPress(digit);
            }}
            className={`h-12 rounded-xl bg-slate-950/80 border border-slate-800 text-base font-bold text-slate-200 shadow-sm transition active:scale-95 flex items-center justify-center ${keyHoverColor}`}
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          className="h-12 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-tech font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition active:scale-95 flex items-center justify-center"
          title="Borrar todo"
        >
          LIMPIAR
        </button>

        {/* Digit 0 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDigitPress('0');
          }}
          className={`h-12 rounded-xl bg-slate-950/80 border border-slate-800 text-base font-bold text-slate-200 shadow-sm transition active:scale-95 flex items-center justify-center ${keyHoverColor}`}
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleBackspace();
          }}
          className="h-12 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition active:scale-95 flex items-center justify-center"
          title="Borrar un dígito"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Submit Action Button */}
      <button
        type="button"
        disabled={pin.length !== 4}
        onClick={(e) => {
          e.stopPropagation();
          onSubmit();
        }}
        className={`w-full py-3 rounded-xl font-pokedex text-xs font-black tracking-wider transition shadow-lg flex items-center justify-center gap-2 ${
          pin.length === 4
            ? isAmber
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 active:scale-95 shadow-amber-900/40'
              : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white active:scale-95 shadow-red-900/40'
            : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
        }`}
      >
        <span>VERIFICAR & ENTRAR</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
