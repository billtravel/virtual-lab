export default function PendulumWavePreview() {
  return (
    <div className="relative h-40 rounded-xl border border-blue-300/20 bg-blue-950/30 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-10 w-[2px] bg-blue-200/60"></div>
      <div className="physics-pendulum absolute top-10 left-1/2 -translate-x-1/2 origin-top animate-bounce">
        <div className="h-16 w-[2px] bg-blue-200/70"></div>
        <div className="h-5 w-5 -ml-[9px] rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.8)]"></div>
      </div>
      <div className="absolute inset-x-4 bottom-4 h-10">
        <div className="physics-wave animate-pulse"></div>
      </div>
    </div>
  );
}
