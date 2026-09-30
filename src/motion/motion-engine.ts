import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { resolveMotionPolicy } from './motion-policy';

gsap.registerPlugin(ScrollTrigger);

export function mountMotion(scope: HTMLElement, policy: ReturnType<typeof resolveMotionPolicy>, _home: boolean) {
  let disposed = false;
  let introTimer = 0;
  let refreshFrame = 0;
  const lenis = policy.smoothScroll ? new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false, anchors: { offset: -95 }, prevent: node => !!node.closest('[role="dialog"],.studio-mobile-nav') }) : undefined;
  const tick = (time: number) => lenis?.raf(time * 1000);
  if (lenis) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(tick); }
  // Existing menu/modal body locks also stop the smooth-scroll controller.
  const lockObserver = new MutationObserver(() => document.body.style.overflow === 'hidden' ? lenis?.stop() : lenis?.start());
  if (lenis) lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
  const ctx = gsap.context(() => {
    // Copy stays visible in the initial HTML. Reveals move wrappers, never hide headings from LCP or JS failure.
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
      gsap.from(element, { y: 28, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
    });
    scope.querySelectorAll<HTMLElement>('.moto-workflow').forEach(section => {
      const stage = section.querySelector<HTMLElement>('.moto-workflow-stage')!;
      // Let the introduction scroll away before pinning, so the animated demo
      // itself sits in the centre of the viewport even on shorter desktops.
      const centeredStageStart = () => {
        const stageRect = stage.getBoundingClientRect();
        const sectionTop = section.getBoundingClientRect().top;
        // GSAP initially scales the stage from its centre. Remove that visual
        // inset when finding its layout top; offsetTop changes as GSAP wraps
        // the pinned section in a spacer during refresh.
        const stageTop = stageRect.top - sectionTop - (stage.offsetHeight - stageRect.height) / 2;
        const centeredTop = (window.innerHeight - stage.offsetHeight) / 2;
        return `top+=${Math.max(0, Math.round(stageTop - centeredTop))} top`;
      };
      const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: policy.pin ? centeredStageStart : 'top 75%', end: policy.pin ? '+=220%' : 'bottom 15%', pin: policy.pin, scrub: .65, invalidateOnRefresh: true, onToggle: trigger => section.classList.toggle('is-pinned', trigger.isActive), onUpdate: trigger => { section.dataset.phase = String(Math.min(3, Math.floor(trigger.progress * 4))); } } });
      timeline.fromTo(stage, { rotateY: -14, rotateX: 7, scale: .88 }, { rotateY: 0, rotateX: 0, scale: 1, duration: 1 })
        .to('.moto-workflow .moto-flow-light', { scaleX: 1, transformOrigin: 'left', duration: 3 }, 0)
        .from('.moto-flow-notice', { y: 20, stagger: .45, duration: .6 }, .2);
    });
    const core = scope.querySelector<HTMLElement>('.moto-core');
    if (core) {
      gsap.timeline({ scrollTrigger: { trigger: core, start: policy.pin ? 'top top' : 'top 75%', end: policy.pin ? '+=100%' : 'bottom 20%', pin: policy.pin, scrub: .8, invalidateOnRefresh: true } })
        .fromTo('.moto-core-object', { rotateY: -38, rotateX: 16 }, { rotateY: 0, rotateX: 0, duration: 1 })
        .fromTo('.moto-core-satellite', { y: 35, rotate: -6 }, { y: -20, rotate: 3, stagger: .1, duration: 1 }, 0)
        .fromTo('.moto-core-light', { xPercent: -150 }, { xPercent: 150, duration: 1 }, 0);
    }
    const integration = scope.querySelector<HTMLElement>('.moto-integration');
    if (integration) {
      gsap.fromTo(integration, { '--transition-dark': 1 }, { '--transition-dark': 0, scrollTrigger: { trigger: integration, start: 'top 90%', end: 'top 20%', scrub: true } });
      gsap.fromTo('.moto-data-column', { y: 30 }, { y: -30, stagger: .05, scrollTrigger: { trigger: integration, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }
    const automation = scope.querySelector<HTMLElement>('.moto-automation');
    if (automation) gsap.to('.moto-automation-light', { scaleY: 1, transformOrigin: 'top', scrollTrigger: { trigger: automation, start: 'top 70%', end: 'bottom 65%', scrub: .5 } });
    scope.querySelectorAll<HTMLElement>('.moto-product-photo,.product-photo-stage').forEach(element => {
      gsap.fromTo(element, { y: 12 }, { y: -12, scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    gsap.from('.moto-footer-cta > *,.footer-main > *,.studio-footer-bottom', { y: 20, stagger: .07, duration: .65, scrollTrigger: { trigger: '.studio-footer', start: 'top 85%', once: true } });
  }, scope);
  const tilt = scope.querySelector<HTMLElement>('.moto-hero-tilt');
  const pointer = (event: PointerEvent) => {
    if (!tilt || event.pointerType !== 'mouse') return;
    const box = tilt.getBoundingClientRect();
    tilt.style.setProperty('--pointer-x', `${Math.max(-4, Math.min(4, (event.clientX - box.left - box.width / 2) / box.width * 8))}deg`);
    tilt.style.setProperty('--pointer-y', `${Math.max(-3, Math.min(3, -(event.clientY - box.top - box.height / 2) / box.height * 6))}deg`);
  };
  const clearPointer = () => { tilt?.style.removeProperty('--pointer-x'); tilt?.style.removeProperty('--pointer-y'); };
  if (policy.pointer && tilt) { tilt.addEventListener('pointermove', pointer, { passive: true }); tilt.addEventListener('pointerleave', clearPointer); }
  const refresh = () => {
    if (disposed || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; if (!disposed) { ScrollTrigger.refresh(); scope.dataset.triggers = String(ScrollTrigger.getAll().length); } });
  };
  const images = [...scope.querySelectorAll('img')];
  images.forEach(image => image.addEventListener('load', refresh, { once: true }));
  document.fonts?.ready.then(refresh);
  refresh();
  return () => {
    disposed = true;
    window.clearTimeout(introTimer);
    cancelAnimationFrame(refreshFrame);
    images.forEach(image => image.removeEventListener('load', refresh));
    tilt?.removeEventListener('pointermove', pointer);
    tilt?.removeEventListener('pointerleave', clearPointer);
    clearPointer();
    lockObserver.disconnect();
    gsap.ticker.remove(tick);
    lenis?.off('scroll', ScrollTrigger.update);
    lenis?.destroy();
    ctx.revert();
    scope.querySelectorAll<HTMLElement>('.moto-workflow').forEach(section => delete section.dataset.phase);
    const intro = scope.querySelector<HTMLElement>('.moto-session-intro');
    if (intro) intro.hidden = true;
  };
}
