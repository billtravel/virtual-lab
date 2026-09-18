"use client";

import React from "react";

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
    <section className="max-w-5xl mx-auto space-y-6 text-gray-200 py-4 px-4">
      <header className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <p className="text-xs text-blue-300/80 font-mono tracking-widest mb-2">CHAPTER 1.4</p>
        <h2 className="text-2xl font-black tracking-wide mb-2 text-white">测量平均速度</h2>
        <p className="text-sm text-gray-300/80 leading-6">
          核心目标：掌握测量平均速度的实验原理、核心操作细节，能够独立完成数据记录与误差分析。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TheoryCard title="1. 实验原理与工具" tone="blue">
          <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-4 mb-4">
            <div className="text-2xl font-serif italic text-blue-200 font-bold text-center">$v = s/t$</div>
            <p className="text-center text-xs text-blue-200/60 mt-2">（路程与时间的比值）</p>
          </div>
          <p className="px-1">
            使用的主要测量工具：
            <span className="inline-flex px-2 py-1 mx-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-sm">刻度尺</span> 和
            <span className="inline-flex px-2 py-1 mx-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-sm">停表</span>。
          </p>
        </TheoryCard>

        <TheoryCard title="2. 实验核心细节" tone="amber">
          <ul className="space-y-3">
            <li className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <span className="text-amber-200 font-semibold mr-1">斜面坡度较小：</span>
              <span className="text-gray-300">
                目的是<span className="text-orange-400 font-bold underline decoration-orange-500/50 underline-offset-4">增长测量时间</span>，以减小测量时间的误差。
              </span>
            </li>
            <li className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <span className="text-amber-200 font-semibold mr-1">金属片的作用：</span>
              <span className="text-gray-300">使小车在同一位置停下，便于准确记录时间与路程。</span>
            </li>
          </ul>
        </TheoryCard>
      </div>

      <TheoryCard title="3. 实验结论" tone="emerald">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-emerald-100 mb-3">
            分析数据发现：小车上半程的平均速度 <span className="font-bold text-emerald-300 underline underline-offset-4">小于</span> 下半程的平均速度。
          </p>
          <div className="h-px w-full bg-emerald-500/20 my-3"></div>
          <p className="text-emerald-200 font-bold text-lg flex items-center gap-2">
            <span>🏁</span> 可见，小车在斜面上做 <span className="text-emerald-300 underline decoration-emerald-400 underline-offset-4 text-xl">变速直线运动</span>。
          </p>
        </div>
      </TheoryCard>

      <TheoryCard title="4. 易错点剖析" tone="red">
        <div className="flex flex-col gap-3">
          <p className="font-bold text-red-200 flex items-start gap-2">
            <span className="shrink-0 text-xl font-black">?</span>
            <span>测小车通过下半段路程的平均速度时，能否直接让小车从斜面中点静止释放？</span>
          </p>
          <p className="text-gray-200 font-bold ml-7">
            答：<span className="text-red-400 text-lg px-1">不能</span>。
          </p>
          <div className="ml-7 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm leading-6 text-red-100">
            <strong>原因：</strong> 如果我们从顶端释放小车，小车经过中点时已经有了初速度；而如果从中点静止释放，它在中点时的速度为零。所以这样
            <span className="font-bold text-red-300 underline underline-offset-4 px-1">
              所测的时间不是运动过程中真正的下半程时间
            </span>。
          </div>
        </div>
      </TheoryCard>
    </section>
  );
}
