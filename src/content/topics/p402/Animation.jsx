"use client";

import React, { useState, useRef, useEffect } from 'react';

// ==========================================
// 动画平滑插值 Hook (实现丝滑滑动的核心)
// ==========================================
function useSmooth(targetValue, speed = 0.08) {
  const [current, setCurrent] = useState(targetValue);
  const targetRef = useRef(targetValue);
  targetRef.current = targetValue;

  useEffect(() => {
    let frameId;
    const update = () => {
      setCurrent(prev => {
        const diff = targetRef.current - prev;
        if (Math.abs(diff) < 0.1) return targetRef.current;
        return prev + diff * speed; // 线性插值趋近
      });
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [speed]);

  return current;
}

// ==========================================
// 主应用组件
// ==========================================
export default function PinholeImaging({ embedded = false } = {}) {
  // 核心状态参数
  const [params, setParams] = useState({
    objectShape: 'candle',
    objectHeight: 100,
    pinholeSize: 5,
    objectDistance: 150,
    imageDistance: 200,
  });

  // 平滑化后的参数 (用于动画渲染)
  const smoothObjDist = useSmooth(params.objectDistance);
  const smoothImgDist = useSmooth(params.imageDistance);
  const smoothObjHeight = useSmooth(params.objectHeight);
  const smoothPinSize = useSmooth(params.pinholeSize);

  // 计算衍生数据
  const magnification = params.imageDistance / params.objectDistance;
  const targetImageHeight = params.objectHeight * magnification;
  const smoothImgHeight = useSmooth(targetImageHeight);
  
  // 评估清晰度
  const getClarity = (size) => {
    if (size <= 5) return '极度清晰 (锐利)';
    if (size <= 12) return '较清晰 (微糊)';
    if (size <= 25) return '明显模糊 (重叠)';
    return '严重模糊 (光斑化)';
  };

  // 评估像的性质
  const getImageNature = (mag) => {
    let sizeDesc = '等大';
    if (mag > 1.05) sizeDesc = '放大';
    else if (mag < 0.95) sizeDesc = '缩小';
    return `倒立 · ${sizeDesc} · 实像`;
  };

  const handleParamChange = (name, value) => {
    setParams(prev => ({ ...prev, [name]: Number(value) || value }));
  };

  const handleReset = () => {
    setParams({
      objectShape: 'candle', objectHeight: 100,
      pinholeSize: 5,
      objectDistance: 150, imageDistance: 200,
    });
  };

  // 包装平滑参数传给子组件
  const animatedParams = {
    ...params,
    objectDistance: smoothObjDist,
    imageDistance: smoothImgDist,
    objectHeight: smoothObjHeight,
    pinholeSize: smoothPinSize
  };

  const rootClass = embedded
    ? "h-full min-h-0 flex flex-col font-sans text-white selection:bg-cyan-500/30 overflow-hidden relative"
    : "h-full w-full bg-[#0b0e14] flex flex-col font-sans text-gray-200 selection:bg-cyan-500/30 overflow-hidden relative";

  const panelClass = embedded
    ? "bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl flex flex-col relative overflow-hidden"
    : "bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl flex flex-col relative overflow-hidden";

  return (
    <div className={rootClass}>
      {!embedded && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0b0e14] to-[#0b0e14] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <header className="bg-gray-900/80 backdrop-blur-md border-b border-cyan-900/50 px-6 py-4 flex justify-between items-center shadow-[0_0_20px_rgba(6,182,212,0.1)] z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
              <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                OPTICS // 小孔成像规律探究
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-6 py-1.5 rounded-md text-sm transition-all font-mono tracking-widest"
              >
                SYSTEM_RESET / 重置实验
              </button>
            </div>
          </header>
        </>
      )}

      <main
        className={`flex-1 flex flex-col lg:flex-row gap-6 z-10 relative min-h-0 ${
          embedded ? "p-2 sm:p-4 overflow-y-auto overflow-x-hidden overscroll-contain" : "p-6 overflow-hidden"
        }`}
      >
        
        {/* 左侧区域：视窗 + 底部参数控制 */}
        <div className="flex-[2.5] flex flex-col gap-6 min-h-0">
          
          {/* 上半部：图像视窗区 — 嵌入时随可用高度伸缩，避免固定 800px 总撑出滚动条 */}
          <div
            className={`flex flex-col md:flex-row gap-6 min-h-0 ${
              embedded ? "flex-1 basis-0 min-h-[260px]" : "h-[800px]"
            }`}
          >
            {/* 3D侧视图 */}
            <div className={`flex-[1.2] group ${panelClass}`}>
              <div className="absolute top-4 left-4 bg-black/50 border border-cyan-500/30 px-4 py-1 rounded text-cyan-400 font-mono text-xs tracking-widest z-10 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                3D_PERSPECTIVE (鼠标可拖拽旋转)
              </div>
              <div className="flex-1 relative w-full h-full flex items-center justify-center">
                 <View3D params={animatedParams} imageHeight={smoothImgHeight} />
              </div>
            </div>

            {/* 2D正视图 */}
            <div className={`flex-1 ${panelClass}`}>
              <div className="absolute top-4 left-4 bg-black/50 border border-indigo-500/30 px-4 py-1 rounded text-indigo-400 font-mono text-xs tracking-widest z-10 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                 2D_ORTHOGRAPHIC
              </div>
              <div className="flex-1 relative w-full h-full flex items-center justify-center">
                 <View2D params={animatedParams} imageHeight={smoothImgHeight} />
              </div>
            </div>
          </div>

          {/* 下半部：物端参数与光路控制台 */}
          <div
            className={`backdrop-blur-xl rounded-2xl border flex flex-col shadow-2xl p-6 ${
              embedded
                ? "shrink-0 bg-white/10 border-white/15"
                : "flex-1 bg-gray-900/60 border-gray-700/50"
            }`}
          >
            <div
              className={`flex items-center justify-between gap-3 pb-4 mb-6 border-b ${
                embedded ? "border-white/10" : "border-gray-700/50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-3 h-3 bg-cyan-500 rounded-sm shrink-0" />
                <span className="font-mono text-sm tracking-widest text-cyan-400 truncate">
                  CONTROL_PANEL // 实验参数调节矩阵
                </span>
              </div>
              {embedded && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="shrink-0 text-xs font-mono px-3 py-1.5 rounded-md border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15 transition-colors"
                >
                  重置实验
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 h-full">
              {/* 1. 物端参数 */}
              <div className="space-y-6">
                <div className="text-gray-400 text-xs font-mono tracking-widest border-l-2 border-pink-500 pl-2">OBJECT // 物端配置</div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">物体形态 (SHAPE)</label>
                  <select 
                    value={params.objectShape}
                    onChange={(e) => handleParamChange('objectShape', e.target.value)}
                    className="w-full p-2.5 bg-black/50 border border-gray-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="candle">燃烧蜡烛</option>
                    <option value="arrow">标准箭头</option>
                    <option value="letterF">字符 F</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <label>物体高度 (HEIGHT)</label>
                    <span className="text-pink-400 font-mono bg-pink-900/20 px-2 py-0.5 rounded border border-pink-500/30">{params.objectHeight}</span>
                  </div>
                  <input 
                    type="range" min="30" max="150" 
                    value={params.objectHeight}
                    onChange={(e) => handleParamChange('objectHeight', e.target.value)}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>

              {/* 2. 孔径参数 */}
              <div className="space-y-6">
                <div className="text-gray-400 text-xs font-mono tracking-widest border-l-2 border-yellow-500 pl-2">PINHOLE // 挡板孔径</div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <label>小孔尺寸 (SIZE)</label>
                    <span className="text-yellow-400 font-mono bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/30">{params.pinholeSize}</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" 
                    value={params.pinholeSize}
                    onChange={(e) => handleParamChange('pinholeSize', e.target.value)}
                    className="w-full accent-yellow-500"
                  />
                </div>
                <div className="p-3 bg-yellow-900/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500/80 leading-relaxed">
                  提示：调节孔径大小，观察右侧 2D/3D 视窗中图像的<strong className="text-yellow-400">亮度</strong>与<strong className="text-yellow-400">清晰度</strong>变化。
                </div>
              </div>

              {/* 3. 光路距离 */}
              <div className="space-y-6">
                <div className="text-gray-400 text-xs font-mono tracking-widest border-l-2 border-indigo-500 pl-2">DISTANCE // 光路距离</div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <label>物距 u (物体 - 小孔)</label>
                    <span className="text-indigo-400 font-mono bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-500/30">{params.objectDistance}</span>
                  </div>
                  <input 
                    type="range" min="50" max="250" 
                    value={params.objectDistance}
                    onChange={(e) => handleParamChange('objectDistance', e.target.value)}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <label>像距 v (小孔 - 光屏)</label>
                    <span className="text-indigo-400 font-mono bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-500/30">{params.imageDistance}</span>
                  </div>
                  <input 
                    type="range" min="50" max="250" 
                    value={params.imageDistance}
                    onChange={(e) => handleParamChange('imageDistance', e.target.value)}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧区域：知识原理解析 */}
        <div className="w-full lg:w-[480px] flex flex-col gap-6 min-h-0 lg:min-h-0 self-stretch">
          <div
            className={`backdrop-blur-xl p-6 rounded-2xl shadow-2xl flex flex-col min-h-0 h-full max-h-full ${
              embedded ? "bg-white/10 border border-white/15" : "bg-gray-900/60 border border-gray-700/50"
            }`}
          >
            
            <div
              className={`flex items-center gap-3 pb-4 mb-6 border-b ${
                embedded ? "border-white/10" : "border-gray-700/50"
              }`}
            >
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
              <span className="font-mono text-sm tracking-widest text-indigo-400">KNOWLEDGE_BASE // 知识原理解析</span>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 space-y-6">
              
              {/* 实时状态反馈面板 */}
              <div className="bg-black/40 border border-cyan-900/50 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-sm tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> 实时成像状态
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">倍率 (v/u)</p>
                    <p className="font-mono text-cyan-300 font-bold text-lg">{magnification.toFixed(2)} x</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">当前像高</p>
                    <p className="font-mono text-cyan-300 font-bold text-lg">{targetImageHeight.toFixed(1)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs mb-1">成像性质</p>
                    <p className="text-white font-medium bg-cyan-900/30 inline-block px-3 py-1 rounded border border-cyan-500/30">
                      {getImageNature(magnification)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs mb-1">画面清晰度诊断</p>
                    <p className={`font-medium ${params.pinholeSize <= 12 ? 'text-green-400' : 'text-orange-400'}`}>
                      {getClarity(params.pinholeSize)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 原理卡片 1 */}
              <div>
                <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-gray-500 font-mono">01</span> 核心物理原理
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  小孔成像的本质是<strong className="text-white underline decoration-indigo-500 underline-offset-4">光沿直线传播</strong>。发光物体发出的光线，穿过小孔后在光屏上交叉投射，形成图像。
                </p>
              </div>

              {/* 原理卡片 2 */}
              <div>
                <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-gray-500 font-mono">02</span> 成像的性质
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-2">
                  无论距离如何，小孔成像永远是<strong className="text-white">倒立的实像</strong>。
                </p>
                <ul className="text-sm text-gray-500 space-y-1 pl-4 list-disc marker:text-gray-600">
                  <li>像距 <strong className="text-gray-300">大于</strong> 物距：成放大的像</li>
                  <li>像距 <strong className="text-gray-300">等于</strong> 物距：成等大的像</li>
                  <li>像距 <strong className="text-gray-300">小于</strong> 物距：成缩小的像</li>
                </ul>
              </div>

              {/* 原理卡片 3 */}
              <div>
                <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-gray-500 font-mono">03</span> 孔径的博弈
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-2">
                  小孔的尺寸决定了成像的质量，存在一个物理博弈：
                </p>
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 shrink-0">↓ 缩小孔径：</span>
                    <span className="text-gray-400">光束更细，像更<strong className="text-white">清晰锐利</strong>，但进光量少导致<strong className="text-white">画面变暗</strong>。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 shrink-0">↑ 放大孔径：</span>
                    <span className="text-gray-400">进光量大，像变<strong className="text-white">亮</strong>，但光斑重叠导致<strong className="text-white">边缘模糊</strong>。</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* 全局发光特效与滚动条样式 (采用安全写法防报错) */}
      <style>
        {`
          @keyframes dashFlow {
            from { stroke-dashoffset: 20; }
            to { stroke-dashoffset: 0; }
          }
          .ray-flow {
            stroke-dasharray: 6, 6;
            animation: dashFlow 0.5s linear infinite;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px; height: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(99,102,241,0.3);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99,102,241,0.6);
          }
        `}
      </style>
    </div>
  );
}

// ==========================================
// 辅助图形：SVG 渲染器 (提取公共逻辑)
// ==========================================
const renderObjectSVG = (shape, x, yTop, yBot, width, height, color, isImage) => {
  const gTransform = isImage ? `translate(${x}, ${(yTop+yBot)/2}) scale(1, -1) translate(${-x}, ${-(yTop+yBot)/2})` : '';

  if (shape === 'arrow') {
     return (
       <g transform={gTransform}>
         <line x1={x} y1={yBot} x2={x} y2={yTop} stroke={color} strokeWidth="4" strokeLinecap="round" />
         <polygon points={`${x},${yTop-2} ${x-width*0.8},${yTop+width*1.5} ${x+width*0.8},${yTop+width*1.5}`} fill={color} />
       </g>
     );
  }
  if (shape === 'candle') {
    return (
       <g transform={gTransform}>
         <rect x={x-width/2} y={yTop+width*1.5} width={width} height={height-width*1.5} fill={color} rx="2"/>
         {/* 火焰发光 */}
         <path d={`M ${x} ${yTop+width*1.2} Q ${x-width/1.2} ${yTop+width/1.5} ${x} ${yTop-width/2} Q ${x+width/1.2} ${yTop+width/1.5} ${x} ${yTop+width*1.2}`} fill="#ffb703"/>
       </g>
    );
  }
  // Letter F
  return (
     <g transform={isImage ? `translate(${x}, ${(yTop+yBot)/2}) scale(-1, -1) translate(${-x}, ${-(yTop+yBot)/2})` : ''}>
       <line x1={x-width/2} y1={yBot} x2={x-width/2} y2={yTop} stroke={color} strokeWidth="5" strokeLinecap="round"/>
       <line x1={x-width/2} y1={yTop} x2={x+width*0.8} y2={yTop} stroke={color} strokeWidth="5" strokeLinecap="round"/>
       <line x1={x-width/2} y1={yTop + height*0.4} x2={x+width*0.4} y2={yTop + height*0.4} stroke={color} strokeWidth="5" strokeLinecap="round"/>
     </g>
  );
};

// ==========================================
// 组件：2D 正视图
// ==========================================
function View2D({ params, imageHeight }) {
  const { objectDistance, imageDistance, objectHeight, pinholeSize, objectShape } = params;
  
  const cx = 250;
  const cy = 150;
  const scale = 0.8;
  
  const objX = cx - objectDistance * scale;
  const imgX = cx + imageDistance * scale;
  
  const objYTop = cy - (objectHeight / 2) * scale;
  const objYBot = cy + (objectHeight / 2) * scale;
  
  const imgYTop = cy + (imageHeight / 2) * scale; 
  const imgYBot = cy - (imageHeight / 2) * scale; 

  const blurAmount = Math.max(0, (pinholeSize - 2) * 0.15);
  const opacityAmount = Math.min(1, 0.4 + (pinholeSize * 0.05));
  
  const objColor = "#ff2a6d"; 
  const imgColor = "#05d9e8"; 

  return (
    <svg width="100%" height="100%" viewBox="0 0 500 300" className="w-full h-full">
      <defs>
        <filter id="neonGlowObj" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="neonGlowImg" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={blurAmount + 3} result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* 刻度背景网格 */}
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
         {[...Array(11)].map((_,i) => <line key={`v${i}`} x1={i*50} y1={0} x2={i*50} y2={300} />)}
         {[...Array(7)].map((_,i) => <line key={`h${i}`} x1={0} y1={i*50} x2={500} y2={i*50} />)}
      </g>

      <line x1="0" y1={cy} x2="500" y2={cy} stroke="#334155" strokeDasharray="4,4" strokeWidth="2" />
      <rect x={imgX-2} y="30" width="4" height="240" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" opacity="0.8"/>

      <g stroke="#eab308" strokeWidth="1.5" opacity="0.7" className="ray-flow">
        <line x1={objX} y1={objYTop} x2={imgX} y2={imgYTop} />
        <line x1={objX} y1={objYBot} x2={imgX} y2={imgYBot} />
      </g>

      <g filter="url(#neonGlowObj)">
        {renderObjectSVG(objectShape, objX, objYTop, objYBot, 15*scale, objectHeight*scale, objColor, false)}
      </g>

      <line x1={cx} y1={0} x2={cx} y2={cy - pinholeSize/2} stroke="#0f172a" strokeWidth="6" />
      <line x1={cx} y1={cy + pinholeSize/2} x2={cx} y2={300} stroke="#0f172a" strokeWidth="6" />
      <line x1={cx} y1={0} x2={cx} y2={cy - pinholeSize/2} stroke="#3b82f6" strokeWidth="1" opacity="0.5"/>
      <line x1={cx} y1={cy + pinholeSize/2} x2={cx} y2={300} stroke="#3b82f6" strokeWidth="1" opacity="0.5"/>

      <g filter="url(#neonGlowImg)" opacity={opacityAmount}>
        {renderObjectSVG(objectShape, imgX, imgYBot, imgYTop, 15*scale*(imageHeight/objectHeight), imageHeight*scale, imgColor, true)}
      </g>
    </svg>
  );
}

// ==========================================
// 组件：3D 侧视图
// ==========================================
function View3D({ params, imageHeight }) {
  const { objectDistance, imageDistance, objectHeight, pinholeSize, objectShape } = params;
  
  const [autoAngle, setAutoAngle] = useState(0);
  const [manualRot, setManualRot] = useState({ x: -0.2, y: -0.4 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame;
    const animateCamera = () => {
      if (!isDragging) {
        setAutoAngle(prev => prev + 0.005);
      }
      frame = requestAnimationFrame(animateCamera);
    };
    frame = requestAnimationFrame(animateCamera);
    return () => cancelAnimationFrame(frame);
  }, [isDragging]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setManualRot(prev => ({
      x: Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, prev.x + dy * 0.01)),
      y: prev.y + dx * 0.01
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const project = (x, y, z) => {
    const angleY = manualRot.y + Math.sin(autoAngle) * 0.3; 
    const angleX = manualRot.x;

    const x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
    const z1 = x * Math.sin(angleY) + z * Math.cos(angleY);

    const y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
    const z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

    const fov = 800;
    const scale = fov / (fov + z2);

    return { x: 250 + x1 * scale, y: 160 + y2 * scale };
  };

  const drawPlane = (z, width, height, color, strokeColor, opacity, isPinhole=false) => {
    const p1 = project(-width/2, -height/2, z);
    const p2 = project(width/2, -height/2, z);
    const p3 = project(width/2, height/2, z);
    const p4 = project(-width/2, height/2, z);
    
    if (isPinhole) {
       return (
         <g>
           <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`} fill={color} opacity={opacity} />
           <circle cx={project(0,0,z).x} cy={project(0,0,z).y} r={pinholeSize * 0.8} fill="#0b0e14" stroke="#eab308" strokeWidth="2.5" filter="drop-shadow(0 0 6px #eab308)"/>
         </g>
       );
    }
    return <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`} fill={color} opacity={opacity} stroke={strokeColor} strokeWidth="2" />;
  };

  const sZ = 1; 
  const sY = 0.8; 
  
  const zObj = objectDistance * sZ;
  const zPin = 0;
  const zImg = -imageDistance * sZ;

  const objTop = project(0, -objectHeight/2 * sY, zObj);
  const objBot = project(0, objectHeight/2 * sY, zObj);
  const imgTop = project(0, imageHeight/2 * sY, zImg); 
  const imgBot = project(0, -imageHeight/2 * sY, zImg);

  const blurAmount = Math.max(0, (pinholeSize - 2) * 0.1);
  const opacityAmount = Math.min(1, 0.4 + (pinholeSize * 0.05));

  const draw3DShape = (z, h, isImage = false) => {
    const color = isImage ? "#05d9e8" : "#ff2a6d";
    const top = project(0, isImage ? h/2 * sY : -h/2 * sY, z);
    const bot = project(0, isImage ? -h/2 * sY : h/2 * sY, z);
    const w = 12 * sY * (isImage ? h/objectHeight : 1);
    
    if (objectShape === 'candle') {
      const yTopLocal = isImage ? h/2 * sY : -h/2 * sY;
      const yBotLocal = isImage ? -h/2 * sY : h/2 * sY;
      const fh = h * 0.3 * sY; 
      const cw = 8 * sY * (isImage ? h/objectHeight : 1); 
      const yFlameBaseLocal = isImage ? yTopLocal - fh : yTopLocal + fh;
      
      const pBotL = project(-cw, yBotLocal, z);
      const pBotR = project(cw, yBotLocal, z);
      const pTopR = project(cw, yFlameBaseLocal, z);
      const pTopL = project(-cw, yFlameBaseLocal, z);
      
      const pFlameTip = project(0, yTopLocal, z);
      const pFlameMidL = project(-cw * 1.5, (yTopLocal + yFlameBaseLocal)/2, z);
      const pFlameMidR = project(cw * 1.5, (yTopLocal + yFlameBaseLocal)/2, z);

      const flameColor = isImage ? "rgba(5,217,232,0.9)" : "#ffb703";
      const bodyFill = isImage ? "rgba(5,217,232,0.2)" : "rgba(255,42,109,0.2)";

      return (
        <g>
          <polygon points={`${pBotL.x},${pBotL.y} ${pBotR.x},${pBotR.y} ${pTopR.x},${pTopR.y} ${pTopL.x},${pTopL.y}`} fill={bodyFill} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d={`M ${pTopL.x} ${pTopL.y} Q ${pFlameMidL.x} ${pFlameMidL.y} ${pFlameTip.x} ${pFlameTip.y} Q ${pFlameMidR.x} ${pFlameMidR.y} ${pTopR.x} ${pTopR.y} Z`} fill={flameColor} />
        </g>
      );
    }

    const left = project(-w, isImage ? h/2 * sY - w*1.5 : -h/2 * sY + w*1.5, z);
    const right = project(w, isImage ? h/2 * sY - w*1.5 : -h/2 * sY + w*1.5, z);

    if (objectShape === 'arrow') {
      return (
        <g stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill={isImage ? "rgba(5,217,232,0.3)" : "rgba(255,42,109,0.3)"}>
          <line x1={bot.x} y1={bot.y} x2={top.x} y2={top.y} />
          <polygon points={`${top.x},${top.y} ${left.x},${left.y} ${right.x},${right.y}`} />
        </g>
      );
    }
    
    const fTopR = project(w*2, isImage ? h/2 * sY : -h/2 * sY, z);
    const fMid = project(0, isImage ? h*0.1 * sY : -h*0.1 * sY, z);
    const fMidR = project(w*1.5, isImage ? h*0.1 * sY : -h*0.1 * sY, z);
    return (
       <g stroke={color} strokeWidth="5" strokeLinecap="round">
         <line x1={bot.x} y1={bot.y} x2={top.x} y2={top.y} />
         <line x1={top.x} y1={top.y} x2={fTopR.x} y2={fTopR.y} />
         <line x1={fMid.x} y1={fMid.y} x2={fMidR.x} y2={fMidR.y} />
       </g>
    );
  };

  return (
    <svg 
      width="100%" height="100%" viewBox="0 0 500 300" 
      className={`w-full h-full outline-none select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <defs>
        <filter id="blur3D">
          <feGaussianBlur stdDeviation={blurAmount + 0.1} />
        </filter>
        <filter id="glowLine">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g stroke="rgba(6,182,212,0.25)" strokeWidth="1.5">
        {[...Array(11)].map((_, i) => {
          const z = 300 - i * 60;
          const p1 = project(-120, 120, z);
          const p2 = project(120, 120, z);
          return <line key={`h-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
        })}
        {[...Array(5)].map((_, i) => {
          const x = -120 + i * 60;
          const p1 = project(x, 120, 300);
          const p2 = project(x, 120, -300);
          return <line key={`v-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
        })}
      </g>

      {drawPlane(zImg, 180, 220, "rgba(5,217,232,0.08)", "rgba(5,217,232,0.5)", 1)}
      
      <g filter="url(#blur3D)" opacity={opacityAmount}>
        {draw3DShape(zImg, imageHeight, true)}
      </g>

      <g stroke="#eab308" strokeWidth="2" opacity="0.8" className="ray-flow" filter="url(#glowLine)">
        <line x1={objTop.x} y1={objTop.y} x2={imgTop.x} y2={imgTop.y} />
        <line x1={objBot.x} y1={objBot.y} x2={imgBot.x} y2={imgBot.y} />
        <line x1={project(0,0,zObj).x} y1={project(0,0,zObj).y} x2={project(0,0,zImg).x} y2={project(0,0,zImg).y} stroke="rgba(255,255,255,0.4)" strokeDasharray="3,5" />
      </g>

      {drawPlane(zPin, 140, 200, "#0f172a", "#3b82f6", 0.9, true)}

      <g filter="url(#glowLine)">
        {draw3DShape(zObj, objectHeight, false)}
      </g>
      
    </svg>
  );
}