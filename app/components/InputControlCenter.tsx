'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Shuffle, Calculator, RotateCcw } from 'lucide-react';
import { MatkaInput } from '../lib/matkaEngine';

interface Props {
  onCalculate: (input: MatkaInput) => void;
}

export function InputControlCenter({ onCalculate }: Props) {
  const [openPanel, setOpenPanel] = useState('');
  const [jodi, setJodi] = useState('');
  const [closePanel, setClosePanel] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback((o: string, j: string, c: string): boolean => {
    const errs: string[] = [];
    if (!/^\d{3}$/.test(o)) errs.push('Open Panel must be 3 digits');
    if (!/^\d{2}$/.test(j)) errs.push('Jodi must be 2 digits');
    if (!/^\d{3}$/.test(c)) errs.push('Close Panel must be 3 digits');
    setErrors(errs);
    return errs.length === 0;
  }, []);

  const handleCalculate = () => {
    if (validate(openPanel, jodi, closePanel)) {
      onCalculate({ openPanel, jodi, closePanel });
    }
  };

  const randomize = () => {
    const r = () => String(Math.floor(Math.random() * 10));
    const o = `${r()}${r()}${r()}`;
    const j = `${r()}${r()}`;
    const c = `${r()}${r()}${r()}`;
    setOpenPanel(o);
    setJodi(j);
    setClosePanel(c);
    setErrors([]);
    onCalculate({ openPanel: o, jodi: j, closePanel: c });
  };

  const reset = () => {
    setOpenPanel('');
    setJodi('');
    setClosePanel('');
    setErrors([]);
  };

  return (
    <GlassCard glow="cyan" className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neon-cyan neon-text-cyan tracking-wider uppercase">
          Input Control Center
        </h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={randomize}
            className="p-2 rounded-lg bg-neon-violet/10 border border-neon-violet/30 text-neon-violet hover:bg-neon-violet/20 transition-colors"
          >
            <Shuffle size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={18} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-semibold">Open Panel</label>
          <input
            type="text"
            maxLength={3}
            value={openPanel}
            onChange={e => setOpenPanel(e.target.value.replace(/\D/g, '').slice(0,3))}
            placeholder="123"
            className="glass-input w-full text-center font-mono text-lg tracking-widest"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-semibold">Jodi</label>
          <input
            type="text"
            maxLength={2}
            value={jodi}
            onChange={e => setJodi(e.target.value.replace(/\D/g, '').slice(0,2))}
            placeholder="45"
            className="glass-input w-full text-center font-mono text-lg tracking-widest border-neon-emerald/30 focus:border-neon-emerald/50 focus:shadow-neon-emerald"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/50 font-semibold">Close Panel</label>
          <input
            type="text"
            maxLength={3}
            value={closePanel}
            onChange={e => setClosePanel(e.target.value.replace(/\D/g, '').slice(0,3))}
            placeholder="678"
            className="glass-input w-full text-center font-mono text-lg tracking-widest"
          />
        </div>
      </div>

      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 space-y-1"
        >
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-neon-rose font-medium">⚠ {e}</p>
          ))}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCalculate}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-emerald/20 border border-neon-cyan/40 text-neon-cyan font-bold uppercase tracking-widest hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2"
      >
        <Calculator size={20} />
        Execute Engine
      </motion.button>
    </GlassCard>
  );
}
