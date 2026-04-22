"use client";

import React, { useContext, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle, createContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import lottie from 'lottie-web';
import {
  Play, Pause, RotateCcw, SkipBack, SkipForward,
  ChevronLeft, ChevronDown, ChevronRight, Search, BookOpen, ScrollText, Award, BarChart3, Atom, Zap,
  User, CheckCircle2, Flame, Sun, Moon
} from 'lucide-react';

const HOME_THEME_KEY = 'virtual-lab-home-theme';

const HomeThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => { },
  setTheme: () => { },
});

function HomeThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(HOME_THEME_KEY);
        if (stored === 'light' || stored === 'dark') setThemeState(stored);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const setTheme = useCallback((next) => {
    const v = next === 'light' || next === 'dark' ? next : 'dark';
    setThemeState(v);
    try {
      localStorage.setItem(HOME_THEME_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return <HomeThemeContext.Provider value={value}>{children}</HomeThemeContext.Provider>;
}
import PendulumWavePreview from '../components/animations/PendulumWavePreview';
import MoleculeOrbitPreview from '../components/animations/MoleculeOrbitPreview';
import CircuitPulsePreview from '../components/animations/CircuitPulsePreview';
import LabFlaskPreview from '../components/animations/LabFlaskPreview';
import TopicAnimationRenderer from '../components/animations/TopicAnimationRenderer';
import TopicModal from '../content/topics/components/TopicModal.jsx';
import { resolveTopicContent } from '../content/topics/registry.jsx';
import DefaultImmersivePage from '../content/topics/_defaults/DefaultImmersivePage.jsx';

// --- Mock Data ---
export const SUBJECTS = {
  PHYSICS: {
    id: 'physics',
    name: '物理',
    color: 'blue',
    theme: 'from-blue-900 to-indigo-950',
    themeLight: 'from-sky-200 via-blue-100 to-indigo-100',
    icon: Zap,
  },
  CHEMISTRY: {
    id: 'chemistry',
    name: '化学',
    color: 'orange',
    theme: 'from-orange-900 to-emerald-950',
    themeLight: 'from-amber-100 via-orange-50 to-emerald-100',
    icon: Atom,
  },
};

export const TOPICS = [
  { id: 'p100', subject: 'physics', title: '第一章 机械运动', type: '章导览', progress: 0, formula: 'v = s / t', desc: '本章聚焦长度与时间测量、运动描述、快慢比较与平均速度，建立运动学基础。' },
  { id: 'p101', subject: 'physics', title: '第一章 第1节 长度和时间的测量', type: '机械运动', progress: 0, formula: 'Δx = x2 - x1', desc: '学习刻度尺和秒表的规范使用、读数方法及实验误差控制。' },
  { id: 'p102', subject: 'physics', title: '第一章 第2节 运动的描述', type: '机械运动', progress: 0, formula: 'x = x(t)', desc: '通过参照物与位置变化理解“机械运动”的本质，学会描述物体运动状态。' },
  { id: 'p103', subject: 'physics', title: '第一章 第3节 运动的快慢', type: '机械运动', progress: 0, formula: 'v = s / t', desc: '理解速度概念，比较不同物体在单位时间内通过路程的差异。' },
  { id: 'p104', subject: 'physics', title: '第一章 第4节 测量平均速度', type: '机械运动', progress: 0, formula: 'v(平均) = s总 / t总', desc: '借助实验数据计算平均速度，区分平均速度与瞬时速度。' },

  { id: 'p200', subject: 'physics', title: '第二章 声现象', type: '章导览', progress: 0, formula: 'v = λf', desc: '本章学习声音产生与传播、声音特性及噪声控制，认识声学在生活中的应用。' },
  { id: 'p201', subject: 'physics', title: '第二章 第1节 声音的产生与传播', type: '声现象', progress: 0, formula: 'v声(空气)≈340 m/s', desc: '通过实验认识振动发声机制和声波传播条件。' },
  { id: 'p202', subject: 'physics', title: '第二章 第2节 声音的特性', type: '声现象', progress: 0, formula: 'f, A, 波形', desc: '区分音调、响度和音色，理解其对应的物理量。' },
  { id: 'p203', subject: 'physics', title: '第二章 第3节 声的利用', type: '声现象', progress: 0, formula: 's = vt / 2', desc: '了解超声、次声与回声测距等技术应用。' },
  { id: 'p204', subject: 'physics', title: '第二章 第4节 噪声的危害和控制', type: '声现象', progress: 0, formula: 'dB', desc: '认识噪声来源与危害，掌握在声源、传播途径和人耳处的控制方法。' },

  { id: 'p300', subject: 'physics', title: '第三章 物态变化', type: '章导览', progress: 0, formula: 'Q = cmΔt', desc: '本章围绕温度与六种物态变化展开，理解微观解释与生活现象。' },
  { id: 'p301', subject: 'physics', title: '第三章 第1节 温度', type: '物态变化', progress: 0, formula: 't(℃)', desc: '学习温度概念、温度计原理与正确读数方法。' },
  { id: 'p302', subject: 'physics', title: '第三章 第2节 熔化和凝固', type: '物态变化', progress: 0, formula: '吸热/放热', desc: '比较晶体与非晶体熔化特点，理解熔点和凝固点。' },
  { id: 'p303', subject: 'physics', title: '第三章 第3节 汽化和液化', type: '物态变化', progress: 0, formula: '蒸发与沸腾', desc: '分析影响蒸发快慢因素，理解液化条件与应用。' },
  { id: 'p304', subject: 'physics', title: '第三章 第4节 升华和凝华', type: '物态变化', progress: 0, formula: '固↔气', desc: '通过樟脑球、霜等现象理解升华与凝华的本质。' },

  { id: 'p400', subject: 'physics', title: '第四章 光现象', type: '章导览', progress: 0, formula: 'i = r', desc: '本章学习光的传播、反射、折射与色散，建立几何光学基础。' },
  { id: 'p401', subject: 'physics', title: '第四章 第1节 光的直线传播', type: '光现象', progress: 0, formula: '小孔成像', desc: '认识光在同种均匀介质中沿直线传播及其典型现象。' },
  { id: 'p402', subject: 'physics', title: '第四章 第2节 光的反射', type: '光现象', progress: 0, formula: '∠i = ∠r', desc: '理解反射定律，区分镜面反射与漫反射。' },
  { id: 'p403', subject: 'physics', title: '第四章 第3节 平面镜成像', type: '光现象', progress: 0, formula: '像距=物距', desc: '掌握平面镜成像特点及作图方法。' },
  { id: 'p404', subject: 'physics', title: '第四章 第4节 光的折射', type: '光现象', progress: 0, formula: 'n1sinθ1=n2sinθ2', desc: '认识折射规律与生活中的折射现象。' },
  { id: 'p405', subject: 'physics', title: '第四章 第5节 光的色散', type: '光现象', progress: 0, formula: '白光→七色光', desc: '理解复色光分解与色光混合的基本规律。' },

  { id: 'p500', subject: 'physics', title: '第五章 透镜及其应用', type: '章导览', progress: 0, formula: '1/f = 1/u + 1/v', desc: '学习凸透镜与凹透镜特性，理解成像规律及仪器应用。' },
  { id: 'p501', subject: 'physics', title: '第五章 第1节 透镜', type: '透镜及其应用', progress: 0, formula: 'F 焦点', desc: '辨认透镜类型，理解会聚与发散作用。' },
  { id: 'p502', subject: 'physics', title: '第五章 第2节 生活中的透镜', type: '透镜及其应用', progress: 0, formula: '放大镜/照相机', desc: '联系照相机、投影仪、放大镜等实例认识透镜应用。' },
  { id: 'p503', subject: 'physics', title: '第五章 第3节 凸透镜成像的规律', type: '透镜及其应用', progress: 0, formula: 'u, v, f 关系', desc: '通过实验归纳物距变化与像的大小、倒正、虚实关系。' },
  { id: 'p504', subject: 'physics', title: '第五章 第4节 眼睛和眼镜', type: '透镜及其应用', progress: 0, formula: '近视/远视矫正', desc: '认识眼球成像原理与近视、远视的矫正方式。' },
  { id: 'p505', subject: 'physics', title: '第五章 第5节 显微镜和望远镜', type: '透镜及其应用', progress: 0, formula: '角放大', desc: '了解复合光学仪器的基本结构与成像思路。' },

  { id: 'p600', subject: 'physics', title: '第六章 质量与密度', type: '章导览', progress: 0, formula: 'ρ = m / V', desc: '本章学习质量、密度和测量方法，并联系工程与生活问题。' },
  { id: 'p601', subject: 'physics', title: '第六章 第1节 质量', type: '质量与密度', progress: 0, formula: 'm', desc: '掌握质量概念、单位换算与天平使用。' },
  { id: 'p602', subject: 'physics', title: '第六章 第2节 密度', type: '质量与密度', progress: 0, formula: 'ρ = m / V', desc: '理解密度物理意义，学会用密度比较和鉴别物质。' },
  { id: 'p603', subject: 'physics', title: '第六章 第3节 测量物质的密度', type: '质量与密度', progress: 0, formula: 'ρ测 = m测 / V测', desc: '通过实验步骤完成固体、液体密度测量及误差分析。' },
  { id: 'p604', subject: 'physics', title: '第六章 第4节 密度与社会生活', type: '质量与密度', progress: 0, formula: '材料选型', desc: '将密度知识迁移到生活和工程场景中进行解释与决策。' },
  { id: 'p700', subject: 'physics', title: '第七章 力', type: '章导览', progress: 0, formula: 'F', desc: '本章学习力的概念、弹力和重力，建立受力分析的基础。' },
  { id: 'p701', subject: 'physics', title: '第七章 第1节 力', type: '力', progress: 0, formula: 'N', desc: '认识力的三要素及力的作用效果。' },
  { id: 'p702', subject: 'physics', title: '第七章 第2节 弹力', type: '力', progress: 0, formula: "F = kx", desc: '理解弹力产生条件和方向，联系弹簧测力计应用。' },
  { id: 'p703', subject: 'physics', title: '第七章 第3节 重力', type: '力', progress: 0, formula: 'G = mg', desc: '掌握重力大小、方向及重心概念。' },

  { id: 'p800', subject: 'physics', title: '第八章 运动和力', type: '章导览', progress: 0, formula: 'F合 = ma', desc: '本章探究牛顿第一定律、二力平衡和摩擦力。' },
  { id: 'p801', subject: 'physics', title: '第八章 第1节 牛顿第一定律', type: '运动和力', progress: 0, formula: '惯性', desc: '理解物体保持原有运动状态的规律。' },
  { id: 'p802', subject: 'physics', title: '第八章 第2节 二力平衡', type: '运动和力', progress: 0, formula: 'F1 = F2', desc: '掌握二力平衡条件并能用于受力判断。' },
  { id: 'p803', subject: 'physics', title: '第八章 第3节 摩擦力', type: '运动和力', progress: 0, formula: 'f', desc: '认识滑动摩擦力与影响因素。' },

  { id: 'p900', subject: 'physics', title: '第九章 压强', type: '章导览', progress: 0, formula: 'p = F/S', desc: '学习固体、液体和气体压强及其应用。' },
  { id: 'p901', subject: 'physics', title: '第九章 第1节 压强', type: '压强', progress: 0, formula: 'p = F/S', desc: '理解压强定义、单位和增减方法。' },
  { id: 'p902', subject: 'physics', title: '第九章 第2节 液体的压强', type: '压强', progress: 0, formula: 'p = ρgh', desc: '掌握液体压强随深度变化的规律。' },
  { id: 'p903', subject: 'physics', title: '第九章 第3节 大气压强', type: '压强', progress: 0, formula: '1 标准大气压', desc: '认识大气压存在及其典型实验。' },
  { id: 'p904', subject: 'physics', title: '第九章 第4节 流体压强与流速的关系', type: '压强', progress: 0, formula: '伯努利现象', desc: '理解流速变化引起压强变化及应用场景。' },

  { id: 'p1000', subject: 'physics', title: '第十章 浮力', type: '章导览', progress: 0, formula: 'F浮', desc: '本章学习浮力、阿基米德原理与浮沉条件。' },
  { id: 'p1001', subject: 'physics', title: '第十章 第1节 浮力', type: '浮力', progress: 0, formula: 'F浮 = G排液', desc: '认识浮力现象并分析浮力方向与大小。' },
  { id: 'p1002', subject: 'physics', title: '第十章 第2节 阿基米德原理', type: '浮力', progress: 0, formula: 'F浮 = ρ液gV排', desc: '掌握阿基米德原理并进行计算应用。' },
  { id: 'p1003', subject: 'physics', title: '第十章 第3节 物体的浮沉条件及应用', type: '浮力', progress: 0, formula: 'ρ物 与 ρ液 比较', desc: '用受力和平衡条件解释物体浮沉与工程应用。' },

  { id: 'p1100', subject: 'physics', title: '第十一章 功和机械能', type: '章导览', progress: 0, formula: 'W = Fs', desc: '本章学习功、功率、动能、势能及机械能转化。' },
  { id: 'p1101', subject: 'physics', title: '第十一章 第1节 功', type: '功和机械能', progress: 0, formula: 'W = Fs', desc: '理解做功的两个必要因素和计算方法。' },
  { id: 'p1102', subject: 'physics', title: '第十一章 第2节 功率', type: '功和机械能', progress: 0, formula: 'P = W/t', desc: '掌握功率意义并比较做功快慢。' },
  { id: 'p1103', subject: 'physics', title: '第十一章 第3节 动能和势能', type: '功和机械能', progress: 0, formula: 'Ek, Ep', desc: '分析影响动能、重力势能和弹性势能的因素。' },
  { id: 'p1104', subject: 'physics', title: '第十一章 第4节 机械能及其转化', type: '功和机械能', progress: 0, formula: 'E机 = Ek + Ep', desc: '理解机械能守恒的常见情境及能量转化。' },

  { id: 'p1200', subject: 'physics', title: '第十二章 简单机械', type: '章导览', progress: 0, formula: 'η = W有/W总', desc: '本章学习杠杆、滑轮与机械效率。' },
  { id: 'p1201', subject: 'physics', title: '第十二章 第1节 杠杆', type: '简单机械', progress: 0, formula: 'F1L1 = F2L2', desc: '掌握杠杆平衡条件并识别省力、省距特性。' },
  { id: 'p1202', subject: 'physics', title: '第十二章 第2节 滑轮', type: '简单机械', progress: 0, formula: 'F ≈ G/n', desc: '区分定滑轮、动滑轮及滑轮组特点。' },
  { id: 'p1203', subject: 'physics', title: '第十二章 第3节 机械效率', type: '简单机械', progress: 0, formula: 'η = W有/W总 × 100%', desc: '理解机械效率意义及提升机械效率的方法。' },

  { id: 'p1300', subject: 'physics', title: '第十三章 内能', type: '章导览', progress: 0, formula: 'Q = cmΔt', desc: '本章学习分子热运动、内能和比热容，建立热学基础。' },
  { id: 'p1301', subject: 'physics', title: '第十三章 第1节 分子热运动', type: '内能', progress: 0, formula: '扩散现象', desc: '认识分子永不停息的无规则运动及温度影响。' },
  { id: 'p1302', subject: 'physics', title: '第十三章 第2节 内能', type: '内能', progress: 0, formula: '内能变化', desc: '理解做功和热传递都能改变物体内能。' },
  { id: 'p1303', subject: 'physics', title: '第十三章 第3节 比热容', type: '内能', progress: 0, formula: 'Q = cmΔt', desc: '掌握比热容意义并能进行吸放热计算。' },

  { id: 'p1400', subject: 'physics', title: '第十四章 内能的利用', type: '章导览', progress: 0, formula: 'η = W有用 / Q放', desc: '学习热机、热机效率与能量转化守恒思想。' },
  { id: 'p1401', subject: 'physics', title: '第十四章 第1节 热机', type: '内能的利用', progress: 0, formula: '内能→机械能', desc: '认识内燃机等热机工作过程及基本结构。' },
  { id: 'p1402', subject: 'physics', title: '第十四章 第2节 热机的效率', type: '内能的利用', progress: 0, formula: 'η', desc: '理解热机效率概念与提高效率的方向。' },
  { id: 'p1403', subject: 'physics', title: '第十四章 第3节 能量的转化和守恒', type: '内能的利用', progress: 0, formula: '能量守恒定律', desc: '建立能量既不会凭空产生也不会凭空消失的观念。' },

  { id: 'p1500', subject: 'physics', title: '第十五章 电流和电路', type: '章导览', progress: 0, formula: 'I = q / t', desc: '本章学习电荷、电流、电路连接和电流规律。' },
  { id: 'p1501', subject: 'physics', title: '第十五章 第1节 两种电荷', type: '电流和电路', progress: 0, formula: '+ / -', desc: '认识正负电荷及摩擦起电、验电等基本现象。' },
  { id: 'p1502', subject: 'physics', title: '第十五章 第2节 电流和电路', type: '电流和电路', progress: 0, formula: 'I', desc: '理解电流形成条件与完整电路组成。' },
  { id: 'p1503', subject: 'physics', title: '第十五章 第3节 串联和并联', type: '电流和电路', progress: 0, formula: '串/并联', desc: '区分串联并联连接方式及其用电特点。' },
  { id: 'p1504', subject: 'physics', title: '第十五章 第4节 电流的测量', type: '电流和电路', progress: 0, formula: 'A', desc: '掌握电流表的连接规则、量程选择与读数。' },
  { id: 'p1505', subject: 'physics', title: '第十五章 第5节 串、并联电路中电流的规律', type: '电流和电路', progress: 0, formula: 'I串相等, I并分流', desc: '实验归纳串并联电路中的电流规律。' },

  { id: 'p1600', subject: 'physics', title: '第十六章 电压 电阻', type: '章导览', progress: 0, formula: 'U, R', desc: '本章学习电压、电阻和变阻器及电压规律。' },
  { id: 'p1601', subject: 'physics', title: '第十六章 第1节 电压', type: '电压 电阻', progress: 0, formula: 'U', desc: '理解电压作用并掌握电压表使用。' },
  { id: 'p1602', subject: 'physics', title: '第十六章 第2节 串、并联电路中电压的规律', type: '电压 电阻', progress: 0, formula: 'U串分压, U并相等', desc: '通过实验掌握串并联电路电压分配规律。' },
  { id: 'p1603', subject: 'physics', title: '第十六章 第3节 电阻', type: '电压 电阻', progress: 0, formula: 'R', desc: '认识电阻概念及影响电阻大小因素。' },
  { id: 'p1604', subject: 'physics', title: '第十六章 第4节 变阻器', type: '电压 电阻', progress: 0, formula: '滑动变阻器', desc: '掌握变阻器结构、接线与调节电路作用。' },

  { id: 'p1700', subject: 'physics', title: '第十七章 欧姆定律', type: '章导览', progress: 0, formula: 'I = U / R', desc: '本章学习电流、电压、电阻关系及欧姆定律应用。' },
  { id: 'p1701', subject: 'physics', title: '第十七章 第1节 电流与电压和电阻的关系', type: '欧姆定律', progress: 0, formula: 'I∝U, I∝1/R', desc: '通过控制变量实验得到电流与电压、电阻关系。' },
  { id: 'p1702', subject: 'physics', title: '第十七章 第2节 欧姆定律', type: '欧姆定律', progress: 0, formula: 'I = U / R', desc: '掌握欧姆定律并用于基础电路计算。' },
  { id: 'p1703', subject: 'physics', title: '第十七章 第3节 电阻的测量', type: '欧姆定律', progress: 0, formula: 'R = U / I', desc: '学习伏安法测电阻与误差分析。' },
  { id: 'p1704', subject: 'physics', title: '第十七章 第4节 欧姆定律在串、并联电路中的应用', type: '欧姆定律', progress: 0, formula: '串并联综合', desc: '在复杂电路中综合应用欧姆定律解决问题。' },

  { id: 'p1800', subject: 'physics', title: '第十八章 电功率', type: '章导览', progress: 0, formula: 'P = UI', desc: '本章学习电能、电功率及焦耳定律。' },
  { id: 'p1801', subject: 'physics', title: '第十八章 第1节 电能 电功', type: '电功率', progress: 0, formula: 'W = UIt', desc: '理解电能与电功关系，认识电能表读数。' },
  { id: 'p1802', subject: 'physics', title: '第十八章 第2节 电功率', type: '电功率', progress: 0, formula: 'P = W/t = UI', desc: '掌握额定功率和实际功率含义。' },
  { id: 'p1803', subject: 'physics', title: '第十八章 第3节 测量小灯泡的电功率', type: '电功率', progress: 0, formula: '实验法', desc: '通过实验测量并分析小灯泡电功率变化。' },
  { id: 'p1804', subject: 'physics', title: '第十八章 第4节 焦耳定律', type: '电功率', progress: 0, formula: 'Q = I²Rt', desc: '理解电流热效应及其定量关系。' },

  { id: 'p1900', subject: 'physics', title: '第十九章 生活用电', type: '章导览', progress: 0, formula: '家庭电路', desc: '本章学习家庭电路构成、过流原因和安全用电。' },
  { id: 'p1901', subject: 'physics', title: '第十九章 第1节 家庭电路', type: '生活用电', progress: 0, formula: '火线/零线', desc: '认识家庭电路主要元件及连接关系。' },
  { id: 'p1902', subject: 'physics', title: '第十九章 第2节 家庭电路中电流过大的原因', type: '生活用电', progress: 0, formula: '短路/过载', desc: '理解短路、过载导致电流过大的机理。' },
  { id: 'p1903', subject: 'physics', title: '第十九章 第3节 安全用电', type: '生活用电', progress: 0, formula: '触电防护', desc: '掌握常见安全用电规范与应急处理常识。' },

  { id: 'p2000', subject: 'physics', title: '第二十章 电与磁', type: '章导览', progress: 0, formula: '电磁关系', desc: '本章学习磁现象、电生磁、电动机与发电机。' },
  { id: 'p2001', subject: 'physics', title: '第二十章 第1节 磁现象 磁场', type: '电与磁', progress: 0, formula: 'N/S极', desc: '认识磁体磁场及磁感线描述方式。' },
  { id: 'p2002', subject: 'physics', title: '第二十章 第2节 电生磁', type: '电与磁', progress: 0, formula: '通电导体周围有磁场', desc: '理解电流磁效应和影响因素。' },
  { id: 'p2003', subject: 'physics', title: '第二十章 第3节 电磁铁 电磁继电器', type: '电与磁', progress: 0, formula: '电磁控制', desc: '掌握电磁铁特点及继电器控制原理。' },
  { id: 'p2004', subject: 'physics', title: '第二十章 第4节 电动机', type: '电与磁', progress: 0, formula: '通电线圈受力', desc: '理解电动机工作原理与能量转化。' },
  { id: 'p2005', subject: 'physics', title: '第二十章 第5节 磁生电', type: '电与磁', progress: 0, formula: '电磁感应', desc: '认识法拉第电磁感应现象及发电机原理。' },

  { id: 'p2100', subject: 'physics', title: '第二十一章 信息的传递', type: '章导览', progress: 0, formula: '电磁波通信', desc: '本章梳理信息传递方式与现代通信技术。' },
  { id: 'p2101', subject: 'physics', title: '第二十一章 第1节 现代顺风耳——电话', type: '信息的传递', progress: 0, formula: '声电转换', desc: '了解电话传递语音信息的基本原理。' },
  { id: 'p2102', subject: 'physics', title: '第二十一章 第2节 电磁波的海洋', type: '信息的传递', progress: 0, formula: 'c = 3×10^8 m/s', desc: '认识电磁波谱及信息传播特点。' },
  { id: 'p2103', subject: 'physics', title: '第二十一章 第3节 广播、电视和移动通信', type: '信息的传递', progress: 0, formula: '调制与传输', desc: '理解常见无线通信的基本工作方式。' },
  { id: 'p2104', subject: 'physics', title: '第二十一章 第4节 越来越宽的信息之路', type: '信息的传递', progress: 0, formula: '光纤/网络', desc: '认识信息高速传输的发展路径与意义。' },

  { id: 'p2200', subject: 'physics', title: '第二十二章 能源与可持续发展', type: '章导览', progress: 0, formula: '可持续发展', desc: '本章学习多种能源及其与可持续发展的关系。' },
  { id: 'p2201', subject: 'physics', title: '第二十二章 第1节 能源', type: '能源与可持续发展', progress: 0, formula: '一次/二次能源', desc: '认识能源分类与利用现状。' },
  { id: 'p2202', subject: 'physics', title: '第二十二章 第2节 核能', type: '能源与可持续发展', progress: 0, formula: '核裂变', desc: '理解核能利用原理与安全议题。' },
  { id: 'p2203', subject: 'physics', title: '第二十二章 第3节 太阳能', type: '能源与可持续发展', progress: 0, formula: '光伏/光热', desc: '了解太阳能利用方式与应用场景。' },
  { id: 'p2204', subject: 'physics', title: '第二十二章 第4节 能源与可持续发展', type: '能源与可持续发展', progress: 0, formula: '低碳发展', desc: '形成节能减排与可持续发展意识。' },

  { id: 'c900', subject: 'chemistry', title: '第一单元 走进化学世界', type: '单元导览', progress: 0, formula: '化学与实验', desc: '本单元介绍化学研究对象与学习方式，建立实验科学观念。' },
  { id: 'c901', subject: 'chemistry', title: '第一单元 课题1 物质的变化和性质', type: '走进化学世界', progress: 0, formula: '物理变化/化学变化', desc: '区分物理变化与化学变化，认识物理性质与化学性质。' },
  { id: 'c902', subject: 'chemistry', title: '第一单元 课题2 化学是一门以实验为基础的科学', type: '走进化学世界', progress: 0, formula: '观察-记录-结论', desc: '理解实验在化学中的核心地位和基本探究流程。' },
  { id: 'c903', subject: 'chemistry', title: '第一单元 课题3 走进化学实验室', type: '走进化学世界', progress: 0, formula: '规范操作', desc: '学习常见仪器使用与实验安全规范。' },

  { id: 'c1000', subject: 'chemistry', title: '第二单元 我们周围的空气', type: '单元导览', progress: 0, formula: '空气组成', desc: '本单元围绕空气和氧气展开，学习气体性质与制取。' },
  { id: 'c1001', subject: 'chemistry', title: '第二单元 课题1 空气', type: '我们周围的空气', progress: 0, formula: 'N2/O2/CO2', desc: '认识空气组成与主要成分用途。' },
  { id: 'c1002', subject: 'chemistry', title: '第二单元 课题2 氧气', type: '我们周围的空气', progress: 0, formula: 'O2', desc: '掌握氧气性质及其与燃烧相关现象。' },
  { id: 'c1003', subject: 'chemistry', title: '第二单元 课题3 制取氧气', type: '我们周围的空气', progress: 0, formula: '实验室制氧', desc: '学习氧气实验室制取、收集和检验方法。' },
  { id: 'c1004', subject: 'chemistry', title: '第二单元 实验活动1 氧气的实验室制取与性质', type: '我们周围的空气', progress: 0, formula: '制取与性质实验', desc: '通过实验综合验证氧气制取与性质。' },

  { id: 'c1100', subject: 'chemistry', title: '第三单元 物质构成的奥秘', type: '单元导览', progress: 0, formula: '微观粒子观', desc: '本单元从分子、原子和元素角度认识物质构成。' },
  { id: 'c1101', subject: 'chemistry', title: '第三单元 课题1 分子和原子', type: '物质构成的奥秘', progress: 0, formula: '分子/原子', desc: '理解分子、原子概念及其基本特征。' },
  { id: 'c1102', subject: 'chemistry', title: '第三单元 课题2 原子的结构', type: '物质构成的奥秘', progress: 0, formula: '核外电子', desc: '认识原子结构模型与核外电子排布初步。' },
  { id: 'c1103', subject: 'chemistry', title: '第三单元 课题3 元素', type: '物质构成的奥秘', progress: 0, formula: '元素符号', desc: '掌握元素概念和元素符号意义。' },

  { id: 'c1200', subject: 'chemistry', title: '第四单元 自然界的水', type: '单元导览', progress: 0, formula: 'H2O', desc: '本单元学习水资源、水的净化、水的组成及化学式。' },
  { id: 'c1201', subject: 'chemistry', title: '第四单元 课题1 爱护水资源', type: '自然界的水', progress: 0, formula: '节约与保护', desc: '认识水资源现状并形成保护意识。' },
  { id: 'c1202', subject: 'chemistry', title: '第四单元 课题2 水的净化', type: '自然界的水', progress: 0, formula: '沉淀/过滤/吸附', desc: '掌握常见净化方法与自来水处理过程。' },
  { id: 'c1203', subject: 'chemistry', title: '第四单元 课题3 水的组成', type: '自然界的水', progress: 0, formula: '电解水', desc: '通过实验认识水由氢、氧元素组成。' },
  { id: 'c1204', subject: 'chemistry', title: '第四单元 课题4 化学式与化合价', type: '自然界的水', progress: 0, formula: '化学式/化合价', desc: '掌握化学式书写规则和化合价应用。' },

  { id: 'c1300', subject: 'chemistry', title: '第五单元 化学方程式', type: '单元导览', progress: 0, formula: '配平与计算', desc: '本单元学习质量守恒、方程式书写与简单计算。' },
  { id: 'c1301', subject: 'chemistry', title: '第五单元 课题1 质量守恒定律', type: '化学方程式', progress: 0, formula: '反应前后总质量相等', desc: '理解质量守恒定律及其微观解释。' },
  { id: 'c1302', subject: 'chemistry', title: '第五单元 课题2 如何正确书写化学方程式', type: '化学方程式', progress: 0, formula: '方程式配平', desc: '掌握化学方程式书写步骤与配平方法。' },
  { id: 'c1303', subject: 'chemistry', title: '第五单元 课题3 利用化学方程式的简单计算', type: '化学方程式', progress: 0, formula: '计量关系', desc: '利用方程式进行基础定量计算。' },

  { id: 'c1400', subject: 'chemistry', title: '第六单元 碳和碳的氧化物', type: '单元导览', progress: 0, formula: 'C/CO/CO2', desc: '本单元学习碳单质、二氧化碳制取及碳氧化物性质。' },
  { id: 'c1401', subject: 'chemistry', title: '第六单元 课题1 金刚石、石墨和C60', type: '碳和碳的氧化物', progress: 0, formula: '同素异形体', desc: '认识碳单质结构差异与性质用途。' },
  { id: 'c1402', subject: 'chemistry', title: '第六单元 课题2 二氧化碳制取的研究', type: '碳和碳的氧化物', progress: 0, formula: 'CaCO3 + 2HCl', desc: '探究二氧化碳实验室制取条件和方法。' },
  { id: 'c1403', subject: 'chemistry', title: '第六单元 课题3 二氧化碳和一氧化碳', type: '碳和碳的氧化物', progress: 0, formula: 'CO2/CO', desc: '比较两种氧化物性质、用途和安全问题。' },
  { id: 'c1404', subject: 'chemistry', title: '第六单元 实验活动2 二氧化碳的实验室制取与性质', type: '碳和碳的氧化物', progress: 0, formula: '制取与检验', desc: '综合实验掌握二氧化碳制取及性质检验。' },

  { id: 'c1500', subject: 'chemistry', title: '第七单元 燃料及其利用', type: '单元导览', progress: 0, formula: '燃烧条件', desc: '本单元学习燃烧灭火、燃料开发与合理利用。' },
  { id: 'c1501', subject: 'chemistry', title: '第七单元 课题1 燃烧和灭火', type: '燃料及其利用', progress: 0, formula: '可燃物/氧气/着火点', desc: '掌握燃烧条件与灭火原理。' },
  { id: 'c1502', subject: 'chemistry', title: '第七单元 课题2 燃料的合理利用与开发', type: '燃料及其利用', progress: 0, formula: '能源利用', desc: '理解化石燃料利用现状与清洁能源开发。' },
  { id: 'c1503', subject: 'chemistry', title: '第七单元 实验活动3 燃烧的条件', type: '燃料及其利用', progress: 0, formula: '对比实验', desc: '通过控制变量实验验证燃烧三要素。' },

  { id: 'c1600', subject: 'chemistry', title: '第八单元 金属和金属材料', type: '单元导览', progress: 0, formula: '金属活动性', desc: '本单元学习金属材料、金属化学性质与资源保护。' },
  { id: 'c1601', subject: 'chemistry', title: '第八单元 课题1 金属材料', type: '金属和金属材料', progress: 0, formula: '合金', desc: '认识常见金属与合金材料及其性质。' },
  { id: 'c1602', subject: 'chemistry', title: '第八单元 课题2 金属的化学性质', type: '金属和金属材料', progress: 0, formula: '置换反应', desc: '掌握金属与酸、盐溶液等反应规律。' },
  { id: 'c1603', subject: 'chemistry', title: '第八单元 课题3 金属资源的利用和保护', type: '金属和金属材料', progress: 0, formula: '防锈与回收', desc: '理解金属资源利用、腐蚀防护和循环利用。' },
  { id: 'c1604', subject: 'chemistry', title: '第八单元 实验活动4 金属的物理性质和某些化学性质', type: '金属和金属材料', progress: 0, formula: '性质探究', desc: '通过实验比较金属物理特性及部分化学性质。' },

  { id: 'c1700', subject: 'chemistry', title: '第九单元 溶液', type: '单元导览', progress: 0, formula: '溶液浓度', desc: '本单元学习溶液形成、溶解度与浓度表示。' },
  { id: 'c1701', subject: 'chemistry', title: '第九单元 课题1 溶液的形成', type: '溶液', progress: 0, formula: '溶质/溶剂', desc: '认识溶液、溶质、溶剂和溶解过程。' },
  { id: 'c1702', subject: 'chemistry', title: '第九单元 课题2 溶解度', type: '溶液', progress: 0, formula: 'S', desc: '掌握溶解度概念和溶解度曲线读取。' },
  { id: 'c1703', subject: 'chemistry', title: '第九单元 课题3 溶液的浓度', type: '溶液', progress: 0, formula: '质量分数', desc: '学习溶液浓度表示与相关计算。' },
  { id: 'c1704', subject: 'chemistry', title: '第九单元 实验活动5 一定溶质质量分数的氯化钠溶液的配制', type: '溶液', progress: 0, formula: '配制计算', desc: '完成氯化钠溶液配制并进行误差分析。' },

  { id: 'c1800', subject: 'chemistry', title: '第十单元 酸和碱', type: '单元导览', progress: 0, formula: '酸碱性质', desc: '本单元学习常见酸碱、中和反应和酸碱性检验。' },
  { id: 'c1801', subject: 'chemistry', title: '第十单元 课题1 常见的酸和碱', type: '酸和碱', progress: 0, formula: 'HCl/NaOH', desc: '认识典型酸碱性质及用途。' },
  { id: 'c1802', subject: 'chemistry', title: '第十单元 课题2 酸和碱的中和反应', type: '酸和碱', progress: 0, formula: 'H+ + OH- = H2O', desc: '理解中和反应本质与实际应用。' },
  { id: 'c1803', subject: 'chemistry', title: '第十单元 实验活动6 酸、碱的化学性质', type: '酸和碱', progress: 0, formula: '性质验证', desc: '通过实验对比常见酸碱化学性质。' },
  { id: 'c1804', subject: 'chemistry', title: '第十单元 实验活动7 溶液酸碱性的检验', type: '酸和碱', progress: 0, formula: 'pH/指示剂', desc: '掌握酸碱指示剂与酸碱性检验方法。' },

  { id: 'c1900', subject: 'chemistry', title: '第十一单元 盐 化肥', type: '单元导览', progress: 0, formula: '盐与化肥', desc: '本单元学习生活中常见盐、化肥与杂质去除。' },
  { id: 'c1901', subject: 'chemistry', title: '第十一单元 课题1 生活中常见的盐', type: '盐 化肥', progress: 0, formula: 'NaCl/Na2CO3', desc: '认识常见盐及其性质、用途。' },
  { id: 'c1902', subject: 'chemistry', title: '第十一单元 课题2 化学肥料', type: '盐 化肥', progress: 0, formula: 'N/P/K肥', desc: '掌握常见化肥分类及科学施用。' },
  { id: 'c1903', subject: 'chemistry', title: '第十一单元 实验活动8 粗盐中难溶性杂质的去除', type: '盐 化肥', progress: 0, formula: '溶解-过滤-蒸发', desc: '通过实验学习粗盐提纯基本流程。' },

  { id: 'c2000', subject: 'chemistry', title: '第十二单元 化学与生活', type: '单元导览', progress: 0, formula: '化学应用', desc: '本单元关注营养、健康与材料，强化化学与生活联系。' },
  { id: 'c2001', subject: 'chemistry', title: '第十二单元 课题1 人类重要的营养物质', type: '化学与生活', progress: 0, formula: '六大营养素', desc: '认识营养物质类别与合理膳食。' },
  { id: 'c2002', subject: 'chemistry', title: '第十二单元 课题2 化学元素与人体健康', type: '化学与生活', progress: 0, formula: '微量元素', desc: '理解常量元素与微量元素对健康的作用。' },
  { id: 'c2003', subject: 'chemistry', title: '第十二单元 课题3 有机合成材料', type: '化学与生活', progress: 0, formula: '有机高分子', desc: '了解塑料、橡胶、纤维等材料及环保问题。' },

  { id: 'c2090', subject: 'chemistry', title: '结束语', type: '综合', progress: 0, formula: '总结提升', desc: '回顾初中化学核心观念与学习方法。' },
  { id: 'c2091', subject: 'chemistry', title: '附录Ⅰ 部分酸、碱和盐的溶解性表（室温）', type: '附录', progress: 0, formula: '溶解性规则', desc: '常见酸碱盐溶解性查询表。' },
  { id: 'c2092', subject: 'chemistry', title: '附录Ⅱ 部分名词中英文对照表', type: '附录', progress: 0, formula: '术语对照', desc: '常见化学术语中英文对照。' },
  { id: 'c2093', subject: 'chemistry', title: '元素周期表', type: '附录', progress: 0, formula: '周期律', desc: '元素周期表查阅与基本信息。' },
];

const PHYSICS_GRADE_CATALOG = [
  {
    gradeId: 'g8s1',
    gradeName: '八年级上册',
    chapters: [
      { chapterId: 'p100', sectionIds: ['p101', 'p102', 'p103', 'p104'] },
      { chapterId: 'p200', sectionIds: ['p201', 'p202', 'p203', 'p204'] },
      { chapterId: 'p300', sectionIds: ['p301', 'p302', 'p303', 'p304'] },
      { chapterId: 'p400', sectionIds: ['p401', 'p402', 'p403', 'p404', 'p405'] },
      { chapterId: 'p500', sectionIds: ['p501', 'p502', 'p503', 'p504', 'p505'] },
      { chapterId: 'p600', sectionIds: ['p601', 'p602', 'p603', 'p604'] },
    ],
  },
  {
    gradeId: 'g8s2',
    gradeName: '八年级下册',
    chapters: [
      { chapterId: 'p700', sectionIds: ['p701', 'p702', 'p703'] },
      { chapterId: 'p800', sectionIds: ['p801', 'p802', 'p803'] },
      { chapterId: 'p900', sectionIds: ['p901', 'p902', 'p903', 'p904'] },
      { chapterId: 'p1000', sectionIds: ['p1001', 'p1002', 'p1003'] },
      { chapterId: 'p1100', sectionIds: ['p1101', 'p1102', 'p1103', 'p1104'] },
      { chapterId: 'p1200', sectionIds: ['p1201', 'p1202', 'p1203'] },
    ],
  },
  {
    gradeId: 'g9all',
    gradeName: '九年级全一册',
    chapters: [
      { chapterId: 'p1300', sectionIds: ['p1301', 'p1302', 'p1303'] },
      { chapterId: 'p1400', sectionIds: ['p1401', 'p1402', 'p1403'] },
      { chapterId: 'p1500', sectionIds: ['p1501', 'p1502', 'p1503', 'p1504', 'p1505'] },
      { chapterId: 'p1600', sectionIds: ['p1601', 'p1602', 'p1603', 'p1604'] },
      { chapterId: 'p1700', sectionIds: ['p1701', 'p1702', 'p1703', 'p1704'] },
      { chapterId: 'p1800', sectionIds: ['p1801', 'p1802', 'p1803', 'p1804'] },
      { chapterId: 'p1900', sectionIds: ['p1901', 'p1902', 'p1903'] },
      { chapterId: 'p2000', sectionIds: ['p2001', 'p2002', 'p2003', 'p2004', 'p2005'] },
      { chapterId: 'p2100', sectionIds: ['p2101', 'p2102', 'p2103', 'p2104'] },
      { chapterId: 'p2200', sectionIds: ['p2201', 'p2202', 'p2203', 'p2204'] },
    ],
  },
];

const CHEMISTRY_GRADE_CATALOG = [
  {
    gradeId: 'c9s1',
    gradeName: '九年级上册',
    chapters: [
      { chapterId: 'c900', sectionIds: ['c901', 'c902', 'c903'] },
      { chapterId: 'c1000', sectionIds: ['c1001', 'c1002', 'c1003', 'c1004'] },
      { chapterId: 'c1100', sectionIds: ['c1101', 'c1102', 'c1103'] },
      { chapterId: 'c1200', sectionIds: ['c1201', 'c1202', 'c1203', 'c1204'] },
      { chapterId: 'c1300', sectionIds: ['c1301', 'c1302', 'c1303'] },
      { chapterId: 'c1400', sectionIds: ['c1401', 'c1402', 'c1403', 'c1404'] },
      { chapterId: 'c1500', sectionIds: ['c1501', 'c1502', 'c1503'] },
    ],
  },
  {
    gradeId: 'c9s2',
    gradeName: '九年级下册',
    chapters: [
      { chapterId: 'c1600', sectionIds: ['c1601', 'c1602', 'c1603', 'c1604'] },
      { chapterId: 'c1700', sectionIds: ['c1701', 'c1702', 'c1703', 'c1704'] },
      { chapterId: 'c1800', sectionIds: ['c1801', 'c1802', 'c1803', 'c1804'] },
      { chapterId: 'c1900', sectionIds: ['c1901', 'c1902', 'c1903'] },
      { chapterId: 'c2000', sectionIds: ['c2001', 'c2002', 'c2003'] },
      { chapterId: 'c2090', sectionIds: ['c2091', 'c2092', 'c2093'] },
    ],
  },
];

// --- Components ---

// 1. Glass Card Wrapper
const GlassCard = ({ children, className = '' }) => {
  const { theme } = useContext(HomeThemeContext);
  const shell =
    theme === 'light'
      ? 'bg-white/70 backdrop-blur-lg border border-slate-200/85 rounded-2xl shadow-lg'
      : 'bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl';
  return <div className={`${shell} ${className}`}>{children}</div>;
};

const ABILITY_DIMENSIONS = {
  physics: [
    { key: 'force', label: '力', matcher: /(力|压强|浮力|机械|杠杆|滑轮)/ },
    { key: 'electricity', label: '电', matcher: /(电流|电压|电阻|欧姆|电功率|电路|生活用电)/ },
    { key: 'thermal', label: '热', matcher: /(温度|热|内能|比热|热机|物态变化)/ },
    { key: 'light', label: '光', matcher: /(光|透镜)/ },
    { key: 'sound', label: '声', matcher: /(声|声音)/ },
    { key: 'electromagnetism', label: '电磁学', matcher: /(电与磁|磁|电磁|电动机|发电机)/ },
  ],
  chemistry: [
    {
      key: 'structure',
      label: '物质的组成与结构',
      matcher: /(分子和原子|原子的结构|元素|物质构成的奥秘|化学式与化合价|元素周期表|周期表)/,
    },
    {
      key: 'nearbySubstances',
      label: '身边的化学物质',
      matcher: /(我们周围的空气|空气|氧气|制取氧气|自然界的水|水的组成|水的净化|爱护水资源|碳和碳的氧化物|二氧化碳|一氧化碳|金刚石|石墨|金属和金属材料|燃料及其利用|燃烧和灭火)/,
    },
    {
      key: 'reactionCalc',
      label: '物质的化学变化与计算',
      matcher: /(化学方程式|质量守恒|利用化学方程式的简单计算|物质的变化和性质)/,
    },
    {
      key: 'solutionAcidSalt',
      label: '溶液与酸碱盐',
      matcher: /(溶液的形成|溶解度|溶质质量分数|酸和碱|中和反应|盐\s*化肥|粗盐|化学肥料|生活中常见的盐)/,
    },
    {
      key: 'experiment',
      label: '化学实验基础与探究',
      matcher: /(实验活动|走进化学实验室|以实验为基础)/,
    },
    {
      key: 'society',
      label: '化学与社会发展',
      matcher: /(化学与生活|营养物质|化学元素与人体健康|有机合成材料|燃料的合理利用与开发|结束语)/,
    },
  ],
};

const QUIZ_SCORE_MAP = {
  physics: {
    force: 76,
    electricity: 82,
    thermal: 73,
    light: 80,
    sound: 78,
    electromagnetism: 75,
  },
  chemistry: {
    structure: 80,
    nearbySubstances: 78,
    reactionCalc: 74,
    solutionAcidSalt: 82,
    experiment: 86,
    society: 76,
  },
};

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

/** catalog 内全部小节进度均值（0–100） */
const getSectionAverageProgress = (catalog, topicsById) => {
  let sum = 0;
  let n = 0;
  for (const grade of catalog) {
    for (const ch of grade.chapters) {
      for (const sid of ch.sectionIds) {
        const t = topicsById[sid];
        if (t) {
          sum += t.progress;
          n += 1;
        }
      }
    }
  }
  return n ? sum / n : 0;
};

const getQuizAverage = (subject) => {
  const m = QUIZ_SCORE_MAP[subject] || QUIZ_SCORE_MAP.physics;
  const vals = Object.values(m);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

const getSubjectLearningMetrics = (subject, topicsList = TOPICS) => {
  const catalog =
    subject === 'physics' ? PHYSICS_GRADE_CATALOG : subject === 'chemistry' ? CHEMISTRY_GRADE_CATALOG : [];
  const topicsById = Object.fromEntries(topicsList.filter((t) => t.subject === subject).map((t) => [t.id, t]));
  const sectionAvg = catalog.length ? getSectionAverageProgress(catalog, topicsById) : 0;
  const quizAvg = getQuizAverage(subject);
  const composite = sectionAvg * 0.55 + quizAvg * 0.45;
  return { sectionAvg, quizAvg, composite: clampScore(composite) };
};

/**
 * 物理 / 化学分立勋章；解锁条件：综合掌握度 = 章节进度×55% + 六维测验均分×45%，达到阈值即解锁。
 * 设为 true 时两侧学科 10 枚勋章全部解锁（演示用）；正式环境改为 false 即恢复按条件解锁。
 */
const UNLOCK_ALL_HONOR_BADGES = true;

const BADGE_DEFINITIONS = [
  {
    id: 'phy-b1',
    subject: 'physics',
    name: '物理·启程',
    minComposite: 24,
    icon: BookOpen,
    color: 'text-sky-200',
  },
  {
    id: 'phy-b2',
    subject: 'physics',
    name: '物理·声光与运动',
    minComposite: 38,
    icon: Zap,
    color: 'text-cyan-300',
  },
  {
    id: 'phy-b3',
    subject: 'physics',
    name: '物理·力热共进',
    minComposite: 52,
    icon: Award,
    color: 'text-blue-300',
  },
  {
    id: 'phy-b4',
    subject: 'physics',
    name: '物理·电路突破',
    minComposite: 66,
    icon: BarChart3,
    color: 'text-indigo-300',
  },
  {
    id: 'phy-b5',
    subject: 'physics',
    name: '物理之星',
    minComposite: 80,
    icon: Atom,
    color: 'text-amber-200',
  },
  {
    id: 'chem-b1',
    subject: 'chemistry',
    name: '化学·启程',
    minComposite: 24,
    icon: BookOpen,
    color: 'text-orange-200',
  },
  {
    id: 'chem-b2',
    subject: 'chemistry',
    name: '化学·微观与组成',
    minComposite: 38,
    icon: Search,
    color: 'text-amber-200',
  },
  {
    id: 'chem-b3',
    subject: 'chemistry',
    name: '化学·变化与计量',
    minComposite: 52,
    icon: Flame,
    color: 'text-orange-300',
  },
  {
    id: 'chem-b4',
    subject: 'chemistry',
    name: '化学·实验与探究',
    minComposite: 66,
    icon: BarChart3,
    color: 'text-emerald-300',
  },
  {
    id: 'chem-b5',
    subject: 'chemistry',
    name: '化学之星',
    minComposite: 80,
    icon: Atom,
    color: 'text-yellow-200',
  },
];

const buildAbilityData = (subject) => {
  const dimensions = ABILITY_DIMENSIONS[subject] || ABILITY_DIMENSIONS.physics;
  const subjectTopics = TOPICS.filter((topic) => topic.subject === subject);
  const quizMap = QUIZ_SCORE_MAP[subject] || QUIZ_SCORE_MAP.physics;

  const labels = dimensions.map((item) => item.label);
  const scores = dimensions.map((item) => {
    const relatedTopics = subjectTopics.filter((topic) => {
      const searchableText = `${topic.title} ${topic.type} ${topic.desc}`.toLowerCase();
      return item.matcher.test(searchableText);
    });

    const progressScore = relatedTopics.length
      ? relatedTopics.reduce((sum, topic) => sum + topic.progress, 0) / relatedTopics.length
      : 0;
    const quizScore = quizMap[item.key] ?? 70;

    // 进度与测验加权，突出“掌握程度”而非单次成绩
    return clampScore(progressScore * 0.55 + quizScore * 0.45);
  });

  return { labels, scores };
};

const PREVIEW_CONFIG = {
  physics: [
    {
      id: 'physics-pendulum',
      title: '物理：摆锤与波形',
      desc: '通过节奏动画感知周期运动，直观看到振幅与周期变化。',
      component: PendulumWavePreview,
    },
    {
      id: 'physics-circuit',
      title: '物理：电路脉冲追踪',
      desc: '用发光脉冲模拟电流路径，帮助理解电路连通与回路概念。',
      component: CircuitPulsePreview,
    },
  ],
  chemistry: [
    {
      id: 'chem-orbit',
      title: '化学：微观粒子运动',
      desc: '用轨道和气泡动态表达微观世界，提升课堂兴趣与想象力。',
      component: MoleculeOrbitPreview,
    },
    {
      id: 'chem-flask',
      title: '化学：烧瓶沸腾反应',
      desc: '液面起伏与气泡上升展示反应活跃过程，强化实验现象记忆。',
      component: LabFlaskPreview,
    },
  ],
};

const AbilityRadar = ({ subject }) => {
  const { theme } = useContext(HomeThemeContext);
  const { labels, scores } = useMemo(() => buildAbilityData(subject), [subject]);
  const center = 110;
  const maxRadius = 78;
  const step = (Math.PI * 2) / labels.length;
  const isLight = theme === 'light';
  const gridStroke = isLight ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.15)';
  const axisStroke = isLight ? 'rgba(15,23,42,0.18)' : 'rgba(255,255,255,0.2)';
  const labelFill = isLight ? 'rgba(15,23,42,0.88)' : 'rgba(255,255,255,0.92)';

  const points = scores.map((score, idx) => {
    const angle = -Math.PI / 2 + idx * step;
    const r = (score / 100) * maxRadius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  });

  const polygon = points.map(([x, y]) => `${x},${y}`).join(' ');
  const axisPoints = labels.map((_, idx) => {
    const angle = -Math.PI / 2 + idx * step;
    return [
      center + maxRadius * Math.cos(angle),
      center + maxRadius * Math.sin(angle),
      center + (maxRadius + 20) * Math.cos(angle),
      center + (maxRadius + 20) * Math.sin(angle),
    ];
  });
  const cornerLabels = labels.map((label, idx) => {
    const angle = -Math.PI / 2 + idx * step;
    const r = maxRadius + 22;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    const anchor = Math.abs(x - center) < 8 ? 'middle' : x < center ? 'end' : 'start';
    const dy = anchor === 'middle' ? (y < center ? -2 : 2) : 0;
    return { label, score: scores[idx], x, y, dy, anchor };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="-12 -12 244 244" className="h-64 w-64 overflow-visible">
        {[1, 2, 3, 4].map((level) => {
          const r = (maxRadius * level) / 4;
          const ring = labels.map((_, idx) => {
            const angle = -Math.PI / 2 + idx * step;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return <polygon key={level} points={ring} fill="none" stroke={gridStroke} strokeWidth="1" />;
        })}

        {axisPoints.map(([x1, y1, x2, y2], idx) => (
          <line key={labels[idx]} x1={x1} y1={y1} x2={x2 - (x2 - center) * 0.15} y2={y2 - (y2 - center) * 0.15} stroke={axisStroke} strokeWidth="1" />
        ))}

        <polygon points={polygon} fill={subject === 'physics' ? 'rgba(96,165,250,0.28)' : 'rgba(251,146,60,0.28)'} stroke={subject === 'physics' ? 'rgba(96,165,250,0.95)' : 'rgba(251,146,60,0.95)'} strokeWidth="2" />

        {points.map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r="3.5" fill={subject === 'physics' ? '#60a5fa' : '#fb923c'} />
        ))}

        {cornerLabels.map((item) => (
          <text
            key={item.label}
            x={item.x}
            y={item.y + item.dy}
            textAnchor={item.anchor}
            dominantBaseline="middle"
            fill={labelFill}
            fontSize={subject === 'chemistry' ? '9' : '11'}
            fontWeight="600"
          >
            {`${item.label} ${item.score}`}
          </text>
        ))}
      </svg>
    </div>
  );
};

// 2. Dashboard View
const Dashboard = ({ activeSubject, setActiveSubject, onSelectTopic }) => {
  const currentTopics = TOPICS.filter(t => t.subject === activeSubject.id);
  const [searchQuery, setSearchQuery] = useState('');
  const topicsById = useMemo(
    () => Object.fromEntries(currentTopics.map((topic) => [topic.id, topic])),
    [currentTopics]
  );
  const formatSectionTitle = (title, subjectId) => {
    if (subjectId === 'physics') {
      return title.replace(/^第[一二三四五六七八九十0-9]+章\s*/, '');
    }
    if (subjectId === 'chemistry') {
      return title.replace(/^第[一二三四五六七八九十0-9]+单元\s*/, '');
    }
    return title;
  };
  const activeCatalog = activeSubject.id === 'physics'
    ? PHYSICS_GRADE_CATALOG
    : activeSubject.id === 'chemistry'
      ? CHEMISTRY_GRADE_CATALOG
      : [];
  const { theme, toggleTheme } = useContext(HomeThemeContext);
  const L = theme === 'light';
  const subjectColorClass =
    activeSubject.id === 'physics'
      ? L
        ? 'text-blue-600'
        : 'text-blue-400'
      : L
        ? 'text-orange-600'
        : 'text-orange-400';
  const subjectBgClass = activeSubject.id === 'physics' ? 'bg-blue-500' : 'bg-orange-500';
  const [expandedGrades, setExpandedGrades] = useState({ g8s1: true, g8s2: true, g9all: true, c9s1: true, c9s2: true });
  const [expandedChapters, setExpandedChapters] = useState({ p100: true });
  const previewItems = PREVIEW_CONFIG[activeSubject.id] || PREVIEW_CONFIG.physics;
  const subjectMetrics = useMemo(() => getSubjectLearningMetrics(activeSubject.id), [activeSubject.id]);
  const honorBadges = useMemo(
    () =>
      BADGE_DEFINITIONS.filter((b) => b.subject === activeSubject.id).map((b) => ({
        ...b,
        unlocked: UNLOCK_ALL_HONOR_BADGES || subjectMetrics.composite >= b.minComposite,
      })),
    [activeSubject.id, subjectMetrics.composite]
  );
  const unlockedHonors = honorBadges.filter((b) => b.unlocked);
  const honorRingClass =
    activeSubject.id === 'physics'
      ? L
        ? 'bg-linear-to-br from-sky-100/90 via-white to-blue-100/80 border border-sky-300/60 shadow-[0_0_18px_rgba(14,165,233,0.18)]'
        : 'bg-linear-to-br from-sky-200/25 via-white/20 to-blue-400/20 border border-sky-200/40 shadow-[0_0_22px_rgba(56,189,248,0.32)]'
      : L
        ? 'bg-linear-to-br from-amber-50/95 via-white to-amber-100/80 border border-amber-300/60 shadow-[0_0_18px_rgba(245,158,11,0.18)]'
        : 'bg-linear-to-br from-amber-200/25 via-white/20 to-amber-400/20 border border-amber-200/40 shadow-[0_0_22px_rgba(251,191,36,0.32)]';
  const honorRibbonClass = activeSubject.id === 'physics' ? 'bg-sky-500/70' : 'bg-amber-500/70';
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return currentTopics.filter((topic) =>
      [topic.title, topic.type, topic.desc, topic.formula]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedSearch))
    );
  }, [currentTopics, isSearching, normalizedSearch]);

  const u = L
    ? {
      sidebar: 'border-slate-200/90',
      brand: 'text-slate-900',
      subjectTrack: 'bg-slate-200/70',
      subjectIdle: 'text-slate-500 hover:text-slate-900',
      sectionLabel: 'text-slate-500',
      resultCard: 'hover:bg-slate-200/70 border border-slate-200/90 bg-white/60',
      resultTitle: 'text-slate-900 text-sm font-medium group-hover:text-slate-950 line-clamp-2',
      resultDesc: 'text-slate-600',
      resultMeta: 'text-slate-500',
      emptyBox: 'border-slate-200/90 bg-white/55 text-slate-600',
      gradeBox: 'border-slate-200/90 bg-slate-100/80',
      gradeBtn: 'text-slate-900 hover:bg-slate-200/60 rounded-xl',
      chapterBox: 'bg-white/70',
      chapterBtn: 'text-slate-800 text-sm hover:bg-slate-200/50 rounded-lg',
      sectionBtn: 'hover:bg-slate-200/60',
      sectionText: 'text-slate-600 text-xs group-hover:text-slate-900',
      listRow: 'hover:bg-slate-100/90',
      listTitle: 'text-slate-900 font-medium group-hover:text-slate-950',
      listType: 'text-slate-500',
      h1: 'text-slate-900',
      sub: 'text-slate-600',
      searchIcon: 'text-slate-400',
      searchInput:
        'bg-white/85 border border-slate-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 w-64 transition-all',
      avatarRing: 'border-slate-200',
      cardGlow: 'bg-sky-400/25',
      statLabel: 'text-slate-600',
      statValue: 'text-slate-900',
      statUnit: 'text-slate-600',
      statSub: 'text-slate-600',
      honorDividerSub: 'text-slate-500',
      divider: 'border-slate-200/90',
      h4: 'text-slate-700',
      tooltip: 'border-slate-200 bg-white/95 text-slate-800 shadow-lg',
      tooltipTitle: 'font-medium text-slate-900',
      tooltipBody: 'text-slate-600',
      emptyHonor: 'text-slate-500',
      sectionHeading: 'text-slate-800 font-semibold',
      h2: 'text-slate-900',
      previewDesc: 'text-slate-600',
      themeBtn: 'border-slate-200 bg-white/85 text-amber-600 hover:bg-white shadow-sm',
    }
    : {
      sidebar: 'border-white/10',
      brand: 'text-white',
      subjectTrack: 'bg-black/20',
      subjectIdle: 'text-white/50 hover:text-white',
      sectionLabel: 'text-white/50',
      resultCard: 'hover:bg-white/8 border border-white/10 bg-white/5',
      resultTitle: 'text-white/90 text-sm font-medium group-hover:text-white line-clamp-2',
      resultDesc: 'text-white/55',
      resultMeta: 'text-white/45',
      emptyBox: 'border-white/10 bg-white/5 text-white/55',
      gradeBox: 'border-white/10 bg-black/10',
      gradeBtn: 'text-white/90 hover:bg-white/5 rounded-xl',
      chapterBox: 'bg-white/5',
      chapterBtn: 'text-white/85 text-sm hover:bg-white/5 rounded-lg',
      sectionBtn: 'hover:bg-white/10',
      sectionText: 'text-white/70 text-xs group-hover:text-white',
      listRow: 'hover:bg-white/5',
      listTitle: 'text-white/90 font-medium group-hover:text-white',
      listType: 'text-white/40',
      h1: 'text-white',
      sub: 'text-white/60',
      searchIcon: 'text-white/40',
      searchInput:
        'bg-black/20 border border-white/10 text-white focus:outline-none focus:border-white/30 w-64 transition-all',
      avatarRing: 'border-white/20',
      cardGlow: 'bg-white/5',
      statLabel: 'text-white/70',
      statValue: 'text-white',
      statUnit: 'text-white/70',
      statSub: 'text-white/55',
      honorDividerSub: 'text-white/50',
      divider: 'border-white/10',
      h4: 'text-white/70',
      tooltip: 'border-white/15 bg-black/75 text-white',
      tooltipTitle: 'font-medium text-white/95',
      tooltipBody: 'text-white/65',
      emptyHonor: 'text-white/50',
      sectionHeading: 'text-white/85 font-semibold',
      h2: 'text-white',
      previewDesc: 'text-white/60',
      themeBtn: 'border-white/15 bg-white/10 text-amber-200 hover:bg-white/15',
    };

  const previewAccent =
    activeSubject.id === 'physics' ? (L ? 'text-blue-600' : 'text-blue-300') : L ? 'text-orange-600' : 'text-orange-300';

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className={`w-64 border-r flex flex-col p-6 space-y-8 ${u.sidebar}`}>
        <div className={`flex items-center space-x-3 text-2xl font-bold ${u.brand}`}>
          <activeSubject.icon className={subjectColorClass} size={32} />
          <span>虚拟实验室</span>
        </div>

        <div className={`flex rounded-lg p-1 ${u.subjectTrack}`}>
          {Object.values(SUBJECTS).map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubject(sub)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeSubject.id === sub.id ? `${subjectBgClass} text-white shadow-lg` : u.subjectIdle
                }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <h3 className={`${u.sectionLabel} text-xs font-semibold uppercase tracking-wider mb-4`}>知识点导览</h3>
          {isSearching ? (
            <div className="space-y-2">
              <p className={`text-xs px-1 ${u.sectionLabel}`}>
                共找到 {searchResults.length} 条与 “{searchQuery.trim()}” 相关内容
              </p>
              {searchResults.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic)}
                  className={`w-full text-left p-3 rounded-xl transition-colors group ${u.resultCard}`}
                >
                  <div className={u.resultTitle}>{topic.title}</div>
                  <div className={`mt-1 text-[11px] line-clamp-2 ${u.resultDesc}`}>{topic.desc}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className={u.resultMeta}>{topic.type}</span>
                    <span className={`${u.resultMeta} font-mono`}>{topic.formula}</span>
                  </div>
                </button>
              ))}
              {searchResults.length === 0 && (
                <div className={`rounded-xl border p-3 text-xs ${u.emptyBox}`}>
                  没有匹配的知识点，请尝试标题、公式或内容关键词。
                </div>
              )}
            </div>
          ) : activeCatalog.length > 0 ? (
            <div className="space-y-2">
              {activeCatalog.map((grade) => (
                <div key={grade.gradeId} className={`rounded-xl border ${u.gradeBox}`}>
                  <button
                    onClick={() =>
                      setExpandedGrades((prev) => ({ ...prev, [grade.gradeId]: !prev[grade.gradeId] }))
                    }
                    className={`w-full flex items-center justify-between px-3 py-2 text-left font-medium ${u.gradeBtn}`}
                  >
                    <span>{grade.gradeName}</span>
                    {expandedGrades[grade.gradeId] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {expandedGrades[grade.gradeId] && (
                    <div className="px-2 pb-2 space-y-1.5">
                      {grade.chapters.map((chapter) => {
                        const chapterTopic = topicsById[chapter.chapterId];
                        if (!chapterTopic) return null;
                        return (
                          <div key={chapter.chapterId} className={`rounded-lg ${u.chapterBox}`}>
                            <button
                              onClick={() =>
                                setExpandedChapters((prev) => ({
                                  ...prev,
                                  [chapter.chapterId]: !prev[chapter.chapterId],
                                }))
                              }
                              className={`w-full flex items-center justify-between px-3 py-2 text-left ${u.chapterBtn}`}
                            >
                              <span>{chapterTopic.title}</span>
                              {expandedChapters[chapter.chapterId] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {expandedChapters[chapter.chapterId] && (
                              <div className="px-2 pb-2 space-y-1">
                                {chapter.sectionIds.map((sectionId) => {
                                  const sectionTopic = topicsById[sectionId];
                                  if (!sectionTopic) return null;
                                  return (
                                    <button
                                      key={sectionTopic.id}
                                      onClick={() => onSelectTopic(sectionTopic)}
                                      className={`w-full text-left px-2 py-1.5 rounded-md transition-colors group flex items-center justify-between ${u.sectionBtn}`}
                                    >
                                      <span className={u.sectionText}>
                                        {formatSectionTitle(sectionTopic.title, activeSubject.id)}
                                      </span>
                                      {sectionTopic.progress === 100 && (
                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {currentTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic)}
                  className={`w-full text-left p-3 rounded-xl transition-colors group flex items-center justify-between ${u.listRow}`}
                >
                  <div>
                    <div className={u.listTitle}>{topic.title}</div>
                    <div className={`${u.listType} text-xs mt-1`}>{topic.type}</div>
                  </div>
                  {topic.progress === 100 && <CheckCircle2 size={16} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${u.h1}`}>你好，小明同学</h1>
            <p className={u.sub}>准备好探索{activeSubject.name}的奥秘了吗？</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-colors ${u.themeBtn}`}
              title={L ? '切换到深色模式' : '切换到浅色模式'}
              aria-label={L ? '切换到深色模式' : '切换到浅色模式'}
            >
              {L ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
            </button>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${u.searchIcon}`} size={18} />
              <input
                type="text"
                placeholder="搜索知识点、公式或内容..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={`rounded-full py-2 pl-10 pr-4 text-sm ${u.searchInput}`}
              />
            </div>
            <div className={`w-10 h-10 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 flex items-center justify-center border-2 ${u.avatarRing}`}>
              <User className="text-white" size={20} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 col-span-2 relative overflow-hidden h-[340px]">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 ${u.cardGlow}`}></div>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <h3 className={`text-sm mb-1 ${u.statLabel}`}>本周学习时长</h3>
                <div className={`text-6xl font-extrabold leading-none ${u.statValue}`}>
                  4.5
                  <span className={`ml-2 text-2xl font-medium ${u.statUnit}`}>小时</span>
                </div>
              </div>
              <div>
                <h3 className={`text-sm mb-1 ${u.statLabel}`}>学习增幅</h3>
                <p className="text-4xl font-extrabold text-emerald-500 leading-none flex items-end">
                  +12%
                </p>
                <p className={`text-xs mt-1 flex items-center ${u.statSub}`}>
                  <BarChart3 size={12} className="mr-1" />
                  对比上周
                </p>
              </div>
              <div>
                <h3 className={`text-sm mb-1 ${u.statLabel}`}>已获荣誉</h3>
                <div className={`text-4xl font-extrabold leading-none ${L ? 'text-amber-600' : 'text-amber-300'}`}>
                  {unlockedHonors.length}
                  <span className={`ml-2 text-lg font-medium ${u.statUnit}`}>项</span>
                </div>
              </div>
            </div>
            <p className={`mt-3 text-xs ${u.honorDividerSub}`}>
              {activeSubject.name}综合掌握度 {subjectMetrics.composite}（章节均进度 {Math.round(subjectMetrics.sectionAvg)}% ×55% +
              测验均分 {Math.round(subjectMetrics.quizAvg)} ×45%）
            </p>
            <div className={`mt-4 border-t pt-4 ${u.divider}`}>
              <h4 className={`text-sm mb-3 flex items-center ${u.h4}`}>
                <Award size={16} className={`mr-2 ${L ? 'text-amber-600' : 'text-amber-300'}`} />
                {activeSubject.name}荣誉成就
              </h4>
              <div className="flex flex-wrap gap-5">
                {unlockedHonors.map((badge) => (
                  <div
                    key={badge.id}
                    className="group relative"
                    title={badge.name}
                    aria-label={badge.name}
                  >
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-full border flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${honorRingClass}`}
                      >
                        <badge.icon className={badge.color} size={24} />
                      </div>
                      <span
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2.5 rounded-b-sm ${honorRibbonClass}`}
                      ></span>
                    </div>
                    <div className={`pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 max-w-[min(280px,calc(100vw-2rem))] rounded-md border px-2.5 py-1.5 text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${u.tooltip}`}>
                      <div className={u.tooltipTitle}>{badge.name}</div>
                      <div className={`mt-1 text-[11px] leading-snug ${u.tooltipBody}`}>
                        {UNLOCK_ALL_HONOR_BADGES
                          ? '演示：已全部解锁。关闭 UNLOCK_ALL_HONOR_BADGES 后按综合掌握度与条件解锁。'
                          : `需综合≥${badge.minComposite}（当前 ${subjectMetrics.composite}），依据章节学习与测验计算`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {unlockedHonors.length === 0 && (
                <p className={`text-xs ${u.emptyHonor}`}>继续完成章节学习并参加测验，即可解锁{activeSubject.name}荣誉勋章。</p>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-5 h-[340px] flex flex-col">
            <h3 className={`mb-2 ${u.sectionHeading}`}>同学能力六边形分数图</h3>
            <AbilityRadar subject={activeSubject.id} />
          </GlassCard>
        </div>

        <h2 className={`text-xl font-bold mb-4 ${u.h2}`}>学科趣味动画预览</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {previewItems.map((item) => {
            const PreviewComponent = item.component;
            return (
              <GlassCard key={item.id} className="p-5">
                <div className={`mb-3 flex items-center ${previewAccent}`}>
                  <activeSubject.icon size={18} className="mr-2" />
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <PreviewComponent />
                <p className={`mt-3 text-xs ${u.previewDesc}`}>{item.desc}</p>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </div>
  );
};

// 3. Experiment / Animation View
export const ExperimentView = ({ topic, onBack, subjectColor: _subjectColor }) => {
  const content = useMemo(() => resolveTopicContent(topic.id), [topic.id]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [theoryOpen, setTheoryOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(30);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 1 * speed));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const toggleSpeed = () => {
    if (speed === 1) setSpeed(0.5);
    else if (speed === 0.5) setSpeed(2);
    else setSpeed(1);
  };

  const TheoryComp = content.Theory;
  const QuizComp = content.Quiz;
  const AnimComp = content.Animation;
  const PageComp = content.Page;

  const theoryModal = theoryOpen && (
    <TopicModal title="知识原理解析" onClose={() => setTheoryOpen(false)} wide>
      {TheoryComp ? (
        <TheoryComp topic={topic} />
      ) : (
        <div className="py-10 text-center text-white/60">该章节知识要点正在整理中，敬请期待</div>
      )}
    </TopicModal>
  );

  const quizModal = quizOpen && (
    QuizComp ? (
      <QuizComp topic={topic} onClose={() => setQuizOpen(false)} />
    ) : (
      <TopicModal title="课后测验" onClose={() => setQuizOpen(false)} wide>
        <div className="py-10 text-center text-white/60">该章节课后测验正在制作中，敬请期待</div>
      </TopicModal>
    )
  );

  const tagLine =
    content.layout === "immersive"
      ? AnimComp
        ? "交互实验"
        : PageComp
          ? "章节内容"
          : "学习内容"
      : "沉浸式动画解析";

  const headerNode = (
    <header
      className={`flex items-center justify-between shrink-0 ${content.layout === "immersive" ? "px-6 pt-6 pb-4" : "mb-6"
        }`}
    >
      <div className="flex items-center min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors mr-4 shrink-0"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{topic.title}</h1>
          <div className="flex items-center text-sm mt-1 flex-wrap gap-2">
            <span
              className={`px-2 py-0.5 rounded text-xs border border-white/20 ${topic.subject === "physics" ? "bg-blue-500/20 text-blue-300" : "bg-orange-500/20 text-orange-300"
                }`}
            >
              {topic.type}
            </span>
            <span className="text-white/50">{tagLine}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setTheoryOpen(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-colors flex items-center text-sm"
        >
          <ScrollText size={16} className="mr-2" /> 知识要点
        </button>
        <button
          type="button"
          onClick={() => setQuizOpen(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-colors flex items-center text-sm"
        >
          <BookOpen size={16} className="mr-2" /> 课后测验
        </button>
      </div>
    </header>
  );

  if (content.layout === "immersive") {
    return (
      <div className="flex flex-col h-full w-full min-h-0">
        {headerNode}
        <div className="flex-1 min-h-0 px-4 pb-4 overflow-hidden flex flex-col">
          {AnimComp ? (
            <AnimComp embedded topic={topic} progress={progress} />
          ) : PageComp ? (
            <PageComp topic={topic} />
          ) : (
            <DefaultImmersivePage topic={topic} TheoryComp={TheoryComp} />
          )}
        </div>
        {theoryModal}
        {quizModal}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-6 min-h-0">
      {headerNode}
      <GlassCard className="flex-1 relative overflow-hidden group min-h-0">
        <div
          className={`absolute inset-0 opacity-20 blur-3xl rounded-full scale-150 transition-colors ${
            topic.subject === "physics" ? "bg-blue-500" : "bg-orange-500"
          }`}
        />
        {AnimComp ? (
          <div className="relative z-[1] w-full h-full min-h-0">
            <AnimComp topic={topic} progress={progress} embedded />
          </div>
        ) : PageComp ? (
          <div className="relative z-[1] w-full h-full min-h-0 overflow-y-auto">
            <PageComp topic={topic} />
          </div>
        ) : (
          <div className="relative z-[1] w-full h-full min-h-0">
            <TopicAnimationRenderer topic={topic} progress={progress} />
          </div>
        )}
      </GlassCard>

      {theoryModal}
      {quizModal}
    </div>
  );
};
// --- Main App ---
function AppInner() {
  const router = useRouter();
  const { theme } = useContext(HomeThemeContext);
  const [activeSubject, setActiveSubject] = useState(SUBJECTS.PHYSICS);

  const L = theme === 'light';
  const bgTheme = L ? activeSubject.themeLight : activeSubject.theme;
  const handleOpenTopic = (topic) => {
    router.push(`/chapters/${topic.id}`);
  };

  return (
    <div className={`w-full h-full bg-linear-to-br ${bgTheme} overflow-hidden font-sans transition-colors duration-700 ease-in-out`}>
      <div
        className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-3xl pointer-events-none ${L ? 'bg-white/50' : 'bg-white/5'
          }`}
      ></div>
      <div
        className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-3xl pointer-events-none ${L ? 'bg-indigo-300/30' : 'bg-black/20'
          }`}
      ></div>

      <div className="relative w-full h-full backdrop-blur-[2px]">
        <Dashboard
          activeSubject={activeSubject}
          setActiveSubject={setActiveSubject}
          onSelectTopic={handleOpenTopic}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HomeThemeProvider>
      <AppInner />
    </HomeThemeProvider>
  );
}
