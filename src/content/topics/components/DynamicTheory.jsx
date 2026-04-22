"use client";

import React, { useState, useEffect, useCallback } from "react";

/* ──────────────────────────────────────────────────────────
   section 颜色方案：根据 section.color 字段选取
────────────────────────────────────────────────────────── */
const SECTION_COLORS = {
  yellow:  { bg: "bg-yellow-500/10",  border: "border-yellow-500/25", text: "text-yellow-400",  icon: "text-yellow-400",  iconBg: "bg-yellow-500/20"  },
  cyan:    { bg: "bg-cyan-500/10",    border: "border-cyan-500/25",   text: "text-cyan-400",    icon: "text-cyan-400",    iconBg: "bg-cyan-500/20"    },
  indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/25", text: "text-indigo-400",  icon: "text-indigo-400",  iconBg: "bg-indigo-500/20"  },
  pink:    { bg: "bg-pink-500/10",    border: "border-pink-500/25",   text: "text-pink-400",    icon: "text-pink-400",    iconBg: "bg-pink-500/20"    },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/25",text: "text-emerald-400", icon: "text-emerald-400", iconBg: "bg-emerald-500/20" },
  purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/25", text: "text-purple-400",  icon: "text-purple-400",  iconBg: "bg-purple-500/20"  },
  rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/25",   text: "text-rose-400",    icon: "text-rose-400",    iconBg: "bg-rose-500/20"    },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/25",  text: "text-amber-400",   icon: "text-amber-400",   iconBg: "bg-amber-500/20"   },
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/25",   text: "text-blue-400",    icon: "text-blue-400",    iconBg: "bg-blue-500/20"    },
};

const DEFAULT_COLOR = SECTION_COLORS.cyan;

function resolveTheoryImgUrl(src, topicId) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  let cleanPath = src.replace(/^\.\//, "").replace(/^\//, "");
  return `/${topicId}/${cleanPath}`;
}

