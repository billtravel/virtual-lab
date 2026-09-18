"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, LineChart, Settings, Flag, Timer, Rocket, Car } from 'lucide-react';

export default function Animation({ embedded = false }) {
  const [vA, setVA] = useState(10);
  const [vB, setVB] = useState(5);
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
        setTime((prev) => {
          const nextTime = prev + dt;

          // Stop if both reach 100m
          const distA = nextTime * vA;
          const distB = nextTime * vB;
          if ((vA === 0 || distA >= 100) && (vB === 0 || distB >= 100) && (vA > 0 || vB > 0)) {
            setIsPlaying(false);
            return Math.max(vA > 0 ? 100 / vA : 0, vB > 0 ? 100 / vB : 0);
          }
          return nextTime;
        });
        reqRef.current = requestAnimationFrame(loop);
      };
      reqRef.current = requestAnimationFrame(loop);
    } else if (reqRef.current) {
      cancelAnimationFrame(reqRef.current);
    }

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, vA, vB]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const distA = Math.min(100, vA * time);
  const distB = Math.min(100, vB * time);

  const rootClass = embedded
    ? "h-full min-h-0 flex flex-col font-sans text-white overflow-hidden"
    : "min-h-screen w-full bg-[#0b0e14] flex flex-col font-sans text-gray-200 relative p-4 md:p-6 lg:p-8";
  
  const glassCardClass = "bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 relative z-10 flex flex-col";

  return (
    <div className={rootClass}>
      {!embedded && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-[#0b0e14] to-[#0b0e14] pointer-events-none" />
      )}

      <div className="w-full flex-1 flex flex-col relative z-10 gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          {/* Left Column: Control Panel & Simulation */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className={glassCardClass}>
              <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Settings className="w-5 h-5 text-cyan-400" /> 控制台 (Control Panel)
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-blue-300 w-24">物体 A 速度:</label>
                  <input type="range" min="0" max="20" step="1" value={vA} onChange={(e) => { setVA(Number(e.target.value)); handleReset(); }} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" disabled={time > 0} />
                  <span className="text-base font-mono w-16 text-right text-gray-300">{vA} m/s</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-orange-300 w-24">物体 B 速度:</label>
                  <input type="range" min="0" max="20" step="1" value={vB} onChange={(e) => { setVB(Number(e.target.value)); handleReset(); }} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" disabled={time > 0} />
                  <span className="text-base font-mono w-16 text-right text-gray-300">{vB} m/s</span>
                </div>
                <div className="flex justify-center gap-4 pt-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? '暂停' : '开始实验'}
                  </button>
                  <button onClick={handleReset} className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-all border border-white/10">
                    <RotateCcw className="w-5 h-5" /> 重置
                  </button>
                </div>
              </div>
            </div>

            <div className={`${glassCardClass} flex-1 min-h-[300px]`}>
              <h2 className="text-lg font-bold text-gray-100 flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-emerald-400" /> 实验视窗 (Simulation View)
                </div>
                <div className="flex items-center gap-2 bg-white/5 py-1 px-3 rounded-full border border-white/10 text-sm">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-amber-300">{time.toFixed(2)} s</span>
                </div>
              </h2>
              
              <div className="flex-1 flex flex-col justify-center gap-8 relative mt-4">
                {/* Track Scale */}
                <div className="absolute top-0 left-[5%] right-[5%] flex justify-between text-xs text-gray-500 font-mono -translate-y-4">
                  <span>0 m</span>
                  <span>25 m</span>
                  <span>50 m</span>
                  <span>75 m</span>
                  <span>100 m</span>
                </div>
                <div className="absolute top-0 left-[5%] right-[5%] flex justify-between h-full pointer-events-none">
                  {[0, 25, 50, 75, 100].map(val => (
                    <div key={val} className="w-[1px] h-full bg-white/5 border-l border-dashed border-white/10 relative"></div>
                  ))}
                </div>

                {/* Track A */}
                <div className="relative h-20 bg-gray-800/50 rounded-full border border-white/5 mx-[5%] overflow-hidden flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 bg-blue-500/20" style={{ width: `${distA}%` }} />
                  <div className="absolute transition-transform duration-75 text-blue-400 flex items-center justify-center translate-x-[-50%]" style={{ left: `${distA}%`, width: '60px' }}>
                    <Car className="w-12 h-12 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  </div>
                </div>

                {/* Track B */}
                <div className="relative h-20 bg-gray-800/50 rounded-full border border-white/5 mx-[5%] overflow-hidden flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 bg-orange-500/20" style={{ width: `${distB}%` }} />
                  <div className="absolute transition-transform duration-75 text-orange-400 flex items-center justify-center translate-x-[-50%]" style={{ left: `${distB}%`, width: '60px' }}>
                    <Car className="w-12 h-12 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Data Analysis & Graph */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className={`${glassCardClass} flex-1`}>
              <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <LineChart className="w-5 h-5 text-fuchsia-400" /> 数据记录与分析 (s-t 图像)
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl flex flex-col">
                  <span className="text-blue-300 text-sm font-bold flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"/> 物体 A 物距</span>
                  <span className="text-2xl font-mono text-blue-100 mt-1">{distA.toFixed(1)} <span className="text-sm">m</span></span>
                  <span className="text-xs text-blue-300/70 mt-1">v = {vA} m/s</span>
                </div>
                <div className="bg-orange-900/20 border border-orange-500/30 p-3 rounded-xl flex flex-col">
                  <span className="text-orange-300 text-sm font-bold flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"/> 物体 B 物距</span>
                  <span className="text-2xl font-mono text-orange-100 mt-1">{distB.toFixed(1)} <span className="text-sm">m</span></span>
                  <span className="text-xs text-orange-300/70 mt-1">v = {vB} m/s</span>
                </div>
              </div>

              <div className="flex-1 bg-black/40 border border-white/10 rounded-xl relative p-4 flex flex-col min-h-[250px]">
                <div className="text-xs text-gray-400 absolute top-2 left-2">s / m (路程)</div>
                <div className="text-xs text-gray-400 absolute bottom-2 right-2">t / s (时间)</div>
                
                <div className="flex-1 ml-6 mb-6 mt-4 mr-2 relative border-l border-b border-gray-600">
                  {/* Grid Lines */}
                  {[25, 50, 75, 100].map(val => (
                    <div key={val} className="absolute left-0 right-0 border-t border-gray-700 pointer-events-none" style={{ bottom: `${val}%` }}>
                      <span className="absolute -left-6 top-[-8px] text-[10px] text-gray-500">{val}</span>
                    </div>
                  ))}

                  {/* SVG Graph */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Scaling: X max defaults to 10s unless time > 10 */}
                    {(() => {
                      const maxTime = Math.max(10, Math.ceil(time / 5) * 5);
                      
                      return (
                        <>
                          {/* x-axis base line */}
                          <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#4b5563" strokeWidth="2" />
                          
                          {/* Line for A */}
                          <line x1="0%" y1="100%" x2={`${(time/maxTime)*100}%`} y2={`${100 - (distA/100)*100}%`} stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
                          <circle cx={`${(time/maxTime)*100}%`} cy={`${100 - (distA/100)*100}%`} r="5" fill="#60a5fa" />
                          
                          {/* Line for B */}
                          <line x1="0%" y1="100%" x2={`${(time/maxTime)*100}%`} y2={`${100 - (distB/100)*100}%`} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                          <circle cx={`${(time/maxTime)*100}%`} cy={`${100 - (distB/100)*100}%`} r="5" fill="#f97316" />

                          {/* Dynamic Time Axis Labels */}
                          <text x="50%" y="105%" fill="#6b7280" fontSize="10" textAnchor="middle">{maxTime/2}</text>
                          <text x="100%" y="105%" fill="#6b7280" fontSize="10" textAnchor="middle">{maxTime}</text>
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
              <div className="mt-4 bg-fuchsia-900/20 border border-fuchsia-500/30 p-3 rounded-lg text-sm text-fuchsia-200">
                <strong className="text-fuchsia-300">📈 图像分析：</strong> 
                s-t 图像中，直线的<span className="font-bold text-white px-1">斜率（陡缓程度）</span>代表了物体的速度大小。斜率越大，说明相同时间内通过的路程越多，速度越快。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
