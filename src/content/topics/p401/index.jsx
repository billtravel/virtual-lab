import Animation from "./Animation.jsx";
import Theory from "./Theory.jsx";

/**
 * p401 章节内容包：动画 / 知识解析各占一文件。
 * layout: immersive — 主区全宽。
 *
 * Quiz 不再单独注册，使用通用 DynamicQuiz 从 public/p401/quiz.json 加载。
 * Theory 保留手写精美版本（含 SVG 动画、手风琴交互等），覆盖通用版本。
 */
export const topicP401 = {
  id: "p401",
  layout: "immersive",
  Animation,
  Theory,
  // Quiz 未指定 → registry 将回退到通用 DynamicQuiz
};
