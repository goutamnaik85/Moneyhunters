'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { MatkaResult } from '../lib/matkaEngine';
import { Copy, Download, History, X, Trash2 } from 'lucide-react';

interface HistoryItem {
  id: string;
  timestamp: string;
  input: { openPanel: string; jodi: string; closePanel: string };
  top8: string[];
}

function resultToText(result: MatkaResult): string {
  return `
SATTA MATKA ADVANCED REPORT
Generated: ${new Date().toLocaleString()}
----------------------------
INPUT
Open Panel   ${result.openPanel}
Jodi         ${result.jodi}
Close Panel  ${result.closePanel}

OTC 888 PYRAMID
Final Digit  ${result.finalOtcDigit}
Sequence     ${result.otcSequence.join('-')}
Removed      ${result.removedOtcDigit}
OTC Pool     ${result.otcPool.join(', ')}

CUT ANKS
Open Cuts    ${result.openCuts.join(', ')}
Close Cuts   ${result.closeCuts.join(', ')}
Global Cuts  ${result.globalCuts.join(', ')}

FINAL POOLS
Open Final   ${result.openDigitsFinal.join(', ')}
Close Final  ${result.closeDigitsFinal.join(', ')}

PREDICTIONS
Strong Jodis ${result.strongJodis.join(', ')}
Top 8        ${result.top8Predictions.join(', ')}
`.trim();
}

export function ExportStorageTools({ result }: { result: MatkaResult | null }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('matka-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (result) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        input: { openPanel: result.openPanel, jodi: result.jodi, closePanel: result.closePanel },
        top8: result.top8Predictions
      };
      setHistory(prev => {
        const next = [newItem, ...prev].slice(0, 50);
        localStorage.setItem('matka-history', JSON.stringify(next));
        return next;
      });
    }
  }, [result?.openPanel, result?.jodi, result?.closePanel]);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(resultToText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!result) return;
    const blob = new Blob([resultToText(result)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matka-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('matka-history');
  };

  return (
    <div className="w-full space-y-4">
      <GlassCard className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white/80 tracking-wider uppercase">Export & Storage</h2>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-violet/10 border border-neon-violet/30 text-neon-violet text-sm font-medium hover:bg-neon-violet/20 transition-colors"
            >
              <History size={16} />
              History ({history.length})
            </motion.button>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyToClipboard}
            disabled={!result}
            className="flex-1 py-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-medium hover:bg-neon-cyan/20 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <Copy size={18} />
            {copied ? 'Copied!' : 'Copy Report'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadTxt}
            disabled={!result}
            className="flex-1 py-3 rounded-xl bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald font-medium hover:bg-neon-emerald/20 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <Download size={18} />
            Export .txt
          </motion.button>
        </div>
      </GlassCard>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="w-full max-h-[400px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Calculation History</h3>
                <div className="flex gap-2">
                  <button onClick={clearHistory} className="p-1.5 rounded text-neon-rose hover:bg-neon-rose/10 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => setShowHistory(false)} className="p-1.5 rounded text-white/40 hover:bg-white/5 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-white/30 text-center py-8">No history yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/30 mb-1">{item.timestamp}</p>
                        <p className="font-mono text-sm text-white">
                          {item.input.openPanel} <span className="text-neon-cyan">{item.input.jodi}</span> {item.input.closePanel}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {item.top8.slice(0, 4).map(j => (
                          <span key={j} className="px-2 py-1 rounded bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald font-mono text-xs">
                            {j}
                          </span>
                        ))}
                        {item.top8.length > 4 && <span className="text-white/30 text-xs py-1">+{item.top8.length - 4}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
