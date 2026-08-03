'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InputControlCenter } from './components/InputControlCenter';
import { PyramidVisualizer } from './components/PyramidVisualizer';
import { LiveReportViewer } from './components/LiveReportViewer';
import { ExportStorageTools } from './components/ExportStorageTools';
import { processMatka, MatkaInput, MatkaResult } from './lib/matkaEngine';
import { Activity } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<MatkaResult | null>(null);

  const handleCalculate = (input: MatkaInput) => {
    const res = processMatka(input);
    setResult(res);
  };

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-3 mb-2">
          <Activity className="text-neon-cyan" size={32} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            MATKA <span className="text-neon-cyan neon-text-cyan">ENGINE</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm uppercase tracking-[0.3em]">Advanced Prediction Dashboard</p>
      </motion.div>

      <div className="mb-8">
        <InputControlCenter onCalculate={handleCalculate} />
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <PyramidVisualizer
            steps={result.pyramidSteps}
            finalDigit={result.finalOtcDigit}
            otcSequence={result.otcSequence}
            removedDigit={result.removedOtcDigit}
            otcPool={result.otcPool}
          />
          <LiveReportViewer result={result} />
        </motion.div>
      )}

      <div className="mb-12">
        <ExportStorageTools result={result} />
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-white/20 text-xs uppercase tracking-widest py-8 border-t border-white/5"
      >
        Matka Advanced Engine &bull; Built with Next.js & Framer Motion
      </motion.footer>
    </main>
  );
}
