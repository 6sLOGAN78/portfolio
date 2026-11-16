import '@fontsource-variable/syne';
import '@fontsource-variable/inter-tight';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createScene } from './scene';
import { journey, magazine, marquee, profile, projects, stack } from './data';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

document.body.classList.add('loading');
// start at the top on reload unless the URL points at a section
if (!location.hash) {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

/* ---------- content ---------- */

$('#marquee').innerHTML = [...marquee, ...marquee].map((m) => `<span>${esc(m)}</span>`).join('');

$('#projects').innerHTML = projects
  .map((p, i) => {
    const id = `project-${i}`;
    return `
<li class="project">
  <button class="project-head" type="button" aria-expanded="false" aria-controls="${id}" data-cursor>
    <span class="project-num mono">${String(i + 1).padStart(2, '0')}</span>
    <span class="project-name">${esc(p.name)}</span>
    <span class="project-kind">${esc(p.kind)}</span>
    <span class="project-toggle" aria-hidden="true">+</span>
  </button>
  <div class="project-body" id="${id}">
    <div class="project-inner">
      <div class="project-detail">
        <div class="blurb">
          <p>${esc(p.blurb)}</p>
          <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
        <div class="project-side">
          <p class="metric">${esc(p.metric)}</p>
          <div class="tags">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
          <div class="project-links">
            <a href="${p.repo}" target="_blank" rel="noopener" tabindex="-1">Source ↗</a>
            ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" tabindex="-1">Live ↗</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  </div>
</li>`;
  })
  .join('');

$('#journey-cards').innerHTML = journey
  .map(
    (j, i) => `
<article class="card">
  <div class="card-top mono"><span>${esc(j.tag)}</span><span>${String(i + 1).padStart(2, '0')}</span></div>
  <h3>${esc(j.title)}</h3>
  <p class="result">${esc(j.result)}</p>
  <p class="text">${esc(j.text)}</p>
</article>`,
  )
  .join('');

$('#posts').innerHTML = magazine
  .map(
    (m) => `
<li><a href="${m.url}" target="_blank" rel="noopener" data-cursor>
  <strong>${esc(m.title)}</strong>
  <span class="mono">${esc(m.by)} · ${esc(m.date)}</span>
</a></li>`,
  )
  .join('');

$('#stack-grid').innerHTML = stack
  .map(
    (s) => `
<div class="stack-col">
  <h3>${esc(s.title)}</h3>
  <p class="note">${esc(s.note)}</p>
  <div class="chips">${s.items.map((x) => `<span>${esc(x)}</span>`).join('')}</div>
</div>`,
  )
  .join('');

/* ---------- project accordion ---------- */

const rows = Array.from(document.querySelectorAll<HTMLElement>('.project'));
function setOpen(row: HTMLElement, open: boolean) {
  row.classList.toggle('open', open);
  row.querySelector('.project-head')!.setAttribute('aria-expanded', String(open));
  row.querySelectorAll<HTMLAnchorElement>('.project-links a').forEach((a) => (a.tabIndex = open ? 0 : -1));
}
rows.forEach((row) => {
  row.querySelector('.project-head')!.addEventListener('click', () => {
    const open = !row.classList.contains('open');
    rows.forEach((r) => setOpen(r, false));
    setOpen(row, open);
    if (open) scene?.pulse();
    // heights change, so pinned measurements need refreshing
    setTimeout(() => ScrollTrigger.refresh(), 650);
  });
});

/* ---------- 3D backdrop ---------- */

const canvas = $<HTMLCanvasElement>('#gl');
const scene = createScene(canvas, reduced);
if (!scene) document.documentElement.classList.add('no-webgl');

/* ---------- smooth scroll ---------- */

let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

/* ---------- section-driven scene ---------- */

document.querySelectorAll<HTMLElement>('section[data-shape]').forEach((sec) => {
  const shape = Number(sec.dataset.shape);
  const x = Number(sec.dataset.x);
  // text-heavy sections sit directly over the particles, so dim them there
  const dim = sec.classList.contains('work') || sec.classList.contains('writing') || sec.classList.contains('stack');
  const enter = () => {
    scene?.morph(shape, x);
    canvas.style.opacity = dim ? '0.42' : '1';
  };
  ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onEnter: enter, onEnterBack: enter });
});

ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => scene?.setScroll(self.progress),
});

