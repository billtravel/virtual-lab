export default function MoleculeOrbitPreview() {
  return (
    <div className="relative h-40 rounded-xl border border-orange-300/20 bg-orange-950/30 overflow-hidden">
      <div className="chem-orbit orbit-1"></div>
      <div className="chem-orbit orbit-2"></div>
      <div className="chem-core"></div>
      <span className="chem-electron electron-a"></span>
      <span className="chem-electron electron-b"></span>
      <span className="chem-bubble bubble-1"></span>
      <span className="chem-bubble bubble-2"></span>
      <span className="chem-bubble bubble-3"></span>
    </div>
  );
}
