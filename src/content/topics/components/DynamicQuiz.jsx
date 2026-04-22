"use client";

import React, { useState, useEffect, useCallback } from "react";
import TopicModal from "./TopicModal.jsx";

/* ──────────────────────────────────────────────────────────
   工具函数与常量
────────────────────────────────────────────────────────── */

/** 识别题目中空格的正则表达式 */
const BLANK_REGEX = /\s{3,}|_{2,}|（\s{2,}）|\(\s{2,}\)|_{2,}/g;

/** 将 quiz.json 中的相对路径转为可访问的绝对路径（基于 topicId） */
function resolveImgUrl(relPath, topicId) {
  if (!relPath) return "";
  if (relPath.startsWith("http") || relPath.startsWith("data:")) return relPath;
  let cleanPath = relPath.replace(/^\.\//, "").replace(/^\//, "");
  return `/${topicId}/${cleanPath}`;
}

/** 解析文本中的 [图片: path] 占位符，渲染为可放大的图片 */
function parseTextWithImages(text, topicId, onZoom) {
  if (typeof text !== "string") return text;
  const regex = /\[图片[：:]\s*(.*?)\]/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }
    const imgUrl = resolveImgUrl(match[1].trim(), topicId);
    elements.push(
      <img
        key={match.index}
        src={imgUrl}
        alt="插图"
        className="max-h-32 rounded-lg border border-white/10 object-contain cursor-zoom-in hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all my-2 mx-1 inline-block align-middle bg-slate-50 p-1"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onZoom?.(imgUrl); }}
        title="点击放大"
      />
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 && typeof elements[0] === "string" ? text : elements;
}

