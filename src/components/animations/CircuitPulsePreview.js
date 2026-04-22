export default function CircuitPulsePreview() {
  return (
    <div className="relative h-40 rounded-xl border border-blue-300/20 bg-blue-950/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_55%)]"></div>

      <div className="absolute left-5 right-5 top-10 h-[2px] bg-blue-200/40"></div>
      <div className="absolute left-5 right-5 bottom-10 h-[2px] bg-blue-200/40"></div>
      <div className="absolute top-10 bottom-10 left-5 w-[2px] bg-blue-200/40"></div>
      <div className="absolute top-10 bottom-10 right-5 w-[2px] bg-blue-200/40"></div>

      <div className="absolute left-8 top-8 h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]"></div>
      <div className="absolute right-8 bottom-8 h-4 w-4 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(147,197,253,0.8)]"></div>

      <div className="physics-pulse-dot pulse-track-a"></div>
      <div className="physics-pulse-dot pulse-track-b"></div>
      <div className="physics-pulse-dot pulse-track-c"></div>
    </div>
  );
}
