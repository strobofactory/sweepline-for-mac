const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'メニューを開く');
  if (mobileMenu) mobileMenu.hidden = true;
};

menuButton?.addEventListener('click', () => {
  const nextOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(nextOpen));
  menuButton.setAttribute('aria-label', nextOpen ? 'メニューを閉じる' : 'メニューを開く');
  if (mobileMenu) mobileMenu.hidden = !nextOpen;
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 14);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});


const featureCarousel = document.querySelector('[data-feature-carousel]');
if (featureCarousel) {
  const rail = featureCarousel.querySelector('.feature-rail');
  const prev = document.querySelector('.feature-arrow--prev');
  const next = document.querySelector('.feature-arrow--next');
  const progress = featureCarousel.querySelector('.feature-progress-bar');

  const getStep = () => {
    const firstSlide = rail?.querySelector('.feature-slide');
    if (!rail || !firstSlide) return 320;
    const styles = window.getComputedStyle(rail);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return firstSlide.getBoundingClientRect().width + gap;
  };

  const updateFeatureProgress = () => {
    if (!rail || !progress) return;
    const maxScroll = Math.max(1, rail.scrollWidth - rail.clientWidth);
    const ratio = Math.min(1, Math.max(0, rail.scrollLeft / maxScroll));
    progress.style.transform = `translateX(${ratio * 455}%)`;
  };

  prev?.addEventListener('click', () => {
    rail?.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  next?.addEventListener('click', () => {
    rail?.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  rail?.addEventListener('scroll', updateFeatureProgress, { passive: true });
  window.addEventListener('resize', updateFeatureProgress, { passive: true });
  updateFeatureProgress();
}


const heroSection = document.querySelector('.hero-section');
if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let heroMotionFrame = 0;

  const clamp01 = (value) => Math.min(1, Math.max(0, value));

  const updateHeroMotion = () => {
    heroMotionFrame = 0;

    const rect = heroSection.getBoundingClientRect();
    const viewportHeight = Math.max(1, window.innerHeight);
    const travel = Math.max(1, rect.height + viewportHeight * 0.15);
    const progress = clamp01((-rect.top) / travel);
    const isMobile = window.innerWidth <= 820;

    const bgY = progress * (isMobile ? 28 : 72);
    const bgScale = 1.035 + progress * (isMobile ? 0.035 : 0.085);

    const copyFadeStart = isMobile ? 0.58 : 0.42;
    const copyProgress = clamp01((progress - copyFadeStart) / (1 - copyFadeStart));
    const copyY = -progress * (isMobile ? 12 : 34);
    const copyOpacity = 1 - copyProgress * (isMobile ? 0.42 : 0.76);

    const visualProgress = clamp01((progress - 0.10) / 0.90);
    const visualY = -visualProgress * (isMobile ? 18 : 58);
    const visualScale = 1 - visualProgress * (isMobile ? 0.025 : 0.065);
    const visualOpacity = 1 - clamp01((progress - 0.72) / 0.28) * 0.46;

    const overlayOpacity = 1 - progress * 0.18;
    const orbitScale = 1 + progress * 0.16;

    heroSection.style.setProperty('--hero-bg-y', `${bgY.toFixed(2)}px`);
    heroSection.style.setProperty('--hero-bg-scale', bgScale.toFixed(4));
    heroSection.style.setProperty('--hero-copy-y', `${copyY.toFixed(2)}px`);
    heroSection.style.setProperty('--hero-copy-opacity', copyOpacity.toFixed(3));
    heroSection.style.setProperty('--hero-visual-y', `${visualY.toFixed(2)}px`);
    heroSection.style.setProperty('--hero-visual-scale', visualScale.toFixed(4));
    heroSection.style.setProperty('--hero-visual-opacity', visualOpacity.toFixed(3));
    heroSection.style.setProperty('--hero-overlay-opacity', overlayOpacity.toFixed(3));
    heroSection.style.setProperty('--hero-orbit-scale', orbitScale.toFixed(4));
  };

  const requestHeroMotion = () => {
    if (heroMotionFrame) return;
    heroMotionFrame = window.requestAnimationFrame(updateHeroMotion);
  };

  updateHeroMotion();
  window.addEventListener('scroll', requestHeroMotion, { passive: true });
  window.addEventListener('resize', requestHeroMotion, { passive: true });
}


const scrollStory = document.querySelector('[data-scroll-story]');
if (scrollStory) {
  const chapters = [...scrollStory.querySelectorAll('[data-story-step]')];
  const screens = [...scrollStory.querySelectorAll('.story-screen')];
  const status = scrollStory.querySelector('[data-story-status]');
  const labels = ['MEASURED ONLY', 'CONFIRM BEFORE DELETE', 'PROTECTED AREAS EXCLUDED'];

  const setStoryStep = (step) => {
    const safeStep = Math.min(chapters.length - 1, Math.max(0, Number(step) || 0));
    scrollStory.dataset.activeStep = String(safeStep);

    chapters.forEach((chapter, index) => {
      chapter.classList.toggle('is-active', index === safeStep);
    });

    screens.forEach((screen, index) => {
      screen.classList.toggle('is-active', index === safeStep);
    });

    if (status) status.textContent = labels[safeStep] || labels[0];
  };

  if ('IntersectionObserver' in window) {
    const storyObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      setStoryStep(visible[0].target.dataset.storyStep);
    }, {
      rootMargin: '-28% 0px -38% 0px',
      threshold: [0.15, 0.3, 0.5, 0.7]
    });

    chapters.forEach((chapter) => storyObserver.observe(chapter));
  } else {
    setStoryStep(0);
  }

  setStoryStep(0);
}


const globalRevealGroups = [
  { selector: '.philosophy-copy', type: 'soft', stagger: 0 },
  { selector: '.philosophy-points > p', type: 'line', stagger: 35 },
  { selector: '.philosophy .measured', type: 'soft', stagger: 0 },
  { selector: '.features .section-heading', type: 'soft', stagger: 0 },
  { selector: '.feature-slide', type: 'scale', stagger: 40 },
  { selector: '.feature-progress', type: 'line', stagger: 0 },
  { selector: '.story-intro', type: 'soft', stagger: 0 },
  { selector: '.faq .section-heading', type: 'soft', stagger: 0 },
  { selector: '.faq-list details', type: 'line', stagger: 30 },
  { selector: '.purchase-panel', type: 'scale', stagger: 0 },
  { selector: '.footer-inner', type: 'soft', stagger: 0 }
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const globalRevealItems = [];

globalRevealGroups.forEach(({ selector, type, stagger }) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    if (element.closest('.hero-section')) return;
    if (element.classList.contains('scroll-reveal')) return;

    element.classList.add('scroll-reveal');
    element.dataset.reveal = type;
    element.style.setProperty('--reveal-delay', `${Math.min(index * stagger, 120)}ms`);
    globalRevealItems.push(element);
  });
});

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  globalRevealItems.forEach((element) => element.classList.add('is-revealed'));
} else {
  document.documentElement.classList.add('motion-ready');

  const globalRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      globalRevealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.01,
    rootMargin: '0px 0px -6% 0px'
  });

  // Allow the hidden state to paint before observation starts.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      globalRevealItems.forEach((element) => globalRevealObserver.observe(element));
    });
  });
}
