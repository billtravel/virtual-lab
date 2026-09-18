"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Hammer, Hand, Play, StopCircle, Wind, Droplets, MoveRight, Thermometer, Box } from 'lucide-react';

// ==========================================
// 模块一：声音是如何产生的？ (音叉与乒乓球实验)
// ==========================================
const TuningForkExperiment = ({ embedded }) => {
  const panelClass = embedded ? 'bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl' : 'bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl';
  const subPanelClass = embedded ? 'bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]' : 'bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)]';
  const [force, setForce] = useState(50);
  const [isVibrating, setIsVibrating] = useState(false);
  const [ballAngle, setBallAngle] = useState(0);

  useEffect(() => {
    let reqId;
    if (isVibrating) {
      let start = null;
      const animate = (time) => {
        if (!start) start = time;
        const elapsed = time - start;
        // 小球弹起角度与敲击力度和振动频率相关
        const currentAngle = (force * 0.45) * Math.abs(Math.sin(elapsed * 0.015));
        setBallAngle(currentAngle);
        reqId = requestAnimationFrame(animate);
      };
      reqId = requestAnimationFrame(animate);
    } else {
      setBallAngle(0);
    }
    return () => cancelAnimationFrame(reqId);
  }, [isVibrating, force]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="mt-4 flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* 核心展示区 */}
        <div className={`flex-1 p-6 ${panelClass} flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]`}>
          <div className="relative flex items-end h-48 w-48 justify-center">
            {/* 音叉 */}
            <div className={`w-12 h-32 border-4 border-t-0 border-slate-300 rounded-b-2xl relative ${isVibrating ? 'animate-pulse' : ''}`}
                 style={{ filter: isVibrating ? `blur(${force * 0.05}px)` : 'none', transform: isVibrating ? `translateX(${Math.sin(Date.now() * 0.1) * (force*0.05)}px)` : 'none' }}>
              <div className="absolute w-2 h-16 bg-slate-400 left-1/2 -translate-x-1/2 top-full" />
            </div>
            
            {/* 乒乓球及细线 (挂在右侧) */}
            <div className="absolute top-0 right-0 flex flex-col items-center origin-top transition-transform duration-75"
                 style={{ transform: `rotate(-${ballAngle}deg)`, height: '80%' }}>
              <div className="w-[1px] h-full bg-slate-500" />
              <div className="w-5 h-5 bg-orange-200 rounded-full border border-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
            </div>

            {/* 音波特效 */}
            {isVibrating && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-400/30 rounded-full animate-ping pointer-events-none" />
            )}
          </div>
          <div className="text-slate-400 mt-12 flex items-center justify-center gap-2 w-full">
            <Volume2Icon isVibrating={isVibrating} force={force} />
            <span>{isVibrating ? '发声中...' : '静音'}</span>
          </div>
        </div>

        {/* 交互控制与结论区 */}
        <div className="w-full xl:w-96 flex flex-col gap-4 overflow-y-auto">
          <div className={`p-5 ${subPanelClass}`}>
            <h3 className="text-sm font-bold text-cyan-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-500/50 rounded-full"></span>
              实验操作
            </h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm font-mono text-slate-400 mb-2">
                <span>敲击力度</span>
                <span className="text-cyan-400">{force}</span>
              </div>
              <input 
                type="range" min="1" max="100" value={force} 
                onChange={(e) => setForce(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                disabled={isVibrating}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsVibrating(true)}
                className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-200 py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm font-bold"
              >
                <Hammer size={16} /> 敲击
              </button>
              <button 
                onClick={() => setIsVibrating(false)}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm font-bold"
              >
                <Hand size={16} /> 握住
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex-1">
            <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500/50 rounded-full"></span>
              实验结论
            </h3>
            <p className="text-slate-400 text-base leading-relaxed mb-3 italic">
              转换法：将不易观察的音叉微小振动，转换为乒乓球的大幅度弹开。
            </p>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-base text-gray-200 leading-8">
              声音是由物体的 <span className="text-amber-300 font-bold border-b border-amber-500/40 px-1">振动</span> 产生的。
              <br className="my-2"/>
              振动停止，发声也 <span className="text-amber-300 font-bold border-b border-amber-500/40 px-1">停止</span>。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Volume2Icon = ({ isVibrating, force }) => {
  if (!isVibrating) return <div className="w-5 h-5 flex items-center justify-center text-slate-500">- -</div>;
  const size = 16 + (force * 0.1);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
  );
};


// ==========================================
// 模块二：声音的传播需要“路”吗？ (真空罩闹钟实验)
// ==========================================
const VacuumExperiment = ({ embedded }) => {
  const panelClass = embedded ? 'bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl' : 'bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl';
  const subPanelClass = embedded ? 'bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]' : 'bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)]';
  const [pressure, setPressure] = useState(1.0);
  
  // 模拟空气分子
  const totalDots = 100;
  const visibleDots = Math.floor(totalDots * pressure);
  const dots = Array.from({ length: totalDots }).map((_, i) => ({
    id: i,
    x: 10 + Math.random() * 80, // %
    y: 10 + Math.random() * 80, // %
    animDuration: 2 + Math.random() * 3,
  }));

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="mt-4 flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* 核心展示区 */}
        <div className={`flex-1 p-6 ${panelClass} flex flex-col items-center justify-center relative min-h-[400px]`}>
          
          <div className="relative w-48 h-64 flex flex-col items-center mt-8">
            {/* 玻璃罩 */}
            <div className="w-full h-48 border-2 border-b-0 border-white/20 rounded-t-[50px] relative bg-cyan-500/5 backdrop-blur-[2px] overflow-hidden flex items-center justify-center">
              {/* 空气分子 */}
              {dots.slice(0, visibleDots).map(dot => (
                <div key={dot.id} 
                     className="absolute w-1 h-1 bg-cyan-200/40 rounded-full animate-bounce"
                     style={{ left: `${dot.x}%`, top: `${dot.y}%`, animationDuration: `${dot.animDuration}s` }} />
              ))}
              
              {/* 机械闹钟 */}
              <div className="relative z-10 w-16 h-16 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                 <div className="w-1 h-6 bg-rose-500 origin-bottom -translate-y-2 animate-spin" style={{ animationDuration: '2s' }} />
                 <div className="absolute -top-3 -left-2 w-4 h-4 rounded-full border-2 border-slate-300 bg-slate-700 shadow-inner" />
                 <div className="absolute -top-3 -right-2 w-4 h-4 rounded-full border-2 border-slate-300 bg-slate-700 shadow-inner" />
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-400 origin-bottom animate-ping" style={{ animationDuration: '0.1s' }} />
                 
                 {/* 声波模拟 */}
                 <div className="absolute inset-[-20px] rounded-full border border-cyan-400/30 animate-ping pointer-events-none" 
                      style={{ opacity: pressure, transform: `scale(${0.5 + pressure * 0.5})` }} />
              </div>
            </div>
            {/* 底座 */}
            <div className="w-56 h-6 bg-slate-700 rounded-sm z-20 shadow-lg border-x border-white/10" />
            <div className="w-8 h-12 bg-slate-800 border-x border-white/5" />
            <div className="absolute -bottom-8 flex gap-2 items-center justify-center text-slate-400 text-xs font-mono border border-white/10 px-3 py-1 bg-black/40 rounded-full backdrop-blur-md">
              <Wind size={12} className={pressure < 1.0 && pressure > 0 ? "text-cyan-400 animate-pulse" : ""} />
             真空泵
            </div>
          </div>
          
          <div className="mt-auto px-4 py-2 bg-black/30 rounded-full border border-white/5 backdrop-blur-md text-slate-300 flex items-center gap-3 w-64 shadow-inner">
             <Volume2Icon isVibrating={true} force={pressure * 100} />
             <div className="flex-1 bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
               <div className="bg-cyan-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]" style={{ width: `${pressure * 100}%` }} />
             </div>
             <span className="w-10 text-right font-mono text-xs text-cyan-300/80 tracking-tighter">{pressure > 0 ? (pressure * 100).toFixed(0) + '%' : '接近真空'}</span>
          </div>

        </div>

        {/* 交互控制与结论区 */}
        <div className="w-full xl:w-96 flex flex-col gap-4 overflow-y-auto">
          <div className={`p-5 ${subPanelClass}`}>
            <h3 className="text-sm font-bold text-cyan-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-500/50 rounded-full"></span>
              真空抽取控制
            </h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm font-mono text-slate-400 mb-2">
                <span>罩内气气压</span>
                <span className="text-cyan-400">{pressure.toFixed(1)} atm</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" value={pressure} 
                onChange={(e) => setPressure(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 mt-2">
                <span>0.0 (真空)</span>
                <span>1.0 (标准大气压)</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex-1">
            <h3 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500/50 rounded-full"></span>
              实验结论
            </h3>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-base text-gray-200 leading-8">
              声音的传播需要 <span className="text-emerald-300 font-bold border-b border-emerald-500/40 px-1">介质</span>（如空气、水、固体）。
              <br className="my-2"/>
              <span className="text-emerald-300 font-bold border-b border-emerald-500/40 px-1">真空</span> 不能传声。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 模块三：与声音赛跑——声速的测量与比较
// ==========================================
const SpeedSoundExperiment = ({ embedded }) => {
  const panelClass = embedded ? 'bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl' : 'bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl';
  const subPanelClass = embedded ? 'bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]' : 'bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)]';
  const [medium, setMedium] = useState('air'); // air, water, steel
  const [temp, setTemp] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [wavePos, setWavePos] = useState(0); // 0 to 100%
  const [records, setRecords] = useState([]);

  const getSpeed = () => {
    if (medium === 'water') return 1500;
    if (medium === 'steel') return 5200;
    return 331.4 + 0.6 * temp;
  };

  const speed = getSpeed();
  const distance = 1000; // m
  const calcTime = distance / speed;

  useEffect(() => {
    let reqId;
    let startTimestamp = null;

    if (isPlaying) {
      // Scale visual time to make it pleasant
      const animScale = 500; 

      const animate = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        
        let progress = elapsed / (calcTime * animScale);
        if (progress >= 1) progress = 1;

        setWavePos(progress * 100);
        setTime(progress * calcTime);

        if (progress < 1) {
          reqId = requestAnimationFrame(animate);
        } else {
          setIsPlaying(false);
          setRecords(prev => {
            const newRecord = { 
              medium: medium === 'air' ? `空气(${temp}℃)` : medium === 'water' ? '纯水' : '钢铁', 
              s: distance, 
              t: calcTime.toFixed(2), 
              v: speed.toFixed(0) 
            };
            if (prev.length > 0 && prev[prev.length -1].medium === newRecord.medium) return prev;
            return [...prev, newRecord];
          });
        }
      };
      reqId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(reqId);
  }, [isPlaying, calcTime, medium, temp, speed]);

  const handleEmit = () => {
    setWavePos(0);
    setTime(0);
    setIsPlaying(true);
  };

  const getMediumStyles = () => {
    if (medium === 'air') return 'bg-sky-900/20 border-sky-700';
    if (medium === 'water') return 'bg-blue-600/30 border-blue-500';
    return 'bg-slate-600/50 border-slate-400';
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="mt-4 flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        
        {/* 核心展示区 */}
        <div className={`flex-1 p-6 ${panelClass} flex flex-col shadow-inner`}>
          
          <div className="flex justify-between items-center text-slate-300 font-mono mb-4 px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 shadow-2xl">
            <span className="text-sm tracking-widest text-slate-500">计时器</span>
            <div className="flex items-center gap-4">
              <span className="text-sm">T: <span className={`font-bold ${isPlaying ? "text-cyan-400" : "text-white"}`}>{time.toFixed(2)}</span> s</span>
              <span className="w-[1px] h-4 bg-white/10"></span>
              <span className="text-sm">S: <span className="text-white font-bold">{distance}</span> m</span>
            </div>
          </div>

          <div className="flex-1 relative flex items-center min-h-[250px]">
             {/* 赛道 */}
             <div className={`absolute left-0 md:left-10 right-0 md:right-10 h-16 rounded-2xl border overflow-hidden flex items-center pr-4 shadow-2xl transition-colors duration-500 ${getMediumStyles()}`}>
                <div className="absolute left-0 w-full flex space-x-10 opacity-5">
                   {[...Array(20)].map((_,i) => <div key={i} className="h-16 w-[1px] bg-white"></div>)}
                </div>
                {/* 终点接收器 */}
                <div className="absolute right-0 h-full w-14 bg-rose-500/20 border-l border-rose-500/30 flex items-center justify-center text-xs font-black text-rose-300 tracking-tighter uppercase">
                  接收器
                </div>

                {/* 声波特效 */}
                {wavePos > 0 && (
                   <div className="absolute h-full w-8 text-cyan-400 flex items-center" style={{ left: `max(0%, calc(${wavePos}% - 3rem))` }}>
                     <MoveRight size={32} className="opacity-80 animate-pulse" />
                     <div className="h-2/3 w-6 flex flex-row items-center gap-1 ml-2">
                        <div className="h-full w-[2px] bg-cyan-400/20 rounded-full"></div>
                        <div className="h-3/4 w-[2px] bg-cyan-400/40 rounded-full"></div>
                        <div className="h-1/2 w-[3px] bg-cyan-300 rounded-full shadow-[0_0_8px_cyan]"></div>
                     </div>
                   </div>
                )}
             </div>

             {/* 发声器 */}
             <div className="absolute left-0 md:left-4 w-12 h-20 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-end overflow-hidden z-10 shadow-2xl">
               <div className="w-8 h-16 bg-slate-800 rounded-l-full border-y border-l border-white/5 flex items-center justify-end pr-1 shadow-inner">
                 <div className="w-2 h-4 bg-cyan-500/50 rounded-full blur-[1px]"></div>
               </div>
             </div>
          </div>

          {/* 公式提示 */}
          <div className="mt-auto bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500 tracking-widest uppercase">公式 A</span>
              <code className="text-sm font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-purple-300 shadow-sm">v = s / t</code>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500 tracking-widest uppercase">公式 B</span>
              <code className="text-sm font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-pink-300 shadow-sm">v ≈ 331.4 + 0.6 × T</code>
            </div>
          </div>
        </div>

        {/* 交互控制与结论区 */}
        <div className="w-full xl:w-96 flex flex-col gap-4 overflow-y-auto">
          <div className={`p-5 ${subPanelClass}`}>
            <h3 className="text-sm font-bold text-cyan-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-500/50 rounded-full"></span>
              赛道参数配置
            </h3>
            
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-500 tracking-widest uppercase mb-2">选择传播介质</label>
              <select 
                value={medium} 
                onChange={(e) => { setMedium(e.target.value); setWavePos(0); setTime(0); }}
                disabled={isPlaying}
                className="w-full bg-slate-900 border border-white/10 text-white text-sm p-2.5 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none transition-all cursor-pointer"
              >
                <option value="air">🌀 气态 (空气)</option>
                <option value="water">💧 液态 (纯水)</option>
                <option value="steel">🧱 固态 (钢铁)</option>
              </select>
            </div>

            {medium === 'air' && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between text-sm font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1 uppercase tracking-tighter"><Thermometer size={12}/> 当前温度</span>
                  <span className="text-pink-400 font-bold">{temp} ℃</span>
                </div>
                <input 
                  type="range" min="-20" max="50" step="1" value={temp} 
                  onChange={(e) => { setTemp(Number(e.target.value)); setWavePos(0); setTime(0); }}
                  className="w-full accent-pink-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  disabled={isPlaying}
                />
              </div>
            )}

            <button 
              onClick={handleEmit}
              disabled={isPlaying}
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed text-purple-100 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm shadow-lg"
            >
              {isPlaying ? <StopCircle size={18} className="animate-spin text-purple-400" /> : <Play size={18} />} 
              {isPlaying ? '声波传输中...' : '发射声波'}
            </button>
          </div>

          <div className={`p-4 flex-1 flex flex-col overflow-hidden ${subPanelClass} flex-1 overflow-hidden flex flex-col`}>
            <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2 bg-slate-800/20 p-2 rounded-lg">
              <span className="w-1.5 h-4 bg-purple-500/50 rounded-full"></span>
              实验实时数据
            </h3>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-slate-900 border-b border-white/5">
                  <tr className="text-slate-500 font-black uppercase tracking-tighter">
                    <th className="py-2 px-1">介质</th>
                    <th className="py-2 px-1 text-center">时间 (秒)</th>
                    <th className="py-2 px-1 text-right">速度 (米/秒)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.length === 0 && (
                    <tr><td colSpan="3" className="text-center py-8 text-slate-600 font-mono italic">暂无测速数据</td></tr>
                  )}
                  {records.map((r, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="py-2.5 px-1 text-slate-300 font-medium">{r.medium}</td>
                      <td className="py-2.5 px-1 font-mono text-cyan-400/80 text-center">{r.t}</td>
                      <td className="py-2.5 px-1 font-mono text-purple-300 text-right group-hover:text-purple-200">{r.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 主入口组件
// ==========================================
export default function Animation({ embedded = false }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "实验一：产生", icon: <Hammer size={16} />, component: <TuningForkExperiment embedded={embedded} /> },
    { title: "实验二：传播", icon: <Droplets size={16} />, component: <VacuumExperiment embedded={embedded} /> },
    { title: "实验三：声速", icon: <MoveRight size={16} />, component: <SpeedSoundExperiment embedded={embedded} /> },
  ];

  return (
    <div className={`flex flex-col h-full text-white ${embedded ? 'bg-[#0b0e14]' : 'bg-[#0b0e14]'}`}>
      {/* 选项卡导航 - 参考 p101 风格 */}
      <div className="flex gap-2 p-4 pb-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl transition-all text-xs font-bold tracking-widest uppercase border-t border-x ${
              activeTab === idx 
                ? 'bg-gray-900/60 text-cyan-400 border-gray-700/50 shadow-[0_-2px_0_0_rgba(6,182,212,1)]' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border-transparent'
            }`}
          >
            {tab.icon}
            <span className="whitespace-nowrap">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* 激活的实验模块 */}
      <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col min-h-0 relative border-t border-gray-700/50 bg-gray-900/60 backdrop-blur-xl mx-4 mb-4 rounded-b-2xl rounded-tr-2xl">
        <div key={activeTab} className="h-full w-full animate-in fade-in zoom-in-95 duration-500">
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
}