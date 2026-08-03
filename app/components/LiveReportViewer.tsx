'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { MatkaResult } from '../lib/matkaEngine';

interface Props {
  result: MatkaResult | null;
}

function Section({ title, children, color = 'cyan' }: { title: string; children: React.ReactNode; color?: 'emerald' | 'cyan' | 'violet' | 'rose' | 'amber' }) {
  const colorMap = {
    emerald: 'text-neon-emerald border-neon-emerald/20',
    cyan: 'text-neon-cyan border-neon-cyan/20',
    violet: 'text-neon-violet border-neon-violet/20',
    rose: 'text-neon-rose border-neon-rose/20',
    amber: 'text-neon-amber border-neon-amber/20'
  };

  return (
    <div className={`p-4 rounded-xl bg-white/[0.02] border ${colorMap[color]} mb-4`}>
      <h3 className={`text-xs uppercase tracking-widest font-bold mb-3 opacity-80 ${colorMap[color].split(' ')[0]}`}>{title}</h3>
      {children}
    </div>
  );
}

function DigitBadge({ d, type = 'default' }: { d: number; type?: 'cut' | 'global' | 'default' }) {
  const styles = {
    default: 'bg-white/5 border-white/10 text-white',
    cut: 'bg-neon-amber/10 border-neon-amber/30 text-neon-amber',
    global: 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose'
  };
  return (
    <span className={`inline-flex w-8 h-8 items-center justify-center rounded-lg border font-mono font-bold text-sm mr-2 mb-2 ${styles[type]}`}>
      {d}
    </span>
  );
}

function JodiBadge({ j, strong = false }: { j: string; strong?: boolean }) {
  return (
    <span className={`inline-flex px-3 py-1 rounded-lg border font-mono font-bold text-sm mr-2 mb-2
      ${strong 
        ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald shadow-neon-emerald' 
        : 'bg-white/5 border-white/10 text-white/70'}`}>
      {j}
    </span>
  );
}

