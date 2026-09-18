"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info, Settings, Eye, LineChart, HelpCircle, Car, TreePine } from 'lucide-react';

export default function MotionDescription({ embedded = false }) {
  const [vA, setVA] = useState(15);
  const [vB, setVB] = useState(-10);
  const [refFrame, setRefFrame] = useState('ground');

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const reqRef = useRef();
  const lastTimeRef = useRef();

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const loop = (now) => {
        const dt = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        setTime((prev) => prev + dt);
        reqRef.current = requestAnimationFrame(loop);
      };
      reqRef.current = requestAnimationFrame(loop);
    } else if (reqRef.current) {
      cancelAnimationFrame(reqRef.current);
    }

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const vRef = refFrame === 'ground' ? 0 : refFrame === 'carA' ? vA : vB;

  const relVGround = 0 - vRef;
  const relVA = vA - vRef;
  const relVB = vB - vRef;

  const scale = 4;
  const width = 800;

  const wrapPosition = (relVelocity, initialOffsetX) => {
    const pos = initialOffsetX + relVelocity * time * scale;
    return ((pos + width / 2) % width + width) % width - width / 2;
  };

  const posGround = wrapPosition(relVGround, 0);
  const posA = refFrame === 'carA' ? 0 : wrapPosition(relVA, -100);
  const posB = refFrame === 'carB' ? 0 : wrapPosition(relVB, 100);

  const roadBgPos = (relVGround * time * scale) % 100;

  const glassCardClass = "bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 relative z-10";

  const rootClass = embedded
    ? "h-full min-h-0 flex flex-col font-sans text-white overflow-hidden"
    : "min-h-screen w-full bg-[#0b0e14] flex flex-col font-sans text-gray-200 relative p-4 md:p-6 lg:p-8";

  const headerClass = "bg-cyan-900/20 border border-cyan-800/50 rounded-xl p-5 mb-6 backdrop-blur-sm";

  return (
    <div className={rootClass}>
      {!embedded && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-[#0b0e14] to-[#0b0e14] pointer-events-none" />
      )}

      <div className="w-full flex-1 flex flex-col relative z-10">        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full flex-1">
          <div className="lg:col-span-8 flex flex-col order-1">
            <div className={`${glassCardClass} flex-1 flex flex-col`}>
              <h2 className="text-lg font-bold text-gray-100 flex items-center justify-between mb-4 border-b border-white/10 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" /> 交互实验：参照物视角
                </div>
                <div className="text-base font-normal text-gray-400 flex items-center gap-2 bg-white/5 py-1.5 px-4 rounded-full border border-white/10">
                  当前时间: <span className="font-mono text-cyan-300 ml-1">{time.toFixed(1)} s</span>
                </div>
              </h2>

              <div className="w-full h-[450px] bg-sky-900/20 border border-white/10 rounded-xl relative overflow-hidden shrink-0 mt-2 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-800 border-t-4 border-gray-600 flex items-center">
                  <div className="w-full h-1" style={{ backgroundImage: 'linear-gradient(90deg, #9ca3af 50%, transparent 50%)', backgroundSize: '40px 100%', backgroundPosition: `${roadBgPos}px 0` }} />
                </div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-500/50 border-l border-dashed border-cyan-400/30 z-0">
                  <div className="bg-cyan-900 text-cyan-300 text-sm px-3 py-1 rounded-full absolute top-4 -translate-x-1/2 whitespace-nowrap border border-cyan-700">参照物基准 (x=0)</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute flex flex-col items-center bottom-40 transition-transform duration-75" style={{ transform: `translateX(${posGround}px)` }}>
                    <TreePine className="w-20 h-20 text-emerald-500 drop-shadow-lg" />
                    <div className="mt-1 bg-black/60 px-3 py-1 rounded text-sm text-white border border-white/10">树木</div>
                    {refFrame === 'ground' && <div className="absolute -top-8 text-sm text-cyan-400 bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-800 animate-pulse">参照物</div>}
                  </div>
                  <div className="absolute flex flex-col items-center bottom-20 transition-transform duration-75" style={{ transform: `translateX(${posA}px)` }}>
                    <div className="relative">
                      <Car className="w-20 h-20 text-blue-400 drop-shadow-lg" />
                      {relVA !== 0 && <div className={`absolute top-1/2 ${relVA > 0 ? '-right-10' : '-left-10'} -translate-y-1/2 text-emerald-400 text-2xl font-bold`}>{relVA > 0 ? '→' : '←'}</div>}
                    </div>
                    <div className="bg-black/60 px-3 py-1 rounded text-sm text-white border border-white/10">小车 A</div>
                    {refFrame === 'carA' && <div className="absolute -top-6 text-sm text-cyan-400 bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-800 animate-pulse">参照物</div>}
                  </div>
                  <div className="absolute flex flex-col items-center bottom-4 transition-transform duration-75" style={{ transform: `translateX(${posB}px)` }}>
                    <div className="relative">
                      <Car className="w-20 h-20 text-orange-400 drop-shadow-lg" style={{ transform: 'scaleX(-1)' }} />
                      {relVB !== 0 && <div className={`absolute top-1/2 ${relVB > 0 ? '-right-10' : '-left-10'} -translate-y-1/2 text-emerald-400 text-2xl font-bold`}>{relVB > 0 ? '→' : '←'}</div>}
                    </div>
                    <div className="bg-black/60 px-3 py-1 rounded text-sm text-white border border-white/10">小车 B</div>
                    {refFrame === 'carB' && <div className="absolute -top-6 text-sm text-cyan-400 bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-800 animate-pulse">参照物</div>}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-center">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row gap-8 justify-between">
                    <div className="flex-1 space-y-5">
                      <h3 className="text-base font-bold text-gray-300 flex items-center gap-2"><Settings className="w-5 h-5" /> 地面速度调节 (m/s)</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-6">
                          <label className="text-sm font-medium text-blue-300 w-20 shrink-0">小车 A</label>
                          <input type="range" min="-30" max="30" step="1" value={vA} onChange={(e) => setVA(Number(e.target.value))} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                          <span className="text-base font-mono w-16 text-right text-gray-300">{vA > 0 ? `+${vA}` : vA}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <label className="text-sm font-medium text-orange-300 w-20 shrink-0">小车 B</label>
                          <input type="range" min="-30" max="30" step="1" value={vB} onChange={(e) => setVB(Number(e.target.value))} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                          <span className="text-base font-mono w-16 text-right text-gray-300">{vB > 0 ? `+${vB}` : vB}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-gray-300">观察视角 (选择参照物)</h3>
                        <div className="flex gap-3">
                          {['ground', 'carA', 'carB'].map((rf) => (
                            <button key={rf} onClick={() => setRefFrame(rf)} className={`flex-1 py-2.5 px-3 rounded-xl text-sm transition-all border ${refFrame === rf ? 'bg-cyan-600 text-white border-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>
                              {rf === 'ground' ? '🌲 地面' : rf === 'carA' ? '🚗 小车A' : '🚙 小车B'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                        <button onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-lg text-white transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20'}`}>
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                          {isPlaying ? '暂停演示' : '开始演示'}
                        </button>
                        <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 text-base">
                          <RotateCcw className="w-5 h-5" /> 重置
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 order-2">
            <div className={`${glassCardClass} flex-1`}>
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                <Info className="w-6 h-6 text-indigo-400" /> 知识导读
              </h2>
              <div className="space-y-6 text-base text-gray-300">
                <div><strong className="text-indigo-300 block mb-2 text-lg">什么是机械运动？</strong><p className="leading-relaxed">物体相对于另一个物体位置的改变。</p></div>
                <div><strong className="text-indigo-300 block mb-2 text-lg">什么是参照物？</strong><p className="leading-relaxed">被选作标准的物体（假定静止）。</p></div>
                <div className="bg-indigo-900/30 border border-indigo-700/50 p-4 rounded-xl">
                  <strong className="text-indigo-200 block mb-2 flex items-center gap-2 text-lg"><Settings className="w-5 h-5" /> 核心定律</strong>
                  <p className="font-semibold text-indigo-100">运动和静止是相对的。</p>
                  <p className="mt-2 text-indigo-200/80 text-sm">相同物体，不同参照物，结论可能不同。</p>
                </div>
                <div>
                  <strong className="text-indigo-300 block mb-2 text-lg">相对速度模型:</strong>
                  <div className="bg-black/40 py-3 px-4 rounded-xl text-center font-mono text-cyan-400 border border-white/5 text-2xl shadow-inner">v_相对 = v_A - v_Ref</div>
                </div>
              </div>
            </div>

            <div className={`${glassCardClass} flex-1`}>
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                <LineChart className="w-6 h-6 text-emerald-400" /> 实时数据分析
              </h2>
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <table className="w-full text-base text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="py-3 font-medium">物体名称</th>
                        <th className="py-3 font-medium text-emerald-300">相对速度</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5"><td className="py-4 text-gray-300">🌲 树木(地面)</td><td className="py-4 font-mono text-emerald-400 font-bold text-lg">{relVGround > 0 ? "+" : ""}{relVGround} m/s</td></tr>
                      <tr className="border-b border-white/5"><td className="py-4 text-blue-300">🚗 小车 A</td><td className="py-4 font-mono text-emerald-400 font-bold text-lg">{relVA > 0 ? "+" : ""}{relVA} m/s</td></tr>
                      <tr><td className="py-4 text-orange-300">🚙 小车 B</td><td className="py-4 font-mono text-emerald-400 font-bold text-lg">{relVB > 0 ? "+" : ""}{relVB} m/s</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-emerald-900/20 border border-emerald-800/50 p-5 rounded-xl mt-6">
                  <strong className="text-emerald-300 block mb-2 flex items-center gap-2 text-lg"><HelpCircle className="w-5 h-5" /> 思考挑战</strong>
                  <p className="text-sm text-emerald-100/90 italic leading-relaxed">“坐匀速高铁，以车厢为参照物，看窗外的树是在向哪动？为什么？”</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
