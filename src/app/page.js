"use client";

import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import lottie from 'lottie-web';
import { 
  Play, Pause, RotateCcw, SkipBack, SkipForward, 
  ChevronLeft, Search, BookOpen, Award, BarChart3, Atom, Zap, 
  User, CheckCircle2, Lock, Flame
} from 'lucide-react';

// --- Mock Data ---
const SUBJECTS = {
  PHYSICS: { id: 'physics', name: '物理', color: 'blue', theme: 'from-blue-900 to-indigo-950', icon: Zap },
  CHEMISTRY: { id: 'chemistry', name: '化学', color: 'orange', theme: 'from-orange-900 to-emerald-950', icon: Atom }
};

const TOPICS = [
  { id: 'p1', subject: 'physics', title: '滑轮组受力分析', type: '力学', progress: 100, formula: 'F = (G_物 + G_动) / n', desc: '通过动画分解滑轮组中每一段绳子的受力情况，理解省力不省功的原理。' },
  { id: 'p2', subject: 'physics', title: '串并联电路电流规律', type: '电学', progress: 45, formula: 'I = I1 = I2 (串) / I = I1 + I2 (并)', desc: '观察电荷在真实电路中的流动轨迹，直观理解电流分流与汇合。' },
  { id: 'c1', subject: 'chemistry', title: '氯化钠的形成 (电子转移)', type: '微观结构', progress: 100, formula: '2Na + Cl2 -> 2NaCl', desc: '观察钠原子失去电子和氯原子得到电子形成离子的动态微观过程。' },
  { id: 'c2', subject: 'chemistry', title: '酸碱中和反应', type: '反应原理', progress: 0, formula: 'H+ + OH- -> H2O', desc: '氢离子与氢氧根离子结合生成水分子，伴随能量释放的过程。' },
];

const BADGES = [
  { id: 'b1', name: '初级观察者', icon: BookOpen, unlocked: true, color: 'text-gray-300' },
  { id: 'b2', name: '力学新星', icon: Award, unlocked: true, color: 'text-blue-400' },
  { id: 'b3', name: '微观侦探', icon: Search, unlocked: true, color: 'text-orange-400' },
  { id: 'b4', name: '反应大师', icon: Flame, unlocked: false, color: 'text-gray-600' },
  { id: 'b5', name: '黄金科学家', icon: Zap, unlocked: false, color: 'text-yellow-500' },
];

// --- Components ---

// 1. Glass Card Wrapper
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

