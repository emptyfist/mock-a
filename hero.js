(() => {
  const copy = {
    creator: {
      title: 'Your creativity deserves', accent: 'more than impressions.',
      description: 'Find Web3 campaigns, create content, and turn verified contributions into rewards.',
      kicker: 'Why AllWeb3 for Creators', heading: 'Your work has value.', highlight: 'Make it count.',
      body: 'AllWeb3 connects your content to campaigns with clear tasks, visible performance, and rewards tied to what you deliver.', cta: 'Explore Campaigns',
      cards: [
        ['Discover', 'Explore active campaigns from Web3 projects looking for creators like you.', 'creator-discover'],
        ['Create', 'Turn your ideas into high-quality content and share it with the right projects.', 'creator-create'],
        ['Earn', 'Get rewarded for the content you create, the results you drive, and the work you deliver.', 'creator-earn'],
      ],
    },
    brand: {
      title: 'Make every', accent: 'campaign accountable.',
      description: 'Work with creators through transparent campaigns and measure the results you pay for.',
      kicker: 'Why AllWeb3 for Brands', heading: 'Know what worked.', highlight: 'Grow with proof.',
      body: 'Replace unclear PR spend with defined campaign tasks, creator collaboration, and verifiable results you can evaluate.', cta: 'Launch Campaign',
      cards: [
        ['Launch', 'Find curated on-chain campaigns tailored precisely to your audience and creative interests.', 'brand-launch'],
        ['Collaborate', 'Connect with leading Web3 creators that get you noticed.', 'brand-collaborate'],
        ['Verify', 'Pay for what works, verify your results, and reward creators with confidence.', 'brand-verify'],
      ],
    },
  };
  const visual = document.querySelector('.hero-visual');
  const stage = document.querySelector('.hero-stage');
  const dots = [...document.querySelectorAll('.hero-dot')];
  const pause = document.querySelector('.hero-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let currentRole, index = 0, progress, paused = false, hovered = false, focused = false, visible = true, pointer;
  function schedule() {
    if (!progress) return;
    if (!paused && !hovered && !focused && visible && !document.hidden && !reduced.matches) {
      progress.play();
    } else {
      progress.pause();
    }
  }
  function show(next) {
    if (progress) {
      progress.onfinish = null;
      progress.cancel();
    }
    index = (next + 3) % 3;
    [...stage.children].forEach((card, i) => {
      card.dataset.position = i === index ? 'active' : i === (index + 1) % 3 ? 'next' : 'previous';
      card.setAttribute('aria-hidden', String(i !== index));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    // The fill is the clock: pausing preserves elapsed time, and completion advances the card.
    progress = stage.children[index].querySelector('.hero-card-progress').animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 5000, easing: 'linear', fill: 'forwards' },
    );
    progress.onfinish = () => show(index + 1);
    schedule();
  }
  function render(role) {
    if (role === currentRole) return;
    currentRole = role;
    const data = copy[role];
    document.querySelectorAll('[data-hero-copy]').forEach(el => el.textContent = data[el.dataset.heroCopy]);
    stage.replaceChildren(...data.cards.map(([title, description, asset], i) => {
      const card = document.createElement('article');
      card.className = 'hero-step-card';
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', `${i + 1} of 3: ${title}`);
      const number = String(i + 1).padStart(2, '0');
      card.innerHTML = `<div class="hero-card-top"><span class="hero-card-badge">STEP ${number}</span><span>${number} / 03</span></div><img class="hero-card-image" src="assets/hero-${asset}.png" alt="" width="316" height="160"><div class="hero-card-text"><h3>${title}</h3><p>${description}</p></div><div class="hero-card-line" aria-hidden="true"><span class="hero-card-progress"></span></div>`;
      dots[i].setAttribute('aria-label', `Show ${title} card`);
      return card;
    }));
    show(0);
  }
  dots.forEach((dot,i) => dot.addEventListener('click', () => show(i)));
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Play card animation' : 'Pause card animation');
    pause.setAttribute('aria-pressed', String(paused));
    schedule();
  });
  visual.addEventListener('pointerenter', e => { if(e.pointerType === 'mouse') { hovered = true; schedule(); } });
  visual.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  visual.addEventListener('focusin', () => { focused = true; schedule(); });
  visual.addEventListener('focusout', e => { focused = visual.contains(e.relatedTarget); schedule(); });
  visual.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(index + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  stage.addEventListener('pointerdown', e => { pointer = { x: e.clientX, y:e.clientY }; });
  stage.addEventListener('pointerup', e => {
    if(pointer) {
      const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
      if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    }
    pointer = null;
  });
  stage.addEventListener('pointercancel', () => { pointer = null; });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, {threshold:.1}).observe(stage);
  window.renderHero = render;
})();
