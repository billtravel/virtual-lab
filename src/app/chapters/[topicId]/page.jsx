"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExperimentView, SUBJECTS, TOPICS } from "../../page";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = Array.isArray(params?.topicId) ? params.topicId[0] : params?.topicId;

  const topic = useMemo(
    () => TOPICS.find((item) => item.id === topicId),
    [topicId]
  );

  if (!topic) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">章节不存在</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"
          >
            返回首页
          </button>
        </div>
      </main>
    );
  }

  const subject = SUBJECTS[topic.subject.toUpperCase()];

  return (
    <div className={`w-full h-full bg-linear-to-br ${subject.theme} overflow-hidden font-sans transition-colors duration-700 ease-in-out`}>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-black/20 blur-3xl pointer-events-none"></div>
      <div className="relative w-full h-full backdrop-blur-[2px]">
        <ExperimentView
          topic={topic}
          onBack={() => router.push("/")}
          subjectColor={subject.color}
        />
      </div>
    </div>
  );
}
