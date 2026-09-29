(() => {
  const carousel = document.querySelector('#how-it-works .carousel');
  const slide = carousel.querySelector('.slide');
  const pause = carousel.querySelector('.how-pause');
  const fill = carousel.querySelector('.how-progress-fill');
  const segments = [...carousel.querySelectorAll('.how-step-button')];
  let activeStep = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let progress, transition, identity, advance, pointer;
  let paused = false, hovered = false, focused = false, visible = false;
  function syncPlayback() {
    if (!progress) return;
    const running = !paused && !hovered && !focused && visible && !document.hidden && !reduced.matches;
    if (running) progress.play(); else progress.pause();
    slide.setAttribute('aria-live', running ? 'off' : 'polite');
  }
  window.howCarousel = {
    init(callback) { advance = callback; },
    update(role, step, direction = 1) {
      const nextIdentity = `${role}:${step}`;
      if (identity === nextIdentity) return;
      const wasRendered = identity !== undefined;
      identity = nextIdentity;
      if (progress) { progress.onfinish = null; progress.cancel(); }
      activeStep = step;
      segments.forEach((button, i) => {
        if (i === step) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      segments[step].querySelector('.how-segment-track').append(fill);
      transition?.cancel();
      if (wasRendered && !reduced.matches) {
        transition = slide.animate([
          { opacity: .35, transform: `translateX(${direction < 0 ? -24 : 24}px)` },
          { opacity: 1, transform: 'translateX(0)' },
        ], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
      progress = fill.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}], {duration:5000,easing:'linear',fill:'forwards'});
      progress.onfinish = () => advance(1);
      syncPlayback();
    },
  };
  segments.forEach((button, i) => button.addEventListener('click', () => {
    if (i !== activeStep) advance(i - activeStep);
  }));
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.setAttribute('aria-label', paused ? 'Play automatic steps' : 'Pause automatic steps');
    pause.setAttribute('aria-pressed', String(paused));
    syncPlayback();
  });
  carousel.addEventListener('pointerenter', e => { if(e.pointerType === 'mouse') { hovered = true; syncPlayback(); } });
  carousel.addEventListener('pointerleave', () => { hovered = false; syncPlayback(); });
  carousel.addEventListener('focusin', () => { focused = true; syncPlayback(); });
  carousel.addEventListener('focusout', e => { focused = carousel.contains(e.relatedTarget); syncPlayback(); });
  slide.addEventListener('pointerdown', e => { pointer = {x:e.clientX,y:e.clientY}; });
  slide.addEventListener('pointerup', e => {
    if (pointer) {
      const dx=e.clientX-pointer.x, dy=e.clientY-pointer.y;
      if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)) advance(dx<0?1:-1);
    }
    pointer=null;
  });
  slide.addEventListener('pointercancel', () => { pointer=null; });
  document.addEventListener('visibilitychange',syncPlayback);
  reduced.addEventListener('change', () => { if(reduced.matches) transition?.cancel(); syncPlayback(); });
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;syncPlayback();},{threshold:.35}).observe(slide);
})();
