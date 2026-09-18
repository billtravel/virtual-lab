"use client";

function Block({ title, children }) {
  return (
    <article className="rounded-2xl border border-white/12 bg-white/4 p-5 space-y-3">
      <h3 className="text-base font-bold text-cyan-200">{title}</h3>
      <div className="text-sm text-gray-300 leading-6">{children}</div>
    </article>
  );
}

export default function Theory() {
  return (
    <section className="space-y-6 text-gray-200">
      <header className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
        <p className="text-xs text-cyan-300/80 font-mono tracking-widest mb-2">CHAPTER 1.3</p>
        <h2 className="text-2xl font-black tracking-wide mb-2">运动的快慢</h2>
        <p className="text-sm text-gray-300 leading-6">
          核心目标：理解速度定义，学会用公式与图像比较物体运动快慢。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Block title="速度定义">
          在物理学中，速度用于表示物体运动的快慢。常用定义是单位时间内通过的路程。
        </Block>
        <Block title="基本公式">
          速度公式：v = s / t。其中国际单位制中，s 单位为 m，t 单位为 s，v 单位为 m/s。
        </Block>
      </div>
    </section>
  );
}