export function LiveReportViewer({ result }: Props) {
  if (!result) {
    return (
      <GlassCard className="w-full min-h-[200px] flex items-center justify-center text-white/30">
        <p className="uppercase tracking-widest text-sm">Awaiting Engine Input...</p>
      </GlassCard>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <GlassCard glow="emerald" className="w-full">
      <h2 className="text-xl font-bold text-neon-emerald neon-text-emerald tracking-wider uppercase mb-6">
        Dynamic Live Report
      </h2>

      <motion.div variants={container} initial="hidden" animate="show">
        <Section title="Input Summary" color="cyan">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">Open Panel</p>
              <p className="font-mono text-2xl font-bold text-white tracking-widest">{result.openPanel}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">Jodi</p>
              <p className="font-mono text-2xl font-bold text-neon-cyan tracking-widest">{result.jodi}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">Close Panel</p>
              <p className="font-mono text-2xl font-bold text-white tracking-widest">{result.closePanel}</p>
            </div>
          </div>
        </Section>

        <Section title="Digit Pools" color="violet">
          <div className="mb-3">
            <p className="text-[10px] uppercase text-white/30 mb-2">Open Digits</p>
            <div>{result.openDigits.map(d => <DigitBadge key={`o-${d}`} d={d} />)}</div>
          </div>
          <div className="mb-3">
            <p className="text-[10px] uppercase text-white/30 mb-2">Close Digits</p>
            <div>{result.closeDigits.map(d => <DigitBadge key={`c-${d}`} d={d} />)}</div>
          </div>
          <div>
            <p className="text-[10px] uppercase text-white/30 mb-2">Missing Digits</p>
            <div>{result.missingDigits.map(d => <DigitBadge key={`m-${d}`} d={d} type="default" />)}</div>
          </div>
        </Section>

        <Section title="Jodi Generation" color="amber">
          <div className="mb-3">
            <p className="text-[10px] uppercase text-white/30 mb-2">Initial Jodis ({result.initialJodis.length})</p>
            <div className="flex flex-wrap">
              {result.initialJodis.slice(0, 20).map(j => <JodiBadge key={j} j={j} />)}
              {result.initialJodis.length > 20 && <span className="text-white/30 text-sm py-1">+{result.initialJodis.length - 20} more</span>}
            </div>
          </div>
          {result.redJodisRemoved.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] uppercase text-neon-rose mb-2">Red Jodis Removed ({result.redJodisRemoved.length})</p>
              <div className="flex flex-wrap">
                {result.redJodisRemoved.map(j => <span key={j} className="inline-flex px-2 py-1 rounded border border-neon-rose/20 text-neon-rose/60 font-mono text-xs mr-2 mb-2 line-through">{j}</span>)}
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase text-white/30 mb-2">After Red Removal ({result.jodisAfterRedRemoval.length})</p>
            <div className="flex flex-wrap">
              {result.jodisAfterRedRemoval.slice(0, 20).map(j => <JodiBadge key={j} j={j} />)}
              {result.jodisAfterRedRemoval.length > 20 && <span className="text-white/30 text-sm py-1">+{result.jodisAfterRedRemoval.length - 20} more</span>}
            </div>
          </div>
        </Section>

        <Section title="Cut Anks Analysis" color="rose">
          <div className="mb-3">
            <p className="text-[10px] uppercase text-white/30 mb-2">Open Cuts</p>
            <div>{result.openCuts.map(d => <DigitBadge key={`oc-${d}`} d={d} type="cut" />)}</div>
          </div>
          <div className="mb-3">
            <p className="text-[10px] uppercase text-white/30 mb-2">Close Cuts</p>
            <div>{result.closeCuts.map(d => <DigitBadge key={`cc-${d}`} d={d} type="cut" />)}</div>
          </div>
          <div className="mb-3">
            <p className="text-[10px] uppercase text-neon-rose mb-2">Global Cuts (Rules 15-17)</p>
            <div>{result.globalCuts.map(d => <DigitBadge key={`gc-${d}`} d={d} type="global" />)}</div>
          </div>
          <div className="p-3 rounded-lg bg-neon-rose/5 border border-neon-rose/10">
            <p className="text-[10px] uppercase text-neon-rose mb-1">Enforcement Notice</p>
            <p className="text-xs text-white/60">
              Digits {result.rules15_16_17_digits.join(', ')} eliminated from both Open & Close pools.
            </p>
          </div>
        </Section>

        <Section title="Final Filtered Pools" color="cyan">
          <div className="mb-3">
            <p className="text-[10px] uppercase text-white/30 mb-2">Open Digits Final</p>
            <div>{result.openDigitsFinal.map(d => <DigitBadge key={`of-${d}`} d={d} />)}</div>
          </div>
          <div>
            <p className="text-[10px] uppercase text-white/30 mb-2">Close Digits Final</p>
            <div>{result.closeDigitsFinal.map(d => <DigitBadge key={`cf-${d}`} d={d} />)}</div>
          </div>
        </Section>

        <Section title="Final Predictions" color="emerald">
          <div className="mb-4">
            <p className="text-[10px] uppercase text-white/30 mb-2">Filtered Jodis ({result.filteredJodis.length})</p>
            <div className="flex flex-wrap">
              {result.filteredJodis.map(j => <JodiBadge key={j} j={j} />)}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-[10px] uppercase text-neon-emerald mb-2">Strong Jodis ({result.strongJodis.length})</p>
            <div className="flex flex-wrap">
              {result.strongJodis.map(j => <JodiBadge key={j} j={j} strong />)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-neon-emerald/10 to-neon-cyan/10 border border-neon-emerald/30">
            <p className="text-[10px] uppercase text-neon-emerald mb-3 tracking-widest font-bold">Top 8 Predictions</p>
            <div className="flex flex-wrap gap-3">
              {result.top8Predictions.map((j, i) => (
                <motion.div
                  key={j}
                  variants={item}
                  className="w-14 h-14 rounded-xl bg-black/40 border border-neon-emerald/40 flex flex-col items-center justify-center shadow-neon-emerald"
                >
                  <span className="text-[9px] text-white/40">#{i+1}</span>
                  <span className="font-mono font-bold text-lg text-neon-emerald">{j}</span>
                </motion.div>
              ))}
              {result.top8Predictions.length === 0 && (
                <p className="text-sm text-white/30">Insufficient data for Top 8</p>
              )}
            </div>
          </div>
        </Section>
      </motion.div>
    </GlassCard>
  );
}
