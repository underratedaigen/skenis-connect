import { describe, expect, it } from 'vitest';
import { resolveMotionPolicy } from '../src/motion/motion-policy';

const desktop = { reduced: false, capture: false, legal: false, touch: false, lowPower: false };
describe('cinematic motion policy', () => {
  it('disables all scroll/3D effects for the system accessibility preference', () => {
    expect(resolveMotionPolicy({ ...desktop, reduced: true })).toEqual({ staticScenes: true, intro: false, smoothScroll: false, pin: false, pointer: false, reveal: false });
  });
  it('keeps touch scrolling native and never pins mobile content', () => {
    const policy = resolveMotionPolicy({ ...desktop, touch: true });
    expect(policy.smoothScroll).toBe(false);
    expect(policy.pin).toBe(false);
    expect(policy.pointer).toBe(false);
    expect(policy.reveal).toBe(true);
  });
  it.each(['capture', 'legal', 'lowPower'] as const)('keeps %s a normal-flow static document', key => {
    const policy = resolveMotionPolicy({ ...desktop, [key]: true });
    expect(policy.staticScenes).toBe(true);
    expect(policy.intro || policy.smoothScroll || policy.pin || policy.pointer).toBe(false);
  });
});
