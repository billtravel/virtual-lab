export default function LabFlaskPreview() {
  return (
    <div className="relative h-40 rounded-xl border border-orange-300/20 bg-orange-950/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(251,146,60,0.22),transparent_55%)]"></div>

      <div className="absolute left-1/2 top-5 h-7 w-4 -translate-x-1/2 rounded-t-md border border-orange-200/35 border-b-0"></div>
      <div className="absolute left-1/2 top-10 h-24 w-24 -translate-x-1/2 rounded-b-[40%] rounded-t-[30%] border border-orange-200/35 bg-orange-400/10"></div>

      <div className="chem-liquid-wave"></div>
      <span className="chem-bubble flask-bubble-1"></span>
      <span className="chem-bubble flask-bubble-2"></span>
      <span className="chem-bubble flask-bubble-3"></span>
    </div>
  );
}