// 2. Dashboard View
const Dashboard = ({ activeSubject, setActiveSubject, onSelectTopic }) => {
  const currentTopics = TOPICS.filter(t => t.subject === activeSubject.id);
  const subjectColorClass = activeSubject.id === 'physics' ? 'text-blue-400' : 'text-orange-400';
  const subjectBgClass = activeSubject.id === 'physics' ? 'bg-blue-500' : 'bg-orange-500';

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 text-2xl font-bold text-white">
          <activeSubject.icon className={subjectColorClass} size={32} />
          <span>虚拟实验室</span>
        </div>

        <div className="flex bg-black/20 rounded-lg p-1">
          {Object.values(SUBJECTS).map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubject(sub)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                activeSubject.id === sub.id ? `${subjectBgClass} text-white shadow-lg` : 'text-white/50 hover:text-white'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">知识点导览</h3>
          <div className="space-y-2">
            {currentTopics.map(topic => (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors group flex items-center justify-between"
              >
                <div>
                  <div className="text-white/90 font-medium group-hover:text-white">{topic.title}</div>
                  <div className="text-white/40 text-xs mt-1">{topic.type}</div>
                </div>
                {topic.progress === 100 && <CheckCircle2 size={16} className="text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">你好，小明同学</h1>
            <p className="text-white/60">准备好探索{activeSubject.name}的奥秘了吗？</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="搜索公式或定理..." 
                className="bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-white/30 w-64 transition-all"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/20">
              <User className="text-white" size={20} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 col-span-2 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="text-lg text-white/80 mb-1">本周学习时长</h3>
            <div className="text-5xl font-bold text-white mb-2">4.5 <span className="text-xl text-white/60 font-normal">小时</span></div>
            <p className="text-sm text-emerald-400 flex items-center">
              <BarChart3 size={14} className="mr-1" /> 比上周提升 12%
            </p>
          </GlassCard>
          
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={subjectColorClass}
                  strokeWidth="3"
                  strokeDasharray="65, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                65%
              </div>
            </div>
            <h3 className="text-white/80 font-medium">综合掌握度</h3>
          </GlassCard>
        </div>

        {/* Honors Corner */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Award className="mr-2" size={24} /> 荣誉角
        </h2>
        <GlassCard className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {BADGES.map(badge => (
              <div key={badge.id} className="flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                  badge.unlocked ? 'bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-black/30 border border-white/5'
                }`}>
                  {badge.unlocked ? (
                    <badge.icon className={badge.color} size={32} />
                  ) : (
                    <Lock className="text-white/20" size={24} />
                  )}
                </div>
                <span className={`text-sm font-medium ${badge.unlocked ? 'text-white/90' : 'text-white/30'}`}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// 3. Experiment / Animation View
const ExperimentView = ({ topic, onBack, subjectColor }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(30);
  const [speed, setSpeed] = useState(1);

  // Simulate animation progress
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + (1 * speed)));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const toggleSpeed = () => {
    if (speed === 1) setSpeed(0.5);
    else if (speed === 0.5) setSpeed(2);
    else setSpeed(1);
  };

  return (
    <div className="flex flex-col h-full w-full p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors mr-4"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
            <div className="flex items-center text-sm mt-1">
              <span className={`px-2 py-0.5 rounded text-xs mr-2 border border-white/20 ${
                topic.subject === 'physics' ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'
              }`}>
                {topic.type}
              </span>
              <span className="text-white/50">沉浸式动画解析</span>
            </div>
          </div>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-colors flex items-center text-sm">
          <BookOpen size={16} className="mr-2" /> 课后测验
        </button>
      </header>

      {/* Main Content Split */}
      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left: Animation Player */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Lottie Container Mock */}
          <GlassCard className="flex-1 flex items-center justify-center relative overflow-hidden group">
            {/* Ambient Background Glow matching subject */}
            <div className={`absolute inset-0 opacity-20 blur-3xl rounded-full scale-150 transition-colors ${
               topic.subject === 'physics' ? 'bg-blue-500' : 'bg-orange-500'
            }`}></div>
            
            {/* Mock Animation Element based on topic */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
               <div className="text-white/20 mb-6 flex flex-col items-center">
                  <Atom size={64} className={`animate-pulse ${topic.subject === 'physics' ? 'text-blue-500/30' : 'text-orange-500/30'}`} />
                  <span className="mt-4 font-mono text-sm tracking-widest">[ Lottie Web 动画渲染区 ]</span>
               </div>
               
               {/* Decorative simulated particles/elements */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>
               
               {/* Progress Indicator within animation (mocking atom/electron movement) */}
               <div 
                  className={`absolute w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] ${topic.subject === 'physics' ? 'bg-blue-400 text-blue-400' : 'bg-orange-400 text-orange-400'}`}
                  style={{ 
                    top: `calc(50% + ${Math.sin(progress * Math.PI / 50) * 120}px)`, 
                    left: `calc(50% + ${Math.cos(progress * Math.PI / 50) * 120}px)` 
                  }}
               ></div>
            </div>

            {/* Hint overlay on hover */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur px-3 py-1.5 rounded-md border border-white/10 text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              SVG 矢量实时渲染中
            </div>
          </GlassCard>

          {/* Player Controls */}
          <GlassCard className="p-4 flex flex-col shrink-0">
            {/* Timeline */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-xs text-white/50 font-mono w-10">00:0{(progress/20).toFixed(1)}</span>
              <div className="flex-1 h-2 bg-black/40 rounded-full relative cursor-pointer overflow-hidden group">
                {/* Buffer bar */}
                <div className="absolute inset-y-0 left-0 bg-white/10 w-full rounded-full"></div>
                {/* Progress bar */}
                <div 
                  className={`absolute inset-y-0 left-0 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-75 ${
                    topic.subject === 'physics' ? 'bg-blue-400 text-blue-400' : 'bg-orange-400 text-orange-400'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-white/50 font-mono w-10">00:05.0</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                 <button 
                  onClick={() => setSpeed(1)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="重置状态">
                  <RotateCcw size={18} />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <SkipBack size={20} />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 ${
                    topic.subject === 'physics' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-orange-600 hover:bg-orange-500'
                  }`}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <SkipForward size={20} />
                </button>
              </div>

              <div className="flex items-center">
                <button 
                  onClick={toggleSpeed}
                  className="px-3 py-1.5 text-xs font-mono text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors w-14 text-center"
                >
                  {speed}x
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Info Panel */}
        <div className="w-80 flex flex-col gap-4">
          <GlassCard className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">知识原理解析</h3>
            
            <div className="mb-6">
              <h4 className="text-sm text-white/50 mb-2">核心公式 / 方程式</h4>
              <div className="bg-black/30 border border-white/5 rounded-lg p-4 font-mono text-center text-lg text-white shadow-inner">
                {topic.formula}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm text-white/50 mb-2">过程描述</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {topic.desc}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-white/50 mb-3">关键帧节点</h4>
              <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-white/10">
                {[
                  { time: '00:01', label: '初始状态观察' },
                  { time: '00:03', label: '核心变化发生' },
                  { time: '00:05', label: '反应/运动结束' }
                ].map((step, idx) => (
                  <button key={idx} className="relative flex items-center text-left group w-full pl-6">
                    <span className={`absolute left-[3px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-slate-900 transition-colors ${
                      topic.subject === 'physics' ? 'bg-blue-400 group-hover:bg-blue-300' : 'bg-orange-400 group-hover:bg-orange-300'
                    }`}></span>
                    <span className="text-xs font-mono text-white/40 group-hover:text-white/70 w-12">{step.time}</span>
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{step.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [activeSubject, setActiveSubject] = useState(SUBJECTS.PHYSICS);
  const [activeTopic, setActiveTopic] = useState(null);

  // Dynamic global background based on selected subject and view
  const bgTheme = activeTopic 
    ? SUBJECTS[activeTopic.subject.toUpperCase()].theme 
    : activeSubject.theme;

  return (
    <div className={`w-full h-screen bg-gradient-to-br ${bgTheme} overflow-hidden font-sans transition-colors duration-700 ease-in-out`}>
      {/* Background ambient decorative circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-black/20 blur-3xl pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="relative w-full h-full backdrop-blur-[2px]">
        {activeTopic ? (
          <ExperimentView 
            topic={activeTopic} 
            onBack={() => setActiveTopic(null)} 
            subjectColor={SUBJECTS[activeTopic.subject.toUpperCase()].color}
          />
        ) : (
          <Dashboard 
            activeSubject={activeSubject} 
            setActiveSubject={setActiveSubject} 
            onSelectTopic={setActiveTopic}
          />
        )}
      </div>
    </div>
  );
}