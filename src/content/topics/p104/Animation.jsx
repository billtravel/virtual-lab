"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Flag, Timer, Zap, CheckCircle2, Calculator, ArrowRight } from 'lucide-react';

export default function Animation({ embedded = false }) {
  const [angle, setAngle] = useState(15);
  const [length, setLength] = useState(1.0);
  const [bafflePos, setBafflePos] = useState('end'); // 'mid' or 'end'
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [isHit, setIsHit] = useState(false);

  // Data records
  const [records, setRecords] = useState({
    upper: { s: null, t: null, v: null },
    total: { s: null, t: null, v: null },
    lower: { s: null, t: null, v: null },
  });

  const reqRef = useRef();
  const lastTimeRef = useRef();
  
  const g = 9.8; 
  const a = g * Math.sin(angle * Math.PI / 180);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const loop = (now) => {
        const dt = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        
        setTime((prev) => {
          const nextTime = prev + dt;
          const currentDist = 0.5 * a * nextTime * nextTime;
          
          const targetDist = bafflePos === 'mid' ? length / 2 : length;
          
          // Auto record mid tracking if we passed it while baffle is at the end
          if (bafflePos === 'end' && currentDist >= length / 2) {
            setRecords(r => {
              if (r.upper.t === null) {
                const exactMidTime = Math.sqrt(length / a);
                return { ...r, upper: { ...r.upper, s: Number((length / 2).toFixed(2)), t: Number(exactMidTime.toFixed(2)) } };
              }
              return r;
            });
          }

          if (currentDist >= targetDist) {
            setIsPlaying(false);
            setIsHit(true);
            const exactTime = Math.sqrt((2 * targetDist) / a);
            
            setRecords(r => {
              if (bafflePos === 'mid') {
                return { ...r, upper: { ...r.upper, s: Number((length / 2).toFixed(2)), t: Number(exactTime.toFixed(2)) } };
              } else {
                return { ...r, total: { ...r.total, s: Number(length.toFixed(2)), t: Number(exactTime.toFixed(2)) } };
              }
            });

            return exactTime;
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
  }, [isPlaying, a, length, bafflePos]);

  useEffect(() => {
    // If upper and total are recorded, we can auto-fill lower distance and time
    if (records.upper.t !== null && records.total.t !== null && records.lower.t === null) {
      setRecords(r => ({
        ...r,
        lower: {
          ...r.lower,
          s: Number((r.total.s - r.upper.s).toFixed(2)),
          t: Number((r.total.t - r.upper.t).toFixed(2))
        }
      }));
    }
  }, [records]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setIsHit(false);
  };

  const currentDist = Math.min(0.5 * a * time * time, bafflePos === 'mid' ? length / 2 : length);
  const currentSpeed = a * time;

  const calculateV = (key) => {
    setRecords(r => {
      const row = r[key];
      if (row.s !== null && row.t !== null && row.t > 0) {
        return {
          ...r,
          [key]: {
            ...row,
            v: Number((row.s / row.t).toFixed(3))
          }
        };
      }
      return r;
    });
  };

  const handleClearData = () => {
    setRecords({
      upper: { s: null, t: null, v: null },
      total: { s: null, t: null, v: null },
      lower: { s: null, t: null, v: null },
    });
    handleReset();
  };

  const allCalculated = records.upper.v !== null && records.lower.v !== null && records.total.v !== null;

  const rootClass = embedded
    ? "h-full min-h-0 flex flex-col font-sans text-white overflow-y-auto"
    : "min-h-screen w-full bg-[#0b0e14] flex flex-col font-sans text-gray-200 relative p-4 md:p-6 lg:p-8 overflow-y-auto";
  
  const glassCardClass = "bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 relative z-10 flex flex-col";

  return (
    <div className={rootClass}>
      {!embedded && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-[#0b0e14] to-[#0b0e14] pointer-events-none" />
      )}

      {/* Header Area */}
      <div className="relative z-10 mb-6 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-extrabold text-blue-100 flex items-center gap-3">
          探究小车在斜面上的运动——测量平均速度
        </h1>
        <p className="text-blue-200/80 mt-2 text-sm leading-relaxed max-w-4xl">
          欢迎来到力学实验室！请通过调整斜面参数，利用虚拟刻度尺和停表，测量小车在不同路段的平均速度，验证变速直线运动的规律。
        </p>
      </div>

      <div className="w-full flex-1 flex flex-col relative z-10 gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Control Panel & Simulation */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Control Panel */}
            <div className={glassCardClass}>
              <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Settings className="w-5 h-5 text-cyan-400" /> 控制面板 (Control Panel)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-blue-300 flex justify-between">
                      <span>斜面倾角 (θ)</span>
                      <span className="font-mono bg-blue-900/30 px-2 py-1 rounded-md">{angle}°</span>
                    </label>
                    <input type="range" min="5" max="30" step="1" value={angle} 
                      onChange={(e) => { setAngle(Number(e.target.value)); handleReset(); }} 
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" disabled={time > 0} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-emerald-300 flex justify-between">
                      <span>总路程 (s)</span>
                      <span className="font-mono bg-emerald-900/30 px-2 py-1 rounded-md">{length.toFixed(1)} m</span>
                    </label>
                    <input type="range" min="0.5" max="2.0" step="0.1" value={length} 
                      onChange={(e) => { setLength(Number(e.target.value)); handleReset(); }} 
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" disabled={time > 0} />
                  </div>
                </div>

                <div className="space-y-6 flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-orange-300">金属挡板位置</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex text-center items-center justify-center gap-2 py-2 px-3 rounded-xl border cursor-pointer transition-all ${bafflePos === 'end' ? 'bg-orange-500/20 border-orange-500 text-orange-100' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                        <input type="radio" className="hidden" checked={bafflePos === 'end'} onChange={() => { setBafflePos('end'); handleReset(); }} disabled={time > 0} />
                        终点 (全程 s)
                      </label>
                      <label className={`flex-1 flex text-center items-center justify-center gap-2 py-2 px-3 rounded-xl border cursor-pointer transition-all ${bafflePos === 'mid' ? 'bg-orange-500/20 border-orange-500 text-orange-100' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                        <input type="radio" className="hidden" checked={bafflePos === 'mid'} onChange={() => { setBafflePos('mid'); handleReset(); }} disabled={time > 0} />
                        中点 (上半程 s₁)
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setIsPlaying(true)} disabled={isPlaying || isHit} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${(isPlaying || isHit) ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white'}`}>
                      <Play className="w-5 h-5" /> 开始释放
                    </button>
                    <button onClick={handleReset} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white flex justify-center items-center gap-2 transition-all border border-white/10">
                      <RotateCcw className="w-5 h-5" /> 重置小车
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Simulation Viewport */}
            <div className={`${glassCardClass} flex-1 min-h-[700px]`}>
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <Flag className="w-6 h-6 text-indigo-400" /> 实验视窗 (Simulation Viewport)
                </h2>
                
                <div className="flex gap-6">
                  {/* Speedometer */}
                  <div className="flex items-center gap-3 bg-black/40 py-2 px-5 rounded-full border border-white/10 shadow-inner">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-mono font-bold text-yellow-400 text-lg">v: {currentSpeed.toFixed(2)} m/s</span>
                  </div>
                  {/* Digital Stopwatch */}
                  <div className={`flex items-center gap-3 bg-black/40 py-2 px-5 rounded-full border transition-all duration-300 ${isPlaying ? 'border-red-500/50 bg-red-900/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
                    <Timer className={`w-5 h-5 ${isPlaying ? 'text-red-400' : 'text-emerald-400'}`} />
                    <span className={`font-mono font-bold text-2xl ${isPlaying ? 'text-red-400' : 'text-emerald-400'}`}>{time.toFixed(2)} <span className="text-base text-current/60">s</span></span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden bg-black/30 rounded-2xl border border-white/5 shadow-inner">
                
                {/* Visual rendering of inclined plane */}
                <div className="relative w-full max-w-3xl h-[350px] flex items-end justify-start">
                  
                  {/* Base Triangle Ground */}
                  <div className="absolute bottom-0 w-full h-[3px] bg-gray-500/50 rounded-full" />
                  
                  {/* Inclined Plane Container */}
                  <div className="absolute w-full h-[8px] bg-sky-600/80 origin-bottom-right transition-transform duration-500 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                       style={{ transform: `rotate(${angle}deg)`, right: 0, bottom: 0 }}>
                    
                    {/* Ruler */}
                    <div className="absolute top-[10px] w-full h-10 flex border-t-2 border-white/30" style={{ left: 0 }}>
                       <div className="absolute flex justify-between w-full font-medium" style={{ top: '-35px' }}>
                          <span style={{ left: '0%', position: 'absolute', transform: `rotate(${-angle}deg)` }} className="text-sm text-gray-400">0m</span>
                          <span style={{ left: '25%', position: 'absolute', transform: `rotate(${-angle}deg)` }} className="text-sm text-gray-400">{(length*0.25).toFixed(2)}m</span>
                          <span style={{ left: '50%', position: 'absolute', transform: `rotate(${-angle}deg)` }} className="text-sm text-gray-400">{(length*0.5).toFixed(2)}m</span>
                          <span style={{ left: '75%', position: 'absolute', transform: `rotate(${-angle}deg)` }} className="text-sm text-gray-400">{(length*0.75).toFixed(2)}m</span>
                          <span style={{ left: '100%', position: 'absolute', transform: `rotate(${-angle}deg)` }} className="text-sm text-gray-400">{length.toFixed(2)}m</span>
                       </div>
                       {[...Array(21)].map((_, i) => (
                         <div key={i} className={`absolute top-0 w-[1.5px] bg-white/30 ${i % 5 === 0 ? 'h-4' : 'h-2'}`} style={{ left: `${(i/20)*100}%` }} />
                       ))}
                    </div>

                    {/* Baffle */}
                    {bafflePos === 'mid' ? (
                      <div className="absolute top-[-40px] left-[50%] w-2.5 h-[48px] bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] z-20 border-2 border-orange-300 rounded-sm"></div>
                    ) : (
                      <div className="absolute top-[-40px] left-[100%] w-2.5 h-[48px] bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] z-20 border-2 border-orange-300 rounded-sm ml-[-2.5px]"></div>
                    )}
                    
                    {/* Cart */}
                    <div className="absolute top-[-30px] w-16 h-8 bg-gradient-to-b from-gray-100 to-gray-400 rounded shadow-xl z-30 flex items-center justify-center border-2 border-gray-500"
                         style={{ left: `${(currentDist / length) * 100}%`, transform: 'translateX(-50%)' }}>
                       <div className="w-full h-full bg-blue-500/10 rounded-sm overflow-hidden relative">
                         <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full" />
                       </div>
                       {/* Wheels */}
                       <div className="absolute bottom-[-8px] left-[15%] w-5 h-5 rounded-full bg-gray-900 border-2 border-gray-600 shadow-md" />
                       <div className="absolute bottom-[-8px] right-[15%] w-5 h-5 rounded-full bg-gray-900 border-2 border-gray-600 shadow-md" />
                    </div>

                  </div>

                  {/* Impact visual effect */}
                  {isHit && (
                    <div className="absolute z-40" 
                         style={{
                           left: `${bafflePos === 'mid' ? 50 : 100}%`,
                           bottom: `${Math.tan(angle * Math.PI / 180) * (bafflePos === 'mid' ? 0.5 : 0) * 100}%`,
                           transform: `translateX(-50%) translateY(-30px)`
                         }}>
                       <div className="w-24 h-24 -ml-12 -mb-12 rounded-full border-4 border-orange-400/80 animate-ping absolute" />
                       <div className="w-24 h-24 -ml-12 -mb-12 rounded-full border-2 border-yellow-300/60 animate-ping" style={{ animationDelay: '0.1s'}} />
                    </div>
                  )}

                  {/* Angle Arc Indicator */}
                  <div className="absolute bottom-0 left-0 w-24 h-24 overflow-hidden pointer-events-none">
                     <div className="w-48 h-48 rounded-full border-2 border-blue-400/30 absolute bottom-[-24px] left-[-24px]" />
                  </div>
                  <div className="absolute bottom-4 left-16 text-blue-300 text-lg font-mono font-bold">{angle}°</div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Data Table */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={glassCardClass + " flex-1"}>
              <h2 className="text-lg font-bold text-gray-100 flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <span className="flex items-center gap-2"><Calculator className="w-5 h-5 text-purple-400" /> 数据记录与计算</span>
                <button onClick={handleClearData} className="text-xs px-3 py-1 rounded bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-800/50 transition-colors">清空数据</button>
              </h2>
              
              <div className="flex flex-col gap-4">
                
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <div className="text-left pl-2">路段</div>
                  <div>路程 s (m)</div>
                  <div>时间 t (s)</div>
                  <div>速度 v (m/s)</div>
                </div>

                {/* Rows */}
                {[
                  { id: 'upper', label: '上半程', color: 'text-sky-300', bg: 'bg-sky-900/20', border: 'border-sky-500/20' },
                  { id: 'lower', label: '下半程', color: 'text-indigo-300', bg: 'bg-indigo-900/20', border: 'border-indigo-500/20' },
                  { id: 'total', label: '全程', color: 'text-orange-300', bg: 'bg-orange-900/20', border: 'border-orange-500/20' }
                ].map(row => {
                  const data = records[row.id];
                  const hasData = data.s !== null && data.t !== null;
                  
                  return (
                    <div key={row.id} className={`grid grid-cols-4 gap-2 items-center text-center p-3 rounded-lg border ${row.bg} ${row.border}`}>
                      <div className={`text-left pl-1 font-bold ${row.color} text-sm`}>{row.label}</div>
                      <div className="font-mono text-gray-200 bg-black/40 rounded py-1">{hasData ? data.s : '-'}</div>
                      <div className="font-mono text-gray-200 bg-black/40 rounded py-1">{hasData ? data.t : '-'}</div>
                      <div>
                        {hasData ? (
                          data.v !== null ? (
                            <span className="font-mono font-bold text-green-400">{data.v.toFixed(3)}</span>
                          ) : (
                            <button onClick={() => calculateV(row.id)} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-md shadow-md transition-all">计算</button>
                          )
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </div>
                    </div>
                  )
                })}

              </div>

              {/* Tips and Information Area */}
              <div className="mt-6 p-6 rounded-xl bg-white/5 border border-white/10 text-lg">
                <h3 className="font-bold text-gray-100 mb-4 flex items-center gap-2 text-xl">📝 实验记录指南：</h3>
                <ol className="list-decimal pl-8 space-y-4 text-gray-200">
                  <li>将挡板放在<strong className="text-orange-400 font-bold underline decoration-orange-500/50 underline-offset-4">中点</strong>，测出上半程时间 t₁ 和路程 s₁。</li>
                  <li>将挡板放在<strong className="text-orange-400 font-bold underline decoration-orange-500/50 underline-offset-4">终点</strong>，测出全程时间 t 和路程 s。</li>
                  <li>下半程的数据：s₂ = s - s₁，t₂ = t - t₁。</li>
                  <li>分别点击“计算”得出各个路段的速度 v。</li>
                </ol>
              </div>

              {/* Conclusion Notification */}
              <div className={`mt-auto pt-6 transition-all duration-500 ${allCalculated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                {allCalculated && records.upper.v < records.lower.v && (
                  <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-xl p-4 flex flex-col items-center text-center gap-3 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    <div>
                      <h3 className="text-emerald-300 text-lg font-bold mb-2">🎉 实验成功！</h3>
                      <p className="text-base text-emerald-100/80 leading-relaxed">
                        从数据中可以清晰地看到：<br/>
                        <span className="font-mono font-bold text-white px-1 text-lg">v<sub>上半程</sub> ({records.upper.v.toFixed(3)}) &lt; v<sub>下半程</sub> ({records.lower.v.toFixed(3)})</span><br/>
                        这证明小车在斜面上下滑时，做的是<strong className="text-white px-1 text-lg">加速直线运动</strong>。
                      </p>
                    </div>
                  </div>
                )}
                {allCalculated && records.upper.v >= records.lower.v && (
                   <div className="bg-orange-900/30 border border-orange-500/40 rounded-xl p-4 flex flex-col items-center text-center gap-3">
                      <p className="text-base text-orange-200">数据似乎有误或未反映出加速运动。</p>
                   </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}