import PhysicsMechanicsAnimation from './topics/PhysicsMechanicsAnimation';
import ChemistryReactionAnimation from './topics/ChemistryReactionAnimation';

const TOPIC_ANIMATION_MAP = {
  // Physics examples
  p100: PhysicsMechanicsAnimation,
  p101: PhysicsMechanicsAnimation,
  p102: PhysicsMechanicsAnimation,
  // Chemistry examples
  c900: ChemistryReactionAnimation,
  c901: ChemistryReactionAnimation,
  c902: ChemistryReactionAnimation,
};

export default function TopicAnimationRenderer({ topic, progress }) {
  const AnimationComponent = TOPIC_ANIMATION_MAP[topic.id];

  if (!AnimationComponent) {
    return (
      <div className="w-full h-full min-h-[260px] flex items-center justify-center">
        <p className="text-white/60 text-sm tracking-wide">该章节动画正在制作中，敬请期待</p>
      </div>
    );
  }

  return <AnimationComponent progress={progress} />;
}
