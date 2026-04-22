"use client";

import React from "react";

export default function DefaultImmersivePage({ topic, TheoryComp, AnimationComp }) {
  // 章节存在 Animation.jsx 时：直接加载该文件的完整页面
  if (AnimationComp) {
    return <AnimationComp embedded={false} />;
  }

  // 无 Animation.jsx 时：回退到默认内容页
  return (
    <div className="h-full min-h-0 flex flex-col rounded-xl border border-white/15 bg-white/5 backdrop-blur-md p-6 text-white/90">
      <p className="text-white/65 text-sm leading-relaxed mb-6 shrink-0">
        本课尚未配置交互动画。可在{" "}
        <code className="text-cyan-300/90 text-xs px-1.5 py-0.5 rounded bg-black/30 border border-white/10">
          src/content/topics/{topic?.id}/Animation.jsx
        </code>{" "}
        中编写实验；若只需图文页，可新增{" "}
        <code className="text-cyan-300/90 text-xs px-1.5 py-0.5 rounded bg-black/30 border border-white/10">
          Page.jsx
        </code>{" "}
        并在 registry 中注册。
      </p>

      <div className="border-t border-white/10 pt-6 flex-1 min-h-0 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 shrink-0">知识原理解析</h3>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {TheoryComp ? <TheoryComp topic={topic} /> : null}
        </div>
      </div>
    </div>
  );
}