/* ──────────────────────────────────────────────────────────
   内容块渲染器：根据 JSON 中 content[].type 渲染不同 UI
────────────────────────────────────────────────────────── */
function ContentBlock({ block, sectionColor, topicId }) {
  const sc = sectionColor;

  switch (block.type) {
    /* 定义块 */
    case "definition":
      return (
        <div className="text-gray-300 text-sm">
          {block.label && <span className={`font-mono ${sc.text} mr-2`}>[{block.label}]</span>}
          <span dangerouslySetInnerHTML={{ __html: block.text }} />
        </div>
      );

    /* 段落 */
    case "paragraph":
      return <p className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />;

    /* 列表 */
    case "list":
      return (
        <ul className="text-gray-300 text-sm space-y-1.5 list-disc pl-5">
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );

    /* 警告 / 易错点 */
    case "warning":
      return (
        <div className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-0.5 h-full bg-linear-to-b from-rose-500 to-rose-500/30" />
          {block.label && (
            <div className="mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">{block.label}</span>
            </div>
          )}
          <p className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />
        </div>
      );

    /* 提示 / 拓展知识 */
    case "tip":
      return (
        <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-0.5 h-full bg-linear-to-b from-emerald-500 to-emerald-500/30" />
          {block.label && (
            <div className="mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">{block.label}</span>
            </div>
          )}
          <p className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />
        </div>
      );

    /* 公式 */
    case "formula":
      return (
        <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-center relative overflow-hidden">
          <div className={`absolute inset-0 ${sc.bg} opacity-30`} />
          <p className="text-white font-mono text-base relative z-10" dangerouslySetInnerHTML={{ __html: block.text }} />
          {block.label && <p className="text-white/30 text-xs mt-2 relative z-10">{block.label}</p>}
        </div>
      );

    /* 图片 */
    case "image":
      return (
        <div className="flex justify-center">
          <img
            src={resolveTheoryImgUrl(block.src, topicId)}
            alt={block.alt || ""}
            className="max-h-64 rounded-lg border border-white/10 object-contain"
          />
          {block.caption && <p className="text-white/30 text-xs mt-2 text-center">{block.caption}</p>}
        </div>
      );

    /* 卡片网格：将多个子条目以网格呈现 */
    case "cards":
      return (
        <div className={`grid ${block.columns ? `grid-cols-${block.columns}` : "grid-cols-2 lg:grid-cols-4"} gap-3`}>
          {(block.items || []).map((card, i) => (
            <div key={i} className="bg-black/20 border border-white/8 rounded-xl p-3.5 flex flex-col items-center text-center hover:bg-white/4 transition-all">
              {card.icon && <div className={`w-10 h-10 rounded-full ${sc.iconBg} flex items-center justify-center mb-2.5`}><span className="text-lg">{card.icon}</span></div>}
              {card.title && <h3 className="font-bold text-gray-200 text-sm mb-1.5">{card.title}</h3>}
              {card.text && <p className="text-[11px] text-gray-400" dangerouslySetInnerHTML={{ __html: card.text }} />}
            </div>
          ))}
        </div>
      );

    /* 数据对比条（如光速对比） */
    case "bars":
      return (
        <div className="bg-black/25 p-4 rounded-xl border border-white/8 space-y-3.5">
          {block.label && (
            <div className="flex justify-between items-end mb-1 border-b border-white/8 pb-2">
              <span className="text-sm text-gray-400 font-bold">{block.label}</span>
              {block.unit && <span className={`text-[11px] font-mono ${sc.text}`}>{block.unit}</span>}
            </div>
          )}
          {(block.items || []).map((bar, i) => (
            <div key={i}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-300">{bar.label}</span>
                <span className={`font-mono ${sc.text}`}>{bar.value}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full`} style={{ width: `${bar.percent || 0}%`, background: bar.color || "currentColor" }} />
              </div>
            </div>
          ))}
        </div>
      );

    /* 未知类型回退 */
    default:
      return block.text ? <p className="text-gray-400 text-sm">{block.text}</p> : null;
  }
}

/* ──────────────────────────────────────────────────────────
   Section 渲染器
────────────────────────────────────────────────────────── */
function SectionCard({ section, topicId }) {
  const sc = SECTION_COLORS[section.color] || DEFAULT_COLOR;
  /* 是否跨双列 */
  const colSpan = section.wide ? "md:col-span-2" : "";

  return (
    <section className={`bg-white/4 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group hover:${sc.border} transition-colors ${colSpan}`}>
      {/* section 标题栏 */}
      <div className={`${sc.bg} border-b border-white/8 px-5 py-3 flex items-center gap-3`}>
        <div className={`p-1.5 ${sc.iconBg} rounded-lg ${sc.icon}`}>
          {section.icon ? (
            <span className="text-base">{section.icon}</span>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </div>
        <h2 className="text-base font-bold text-gray-100 tracking-wide">{section.heading}</h2>
      </div>
      {/* section 内容 */}
      <div className="p-5 space-y-4">
        {(section.content || []).map((block, i) => (
          <ContentBlock key={i} block={block} sectionColor={sc} topicId={topicId} />
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   回退视图：当 theory.json 不存在时，显示 topic 基本信息
────────────────────────────────────────────────────────── */
function FallbackView({ topic }) {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs font-mono text-white/45 tracking-wider mb-2 flex items-center gap-2">
          <span className="w-1 h-3 bg-linear-to-b from-cyan-400 to-indigo-500 rounded-full" />
          核心公式 / 方程式
        </h4>
        <div className="bg-white/4 border border-white/10 rounded-xl p-5 font-mono text-center text-lg text-white shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/3 to-indigo-500/3" />
          <span className="relative z-10">{topic.formula}</span>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-mono text-white/45 tracking-wider mb-2 flex items-center gap-2">
          <span className="w-1 h-3 bg-linear-to-b from-cyan-400 to-indigo-500 rounded-full" />
          过程描述
        </h4>
        <p className="text-white/80 text-sm leading-relaxed bg-white/2 border border-white/8 rounded-xl p-4">
          {topic.desc}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   通用知识要点主入口
   - topic: { id, title, formula, desc, ... }
────────────────────────────────────────────────────────── */
export default function DynamicTheory({ topic }) {
  const topicId = topic?.id ?? "unknown";
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setData(null);
    fetch(`/${topicId}/theory.json`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((json) => { setData(json); setLoaded(true); })
      .catch(() => { setData(null); setLoaded(true); });
  }, [topicId]);

  /* 加载中 */
  if (!loaded) {
    return <div className="py-12 text-center text-white/30 animate-pulse">加载知识要点中...</div>;
  }

  /* 无 theory.json → 回退到基本信息展示 */
  if (!data || !data.sections || data.sections.length === 0) {
    return <FallbackView topic={topic} />;
  }

  /* 正常渲染 */
  return (
    <div className="relative font-sans text-gray-200 selection:bg-cyan-500/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.sections.map((section, i) => (
          <SectionCard key={i} section={section} topicId={topicId} />
        ))}
      </div>
    </div>
  );
}
