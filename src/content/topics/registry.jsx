import DynamicTheory from "./components/DynamicTheory.jsx";
import DynamicQuiz from "./components/DynamicQuiz.jsx";
import { topicP101 } from "./p101/index.jsx";
import { topicP102 } from "./p102/index.jsx";
import { topicP103 } from "./p103/index.jsx";
import { topicP104 } from "./p104/index.jsx";
import { topicP201 } from "./p201/index.jsx";
import { topicP401 } from "./p401/index.jsx";
import { topicP402 } from "./p402/index.jsx";

/**
 * 按 topic.id 注册章节定制内容。新增章节时：
 * 1. 新建目录 src/content/topics/<topicId>/
 * 2. 放入 Animation.jsx / Theory.jsx / Quiz.jsx（可按需只写其中几个）
 * 3. 在本文件中 import 并加入 registry
 *
 * 未注册的章节将自动使用 DynamicQuiz / DynamicTheory 作为默认组件，
 * 它们会尝试从 public/<topicId>/quiz.json 和 theory.json 加载数据。
 *
 * layout:
 * - "standard"：左侧动画区 + 底部播放器 + 右侧知识面板；测验弹层
 * - "immersive"：顶栏 + 主区；有 Animation 则全宽动画，否则渲染 Page（或默认说明页）
 */
const registry = {
  p101: topicP101,
  p102: topicP102,
  p103: topicP103,
  p104: topicP104,
  p201: topicP201,
  p401: topicP401,
  p402: topicP402
};

export function resolveTopicContent(topicId) {
  const entry = registry[topicId];

  return {
    layout: entry?.layout ?? "standard",
    /** 有则替换 TopicAnimationRenderer；无动画时可改用 Page */
    Animation: entry?.Animation ?? null,
    /** 沉浸式且无 Animation 时渲染（独立 Page.jsx） */
    Page: entry?.Page ?? null,
    /** 知识要点：自定义组件优先，否则使用通用 DynamicTheory */
    Theory: entry?.Theory ?? DynamicTheory,
    /** 课后测验：自定义组件优先，否则使用通用 DynamicQuiz */
    Quiz: entry?.Quiz ?? DynamicQuiz,
  };
}
