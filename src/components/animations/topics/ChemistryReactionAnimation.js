import { Atom } from 'lucide-react';

export default function ChemistryReactionAnimation({ progress = 30 }) {
  return (
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
      <div className="text-white/20 mb-6 flex flex-col items-center">
        <Atom size={64} className="text-orange-500/30 animate-pulse" />
        <span className="mt-4 font-mono text-sm tracking-widest">[ 化学反应动画 ]</span>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>

      <div
        className="absolute w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] bg-orange-400 text-orange-400"
        style={{
          top: `calc(50% + ${Math.sin(progress * Math.PI / 50) * 120}px)`,
          left: `calc(50% + ${Math.cos(progress * Math.PI / 50) * 120}px)`,
        }}
      ></div>
    </div>
  );
}
