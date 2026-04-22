"use client";

import React, { useState } from 'react';

// ==========================================
// 主页面组件：光的直线传播知识点汇总
// ==========================================
export default function LightPropagationNotes() {
  const [activeTip, setActiveTip] = useState(null);

  return (
    <div className="relative font-sans text-gray-200 selection:bg-cyan-500/30">

      {/* 核心内容区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ==========================================
            模块 1：光源 (Light Source) 
            ========================================== */}
        <section className="bg-white/4 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group hover:border-yellow-500/40 transition-colors">
          <div className="bg-yellow-500/10 border-b border-white/8 px-5 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-yellow-500/20 rounded-lg text-yellow-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-100 tracking-wide">一、光源</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-gray-300 text-sm">
              <span className="font-mono text-yellow-400 mr-2">[定义]</span>
              <strong className="text-white text-base">能够发光的物体</strong> 叫光源。
            </div>

            {/* 易错点互动卡片 */}
            <div className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-0.5 h-full bg-linear-to-b from-rose-500 to-rose-500/30"></div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">易错预警</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                月亮看起来很亮，但它只是反射太阳的光，<strong className="text-rose-400 border-b border-rose-400/40 pb-0.5">月亮本身不会发光，所以它不是光源！</strong>
              </p>
              <div className="flex gap-3 mt-3">
                <div className="flex-1 bg-black/30 border border-white/10 rounded-lg p-2.5 text-center flex flex-col items-center gap-1.5">
                  <span className="text-xl">🌞</span>
                  <span className="text-[11px] text-green-400">太阳 (是光源)</span>
                </div>
                <div className="flex-1 bg-black/30 border border-rose-900/40 rounded-lg p-2.5 text-center flex flex-col items-center gap-1.5 relative">
                  <div className="absolute inset-0 border border-rose-500/40 rounded-lg animate-pulse pointer-events-none"></div>
                  <span className="text-xl">🌙</span>
                  <span className="text-[11px] text-rose-400">月亮 (不是光源)</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ==========================================
            模块 2：光的直线传播规律
            ========================================== */}
        <section className="bg-white/4 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="bg-cyan-500/10 border-b border-white/8 px-5 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-cyan-500/20 rounded-lg text-cyan-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-100 tracking-wide">二、直线传播规律</h2>
          </div>
          <div className="p-5 space-y-4">

            {/* 核心定律展示 */}
            <div className="bg-black/30 p-4 rounded-xl border border-cyan-900/40 relative overflow-hidden text-center py-5">
              <div className="absolute inset-0 bg-cyan-500/3"></div>
              {/* CSS 光束动画 */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(6,182,212,1)] animate-ray-move opacity-40"></div>
              <p className="text-sm text-gray-200 relative z-10 leading-relaxed font-medium">
                光在<strong className="text-cyan-400 px-0.5 text-base">同一种均匀介质</strong>中<br />是沿直线传播的。
              </p>
            </div>

            {/* 点拨区域 (手风琴交互) */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-cyan-500 tracking-widest border-b border-white/8 pb-1 mb-2">【专家点拨】</div>

              <button onClick={() => setActiveTip(activeTip === 1 ? null : 1)} className="w-full text-left bg-white/3 hover:bg-white/6 border border-white/10 rounded-lg p-3 flex justify-between items-center transition-colors">
                <span className="text-sm text-gray-300">💡 怎样清晰地观察光路？</span>
                <span className="text-cyan-400 text-sm">{activeTip === 1 ? '−' : '+'}</span>
              </button>
              {activeTip === 1 && (
                <div className="p-3 bg-cyan-900/10 border-l-2 border-cyan-500 text-sm text-gray-400 rounded-r-lg animate-fade-in-down">
                  ① 实验最好在**较黑暗的环境**下进行。<br />
                  ② 显示光路的方法：在空气中**喷水雾、点燃蚊香**，在液体中滴入**几滴牛奶**等（利用漫反射让光路显现）。
                </div>
              )}

              <button onClick={() => setActiveTip(activeTip === 2 ? null : 2)} className="w-full text-left bg-white/3 hover:bg-white/6 border border-white/10 rounded-lg p-3 flex justify-between items-center transition-colors">
                <span className="text-sm text-gray-300">💡 光线真的存在吗？</span>
                <span className="text-cyan-400 text-sm">{activeTip === 2 ? '−' : '+'}</span>
              </button>
              {activeTip === 2 && (
                <div className="p-3 bg-cyan-900/10 border-l-2 border-cyan-500 text-sm text-gray-400 rounded-r-lg animate-fade-in-down">
                  光线实际上是**不存在的**！它是由一小束光抽象而建立的<strong className="text-cyan-300">理想物理模型</strong>。建立理想物理模型是研究物理的常用方法之一。
                </div>
              )}
            </div>

          </div>
        </section>


        {/* ==========================================
            模块 3：现象与应用
            ========================================== */}
        <section className="bg-white/4 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden md:col-span-2 group hover:border-indigo-500/40 transition-colors">
          <div className="bg-indigo-500/10 border-b border-white/8 px-5 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-100 tracking-wide">三、光沿直线传播的现象及应用</h2>
          </div>

          <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-3">

            {/* 小孔成像 */}
            <div className="bg-black/20 border border-white/8 rounded-xl p-3.5 flex flex-col items-center text-center hover:bg-white/4 hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center mb-2.5">
                <span className="text-lg">📸</span>
              </div>
              <h3 className="font-bold text-gray-200 text-sm mb-1.5">小孔成像</h3>
              <p className="text-[11px] text-gray-400">
                形成<strong className="text-indigo-400">倒立实像</strong>。<br />
                <span className="opacity-80 mt-0.5 block">实像的形状与小孔形状无关，只与物体的形状有关。</span>
              </p>
            </div>

            {/* 影子 */}
            <div className="bg-black/20 border border-white/8 rounded-xl p-3.5 flex flex-col items-center text-center hover:bg-white/4 hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center mb-2.5">
                <span className="text-lg">👤</span>
              </div>
              <h3 className="font-bold text-gray-200 text-sm mb-1.5">影子的形成</h3>
              <p className="text-[11px] text-gray-400">
                光被不透明物体挡住后，在后面形成的暗区。
              </p>
            </div>

            {/* 日食月食 */}
            <div className="bg-black/20 border border-white/8 rounded-xl p-3.5 flex flex-col items-center text-center hover:bg-white/4 hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center mb-2.5">
                <span className="text-lg">🌘</span>
              </div>
              <h3 className="font-bold text-gray-200 text-sm mb-1.5">日食、月食</h3>
              <p className="text-[11px] text-gray-400">
                天体运行时的遮挡现象。日食是月球挡住了太阳。
              </p>
            </div>

            {/* 激光准直 */}
            <div className="bg-black/20 border border-white/8 rounded-xl p-3.5 flex flex-col items-center text-center hover:bg-white/4 hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center mb-2.5">
                <span className="text-lg">🎯</span>
              </div>
              <h3 className="font-bold text-gray-200 text-sm mb-1.5">激光准直</h3>
              <p className="text-[11px] text-gray-400">
                利用激光极好的方向性，用于隧道掘进等工程对齐。
              </p>
            </div>

          </div>
        </section>


        {/* ==========================================
            模块 4：光速与光年
            ========================================== */}
        <section className="bg-white/4 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden md:col-span-2 group hover:border-pink-500/40 transition-colors">
          <div className="bg-pink-500/10 border-b border-white/8 px-5 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-pink-500/20 rounded-lg text-pink-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-100 tracking-wide">四、光速与光年</h2>
          </div>

          <div className="p-5 flex flex-col md:flex-row gap-5">

            {/* 光速柱状图数据可视化 */}
            <div className="flex-3 bg-black/25 p-4 rounded-xl border border-white/8">
              <div className="flex justify-between items-end mb-3 border-b border-white/8 pb-2">
                <span className="text-sm text-gray-400 font-bold">不同介质中的光速对比</span>
                <span className="text-[11px] font-mono text-pink-500">C = 3×10⁸ m/s</span>
              </div>

              <div className="space-y-3.5">
                {/* 真空/空气 */}
                <div className="relative">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-300">真空 / 空气 (近似)</span>
                    <span className="font-mono text-pink-400">3×10⁸ m/s (C)</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-pink-600 to-pink-400 rounded-full w-full shadow-[0_0_8px_rgba(244,114,182,0.6)]"></div>
                  </div>
                </div>

                {/* 水中 */}
                <div className="relative">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-300">水中</span>
                    <span className="font-mono text-blue-400">约 3/4 C</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[75%]"></div>
                  </div>
                </div>

                {/* 玻璃中 */}
                <div className="relative">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-300">玻璃中</span>
                    <span className="font-mono text-amber-400">约 2/3 C</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[66.6%]"></div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 mt-3 font-mono">
                * 换算: 3×10⁸ m/s = 3×10⁵ km/s
              </p>
            </div>

            {/* 拓展：光年 */}
            <div className="flex-2 bg-linear-to-br from-indigo-900/20 to-purple-900/20 p-4 rounded-xl border border-purple-500/20 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -right-4 -top-4 text-6xl opacity-10">🌌</div>
              <div className="text-[10px] font-mono text-purple-400 tracking-widest mb-2 border-l-2 border-purple-500 pl-2">【概念拓展】</div>
              <h3 className="text-lg font-black text-gray-100 mb-1.5">光年 (Light-year)</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                光年是天文学上的<strong className="text-purple-400 bg-purple-900/30 px-0.5 rounded">长度单位</strong>，而不是时间单位！
              </p>
              <div className="mt-3 text-[11px] text-gray-400 bg-black/30 p-2.5 rounded-lg border border-purple-900/40">
                1光年表示光在 1年 内传播的距离。由于光速极快，1光年大约等于 9.46×10¹² 千米。
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* 动画样式注入 */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes rayMove {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-ray-move {
          animation: rayMove 3s infinite linear;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}