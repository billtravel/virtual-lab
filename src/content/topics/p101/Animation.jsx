import React, { useState, useEffect, useRef } from 'react';

// --- Icons (Inline SVGs for portability) ---
const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);

const RulerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 15.3l-2.6 2.6a1 1 0 0 1-1.4 0l-12-12a1 1 0 0 1 0-1.4l2.6-2.6a1 1 0 0 1 1.4 0l12 12a1 1 0 0 1 0 1.4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l2 2"/><path d="M9.5 10.5l2 2"/><path d="M7 13l2 2"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const SwapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 3h5v5"/><path d="M4 21h5v-5"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 14v2c0 .6.4 1 1 1h2a3 3 0 0 0 6 0h2a3 3 0 0 0 6 0z"/>
    <circle cx="7" cy="17" r="2" fill="white" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="17" r="2" fill="white" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function App({ embedded = false }) {
  const [activeTab, setActiveTab] = useState('length');

  const rootClass = embedded
    ? "h-full min-h-0 flex flex-col font-sans text-white selection:bg-cyan-500/30 overflow-hidden relative"
    : "h-full w-full bg-[#0b0e14] flex flex-col font-sans text-gray-200 selection:bg-cyan-500/30 overflow-hidden relative";

  const panelClass = embedded
    ? "bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl"
    : "bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl";

  const activeTabClass = embedded
    ? "bg-white/10 text-cyan-300 border-t border-x border-white/15 shadow-[0_-2px_0_0_rgba(255,255,255,0.1)]"
    : "bg-gray-900/60 text-cyan-400 border-t border-x border-gray-700/50 shadow-[0_-2px_0_0_rgba(6,182,212,1)]";
  
  const inactiveTabClass = embedded
    ? "bg-black/20 text-gray-400 hover:bg-white/5 border-b border-white/15 text-gray-400"
    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border-b border-transparent";

  return (
    <div className={rootClass}>
      {!embedded && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-[#0b0e14] to-[#0b0e14] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <header className="bg-gray-900/80 backdrop-blur-md border-b border-cyan-900/50 px-6 py-4 flex justify-between items-center shadow-[0_0_20px_rgba(6,182,212,0.1)] z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
              <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                MEASUREMENT // 长度和时间的测量
              </h1>
            </div>
          </header>
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col w-full z-10 relative ${embedded ? "p-2 sm:p-4 overflow-y-auto overflow-x-hidden overscroll-contain" : "p-6 overflow-hidden"} min-h-0`}>
        {/* Navigation Tabs - No gap at bottom! mb-0 */}
        <div className="grid grid-cols-2 gap-2 mb-0 w-full shrink-0">
          <button
            onClick={() => setActiveTab('length')}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${
              activeTab === 'length' 
                ? activeTabClass 
                : inactiveTabClass
            }`}
          >
            <RulerIcon /> 实验一：测量长度
          </button>
          <button
            onClick={() => setActiveTab('time')}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${
              activeTab === 'time' 
                ? activeTabClass
                : inactiveTabClass
            }`}
          >
            <ClockIcon /> 实验二：测量时间
          </button>
        </div>

        {/* Workspace */}
        <div className={`${panelClass} !rounded-tl-none p-6 md:p-8 min-h-[500px] mb-6 flex flex-col shrink-0 relative z-10`}>
          {activeTab === 'length' && <LengthExperiment />}
          {activeTab === 'time' && <TimeExperiment />}
        </div>

        {/* Common Measurement Tools Section */}
        <CommonTools panelClass={panelClass} embedded={embedded} />
      </main>
    </div>
  );
}

// ==========================================
// Tools Information Component
// ==========================================
function CommonTools({ panelClass, embedded }) {
  return (
    <div className={`${panelClass} p-6 md:p-8 shrink-0 relative z-10`}>
      <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${embedded ? 'text-white' : 'text-gray-200'}`}>
        <span className="text-2xl">🔧</span> 常用测量工具
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* 长度测量工具 */}
        <div className="bg-cyan-900/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
            <RulerIcon /> 长度测量工具
          </h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5 text-lg">•</span>
              <div><strong className="text-cyan-200">刻度尺：</strong>实验中最基本的长度测量工具，分度值一般为 1mm（使用时需要估读到分度值的下一位）。</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5 text-lg">•</span>
              <div><strong className="text-cyan-200">卷尺：</strong>用于测量较长的距离，量程大，生活中常用于建筑和裁缝。</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5 text-lg">•</span>
              <div><strong className="text-cyan-200">游标卡尺：</strong>精细的长度测量工具，常用于测量圆柱体外径、管内径及深度，精度一般为 0.1mm 或更小（无需估读）。</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5 text-lg">•</span>
              <div><strong className="text-cyan-200">螺旋测微器（千分尺）：</strong>更精密的测量工具，可精确到 0.01mm，常用于测量细金属丝的直径或薄片厚度。</div>
            </li>
          </ul>
        </div>

        {/* 时间测量工具 */}
        <div className="bg-indigo-900/10 border border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
            <ClockIcon /> 时间测量工具
          </h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-indigo-500 font-bold mt-0.5 text-lg">•</span> 
              <div><strong className="text-indigo-200">机械停表（秒表）：</strong>实验室传统计时工具，表盘分为内圈（分级）和外圈（秒级），不需要估读。</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-500 font-bold mt-0.5 text-lg">•</span> 
              <div><strong className="text-indigo-200">电子停表：</strong>数字显示，读数更直观、精确，实验室和体育赛事常用精度可达 0.01s。</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-500 font-bold mt-0.5 text-lg">•</span> 
              <div><strong className="text-indigo-200">石英钟 / 电子表：</strong>生活中最普及的计时工具，由石英晶体振荡提供稳定频率。</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-500 font-bold mt-0.5 text-lg">•</span> 
              <div><strong className="text-indigo-200">原子钟：</strong>目前最精密的计时装置，主要应用于航空航天、卫星导航及前沿科研，几十万年甚至几千万年才误差一秒。</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Reusable Unit Conversion Component
// ==========================================
function UnitConversionUI({ mode }) {
  const isLength = mode === 'length';
  
  const lengthNodes = ['km', 'm', 'dm', 'cm', 'mm', 'μm', 'nm'];
  const lengthLinks = {
    'km-m': { factor: 1000, power: 3 }, 'm-km': { factor: 1/1000, power: -3 },
    'm-dm': { factor: 10, power: 1 }, 'dm-m': { factor: 1/10, power: -1 },
    'dm-cm': { factor: 10, power: 1 }, 'cm-dm': { factor: 1/10, power: -1 },
    'cm-mm': { factor: 10, power: 1 }, 'mm-cm': { factor: 1/10, power: -1 },
    'mm-μm': { factor: 1000, power: 3 }, 'μm-mm': { factor: 1/1000, power: -3 },
    'μm-nm': { factor: 1000, power: 3 }, 'nm-μm': { factor: 1/1000, power: -3 },
  };

  const timeNodes = ['h', 'min', 's'];
  const timeLinks = {
    'h-min': { factor: 60, text: '×60' }, 'min-h': { factor: 1/60, text: '÷60' },
    'min-s': { factor: 60, text: '×60' }, 's-min': { factor: 1/60, text: '÷60' },
  };

  const activeNodes = isLength ? lengthNodes : timeNodes;
  const activeLinks = isLength ? lengthLinks : timeLinks;

  const [sourceUnit, setSourceUnit] = useState(isLength ? 'cm' : 'min');
  const [targetUnit, setTargetUnit] = useState(isLength ? 'm' : 's');
  const [inputValue, setInputValue] = useState(isLength ? '5' : '2');
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animPath, setAnimPath] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [currentValue, setCurrentValue] = useState(0);
  const [showExamFormat, setShowExamFormat] = useState(false);
  const [examFormatData, setExamFormatData] = useState(null);

  const handleReset = () => {
    setIsAnimating(false);
    setAnimPath([]);
    setCurrentStepIndex(-1);
    setCurrentValue(0);
    setShowExamFormat(false);
  };

  const cleanFloat = (num) => parseFloat(num.toPrecision(10));

  const startAnimation = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      alert("请输入有效的数字！");
      return;
    }
    if (sourceUnit === targetUnit) {
      alert("起点和终点单位相同啦！");
      return;
    }

    handleReset();
    
    const srcIdx = activeNodes.indexOf(sourceUnit);
    const tgtIdx = activeNodes.indexOf(targetUnit);
    
    let path = [];
    if (srcIdx < tgtIdx) {
      for (let i = srcIdx; i <= tgtIdx; i++) path.push(activeNodes[i]);
    } else {
      for (let i = srcIdx; i >= tgtIdx; i--) path.push(activeNodes[i]);
    }
    
    setAnimPath(path);
    setCurrentStepIndex(0);
    setCurrentValue(val);
    setIsAnimating(true);
    setShowExamFormat(false);

    let totalPower = 0;
    let totalTimeFactor = 1;
    
    if (isLength) {
      for (let i = 0; i < path.length - 1; i++) {
        const linkKey = `${path[i]}-${path[i+1]}`;
        totalPower += activeLinks[linkKey].power;
      }
      setExamFormatData({
        origVal: val, origUnit: sourceUnit, tgtUnit: targetUnit,
        isLength: true, power: totalPower, finalVal: cleanFloat(val * Math.pow(10, totalPower))
      });
    } else {
      let isMult = srcIdx < tgtIdx;
      for (let i = 0; i < path.length - 1; i++) {
        const linkKey = `${path[i]}-${path[i+1]}`;
        totalTimeFactor *= (isMult ? 60 : 1/60);
      }
      setExamFormatData({
        origVal: val, origUnit: sourceUnit, tgtUnit: targetUnit,
        isLength: false, 
        factorText: isMult ? `× ${path.length>2 ? '60 × 60' : '60'}` : `× (1 / ${path.length>2 ? '3600' : '60'})`,
        finalVal: cleanFloat(val * totalTimeFactor)
      });
    }
  };

  useEffect(() => {
    if (!isAnimating || currentStepIndex === -1) return;

    if (currentStepIndex < animPath.length - 1) {
      const timer = setTimeout(() => {
        const fromNode = animPath[currentStepIndex];
        const toNode = animPath[currentStepIndex + 1];
        const linkKey = `${fromNode}-${toNode}`;
        const link = activeLinks[linkKey];
        
        setCurrentValue(prev => cleanFloat(prev * link.factor));
        setCurrentStepIndex(prev => prev + 1);
      }, 1200); 
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setShowExamFormat(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStepIndex, animPath, activeLinks]);

  return (
    <div className="w-full h-full overflow-hidden font-sans transition-colors duration-700 ease-in-out">
      <div className="bg-emerald-900/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex gap-3 items-start mb-6">
        <SwapIcon className="mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold mb-1">附加任务：{isLength ? '长度' : '时间'}单位换算</h3>
          <p className="text-sm">选择你想换算的单位并输入数字，观察数值的“跳跃”过程。</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-6 bg-black/30 p-4 rounded-xl border border-gray-700/60">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <input 
            type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            className="w-20 px-3 py-2 border-2 border-gray-600 bg-gray-900/70 text-gray-100 rounded-lg text-center font-mono focus:border-emerald-500 focus:outline-none"
          />
          
          <select value={sourceUnit} onChange={(e) => setSourceUnit(e.target.value)} className="px-2 py-2 border-2 border-gray-600 rounded-lg bg-gray-900 text-gray-100 font-bold">
            {activeNodes.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          
          <span className="text-gray-400 font-bold px-1">➔</span>

          <select value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)} className="px-2 py-2 border-2 border-gray-600 rounded-lg bg-gray-900 text-gray-100 font-bold">
            {activeNodes.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <button 
          onClick={startAnimation}
          disabled={isAnimating}
          className={`w-full py-2 rounded-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
            isAnimating ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/50 text-emerald-300 active:scale-95'
          }`}
        >
          {isAnimating ? '演示中...' : '▶ 开始换算'}
        </button>
      </div>

      {/* Animation Canvas */}
      <div className="relative min-h-[160px] bg-gray-800 rounded-2xl p-6 shadow-inner flex items-center justify-center overflow-x-auto border-4 border-gray-700 flex-1">
         <div className="flex items-center min-w-max">
            {activeNodes.map((node, index) => {
               const isActive = animPath[currentStepIndex] === node;
               const isPathNode = animPath.includes(node);
               const isTarget = targetUnit === node;
               const isSource = sourceUnit === node;

               const linkKeyForward = index < activeNodes.length - 1 ? `${node}-${activeNodes[index+1]}` : null;
               const linkForward = linkKeyForward ? activeLinks[linkKeyForward] : null;

               return (
                 <React.Fragment key={node}>
                   <div className="relative flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all duration-500 z-10 ${
                        isActive ? 'bg-emerald-400 border-emerald-200 text-black shadow-[0_0_20px_rgba(52,211,153,0.8)] scale-110' :
                        isPathNode ? 'bg-emerald-900 border-emerald-700 text-emerald-200' :
                        (isSource || isTarget) ? 'bg-gray-600 border-gray-500 text-white' :
                        'bg-gray-800 border-gray-600 text-gray-500'
                      }`}>
                        {node}
                      </div>

                      {isActive && (
                         <div className="absolute -top-12 bg-black/85 text-emerald-200 px-2 py-1 rounded-md font-mono font-bold text-sm shadow-lg border-2 border-emerald-500 animate-bounce whitespace-nowrap">
                            {currentValue}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-500"></div>
                         </div>
                      )}
                   </div>

                   {index < activeNodes.length - 1 && (
                     <div className="relative w-8 h-1 flex items-center justify-center mx-1">
                        <div className="absolute w-full h-1 bg-gray-600 rounded"></div>
                        
                        {isPathNode && animPath.includes(activeNodes[index+1]) && (
                           <div className={`absolute w-full h-1 bg-emerald-500 rounded shadow-[0_0_10px_rgba(52,211,153,0.8)]`}></div>
                        )}

                        <div className="absolute -top-6 text-[10px] font-mono font-bold text-gray-400 whitespace-nowrap">
                           {isLength 
                             ? (linkForward.power === 3 ? '10³' : '10')
                             : '60'}
                        </div>
                     </div>
                   )}
                 </React.Fragment>
               );
            })}
         </div>

         {!isAnimating && currentStepIndex === -1 && !showExamFormat && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 text-gray-400 font-bold tracking-widest text-xs pointer-events-none opacity-50 whitespace-nowrap">
               配置参数后点击演示
             </div>
         )}
      </div>

      {/* Exam Format Result Container */}
      <div className={`mt-6 transition-all duration-700 ${showExamFormat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-black/40 border border-emerald-500/40 p-4 rounded-xl shadow-lg relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg">
               标准等式书写
            </div>
            
            {examFormatData && (
              <div className="text-center pt-3">
                 <div className="text-lg md:text-xl font-serif text-gray-200 tracking-wide font-medium flex flex-wrap justify-center items-center gap-x-1 gap-y-2">
                    <span>{examFormatData.origVal}</span>
                    <span className="text-emerald-700">{examFormatData.origUnit}</span>
                    <span>=</span>
                    
                    <span>{examFormatData.origVal}</span>
                    <span className="text-orange-500 text-base md:text-lg">
                      {examFormatData.isLength 
                        ? (<span>× 10<sup className="text-sm">{examFormatData.power}</sup></span>) 
                        : (<span>{examFormatData.factorText}</span>)}
                    </span>
                      <span className="text-cyan-300">{examFormatData.tgtUnit}</span>
                    <span>=</span>

                    <span className="font-bold underline decoration-2 decoration-emerald-300 underline-offset-4">{examFormatData.finalVal}</span>
                      <span className="text-cyan-300 font-bold">{examFormatData.tgtUnit}</span>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

// ==========================================
// Module 1: Length Measurement
// ==========================================
function LengthExperiment() {
  const containerRef = useRef(null);
  const [rulerX, setRulerX] = useState(50); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  
  const [pencilLength, setPencilLength] = useState(() => (Math.floor(Math.random() * 40) + 45) / 10);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const PIXELS_PER_CM = 50; 
  const pencilWidthPx = pencilLength * PIXELS_PER_CM;
  const PENCIL_START_X = 150; 

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX - rulerX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    let newX = e.clientX - dragStartX;
    if (newX < -100) newX = -100;
    if (newX > 600) newX = 600;
    setRulerX(newX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const checkAnswer = () => {
    const value = parseFloat(userInput);
    if (isNaN(value)) {
      setFeedback({ type: 'error', text: '请输入有效的数字！' });
      return;
    }

    const difference = Math.abs(value - pencilLength);
    if (difference < 0.05) {
      if ((userInput.includes('.') && userInput.split('.')[1].length >= 2) || (value===pencilLength && Number.isInteger(pencilLength) && userInput.includes('.'))) {
         setFeedback({ type: 'success', text: `完全正确！你测量出了真实长度 ${pencilLength} cm，并且进行了正确的估读（${userInput} cm）。` });
      } else {
         setFeedback({ type: 'warning', text: `数值 ${value} cm 是对的，但是注意物理实验要求“估读到分度值的下一位”！\n既然正好对齐刻度，应该记录为 ${pencilLength.toFixed(2)} cm 哟。` });
      }
    } else {
      setFeedback({ type: 'error', text: `不太对哦。再仔细观察一下尺子的两端？（提示：物体右端刻度 - 物体左端刻度 = 物体长度）` });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-10 h-full select-none" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Left Column: Measurement Task */}
      <div className="flex-1 flex flex-col">
        <div className="bg-cyan-900/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-xl flex gap-3 items-start mb-8">
          <LightbulbIcon className="mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold mb-1">实验任务：测量铅笔的长度</h3>
            <p className="text-sm">用鼠标<strong>拖拽下方黄色的刻度尺</strong>，使其边缘或某个刻度对齐铅笔的左端，然后读取右端的数值并计算。注意这把尺子的分度值是 1mm，别忘了<strong>估读</strong>哦！</p>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="relative h-64 bg-black/30 border border-dashed border-gray-600 rounded-xl overflow-hidden mb-8 shadow-inner"
        >
          <div 
            className="absolute top-16 h-8 flex items-center shadow-sm z-10"
            style={{ left: `${PENCIL_START_X}px`, width: `${pencilWidthPx}px` }}
          >
            <div className="w-4 h-full bg-pink-300 rounded-l-sm border-2 border-gray-700 border-r-0"></div>
            <div className="w-3 h-full bg-gray-300 border-y-2 border-gray-700"></div>
            <div className="flex-1 h-full bg-yellow-400 border-y-2 border-gray-700 flex flex-col justify-evenly">
               <div className="w-full h-px bg-yellow-500"></div>
               <div className="w-full h-px bg-yellow-500"></div>
            </div>
            <div className="w-6 h-full bg-[#E5C195] border-y-2 border-r-2 border-gray-700 flex items-center justify-end" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}>
               <div className="w-2 h-2 bg-gray-800 rounded-full mr-[-1px]"></div>
            </div>
          </div>

          <div 
            className={`absolute top-28 h-20 bg-[#FCD34D] border-2 border-gray-800 cursor-grab active:cursor-grabbing flex transition-shadow ${isDragging ? 'shadow-2xl scale-[1.01]' : 'shadow-md'}`}
            style={{ left: `${rulerX}px`, width: `${15 * PIXELS_PER_CM + 20}px` }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1 right-2 text-xs font-bold text-gray-700">cm</div>
            <div className="relative w-full h-full ml-[10px]">
              {Array.from({ length: 151 }).map((_, i) => {
                const isCm = i % 10 === 0;
                const isHalfCm = i % 5 === 0 && !isCm;
                return (
                  <div 
                    key={i} 
                    className={`absolute top-0 w-[2px] bg-gray-800 ${isCm ? 'h-5' : isHalfCm ? 'h-3' : 'h-2'}`} 
                    style={{ left: `${i * (PIXELS_PER_CM / 10)}px` }}
                  >
                    {isCm && (
                      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-800 pointer-events-none">
                        {i / 10}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-auto">
          <div className="flex items-center gap-3">
            <label className="font-bold text-gray-300">这支铅笔的长度是：</label>
            <input 
              type="number" 
              step="0.01"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-24 px-3 py-2 border-2 border-gray-600 bg-gray-900/70 text-gray-100 rounded-lg focus:outline-none focus:border-cyan-500 text-center font-mono text-lg"
              placeholder="0.00"
            />
            <span className="font-bold text-gray-300">cm</span>
            <button 
              onClick={checkAnswer}
              className="ml-4 bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/50 text-cyan-300 px-6 py-2 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <CheckIcon /> 提交验证
            </button>
          </div>

          {feedback && (
            <div className={`mt-2 px-6 py-3 rounded-lg max-w-lg text-center whitespace-pre-line ${
              feedback.type === 'success' ? 'bg-green-900/20 text-green-300 border border-green-500/40' :
              feedback.type === 'warning' ? 'bg-yellow-900/20 text-yellow-300 border border-yellow-500/40' :
              'bg-red-900/20 text-red-300 border border-red-500/40'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Unit Conversion */}
      <div className="w-full xl:w-[500px] shrink-0 bg-black/30 border border-gray-700/60 p-6 rounded-2xl flex flex-col backdrop-blur-sm">
        <UnitConversionUI mode="length" />
      </div>
    </div>
  );
}

// ==========================================
// Module 2: Time Measurement
// ==========================================
function TimeExperiment() {
  const [carPos, setCarPos] = useState(0); 
  const [isCarRunning, setIsCarRunning] = useState(false);
  const [carHasFinished, setCarHasFinished] = useState(false);
  const carReqRef = useRef(null);
  const carStartTimeRef = useRef(0);
  const actualDurationRef = useRef(0); 

  const [time, setTime] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); 
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const startExperiment = () => {
    setCarPos(0);
    setCarHasFinished(false);
    setFeedback(null);
    setUserInput('');
    setTime(0);
    
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
    setIsTiming(true);

    actualDurationRef.current = 2500 + Math.random() * 2500; 
    setIsCarRunning(true);
    carStartTimeRef.current = performance.now();
    
    const animateCar = (now) => {
      const elapsed = now - carStartTimeRef.current;
      const progress = elapsed / actualDurationRef.current;
      
      if (progress >= 1) {
        setCarPos(100);
        setIsCarRunning(false);
        setCarHasFinished(true);
      } else {
        setCarPos(progress * 100);
        carReqRef.current = requestAnimationFrame(animateCar);
      }
    };
    carReqRef.current = requestAnimationFrame(animateCar);
  };

  const handleStartStop = () => {
    if (isTiming) {
      clearInterval(intervalRef.current);
      setIsTiming(false);
    } else {
      if (!isCarRunning && !carHasFinished) {
        startExperiment();
      } else if (carHasFinished) {
        startExperiment();
      }
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    cancelAnimationFrame(carReqRef.current);
    setIsTiming(false);
    setTime(0);
    setCarPos(0);
    setIsCarRunning(false);
    setCarHasFinished(false);
    setFeedback(null);
    setUserInput('');
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(carReqRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const checkAnswer = () => {
    const value = parseFloat(userInput);
    if (isNaN(value)) {
      setFeedback({ type: 'error', text: '请输入有效的数字！' });
      return;
    }

    const stopwatchSeconds = (time / 1000).toFixed(2);
    const actualSeconds = (actualDurationRef.current / 1000).toFixed(2);
    
    if (Math.abs(value - parseFloat(stopwatchSeconds)) > 0.02) {
      setFeedback({ 
        type: 'error', 
        text: `读取数据错误。你秒表上的时间是 ${stopwatchSeconds} s，而你输入的是 ${value} s。请直接读取秒表数据！` 
      });
      return;
    }

    if (time === 0) {
      setFeedback({ type: 'error', text: '你还没有进行实验哦！点击“开始”发车吧。' });
      return;
    }

    const error = parseFloat(stopwatchSeconds) - parseFloat(actualSeconds);
    const absError = Math.abs(error);

    if (error < -0.1) {
       setFeedback({ type: 'warning', text: `你按得太早啦！小车实际运行了 ${actualSeconds} s，你记录的是 ${stopwatchSeconds} s。点击“复位”再试一次！` });
    } else if (absError < 0.15) {
      setFeedback({ type: 'success', text: `神反应！读数完全正确。小车实际运行了 ${actualSeconds} s，你的误差仅为 ${absError.toFixed(2)} s！` });
    } else if (absError < 0.4) {
       setFeedback({ type: 'success', text: `读数正确！操作稍微有点延迟（或提前）。小车实际运行了 ${actualSeconds} s，你的误差是 ${absError.toFixed(2)} s。成绩很不错了！` });
    } else {
       setFeedback({ type: 'error', text: `读数正确，但是按“停止”的时机偏差有点大哦。小车实际运行了 ${actualSeconds} s，你记录的是 ${stopwatchSeconds} s。` });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-10 h-full">
      {/* Left Column: Time Measurement Task */}
      <div className="flex-1 flex flex-col">
        <div className="bg-indigo-900/10 border border-indigo-500/30 text-indigo-200 p-4 rounded-xl flex gap-3 items-start mb-8">
          <LightbulbIcon className="mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold mb-1">实验任务：测量小车运动的时间</h3>
            <p className="text-sm">点击右侧秒表的<strong>“开始”</strong>按钮，小车将<strong>同步发车</strong>！请紧盯小车的运动轨迹，在<strong>小车车头抵达终点线的瞬间再次点击“停止”</strong>。完成测量后记录时间。</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start mb-8">
          <div className="flex-1 w-full relative h-48 bg-black/30 border border-gray-600 rounded-xl overflow-hidden shadow-inner flex flex-col justify-end pb-4">
             <div className="absolute top-4 left-10 text-4xl opacity-20">☁️</div>
             <div className="absolute top-8 right-20 text-4xl opacity-20">☁️</div>

             <div className="w-full h-16 bg-gray-700 relative shadow-[inset_0_10px_10px_rgba(0,0,0,0.2)]">
                <div className="absolute left-[5%] top-0 w-2 h-full bg-gray-800 opacity-80 border-r border-gray-800 z-10">
                  <span className="absolute -top-6 -left-2 text-xs font-bold text-gray-400">起点</span>
                </div>
                
                <div className="absolute right-[5%] top-0 w-4 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] border-l border-gray-800 z-10">
                   <span className="absolute -top-6 -left-2 text-xs font-bold text-gray-400">终点</span>
                </div>

                <div className="w-full h-0.5 border-t-2 border-dashed border-gray-400 absolute top-1/2 -translate-y-1/2"></div>
                
                <div 
                  className={`absolute top-[-8px] text-cyan-400 drop-shadow-lg z-20 ${isCarRunning ? '-rotate-1 transition-transform' : ''}`}
                  style={{ left: `calc(5% + ${carPos * 0.9}%)`, transform: `translateX(-50%) ${isCarRunning ? 'scaleY(0.98) translateY(2px)' : ''}` }}
                >
                  <CarIcon />
                  {isCarRunning && <div className="absolute top-6 -left-4 w-3 h-3 bg-gray-800/50 rounded-full animate-ping"></div>}
                </div>
             </div>

             {!isCarRunning && !carHasFinished && carPos === 0 && (
               <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold tracking-widest text-sm pointer-events-none whitespace-nowrap">
                 👈 请点击秒表开始
               </div>
             )}
          </div>

          <div className="w-full lg:w-64 bg-gray-800 p-4 rounded-2xl shadow-2xl border-4 border-gray-700 flex flex-col items-center flex-shrink-0">
             <div className="text-gray-400 text-xs font-bold mb-2 tracking-widest">DIGITAL STOPWATCH</div>
             <div className="bg-gray-900 border-2 border-gray-950 w-full rounded-lg p-3 text-center mb-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="font-mono text-3xl font-bold text-emerald-400 tracking-wider" style={{ textShadow: '0 0 10px rgba(52,211,153,0.5)' }}>
                  {formatTime(time)}
                </span>
             </div>
             
             <div className="flex gap-4 w-full px-2">
                <button 
                  onClick={handleStartStop}
                  className={`flex-1 py-3 rounded-full font-bold shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all ${isTiming ? 'bg-red-500 hover:bg-red-600 border-red-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white'}`}
                >
                  {isTiming ? '停止' : '发车'}
                </button>
                <button 
                  onClick={handleReset}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 text-white py-3 rounded-full font-bold shadow-md transition-all"
                >
                  复位
                </button>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-auto">
          <div className="flex items-center gap-3">
            <label className="font-bold text-gray-300">根据秒表读数，小车的运动时间是：</label>
            <input 
              type="number" step="0.01" value={userInput} onChange={(e) => setUserInput(e.target.value)}
              className="w-24 px-3 py-2 border-2 border-gray-600 bg-gray-900/70 text-gray-100 rounded-lg focus:outline-none focus:border-indigo-500 text-center font-mono text-lg" placeholder="0.00"
            />
            <span className="font-bold text-gray-300">s (秒)</span>
            <button onClick={checkAnswer} className="ml-4 bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/50 text-indigo-300 px-6 py-2 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
              <CheckIcon /> 提交记录
            </button>
          </div>

          {feedback && (
            <div className={`mt-2 px-6 py-3 rounded-lg max-w-lg text-center whitespace-pre-line ${feedback.type === 'success' ? 'bg-green-900/20 text-green-300 border border-green-500/40' : feedback.type === 'warning' ? 'bg-yellow-900/20 text-yellow-300 border border-yellow-500/40' : 'bg-red-900/20 text-red-300 border border-red-500/40'}`}>
              {feedback.text}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Unit Conversion */}
      <div className="w-full xl:w-[500px] shrink-0 bg-black/30 border border-gray-700/60 p-6 rounded-2xl flex flex-col backdrop-blur-sm">
        <UnitConversionUI mode="time" />
      </div>
    </div>
  );
}