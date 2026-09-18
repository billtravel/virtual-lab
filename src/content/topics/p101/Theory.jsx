"use client";

const LENGTH_UNITS = ["km", "m", "dm", "cm", "mm", "μm", "nm"];

const LENGTH_ESTIMATES = [
  "课桌高度约 0.75 m",
  "物理课本宽度约 18 cm",
  "物理课本长度约 20~30 cm",
  "一支铅笔长度约 20 cm",
  "成年人走两步约 1.5 m",
  "教室每层楼高约 3 m",
  "一页纸厚度约 0.1 mm",
];

const RULER_STEPS = [
  { title: "会选", text: "根据测量对象，选择合适量程和分度值的刻度尺。" },
  { title: "会看", text: "使用前观察零刻度、量程、分度值（决定精确程度）。" },
  { title: "会放", text: "零刻度线对齐被测物一端，尺面紧贴且与被测长度平行。" },
  { title: "会读", text: "视线与尺面垂直，读数估读到分度值下一位。" },
  { title: "会记", text: "记录必须包含数值与单位。" },
];

const SPECIAL_METHODS = [
  "累积法：测细铜丝直径、一页纸厚度等微小长度。",
  "尺规配合法：测硬币直径、乒乓球直径、圆锥高度。",
  "化曲为直法：用细线测地图铁路长度、圆周长。",
  "滚轮法：测操场周长、较长路径距离。",
];

const TIME_ESTIMATES = [
  "橡皮从课桌掉到地上约 0.4 s",
  "国歌演奏时长约 50 s",
  "普通中学生 100 m 成绩约 15 s",
  "脉搏 1 min 约 75 次",
];

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
        <p className="text-xs text-cyan-300/80 font-mono tracking-widest mb-2">CHAPTER 1.1</p>
        <h2 className="text-2xl font-black tracking-wide mb-2">长度和时间的测量</h2>
        <p className="text-sm text-gray-300 leading-6">
          核心目标：掌握长度与时间单位换算，规范使用刻度尺与停表，理解“误差”与“错误”的区别。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="📏" title="长度单位与换算" tone="cyan" />
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4 overflow-x-auto">
            <div className="min-w-[520px]">
              <div className="flex items-center gap-2 text-sm font-mono text-cyan-300 mb-2">
                {LENGTH_UNITS.map((u, idx) => (
                  <div key={u} className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10">{u}</span>
                    {idx < LENGTH_UNITS.length - 1 ? <span className="text-cyan-400/70">→</span> : null}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-6">
                相邻单位常见进率：m→dm→cm→mm 为 10 进制；mm→μm→nm 为 1000 进制；km→m 为 1000。
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h4 className="text-sm font-bold text-cyan-200 mb-2">常考长度估测</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300 leading-6">
              {LENGTH_ESTIMATES.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-white/3 px-3 py-1.5">{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="🧭" title="刻度尺规范使用（五步）" tone="indigo" />
          <ol className="space-y-2">
            {RULER_STEPS.map((item, idx) => (
              <li key={item.title} className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-sm leading-6">
                <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mr-2 align-middle">
                  {idx + 1}
                </span>
                <span className="text-indigo-200 font-semibold mr-1">{item.title}：</span>
                <span className="text-gray-300">{item.text}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-3.5 text-sm leading-6 text-amber-100">
            读数关键：分度值是 1 mm 时，记录应估读到下一位（即 0.1 mm，对应 cm 单位保留两位小数）。
          </div>
        </article>

        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="🧪" title="长度特殊测量方法" tone="emerald" />
          <ul className="space-y-2 text-sm text-gray-300 leading-6">
            {SPECIAL_METHODS.map((item) => (
              <li key={item} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
          <SectionTitle icon="⏱️" title="时间单位、工具与估测" tone="amber" />
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4">
            <p className="text-sm text-gray-200 leading-7 font-mono">
              1 h = 60 min，1 min = 60 s，1 h = 3600 s
            </p>
            <p className="text-sm text-gray-300 mt-2">常用工具：钟表、停表（秒表）。</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h4 className="text-sm font-bold text-amber-200 mb-2">常考时间估测</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300 leading-6">
              {TIME_ESTIMATES.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-white/3 px-3 py-1.5">{item}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4">
        <SectionTitle icon="🎯" title="误差与错误" tone="indigo" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/8 p-4">
            <h4 className="font-bold text-indigo-200 mb-2">误差（不可避免）</h4>
            <p className="text-sm text-gray-300 leading-6">
              由测量工具精度和测量方法限制引起，不能彻底消除，但可以减小。
            </p>
            <ul className="mt-2 text-sm text-gray-300 leading-6 list-disc pl-5">
              <li>多次测量取平均值</li>
              <li>使用更精密仪器</li>
              <li>改进测量方法</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/8 p-4">
            <h4 className="font-bold text-rose-200 mb-2">错误（可避免）</h4>
            <p className="text-sm text-gray-300 leading-6">
              由不规范操作、读数不当或记录粗心导致，可以通过规范步骤消除。
            </p>
            <p className="mt-2 text-sm text-gray-300 leading-6">
              例如：视线不垂直、单位漏写、记录位数不一致。
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-3">
        <SectionTitle icon="📝" title="典型题型提示" tone="cyan" />
        <ul className="space-y-2 text-sm text-gray-300 leading-6">
          <li className="rounded-lg border border-cyan-500/25 bg-cyan-500/8 px-3 py-2">
            圆柱体直径读数题：注意分度值是 1 mm 时，读数应体现估读位。
          </li>
          <li className="rounded-lg border border-cyan-500/25 bg-cyan-500/8 px-3 py-2">
            多次测量平均值题：先剔除明显错误数据，再按有效数字规则（四舍五入）保留结果。
          </li>
        </ul>
      </article>
    </section>
  );
}
