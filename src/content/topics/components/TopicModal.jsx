"use client";

import React from "react";

/** 章节弹层：用于「知识要点」「课后测验」等 */
export default function TopicModal({ title, onClose, children, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "topic-modal-title" : undefined}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${wide ? "max-w-4xl" : "max-w-2xl"} rounded-2xl border border-white/15 bg-linear-to-br from-slate-900/98 via-indigo-950/95 to-slate-900/98 backdrop-blur-xl shadow-[0_8px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(99,102,241,0.08)] max-h-[92vh] flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 背景装饰光斑 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        {/* 顶部渐变装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-indigo-500/60 to-transparent" />

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/10 shrink-0 relative z-10">
          {title ? (
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-linear-to-b from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <h2 id="topic-modal-title" className="text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-white to-indigo-200">
                {title}
              </h2>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all"
          >
            关闭
          </button>
        </div>
        <div className="overflow-y-auto p-6 text-white/90 relative z-10 custom-scrollbar">{children}</div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px; height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.15);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99,102,241,0.55);
        }
      `}</style>
    </div>
  );
}
