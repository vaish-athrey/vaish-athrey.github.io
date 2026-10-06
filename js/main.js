// Vaishnavi Athrey Ramesh — Portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelector('.nav-links');
  const navToggle = document.querySelector('.nav-toggle');
  const navScrim = document.querySelector('.nav-scrim');

  // Sticky nav background on scroll
  const onScroll = () => {
    if (window.scrollY > 24) nav?.classList.add('is-scrolled');
    else nav?.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu toggle
  const closeMenu = () => {
    navLinks?.classList.remove('is-open');
    navScrim?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };
  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('is-open');
    navScrim?.classList.toggle('is-open', !!isOpen);
    navToggle.setAttribute('aria-expanded', String(!!isOpen));
  });
  navScrim?.addEventListener('click', closeMenu);
  navLinks?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  // Active nav link + case-study TOC highlighting via IntersectionObserver
  const sections = document.querySelectorAll('main section[id]');
  const allNavAnchors = document.querySelectorAll('.nav-links a, .case-toc a');
  if (sections.length && allNavAnchors.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          allNavAnchors.forEach((a) => {
            a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealEls.length) {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealer.observe(el));
  }

  // Rotating role words in hero
  const roleEl = document.querySelector('[data-role-rotator]');
  if (roleEl) {
    const roles = JSON.parse(roleEl.getAttribute('data-role-rotator'));
    let i = 0;
    const label = roleEl.querySelector('.role-word');
    setInterval(() => {
      i = (i + 1) % roles.length;
      label.style.opacity = '0';
      setTimeout(() => {
        label.textContent = roles[i];
        label.style.opacity = '1';
      }, 220);
    }, 2600);
  }

  // Copy email to clipboard
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = 'copied ✓';
      } catch {
        btn.textContent = value;
      }
      setTimeout(() => (btn.textContent = original), 1600);
    });
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Scroll progress bar
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    const setProgress = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrolled))})`;
    };
    setProgress();
    window.addEventListener('scroll', setProgress, { passive: true });
    window.addEventListener('resize', setProgress);
  }

  // Custom cursor glow (desktop / fine pointers only)
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = glow.style.opacity === '0' ? '' : glow.style.opacity;
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = ''; });
    const tick = () => {
      gx += (tx - gx) * 0.18;
      gy += (ty - gy) * 0.18;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.querySelectorAll('a, button, .btn').forEach((el) => {
      el.addEventListener('mouseenter', () => glow.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => glow.classList.remove('is-hover'));
    });
  }

  // Parallax drift on decorative color blobs
  const blobs = document.querySelectorAll('.blob');
  if (blobs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const onScrollParallax = () => {
      const y = window.scrollY;
      blobs.forEach((b, i) => {
        const speed = 0.06 + i * 0.03;
        b.style.transform = `translateY(${y * speed}px)`;
      });
    };
    onScrollParallax();
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  }

  // Count-up animation for case-study metric numbers
  const metricNums = document.querySelectorAll('.cm-num');
  if (metricNums.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const animateNum = (el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!match) return;
      const [, prefix, numStr, suffix] = match;
      const target = parseFloat(numStr.replace(/,/g, ''));
      if (Number.isNaN(target)) return;
      const decimals = (numStr.split('.')[1] || '').length;
      const duration = 900;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent = prefix + val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const metricObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNum(entry.target);
            metricObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    metricNums.forEach((el) => metricObserver.observe(el));
  }

  // Command palette (Cmd/Ctrl+K)
  (function initCommandPalette() {
    const onIndex = /(^|\/)index\.html$/.test(location.pathname) || location.pathname.endsWith('/');
    const home = onIndex ? '' : 'index.html';
    const commands = [
      { label: 'Go to About', hint: 'section', href: `${home}#about` },
      { label: 'Go to Experience', hint: 'section', href: `${home}#experience` },
      { label: 'Go to Skills', hint: 'section', href: `${home}#skills` },
      { label: 'Go to Work', hint: 'section', href: `${home}#work` },
      { label: 'Go to Coursework', hint: 'section', href: `${home}#coursework` },
      { label: 'Go to Beyond Code', hint: 'section', href: `${home}#beyond` },
      { label: 'Go to Contact', hint: 'section', href: `${home}#contact` },
      { label: 'DocuMind AI', hint: 'project', href: 'documind-ai.html' },
      { label: 'Sign Language to Speech', hint: 'project', href: 'sign-language-to-speech.html' },
      { label: 'Telehealth Platform', hint: 'project', href: 'telehealth.html' },
      { label: 'EEG-to-Image Decoding', hint: 'coursework', href: 'eeg-image-decoding.html' },
      { label: 'Movie Recommender on Kafka Streams', hint: 'coursework', href: 'movie-recommender.html' },
      { label: 'AI Risk Analysis Automation', hint: 'coursework', href: 'ai-risk-analysis.html' },
      { label: 'LLM Features for Zulip', hint: 'coursework', href: 'zulip-llm-features.html' },
      { label: 'Download résumé', hint: 'file', href: 'assets/Vaishnavi_Athrey_Ramesh_Resume.pdf', external: true },
      { label: 'Email vaish.athrey@gmail.com', hint: 'contact', href: 'mailto:vaish.athrey@gmail.com', external: true },
      { label: 'Open LinkedIn', hint: 'link', href: 'https://www.linkedin.com/in/vaishnavi-athrey/', external: true },
      { label: 'Open GitHub', hint: 'link', href: 'https://github.com/vathreyr', external: true },
    ];

    const overlay = document.createElement('div');
    overlay.className = 'cmdk-overlay';
    overlay.innerHTML = `
      <div class="cmdk-modal" role="dialog" aria-modal="true" aria-label="Quick navigation">
        <div class="cmdk-input-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input type="text" class="cmdk-input" placeholder="Jump to a section or project" autocomplete="off" spellcheck="false">
          <kbd>esc</kbd>
        </div>
        <div class="cmdk-list"></div>
      </div>`;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('.cmdk-input');
    const list = overlay.querySelector('.cmdk-list');
    let filtered = commands.slice();
    let activeIndex = 0;
    let lastFocused = null;

    function render() {
      list.innerHTML = '';
      if (!filtered.length) {
        list.innerHTML = '<div class="cmdk-empty">No matches</div>';
        return;
      }
      filtered.forEach((cmd, i) => {
        const row = document.createElement('a');
        row.className = 'cmdk-item' + (i === activeIndex ? ' is-active' : '');
        row.href = cmd.href;
        if (cmd.external) {
          row.target = '_blank';
          row.rel = 'noopener';
        }
        const labelSpan = document.createElement('span');
        labelSpan.textContent = cmd.label;
        const tagSpan = document.createElement('span');
        tagSpan.className = 'cmdk-tag';
        tagSpan.textContent = cmd.hint;
        row.appendChild(labelSpan);
        row.appendChild(tagSpan);
        row.addEventListener('mouseenter', () => {
          activeIndex = i;
          updateActive();
        });
        row.addEventListener('click', close);
        list.appendChild(row);
      });
    }

    function updateActive() {
      list.querySelectorAll('.cmdk-item').forEach((el, i) => el.classList.toggle('is-active', i === activeIndex));
      const activeEl = list.querySelector('.cmdk-item.is-active');
      if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
    }

    function filterCommands(q) {
      const term = q.trim().toLowerCase();
      filtered = !term ? commands.slice() : commands.filter((c) => c.label.toLowerCase().includes(term) || c.hint.toLowerCase().includes(term));
      activeIndex = 0;
      render();
    }

    function open() {
      lastFocused = document.activeElement;
      overlay.classList.add('is-open');
      input.value = '';
      filterCommands('');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 10);
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    input.addEventListener('input', () => filterCommands(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        updateActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        updateActive();
      } else if (e.key === 'Enter') {
        const el = list.querySelector('.cmdk-item.is-active');
        if (el) el.click();
      } else if (e.key === 'Escape') {
        close();
      }
    });
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        overlay.classList.contains('is-open') ? close() : open();
      }
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    const navRight = document.querySelector('.nav-right');
    if (navRight) {
      const isMac = navigator.platform ? navigator.platform.toUpperCase().includes('MAC') : false;
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'cmdk-trigger';
      trigger.setAttribute('aria-label', 'Open quick navigation');
      trigger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><kbd>${isMac ? '⌘K' : 'Ctrl K'}</kbd>`;
      trigger.addEventListener('click', open);
      navRight.insertBefore(trigger, navRight.firstChild);
    }
  })();
});
