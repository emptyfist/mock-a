(() => {
  const section = document.querySelector('#how-it-works');
  const pin = section.querySelector('.how-pin');
  const viewport = section.querySelector('.how-viewport');
  const track = section.querySelector('.how-track');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let currentRole, frame = 0, distance = 1, pinTop = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  function paint() {
    frame = 0;
    if (section.dataset.layout !== 'pinned') { track.style.transform = ''; return; }
    const progress = clamp((pinTop - section.getBoundingClientRect().top) / distance);
    const position = progress * 3;
    const step = Math.min(2, Math.floor(position));
    // Brief resting portions keep each card readable between horizontal swipes.
    const local = clamp((position - step - .15) / .7);
    const eased = local * local * (3 - 2 * local);
    track.style.transform = `translate3d(${-((step + eased) * (viewport.clientWidth + 24))}px,0,0)`;
  }
  function requestPaint() { if (!frame) frame = requestAnimationFrame(paint); }
  function measure() {
    const available = window.innerHeight - 112;
    // Short screens and reduced-motion users get all four cards in normal document flow.
    section.dataset.layout = reduced.matches ? 'stacked' : 'pinned';
    const height = pin.getBoundingClientRect().height;
    if (reduced.matches || height > available) {
      section.dataset.layout = 'stacked';
      section.style.height = '';
      pin.style.top = '';
    } else {
      pinTop = Math.max(96, (window.innerHeight - height) / 2);
      distance = Math.max(480, window.innerHeight * .8) * 3;
      section.style.height = `${height + distance}px`;
      pin.style.top = `${pinTop}px`;
    }
    requestPaint();
  }
  window.howScroll = {
    render(role, steps, theme) {
      if (role !== currentRole) {
        currentRole = role;
        track.replaceChildren(...steps.map(([label, title, description, asset], i) => {
          const card = document.createElement('article');
          card.className = 'slide';
          const headingId = `how-card-${i + 1}`;
          card.setAttribute('aria-labelledby', headingId);
          card.innerHTML = `<div class="step-art" aria-hidden="true"><img src="assets/how-${theme}-${asset}.png" width="731" height="501" alt="" draggable="false"></div><div class="step-copy"><p class="eyebrow">${String(i + 1).padStart(2, '0')} / ${label}</p><h3 id="${headingId}">${title}</h3><p>${description}</p></div>`;
          return card;
        }));
      }
      // Keep the same card elements during a theme change to preserve scroll anchoring.
      track.querySelectorAll('.step-art img').forEach((image, i) => {
        const src = `assets/how-${theme}-${steps[i][3]}.png`;
        if (image.getAttribute('src') !== src) image.setAttribute('src', src);
      });
      requestAnimationFrame(measure);
    },
  };
  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', measure);
  // Content and font reflows can change the vertical centering point.
  let measuredWidth = 0, measuredHeight = 0;
  new ResizeObserver(() => {
    const width = viewport.clientWidth;
    const cardHeight = track.firstElementChild?.offsetHeight || 0;
    if (width !== measuredWidth || cardHeight !== measuredHeight) {
      measuredWidth = width; measuredHeight = cardHeight;
      requestAnimationFrame(measure);
    }
  }).observe(viewport);
  document.fonts.ready.then(measure);
})();