/** 支持基础 Markdown Block 解析（例如表格），并级联处理内联图片 */
function renderRichText(text, topicId, onZoom) {
  if (typeof text !== "string") return parseTextWithImages(text, topicId, onZoom);

  const lines = text.split('\n');
  const blocks = [];
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: currentParagraph.join('\n')
      });
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      let tableLines = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('|') && lines[j].trim().endsWith('|')) {
        tableLines.push(lines[j].trim());
        j++;
      }
      
      // 检查标题底下的分隔行，例如 |---|---| 或 | :--- | :---: |
      if (tableLines.length >= 2 && /^\|(?:[-\s:]+\|)+$/.test(tableLines[1])) {
        flushParagraph();
        blocks.push({
          type: 'table',
          lines: tableLines
        });
        i = j - 1;
        continue;
      }
    }
    // 原样推入行，保持原本的前导空格
    currentParagraph.push(lines[i]);
  }
  flushParagraph();

  // 若只有一段普通文本，避免多余包装
  if (blocks.length === 1 && blocks[0].type === 'paragraph') {
    return parseTextWithImages(blocks[0].content, topicId, onZoom);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {blocks.map((block, idx) => {
        if (block.type === 'table') {
          const headers = block.lines[0].split('|').slice(1, -1).map(s => s.trim());
          const rows = block.lines.slice(2).map(row => row.split('|').slice(1, -1).map(s => s.trim()));
          return (
            <div key={idx} className="my-2 overflow-x-auto custom-scrollbar rounded-lg border border-white/10 bg-white/5">
              <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-white/10 border-b border-white/10">
                    {headers.map((th, i) => (
                      <th key={i} className="px-4 py-2.5 font-semibold text-white/90 border-r border-white/10 last:border-0">
                        {parseTextWithImages(th, topicId, onZoom)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-white/5 last:border-0 hover:bg-white/10 transition-colors">
                      {row.map((td, ci) => (
                        <td key={ci} className="px-4 py-2.5 text-white/80 border-r border-white/5 last:border-0">
                          {parseTextWithImages(td, topicId, onZoom)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <div key={idx} className="whitespace-pre-wrap leading-relaxed inline-block w-full">
            {parseTextWithImages(block.content, topicId, onZoom)}
          </div>
        );
      })}
    </div>
  );
}

/** Fisher-Yates 随机洗牌 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 是否为客观题（自动打分） */
function isObjective(type) {
  return type.includes("单选") || type.includes("多选");
}

/** 检查主观题是否包含填空下划线 */
function hasBlanksRegex(question) {
  return question ? question.split(BLANK_REGEX).length > 1 : false;
}

/** 索引→字母 */
function idxToLetter(i) {
  return String.fromCharCode(65 + i);
}

/** 单选判分 */
function checkSingle(answer, pickedIdx) {
  return idxToLetter(pickedIdx) === answer;
}

/** 多选判分 */
function checkMulti(answer, selectedIndices) {
  const correctLetters = answer.split("").sort();
  const selectedLetters = selectedIndices.map(idxToLetter).sort();
  return (
    correctLetters.length === selectedLetters.length &&
    correctLetters.every((l, i) => l === selectedLetters[i])
  );
}

const TYPE_COLORS = {
  单选: { bg: "bg-indigo-500/20",  text: "text-indigo-300",  border: "border-indigo-500/30"  },
  多选: { bg: "bg-purple-500/20",  text: "text-purple-300",  border: "border-purple-500/30"  },
  填空: { bg: "bg-amber-500/20",   text: "text-amber-300",   border: "border-amber-500/30"   },
  实验: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30" },
  作图: { bg: "bg-rose-500/20",    text: "text-rose-300",    border: "border-rose-500/30"    },
  默认: { bg: "bg-slate-500/20",   text: "text-slate-300",   border: "border-slate-500/30"   },
};

function getTypeColor(type) {
  if (type.includes("单选")) return TYPE_COLORS["单选"];
  if (type.includes("多选")) return TYPE_COLORS["多选"];
  if (type.includes("填空")) return TYPE_COLORS["填空"];
  if (type.includes("实验")) return TYPE_COLORS["实验"];
  if (type.includes("作图")) return TYPE_COLORS["作图"];
  return TYPE_COLORS["默认"];
}

/* ──────────────────────────────────────────────────────────
   Lightbox 图片放大弹层
────────────────────────────────────────────────────────── */
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/88 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt="放大查看"
          className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-white/10 bg-slate-50 p-2"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-white/20 text-white hover:bg-white/25 transition-all flex items-center justify-center text-lg"
          aria-label="关闭图片"
        >
          ×
        </button>
        <p className="text-center text-white/25 text-xs mt-2">点击任意处 / 按 Esc 关闭</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   图片行：点击可放大
────────────────────────────────────────────────────────── */
function ImageRow({ urls, onZoom, topicId }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {urls.map((url, i) => (
        <img
          key={i}
          src={resolveImgUrl(url, topicId)}
          alt={`图 ${i + 1}`}
          className="max-h-44 rounded-lg border border-white/10 object-contain cursor-zoom-in hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all bg-slate-50 p-1.5"
          onClick={() => onZoom(resolveImgUrl(url, topicId))}
          title="点击放大"
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   单道题卡片
────────────────────────────────────────────────────────── */
function QuestionCard({ q, idx, state, dispatch, onZoom, submitted, topicId }) {
  const tc = getTypeColor(q.type);
  const isObj = isObjective(q.type);
  const isSingle = q.type.includes("单选");
  const isMulti = q.type.includes("多选");
  const hasBlanks = !isObj && hasBlanksRegex(q.question);

  /* 判断是否已完成输入 */
  const isInputDone = () => {
    if (hasBlanks) {
      return Array.isArray(state.answer) && state.answer.length > 0 && state.answer.every(a => a?.trim().length > 0);
    }
    return state.answer?.trim().length > 0;
  };

  const isDone =
    isSingle ? state.picked != null
    : isMulti ? state.selected.size > 0
    : submitted ? state.score != null
    : isInputDone();

  const isCorrect =
    isSingle ? state.picked != null && checkSingle(q.answer, state.picked)
    : isMulti ? checkMulti(q.answer, [...state.selected])
    : state.score === 1;

  /* 题头状态徽标 */
  const badge = (() => {
    if (isObjective(q.type)) {
      if (!submitted) {
        return isDone
          ? <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white/40">✍ 已作答</span>
          : null;
      }
      return isCorrect
        ? <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">✓ 正确</span>
        : <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300">✗ 错误</span>;
    }
    if (!submitted) {
      return isInputDone()
        ? <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white/40">✍ 已作答</span>
        : null;
    }
    if (state.score == null) return <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300">待自评</span>;
    return state.score === 1
      ? <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">✓ 得分</span>
      : <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300">0 分</span>;
  })();

  /* 渲染带输入框的题目文本 */
  const renderQuestionWithInputs = () => {
    const parts = q.question.split(BLANK_REGEX);
    return (
      <div className="text-white font-medium text-sm whitespace-pre-wrap leading-[2.5]! mt-1">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {renderRichText(part, topicId, onZoom)}
            {i < parts.length - 1 && (
              <input
                type="text"
                disabled={submitted}
                value={state.answer?.[i] || ""}
                placeholder={`(${i + 1})`}
                onChange={(e) => dispatch({ type: "ANSWER_SUBJECTIVE", idx, subIdx: i, answer: e.target.value })}
                className={`inline-block mx-1 px-3 h-7 min-w-[80px] bg-white/5 border-b-2 transition-all text-center focus:outline-none focus:bg-white/8 rounded-t-md ${
                  submitted
                    ? "border-white/10 cursor-default text-cyan-300 opacity-90"
                    : "border-cyan-500/40 focus:border-cyan-400 text-white"
                }`}
                style={{ width: `${Math.max(80, (state.answer?.[i]?.length || 0) * 12 + 30)}px` }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden">
      {/* 题头 */}
      <div className="px-5 py-3 bg-white/4 border-b border-white/8 flex items-start gap-3">
        <span className={`shrink-0 w-7 h-7 rounded-lg ${tc.bg} ${tc.text} text-sm font-bold flex items-center justify-center border ${tc.border} mt-0.5`}>
          {idx + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-md ${tc.bg} ${tc.text} border ${tc.border}`}>{q.type}</span>
            {badge}
          </div>
          {hasBlanks ? renderQuestionWithInputs() : (
            <div className="text-white font-medium text-sm whitespace-pre-wrap leading-relaxed">{renderRichText(q.question, topicId, onZoom)}</div>
          )}
          <ImageRow urls={q.imageUrls} onZoom={onZoom} topicId={topicId} />
        </div>
      </div>

      {/* 题体 */}
      <div className="p-4 space-y-3">
        {/* 单选题 */}
        {isSingle && (
          <div className="space-y-2">
            {q.options.map((opt, j) => {
              const isSelected = state.picked === j;
              const isThisCorrect = idxToLetter(j) === q.answer;
              const revealed = submitted;
              const showGreen = revealed && isThisCorrect;
              const showRed = revealed && isSelected && !isThisCorrect;
              return (
                <label key={j} className={`flex items-start gap-3 text-sm rounded-lg px-4 py-2.5 border transition-all ${
                  revealed ? "cursor-default" : "cursor-pointer hover:bg-white/4 hover:border-white/15"
                } ${
                  showGreen ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : showRed ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
                  : isSelected ? "border-cyan-500/60 bg-cyan-500/10 text-white"
                  : "border-white/8 text-white/75"
                }`}>
                  <input type="radio" className="accent-cyan-500 mt-0.5 shrink-0" name={`q-${q.id}`} checked={isSelected}
                    onChange={() => { if (!revealed) dispatch({ type: "PICK_SINGLE", idx, j }); }} />
                  <span className="flex-1 overflow-hidden">{renderRichText(opt, topicId, onZoom)}</span>
                  {showGreen && <span className="text-xs text-emerald-400 shrink-0 font-bold">✓</span>}
                  {showRed && <span className="text-xs text-rose-400 shrink-0 font-bold">✗</span>}
                </label>
              );
            })}
          </div>
        )}

        {/* 多选题 */}
        {isMulti && (
          <div className="space-y-2">
            <p className="text-xs text-purple-400/60 mb-1">多选题</p>
            {q.options.map((opt, j) => {
              const isSelected = state.selected.has(j);
              const isThisCorrect = q.answer.includes(idxToLetter(j));
              const revealed = submitted;
              const showGreen = revealed && isThisCorrect;
              const showRed = revealed && isSelected && !isThisCorrect;
              const showMissed = revealed && !isSelected && isThisCorrect;
              return (
                <label key={j} className={`flex items-start gap-3 text-sm rounded-lg px-4 py-2.5 border transition-all ${
                  revealed ? "cursor-default" : "cursor-pointer hover:bg-white/4 hover:border-white/15"
                } ${
                  showGreen ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : showRed ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
                  : showMissed ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                  : isSelected ? "border-cyan-500/60 bg-cyan-500/10 text-white"
                  : "border-white/8 text-white/75"
                }`}>
                  <input type="checkbox" className="accent-cyan-500 mt-0.5 shrink-0" checked={isSelected}
                    onChange={() => { if (!revealed) dispatch({ type: "TOGGLE_MULTI", idx, j }); }} />
                  <span className="flex-1 overflow-hidden">{renderRichText(opt, topicId, onZoom)}</span>
                  {showGreen && <span className="text-xs text-emerald-400 shrink-0">✓ 正确</span>}
                  {showRed && <span className="text-xs text-rose-400 shrink-0">✗ 错误</span>}
                  {showMissed && <span className="text-xs text-amber-400 shrink-0">漏选</span>}
                </label>
              );
            })}
          </div>
        )}

        {/* 主观题区域 */}
        {!isObj && (
          <div className="space-y-3">
            {!submitted && !hasBlanks && (
              <div className="space-y-2">
                {q.type.includes("作图") && (
                  <div className="flex items-center gap-2 text-xs text-rose-400/70 bg-rose-500/6 border border-rose-500/20 rounded-lg px-3 py-2">
                    <span>✏</span>
                    <span>作图题请在纸上作图，此处填写作图思路或关键步骤</span>
                  </div>
                )}
                <textarea value={state.answer ?? ""} onChange={(e) => dispatch({ type: "ANSWER_SUBJECTIVE", idx, answer: e.target.value })}
                  placeholder="请输入答案或写下思路…" rows={3}
                  className="w-full bg-white/5 border border-white/12 rounded-lg px-4 py-3 text-white/85 text-sm placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all resize-y custom-scrollbar leading-relaxed" />
              </div>
            )}

            {/* 批改阶段 */}
            {submitted && (
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/4 p-4">
                  <p className="text-xs text-cyan-400/70 font-semibold mb-2 uppercase tracking-tight">📝 你的作答</p>
                  {hasBlanks ? (
                    <div className="space-y-1.5 mt-1">
                      {(state.answer || []).map((ans, i) => (
                        <div key={i} className="text-sm text-white/80 flex items-start gap-2">
                          <span className="text-white/30 shrink-0">空({i + 1}):</span>
                          <span className="break-all">{ans?.trim() ? ans : <span className="text-white/20 italic">未填</span>}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{state.answer || <span className="text-white/25 italic">（本题未作答）</span>}</p>
                  )}
                </div>
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/6 p-4 space-y-2">
                  <p className="text-xs text-indigo-400 font-semibold uppercase tracking-tight">📖 参考答案</p>
                  <div className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">{renderRichText(q.answer, topicId, onZoom)}</div>
                  {q.answerImageUrls && q.answerImageUrls.length > 0 && <ImageRow urls={q.answerImageUrls} onZoom={onZoom} topicId={topicId} />}
                </div>
                <div className="flex items-center gap-3 py-1">
                  <span className="text-xs text-white/40 shrink-0">对照参考答案自评：</span>
                  <button onClick={() => dispatch({ type: "MANUAL_SCORE", idx, score: 0 })}
                    className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${state.score === 0
                      ? "bg-rose-500/25 border-rose-500/60 text-rose-200 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                      : "border-white/12 text-white/40 hover:border-rose-500/35 hover:text-rose-300 hover:bg-rose-500/8"
                    }`}>✗ 不得分</button>
                  <button onClick={() => dispatch({ type: "MANUAL_SCORE", idx, score: 1 })}
                    className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${state.score === 1
                      ? "bg-emerald-500/25 border-emerald-500/60 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                      : "border-white/12 text-white/40 hover:border-emerald-500/35 hover:text-emerald-300 hover:bg-emerald-500/8"
                    }`}>✓ 得分</button>
                </div>
                {q.analysis && (
                  <div className="rounded-lg border border-white/8 bg-white/2.5 p-4">
                    <p className="text-xs text-white/30 font-semibold mb-2 tracking-wide">解析</p>
                    <div className="text-white/60 text-xs leading-relaxed whitespace-pre-wrap">{renderRichText(q.analysis, topicId, onZoom)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 客观题解析 */}
        {isObj && submitted && q.analysis && (
          <div className="rounded-lg border border-white/8 bg-white/2.5 p-4">
            <p className="text-xs text-white/30 font-semibold mb-2 tracking-wide">解析</p>
            <div className="text-white/60 text-xs leading-relaxed whitespace-pre-wrap">{renderRichText(q.analysis, topicId, onZoom)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   设置页
────────────────────────────────────────────────────────── */
function SetupScreen({ questions, onStart }) {
  const [count, setCount] = useState(10);
  
  // 动态提取所有题型
  const allTypes = Array.from(new Set(questions.map((q) => q.type).filter(Boolean)));
  const [types, setTypes] = useState(() => new Set(allTypes));
  const [mode, setMode] = useState("step");

  const available = questions.filter((q) => types.has(q.type));
  const maxCount = available.length;
  const actualCount = Math.min(count, maxCount);
  const typeStat = allTypes.map((t) => ({ type: t, total: questions.filter((q) => q.type === t).length }));

  function toggleType(t) {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); } else next.add(t);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wide">题型分布（点击可过滤）</p>
        <div className="flex flex-wrap gap-2">
          {typeStat.map(({ type, total }) => {
            const tc = getTypeColor(type);
            return (
              <button key={type} onClick={() => toggleType(type)}
                className={`flex-1 min-w-[80px] rounded-xl border px-2 py-3 text-center transition-all ${
                  types.has(type) ? `${tc.bg} ${tc.border} ${tc.text}` : "border-white/8 bg-white/2 text-white/25 opacity-60"
                }`}>
                <div className="text-2xl font-black">{total}</div>
                <div className="text-xs mt-0.5 leading-tight">{type}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-4">
        <p className="text-sm text-white/60 font-medium">做题数量</p>
        <div className="flex gap-2 flex-wrap">
          {[5, 10, 15, 20].map((n) => (
            <button key={n} onClick={() => setCount(n)} disabled={n > maxCount}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${actualCount === n ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300" : "border-white/10 text-white/50 disabled:opacity-25"}`}>
              {n} 题
            </button>
          ))}
          <button onClick={() => setCount(maxCount)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${actualCount === maxCount ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300" : "border-white/10 text-white/50"}`}>
            全部 ({maxCount})
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input type="range" min={1} max={Math.max(maxCount, 1)} value={actualCount} onChange={(e) => setCount(Number(e.target.value))} className="flex-1 accent-cyan-500" disabled={maxCount === 0} />
          <span className="text-cyan-300 font-black text-xl w-12 text-right">{actualCount}</span>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-3">
        <p className="text-sm text-white/60 font-medium">答题模式</p>
        <div className="flex gap-3">
          {[{ v: "step", l: "逐题作答", i: "▶" }, { v: "scroll", l: "全部显示", i: "≡" }].map(({ v, l, i }) => (
            <button key={v} onClick={() => setMode(v)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-xl border text-sm transition-all ${mode === v ? "border-indigo-500/60 bg-indigo-500/15 text-indigo-200" : "border-white/10 text-white/40"}`}>
              <span className="text-xl">{i}</span><span>{l}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => onStart({ count: actualCount, types, mode })} disabled={maxCount === 0}
        className="w-full py-4 rounded-xl bg-linear-to-r from-cyan-600 to-indigo-600 hover:scale-[1.02] text-white font-bold transition-all disabled:opacity-40">
        开始做题
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   结果页
────────────────────────────────────────────────────────── */
function ResultScreen({ questions, states, onRetry, onClose }) {
  let autoScore = 0, autoTotal = 0, manualScore = 0, manualTotal = 0;
  questions.forEach((q, i) => {
    const s = states[i];
    if (isObjective(q.type)) {
      autoTotal++;
      if (q.type.includes("单选") && s.picked != null && checkSingle(q.answer, s.picked)) autoScore++;
      if (q.type.includes("多选") && checkMulti(q.answer, [...s.selected])) autoScore++;
    } else {
      manualTotal++;
      if (s.score === 1) manualScore++;
    }
  });
  const grandScore = autoScore + manualScore;
  const grandTotal = autoTotal + manualTotal;
  const pct = grandTotal > 0 ? Math.round((grandScore / grandTotal) * 100) : 0;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-linear-to-br from-indigo-950/60 to-cyan-950/40 p-8 text-center">
        <div className={`text-8xl font-black mb-2 ${pct >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>{grandScore}<span className="text-3xl text-white/30 font-normal">/{grandTotal}</span></div>
        <div className="text-white/40 text-sm">{pct}% 正确率</div>
        <div className="mt-6 flex justify-center gap-8 text-sm">
          <div><div className="text-white/30 text-xs mb-1">客观题</div><div className="text-cyan-300 font-bold">{autoScore}/{autoTotal}</div></div>
          {manualTotal > 0 && <div><div className="text-white/30 text-xs mb-1">主观题</div><div className="text-indigo-300 font-bold">{manualScore}/{manualTotal}</div></div>}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onRetry} className="flex-1 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white">重新测验</button>
        <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold">关闭</button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   通用测验主入口
   - topic: { id, title, ... } 来自 TOPICS
   - onClose: 关闭弹层回调
────────────────────────────────────────────────────────── */
export default function DynamicQuiz({ topic, onClose }) {
  const topicId = topic?.id ?? "unknown";

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [loadError,    setLoadError]    = useState(false);
  const [phase,        setPhase]        = useState("setup");
  const [selected,     setSelected]     = useState([]);
  const [mode,         setMode]         = useState("step");
  const [qStates,      setQStates]      = useState([]);
  const [current,      setCurrent]      = useState(0);
  const [lightbox,     setLightbox]     = useState(null);
  const [submitted,    setSubmitted]    = useState(false);

  /* 根据 topicId 动态加载 quiz.json */
  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    fetch(`/${topicId}/quiz.json`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => { setAllQuestions(data); setLoading(false); })
      .catch(() => { setLoadError(true); setLoading(false); });
  }, [topicId]);

  function initState(q) {
    if (q.type.includes("单选")) return { picked: null };
    if (q.type.includes("多选")) return { selected: new Set() };
    if (!isObjective(q.type) && hasBlanksRegex(q.question)) {
      const blanks = q.question.match(BLANK_REGEX);
      return { answer: blanks ? new Array(blanks.length).fill("") : [""], score: null };
    }
    return { answer: "", score: null };
  }

  function handleStart({ count, types, mode: m }) {
    const pool = allQuestions.filter((q) => types.has(q.type));
    const drawn = shuffle(pool).slice(0, count);
    setSelected(drawn);
    setQStates(drawn.map(initState));
    setMode(m);
    setCurrent(0);
    setSubmitted(false);
    setPhase("quiz");
  }

  const dispatch = useCallback((action) => {
    setQStates((prev) => {
      const next = [...prev];
      const s = { ...next[action.idx] };
      switch (action.type) {
        case "PICK_SINGLE":   if (s.picked == null) s.picked = action.j; break;
        case "TOGGLE_MULTI":
          if (!submitted) {
            const sel = new Set(s.selected);
            sel.has(action.j) ? sel.delete(action.j) : sel.add(action.j);
            s.selected = sel;
          }
          break;
        case "ANSWER_SUBJECTIVE":
          if (!submitted) {
            const qType = selected[action.idx]?.type;
            const qText = selected[action.idx]?.question;
            if (qType && qText && !isObjective(qType) && hasBlanksRegex(qText)) {
              const newAns = [...(s.answer || [])];
              newAns[action.subIdx] = action.answer;
              s.answer = newAns;
            } else {
              s.answer = action.answer;
            }
          }
          break;
        case "MANUAL_SCORE":  s.score = action.score; break;
      }
      next[action.idx] = s;
      return next;
    });
  }, [submitted, selected]);

  function isQDone(i) {
    const q = selected[i], s = qStates[i];
    if (!q || !s) return false;
    if (q.type.includes("单选")) return s.picked != null;
    if (q.type.includes("多选")) return s.selected.size > 0;
    if (!isObjective(q.type) && hasBlanksRegex(q.question)) return Array.isArray(s.answer) && s.answer.every(a => a?.trim().length > 0);
    return submitted ? s.score != null : s.answer?.trim().length > 0;
  }

  const doneCount = selected.filter((_, i) => isQDone(i)).length;

  /* 动态标题：包含章节名 */
  const topicTitle = topic?.title?.replace(/^第[一二三四五六七八九十0-9]+章\s*/, "").replace(/^第[一二三四五六七八九十0-9]+节\s*/, "") ?? "";
  const modalTitle = phase === "setup" ? `课后测验 · ${topicTitle}`
    : phase === "result" ? "测验结果"
    : `课后测验 (${doneCount}/${selected.length})`;

  const submitBar = (
    <div className="pt-6 border-t border-white/10 flex gap-3">
      <button onClick={() => setPhase("setup")} className="px-5 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white/70">返回设置</button>
      <button onClick={() => setSubmitted(true)} className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg">提交答卷并批改</button>
    </div>
  );

  const afterSubmitBar = (
    <div className="pt-6 border-t border-white/10 flex gap-3">
      <button onClick={() => setSubmitted(false)} className="px-5 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white/70">修改作答</button>
      <button onClick={() => setPhase("result")} className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg">查看最终结果</button>
    </div>
  );

  return (
    <TopicModal title={modalTitle} onClose={onClose} wide>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      {/* 加载中 */}
      {loading && <div className="py-20 text-center text-white/30 animate-pulse">加载题目中...</div>}

      {/* 加载失败 / 无题目 — 优雅提示 */}
      {!loading && loadError && (
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-white/70 text-sm">本课「{topicTitle}」尚未配置测验题目</p>
          <p className="text-white/30 text-xs">
            在 <span className="text-cyan-400 font-mono">public/{topicId}/quiz.json</span> 中添加题目即可启用
          </p>
        </div>
      )}

      {/* 设置页 */}
      {!loading && !loadError && phase === "setup" && <SetupScreen questions={allQuestions} onStart={handleStart} />}

      {/* 答题页 */}
      {!loading && !loadError && phase === "quiz" && (
        <div className="space-y-6">
          {mode === "step" && (
            <>
              <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
                {selected.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      i === current ? 'bg-cyan-500 text-white'
                      : isQDone(i) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-white/30'
                    }`}>{i + 1}</button>
                ))}
              </div>
              <QuestionCard q={selected[current]} idx={current} state={qStates[current]} dispatch={dispatch} onZoom={setLightbox} submitted={submitted} topicId={topicId} />
              <div className="flex gap-3">
                <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)} className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 disabled:opacity-20 transition-all">上一题</button>
                <button disabled={current === selected.length - 1} onClick={() => setCurrent(c => c + 1)} className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 disabled:opacity-20 transition-all">下一题</button>
              </div>
            </>
          )}
          {mode === "scroll" && selected.map((q, i) => <QuestionCard key={q.id} q={q} idx={i} state={qStates[i]} dispatch={dispatch} onZoom={setLightbox} submitted={submitted} topicId={topicId} />)}
          {!submitted ? submitBar : afterSubmitBar}
        </div>
      )}

      {/* 结果页 */}
      {!loading && !loadError && phase === "result" && <ResultScreen questions={selected} states={qStates} onRetry={() => setPhase("setup")} onClose={onClose} />}
    </TopicModal>
  );
}
