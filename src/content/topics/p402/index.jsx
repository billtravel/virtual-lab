import Animation from "./Animation.jsx";

/**
 * p402 章节内容包：仅保留动画组件。
 * layout: immersive — 主区全宽。
 *
 * Quiz / Theory 均不指定 → registry 将回退到通用 DynamicQuiz / DynamicTheory，
 * 自动从 public/p402/quiz.json 和 theory.json 加载数据。
 */
export const topicP402 = {
  id: "p402",
  layout: "immersive",
  Animation,
  // Quiz 未指定 → 通用 DynamicQuiz
  // Theory 未指定 → 通用 DynamicTheory
};
