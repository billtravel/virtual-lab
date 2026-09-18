"use client";

function SectionTitle({ icon, title, tone = "cyan" }) {
  const toneMap = {
    cyan: "text-cyan-300 border-cyan-500/35 bg-cyan-500/10",
    indigo: "text-indigo-300 border-indigo-500/35 bg-indigo-500/10",
    emerald: "text-emerald-300 border-emerald-500/35 bg-emerald-500/10",
    amber: "text-amber-300 border-amber-500/35 bg-amber-500/10",
  };

  return (
    <div className={`rounded-xl border px-4 py-2.5 font-bold tracking-wide flex items-center gap-2 ${toneMap[tone] || toneMap.cyan}`}>
      <span>{icon}</span>
      <h3>{title}</h3>
    </div>
  );
}

export default function Theory() {
  return (
    <section className="space-y-6 text-gray-200">
      <header className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
        <p className="text-xs text-cyan-300/80 font-mono tracking-widest mb-2">CHAPTER 1.2</p>
        <h2 className="text-2xl font-black tracking-wide mb-2">运动的描述</h2>
        <p className="text-sm text-gray-300 leading-6">
          核心目标：理解机械运动的概念，掌握参照物的选择方法，领悟运动和静止的相对性。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="🚀" title="机械运动" tone="cyan" />
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4">
            <p className="text-base text-gray-200 leading-7">
              在物理学中，我们把<span className="text-cyan-300 font-bold">物体相对于另一个物体位置随时间的变化</span>叫做机械运动。
            </p>
            <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/5 text-sm text-gray-400">
              💡 机械运动是宇宙中最普遍的现象，绝对静止的物体是不存在的。
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="📍" title="参照物" tone="indigo" />
          <div className="space-y-3">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="text-sm leading-6">
                <span className="text-indigo-300 font-bold">定义：</span>研究物体运动时，被选作标准的物体。
              </p>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">●</span>
                <span>参照物的选择是<span className="text-white font-medium">任意</span>的，但不能选研究对象本身。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">●</span>
                <span>一旦选定，该物体即被假定为<span className="text-white font-medium">静止</span>。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">●</span>
                <span>通常选<span className="text-white font-medium">地面</span>作为参照物。</span>
              </li>
            </ul>
          </div>
        </article>

        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="⚖️" title="运动和静止的相对性" tone="emerald" />
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-6">
              判断物体运动或静止，取决于所选的<span className="text-emerald-300 font-bold">参照物</span>。
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <h4 className="text-xs font-bold text-emerald-200 mb-1 uppercase tracking-wider">典型应用</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• 空中加油：两机保持相对静止</li>
                  <li>• 接力赛：交接棒时保持相对静止</li>
                  <li>• 航天器对接：调整速度实现相对静止</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="🧮" title="数学模型与演示说明" tone="amber" />
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4">
            <h4 className="text-sm font-bold text-amber-200 mb-2">相对速度计算</h4>
            <div className="bg-black/40 py-2 px-3 rounded text-center font-mono text-amber-300 border border-white/5 text-lg mb-2">
              v_相对 = v_物 - v_参照
            </div>
            <p className="text-xs text-gray-400">
              若 v_相对 = 0，表示两者相对静止；若 v_相对 {'>'}0，表示物体沿正方向远离参照物。
            </p>
          </div>
        </article>
      </div>

      <footer className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
        <p className="text-sm text-cyan-200/80 italic">
          "小小竹排江中游，巍巍青山两岸走" —— 蕴含了丰富的运动相对性原理。
        </p>
      </footer>
    </section>
  );
}
