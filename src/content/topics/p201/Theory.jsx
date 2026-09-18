"use client";

const TheoryCard = ({ title, children, tone = "blue" }) => {
  const tones = {
    blue: "border-blue-500/20 bg-blue-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
    indigo: "border-indigo-500/20 bg-indigo-500/5",
    red: "border-red-500/20 bg-red-500/5",
  };
  const titleTones = {
    blue: "text-blue-300",
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    indigo: "text-indigo-300",
    red: "text-red-300",
  };

  return (
    <article className={`rounded-2xl border border-white/12 bg-white/4 p-5 space-y-4`}>
      <div className="flex items-center gap-2 mb-2">
        <h3 className={`text-xl font-bold tracking-wide ${titleTones[tone]}`}>{title}</h3>
      </div>
      <div className="text-gray-300 leading-relaxed text-sm lg:text-base space-y-3">
        {children}
      </div>
    </article>
  );
};

export default function Theory() {
  return (
    <section className="space-y-6 text-gray-200">
      <header className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
        <p className="text-xs text-cyan-300/80 font-mono tracking-widest mb-2">CHAPTER 2.1</p>
        <h2 className="text-2xl font-black tracking-wide mb-2">声音的产生与传播</h2>
        <p className="text-sm text-gray-300 leading-6">
          核心目标：认识声音的产生条件，理解声音传播的介质要求及规律，掌握声速特性和回声测距原理。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TheoryCard title="🎙️ 声音的产生" tone="blue">
          <ul className="space-y-2 list-disc pl-5 marker:text-blue-400">
            <li>
              <strong className="text-blue-200">一切发声的物体都在振动。</strong>用手按住发声的音叉，发声也停止，说明<strong className="text-blue-200">振动停止，发声也停止</strong>。
            </li>
            <li>
              <strong className="text-blue-200">声源：</strong>正在发声的物体。
            </li>
          </ul>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-sm mt-3">
            <span className="font-bold text-blue-300 flex items-center gap-1">
              <span className="w-1 h-3 bg-blue-400 rounded-full inline-block"></span>
              易错点注意
            </span>
            <ol className="list-decimal pl-4 mt-2 space-y-1 text-gray-300">
              <li>一切发声的物体都在振动，有物体振动但<strong className="text-white">不一定</strong>能够听到声音（如在真空中振动，或振动频率在人耳听觉范围外）。</li>
              <li>振动停止发声也停止，但声音<strong className="text-white">不一定</strong>立即停止传到人耳。</li>
              <li>将悬挂的乒乓球靠近发声的音叉，乒乓球被多次弹开。目的：<strong className="text-blue-200">把音叉的微小振动放大，便于观察——转换法</strong>。</li>
            </ol>
          </div>
        </TheoryCard>

        <TheoryCard title="🌊 声音的传播" tone="emerald">
          <ul className="space-y-2 list-disc pl-5 marker:text-emerald-400">
            <li>
              <strong className="text-emerald-200">传播条件：</strong>声音的传播需要<strong className="text-emerald-200">介质</strong>，固体、液体、气体都可以传声。
            </li>
            <li>
              <strong className="text-emerald-200">真空不能传声：</strong>用抽气机抽出钟罩内空气，能看到闹铃小锤振动，但听到的音乐声会逐渐减小。如果完全抽出将听不到声音。<br/>
              <span className="text-sm text-emerald-300/80 mt-1 block">➥ 物理方法：<strong className="text-emerald-300">理想实验法（科学推理法）</strong>。</span>
            </li>
            <li>
              <strong className="text-emerald-200">应用实例：</strong>月球上没有空气（真空），宇航员即使相距很近也要靠<strong className="textemerald-200 border-b border-emerald-500/50">无线电</strong>交谈。
            </li>
            <li>
              <strong className="text-emerald-200">传播形式：</strong>声波。
            </li>
          </ul>
        </TheoryCard>

        <TheoryCard title="🚀 声速的大小" tone="amber">
          <ul className="space-y-2 list-disc pl-5 marker:text-amber-400">
            <li>
              声速的大小等于<strong className="text-amber-200">声音在每秒内传播的距离</strong>。
            </li>
            <li>
              <strong className="text-amber-200">传播速度对比：</strong>一般情况下，<strong className="text-amber-200 font-mono tracking-wider bg-black/20 px-2 py-0.5 rounded">v固 &gt; v液 &gt; v气</strong>。
            </li>
            <li>
              <strong className="text-amber-200">重要常数：</strong>声音在 15℃ 空气中的传播速度是 <strong className="text-amber-200">340m/s</strong> （合 1224km/h），在真空中的传播速度为 <strong className="text-amber-200">0m/s</strong>。
            </li>
            <li>
              <strong className="text-amber-200">影响因素：</strong>声速的大小跟<strong className="text-white">介质的种类</strong>和<strong className="text-white">温度</strong>有关。同一种介质传声，温度越高，传播声音越快。
            </li>
          </ul>
        </TheoryCard>

        <TheoryCard title="⛰️ 回声与听声方式" tone="indigo">
          <ul className="space-y-2 list-disc pl-5 marker:text-indigo-400">
            <li>
              <strong className="text-indigo-200">听声方式：</strong><strong className="text-white">空气传导</strong> 和 <strong className="text-white">骨传导</strong>。
            </li>
            <li>
              <strong className="text-indigo-200">回声：</strong>由于声音在传播过程中<strong className="text-white">遇到障碍物被反射回来</strong>形成的。
            </li>
            <li>
              <strong className="text-indigo-200">原声与回声区分：</strong>回声到达人耳需比原声晚 <strong className="text-indigo-200">0.1s</strong> 以上才能区分开。此时人距障碍物至少 <strong className="text-indigo-200">17m</strong>。<br/>
              <span className="text-sm text-indigo-300/80">（在小房间听起来响亮，是因为时间差不足 0.1s，回声使原声加强。）</span>
            </li>
          </ul>
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-sm mt-3">
            <span className="font-bold text-indigo-300 flex items-center gap-1">
              <span className="w-1 h-3 bg-indigo-400 rounded-full inline-block"></span>
              回声测距怎么算？
            </span>
            <p className="mt-2 text-gray-300">
              测量发出声音到信号反射回来的时间 <code className="text-pink-300 font-mono bg-black/30 py-0.5 px-2 rounded mx-1">t</code>，以及声音在介质中的传播速度 <code className="text-pink-300 font-mono bg-black/30 py-0.5 px-2 rounded mx-1">v</code>，则发声点距物体的距离：
            </p>
            <div className="text-center mt-2">
              <code className="text-lg text-purple-300 font-mono bg-black/40 py-1 px-4 rounded border border-white/5 shadow-inner">
                s = v × ( t / 2 )
              </code>
            </div>
            <p className="text-xs text-indigo-300/60 mt-2 text-center text-balance">(深海测距、潜水艇定位常用)</p>
          </div>
        </TheoryCard>
      </div>
    </section>
  );
}