/* ---------- reveals ---------- */

function splitWords(el: HTMLElement) {
  const words = el.textContent!.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
  return Array.from(el.querySelectorAll<HTMLElement>('.w'));
}

if (!reduced) {
  const words = splitWords($('#statement'));
  ScrollTrigger.create({
    trigger: '#statement',
    start: 'top 82%',
    end: 'bottom 45%',
    onUpdate: (self) => {
      const n = Math.round(self.progress * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    },
  });

  const up = (targets: string, trigger?: string, stagger = 0.07) =>
    gsap.utils.toArray<HTMLElement>(trigger ? [trigger] : targets).forEach((t) => {
      gsap.from(trigger ? targets : t, {
        y: 46,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: t, start: 'top 88%' },
      });
    });

  up('.section-head');
  up('.about-grid p', '.about-grid');
  up('.stats li', '.stats');
  up('.project', '#projects', 0.045);
  up('.card', '#journey-cards', 0.09);
  up('.writing-grid > div', '.writing-grid', 0.12);
  up('.stack-col', '#stack-grid', 0.1);
  up('.contact .lede, .contact-row, .links li', '.contact-row', 0.06);

  gsap.from('.contact-title .line > span', {
    yPercent: 110,
    duration: 1.2,
    ease: 'power4.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.contact-title', start: 'top 85%' },
  });
}

/* ---------- counters ---------- */

document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const end = Number(el.dataset.count);
  const pre = el.dataset.prefix || '';
  const suf = el.dataset.suffix || '';
  const set = (v: number) => (el.textContent = `${pre}${Math.round(v)}${suf}`);
  if (reduced) return set(end);
  const o = { v: 0 };
  set(0);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 92%',
    once: true,
    onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => set(o.v) }),
  });
});

/* ---------- cursor & tilt ---------- */

if (fine && !reduced) {
  const cur = $('#cursor');
  const qx = gsap.quickTo(cur, 'x', { duration: 0.25, ease: 'power3' });
  const qy = gsap.quickTo(cur, 'y', { duration: 0.25, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    qx(e.clientX);
    qy(e.clientY);
  });
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest?.('a, button, [data-cursor]');
    cur.classList.toggle('big', !!t);
  });

  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      gsap.to(card, { rotateY: (px - 0.5) * 10, rotateX: (0.5 - py) * 10, duration: 0.5, ease: 'power2.out' });
    });
    card.addEventListener('pointerleave', () =>
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' }),
    );
  });
}

/* ---------- clock ---------- */

const clock = $('#clock');
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
const tick = () => (clock.textContent = `${fmt.format(new Date())} IST`);
tick();
setInterval(tick, 20_000);

/* ---------- email copy ---------- */

const hint = $('#email-hint');
$('#email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
    hint.textContent = 'Copied';
    scene?.pulse();
  } catch {
    window.location.href = `mailto:${profile.email}`;
  }
  setTimeout(() => (hint.textContent = 'Click to copy'), 1800);
});

/* ---------- loader & intro ---------- */

function intro() {
  document.body.classList.remove('loading');
  lenis?.start();
  ScrollTrigger.refresh();
  if (reduced) return;
  gsap.from('.hero .line > span', { yPercent: 110, duration: 1.4, ease: 'power4.out', stagger: 0.12 });
  gsap.from('.hero .reveal, .nav > *', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
}

const loader = $('#loader');
const num = $('#loader-num');
const fill = $('#loader-fill');
if (reduced) {
  loader.remove();
  intro();
} else {
  const o = { v: 0 };
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const count = gsap.to(o, {
    v: 100,
    duration: 1.7,
    ease: 'power2.inOut',
    onUpdate: () => {
      num.textContent = String(Math.round(o.v));
      fill.style.transform = `scaleX(${o.v / 100})`;
    },
  });
  // never hold the page hostage to a slow font request
  Promise.all([count.then(), Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))])]).then(() => {
    gsap.to(loader, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      onStart: intro,
      onComplete: () => loader.remove(),
    });
  });
}
