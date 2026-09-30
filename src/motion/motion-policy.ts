export type MotionPolicy = { reduced: boolean; capture: boolean; legal: boolean; touch: boolean; lowPower: boolean };

export function resolveMotionPolicy(policy: MotionPolicy) {
  const staticScenes = policy.reduced || policy.capture || policy.legal || policy.lowPower;
  return {
    staticScenes,
    intro: !staticScenes,
    smoothScroll: !staticScenes && !policy.touch,
    pin: !staticScenes && !policy.touch,
    pointer: !staticScenes && !policy.touch,
    reveal: !staticScenes,
  };
}
