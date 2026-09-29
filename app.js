const destinations = {
  app: {
    creator: 'https://alpha.creator.allweb3.io',
    brand: 'https://alpha.project.allweb3.io',
  },
  role: {
    creator: 'https://alpha.creator.allweb3.io/campaign',
    brand: 'https://alpha.project.allweb3.io',
  },
  docs: 'https://docs.allweb3.io/',
  twitter: 'https://x.com/AllWeb3_io',
  medium: 'https://allweb3.medium.com',
  creator: 'https://creator.allweb3.io',
  brand: 'https://project.allweb3.io',
  contact: 'mailto:team@allweb3.io',
  terms: 'https://allweb3.io/terms',
  privacy: 'https://allweb3.io/policy',
};

function destinationUrl(key, currentRole = role) {
  const value = destinations[key];
  if (value == null) return null;
  if (typeof value === 'object') return value[currentRole] ?? null;
  return value;
}

function applyDestinationLinks() {
  document.querySelectorAll('[data-destination]').forEach(link => {
    const key = link.dataset.destination;
    const url = destinationUrl(key);
    link.href = url || '#';
  });
}

const content = {
  creator: {
    heroTitle: 'Get rewarded for the', heroAccent: 'attention you create',
    heroDescription: 'AllWeb3 is an onchain marketing platform that lets anyone earn by sharing campaigns.',
    cta: 'Start Earning', bannerTitle: 'Earn Rewards for', bannerAccent: 'Your Influence and Content',
    bannerDescription: 'Turn your creativity and reach into verifiable earnings', howTitle: 'Start earning',
    imageAlt: 'Green glass panels showing Create, Share, Earn and campaign rewards',
    features: [
      ['Fair Compensation for Verified Work', 'Get paid exactly what your contributions are worth', 'fair'],
      ['Multiple Earning Opportunities', 'Access diverse campaigns across industries', 'opportunities'],
      ['Automatic Payment System', 'Receive payments instantly upon verification', 'payments'],
      ['Reputation Building with Certificates', 'Get paid exactly what your contributions are worth', 'reputation'],
      ['Portfolio of Successful Campaigns', 'Showcase your proven track record', 'portfolio'],
    ],
    steps: [
      ['BROWSE', 'Browse Campaigns', 'Find projects that match your audience', 'creator-browse'],
      ['APPLY', 'Apply to Join', 'Submit your profile and get approved', 'creator-apply'],
      ['CREATE', 'Create Content', 'Promote the project through your channels', 'creator-create'],
      ['EARN', 'Earn Rewards', 'Get paid automatically when results are verified', 'creator-earn'],
    ],
  },
  brand: {
    heroTitle: 'Turn creators into your', heroAccent: 'growth engine',
    heroDescription: 'Launch performance-driven campaigns powered by real creators. Every post is AI-scored, every result is verified onchain, and you only pay for the engagement that actually delivers.',
    cta: 'Launch Campaign', bannerTitle: 'Launch Campaigns that Deliver', bannerAccent: 'Real Results.',
    bannerDescription: 'Connect with creators who drive measurable impact for your project', howTitle: 'Start growing',
    imageAlt: 'Green glass panels showing Create Campaign, Pay for Real Results and measurable growth',
    features: [
      ['Verified Campaign Performance Tracking', 'Real-time analytics with on-chain verification', 'fair'],
      ['Direct Access to Creator Network', 'Connect with thousands of qualified creators', 'opportunities'],
      ['Transparent Pricing and Payments', 'Clear costs and automatic payment processing', 'payments'],
      ['On-Chain Proof of Results', 'Immutable verification of campaign performance', 'reputation'],
      ['Campaign Management Dashboard', 'Comprehensive tools to manage all your campaigns', 'portfolio'],
    ],
    steps: [
      ['CREATE', 'Create Campaign', 'Set your goals, budget, and requirements.', 'brand-create'],
      ['JOIN', 'Creators Join', 'Qualified creators apply to participate', 'brand-join'],
      ['TRACK', 'Track Results', 'Monitor real-time performance with verified data', 'brand-track'],
      ['PAY', 'Pay for Performance', 'Creators get paid automatically based on verified results', 'brand-pay'],
    ],
  },
};

function readPreference(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}
function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch { /* File previews can block storage. */ }
}
const parameters = new URLSearchParams(location.search);
let role = parameters.get('role') || readPreference('aw3-role', 'creator');
let theme = parameters.get('theme') || readPreference('aw3-theme', 'dark');
if (!Object.hasOwn(content, role)) role = 'creator';
if (!['dark', 'light'].includes(theme)) theme = 'dark';
let step = 0;

