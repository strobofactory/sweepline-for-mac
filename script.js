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
