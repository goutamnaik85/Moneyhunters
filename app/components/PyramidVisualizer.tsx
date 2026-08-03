'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { PyramidStep } from '../lib/matkaEngine';

interface Props {
  steps: PyramidStep[];
  finalDigit: number;
  otcSequence: number[];
  removedDigit: number;
  otcPool: number[];
}

export function PyramidVisualizer({ steps, finalDigit, otcSequence, removedDigit, otcPool }: Props) {
  return (
    <GlassCard glow="violet" className="w-full">
      <h2 className="text-xl font-bold text-neon-violet neon-text-violet tracking-wider uppercase mb-6">
        888 Pyramid Visualizer
      </h2>

      <div className="flex flex-col items-center gap-3 mb-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15 }}
            className="flex gap-3"
          >
            {step.values.map((v, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg
                  ${idx === steps.length - 1 
                    ? 'bg-neon-violet/20 border-2 border-neon-violet text-neon-violet shadow-neon-violet' 
                    : 'bg-white/5 border border-white/10 text-white/80'}`}
              >
                {v}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neon-violet/5 border border-neon-violet/20 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Final OTC Digit</p>
          <p className="text-3xl font-mono font-bold text-neon-violet">{finalDigit}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center col-span-2">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">OTC Sequence (X-1 to X+3)</p>
          <div className="flex justify-center gap-2 mt-2">
            {otcSequence.map((d, i) => (
              <div key={i} className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold
                ${i === 1 ? 'bg-neon-rose/20 border border-neon-rose text-neon-rose line-through opacity-50' : 'bg-neon-emerald/20 border border-neon-emerald text-neon-emerald'}`}>
                {d}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-neon-rose/5 border border-neon-rose/20 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Removed</p>
          <p className="text-3xl font-mono font-bold text-neon-rose">{removedDigit}</p>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-neon-emerald/5 border border-neon-emerald/20 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-white/40">Final OTC Pool</span>
        <div className="flex gap-3">
          {otcPool.map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="w-10 h-10 rounded-lg bg-neon-emerald/20 border border-neon-emerald text-neon-emerald flex items-center justify-center font-mono font-bold text-lg shadow-neon-emerald"
            >
              {d}
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