function getAssets() {
  const raw = window.AW3_ASSETS[`${theme}-${role}`];
  const dark = theme === 'dark';
  const creator = role === 'creator';
  const featureOffset = dark && !creator ? 5 : 4;
  return {
    logoMark: raw.imgGroup2087327757, logoWord: raw.imgGroup2087327799,
    creatorIcon: raw.imgProfileSvgrepoCom11, brandIcon: raw.imgProfile2UserSvgrepoCom1,
    ctaIcon: creator ? raw.imgCoinsSvgrepoCom11 : (dark ? raw.imgIcon : raw.imgGroup2087328509),
    ctaArrow: creator ? raw.imgIcon : (dark ? raw.imgIcon1 : raw.imgIcon),
    docIcon: raw.imgDocTextFillSvgrepoCom1,
    banner: dark ? raw.imgImage35 : raw.imgChatGptImageSep162026030635Am1,
    earth: dark ? raw.imgImage36 : raw.imgImage38,
    hero: creator ? (dark ? raw.imgChatGptImageSep142026083837Pm1 : raw.imgImage39) : (dark ? raw.imgImage37 : raw.imgChatGptImageSep162026030303Am1),
    partner: raw.imgGroup2,
    campaign1: raw.imgEllipse7486, campaign2: raw.imgEllipse7489, campaign3: raw.imgEllipse7487,
    chevronLeft: raw.imgChevronLeft, chevronRight: raw.imgChevronRight, rowArrow: raw.imgVector11,
    opportunities: raw[`imgIcon${featureOffset}`], payments: raw[`imgIcon${featureOffset + 1}`],
    reputation: raw[`imgIcon${featureOffset + 2}`], portfolio: raw[`imgIcon${featureOffset + 3}`], fair: raw[`imgIcon${featureOffset + 4}`],
  };
}

function renderStep(direction = 1) {
  const data = content[role].steps[step];
  document.querySelector('#step-label').textContent = `${String(step + 1).padStart(2, '0')} / ${data[0]}`;
  document.querySelector('#step-title').textContent = data[1];
  document.querySelector('#step-description').textContent = data[2];
  document.querySelector('#step-number').textContent = step + 1;
  document.querySelector('.slide').setAttribute('aria-label', `Step ${step + 1} of 4: ${data[1]}`);
  document.querySelector('#how-step-image').src = `assets/how-${data[3]}.png`;
  window.howCarousel.update(role, step, direction);
}

function render() {
  const data = content[role];
  const assets = getAssets();
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.role = role;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#070d08' : '#ebf7eb';
  document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = data[el.dataset.copy]; });
  document.querySelectorAll('[data-asset]').forEach(el => { el.src = assets[el.dataset.asset]; });
  document.querySelectorAll('[data-role]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.role === role)); });
  window.renderHero(role);
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
  });
  const cards = data.features.map(([title, description, icon]) => {
    const article = document.createElement('article');
    article.className = 'feature-card';
    const image = document.createElement('img');
    image.src = assets[icon]; image.alt = ''; image.width = 50; image.height = 50;
    const copy = document.createElement('div');
    const heading = document.createElement('h3'); heading.textContent = title;
    const body = document.createElement('p'); body.textContent = description;
    copy.append(heading, body); article.append(image, copy); return article;
  });
  document.querySelector('#features-grid').replaceChildren(...cards);
  renderStep();
  applyDestinationLinks();
}

document.querySelectorAll('[data-role]').forEach(button => {
  button.addEventListener('click', () => {
    role = button.dataset.role; step = 0; savePreference('aw3-role', role); render();
  });
});
document.querySelectorAll('[data-theme-choice]').forEach(button => {
  button.addEventListener('click', () => {
    theme = button.dataset.themeChoice;
    savePreference('aw3-theme', theme);
    render();
  });
});
function changeStep(direction) { step = (step + direction + 4) % 4; renderStep(direction); }
document.querySelector('.previous').addEventListener('click', () => changeStep(-1));
document.querySelector('.next').addEventListener('click', () => changeStep(1));
document.querySelector('.carousel').addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); changeStep(event.key === 'ArrowRight' ? 1 : -1);
  }
});
document.querySelectorAll('.faq-list details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.faq-list details').forEach(other => { if (other !== detail) other.open = false; });
  });
});

const siteHeader = document.querySelector('.site-header');
function updateStickyHeader() {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
}
updateStickyHeader();
window.addEventListener('scroll', updateStickyHeader, { passive: true });

const navigation = document.querySelector('.header nav');
const menuToggle = document.querySelector('.menu-toggle');
function closeMenu() { navigation.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); }
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const dialog = document.querySelector('#link-dialog');
document.querySelectorAll('[data-destination]').forEach(link => {
  link.addEventListener('click', event => {
    const url = destinationUrl(link.dataset.destination);
    if (url) {
      link.href = url;
      return;
    }
    event.preventDefault();
    document.querySelector('#dialog-title').textContent = link.textContent.trim().replace('→', '').trim();
    document.querySelector('#dialog-description').textContent = 'You’re viewing the AllWeb3 preview. This link is not connected yet.';
    dialog.showModal();
  });
});
document.querySelectorAll('.dialog-close, .dialog-dismiss').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });

Object.values(content).flatMap(data => data.steps).forEach(stepData => {
  const image = new Image(); image.src = `assets/how-${stepData[3]}.png`;
});
window.howCarousel.init(changeStep);
render();
