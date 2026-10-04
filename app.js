/* =========================================================
   Tuki Tales — Site JS
   - Navbar scroll state + mobile menu toggle
   - Video grid rendering with modal player
   - Lazy thumbnail loading with fade-in
   ========================================================= */

(function () {
  'use strict';

  // ---- Video data (15 popular videos from Tuki Tales channel) ----
  var videos = [
    { id: '4uXYgl6Gn4g', title: 'Kalu Madari Aaya | कालू मदारी आया | Hindi Balgeet | Funny Dancing Bear | Kids Rhymes' },
    { id: 'HaHSvy283c0', title: 'Hathi Raja Kaha chale 💚 Mithu Mithu Main Tota 🎉 Dudi Dudi Dum Dum 🎵 | Hindi Kids Songs' },
    { id: 'S7dqBKgT2lw', title: 'Upar Pankha Chalta Hai 🎵 | Hindi Nursery Rhymes for Kids | Upar Pankha Niche Munna' },
    { id: 'G4TGNqL5FhY', title: 'Potty Aa Rahi Susu Aa Rahi 🚽 + Mithu Mithu Main Tota 🦜 | Hindi Kids Songs Compilation' },
    { id: 'Yz2tZEAx_RI', title: 'Mummy ki Roti Gol matol Papa ka Paisa gol gol | Kaalu madari aya | Dudi dudi dum dum' },
    { id: 'J02k7zOiniw', title: 'Madam Teri Kasam 🎶 Teacher Teri Kasam | Meow Meow | Chanda Mama Dur ke | Hindi Kids Songs' },
    { id: 'FVZegAb4CdI', title: 'Kaalu Madari Aaya 🐻 Kala Apna Bhalu Laya 🎶 | Mithu Mithu 🦜 | Hindi Kids Songs Compilation' },
    { id: 'nMc3JLSv3hE', title: 'Naani Teri Morni Ko Mor Le Gaye 🦚 | नानी तेरी मोरनी को मोर ले गए | SuperHit Hindi Rhyme' },
    { id: 'vC4TnjzkbXc', title: '🚂✨ Magic Rail | Chuk Chuk Chuk | Hindi Kids Poem | Monkey, Lion, Rabbit & Peacock' },
    { id: '-Pgqo8e_Aq4', title: 'Chanda Mama Dur ke | चंदा मामा दूर के 🌙 | Hindi Kids Poem | Tuki Tales | Kids Rhyme' },
    { id: 'YaQWGpfS6Cg', title: 'Rail Gaadi Chuk Chuk Chuk 🚂 | Hindi Kids Song | Nursery Rhymes for Kids | Rail Gaadi Song' },
    { id: 'nelCXUlO6ac', title: 'Haathi Raja Kahan Chale | Hindi Nursery Rhymes for Kids | Hathi Raja | Tuki Tales' },
    { id: 'JJdnhAa-lIY', title: 'Thande Thande Pani Se Nahana Chahiye | Cute Hindi Kids Dance Masti Cartoon Song' },
    { id: '6NRaF2sK6c0', title: 'Kalu Madari Aaya | कालू मदारी आया | Kalu Madari Song | Hindi Kids Song | Nursery Rhymes' },
    { id: 'gQm7Cs7NQXo', title: 'Topi Meri Kahaan Gayi? | Chuu Chuu Chuhe Ki Masti | Hindi Cartoon for Kids | Tuki Tales' }
  ];

  // ---- DOM helpers ----
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.startsWith('data-')) node.setAttribute(k, attrs[k]);
        else if (k === 'onclick') node.setAttribute('onclick', attrs[k]);
        else node[k] = attrs[k];
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  // ---- Navbar: scroll state + mobile toggle ----
  var navbar = $('#navbar');
  var navToggle = $('#navToggle');
  var navLinks = $('.nav-links');

  function onScroll() {
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu when a link is clicked
    $$('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Render video grid ----
  function thumbUrl(id) {
    return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  }

  function renderVideos() {
    var grid = $('#videoGrid');
    if (!grid) return;

    var frag = document.createDocumentFragment();

    videos.forEach(function (v) {
      var card = el('article', { class: 'video-card', 'data-video-id': v.id, role: 'button', tabindex: '0', 'aria-label': 'Play video: ' + v.title });

      var thumb = el('div', { class: 'video-thumb' });
      var img = el('img', {
        src: thumbUrl(v.id),
        alt: v.title,
        loading: 'lazy',
        width: 480,
        height: 270
      });
      img.addEventListener('load', function () { img.style.opacity = '1'; });
      img.style.opacity = '0';
      img.style.transition = 'opacity .4s';
      thumb.appendChild(img);

      var playOverlay = el('div', { class: 'video-play' });
      playOverlay.appendChild(el('span', { class: 'video-play-btn', html: '▶' }));
      thumb.appendChild(playOverlay);

      card.appendChild(thumb);

      var info = el('div', { class: 'video-info' });
      info.appendChild(el('h3', { class: 'video-title', title: v.title }, v.title));
      info.appendChild(el('div', { class: 'video-channel', html: '<span>📺</span> Tuki Tales' }));
      card.appendChild(info);

      // Click → open modal
      card.addEventListener('click', function () { openModal(v); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(v);
        }
      });

      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

  // ---- Modal player ----
  var modal = null;
  var modalIframe = null;

  function buildModal() {
    if (modal) return;
    modal = el('div', { class: 'video-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Video player' });
    var inner = el('div', { class: 'video-modal-inner' });
    modalIframe = el('iframe', {
      src: 'about:blank',
      title: 'YouTube video',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      allowfullscreen: true
    });
    inner.appendChild(modalIframe);

    var closeBtn = el('button', { class: 'video-modal-close', 'aria-label': 'Close video', type: 'button', html: '×' });
    closeBtn.addEventListener('click', closeModal);
    inner.appendChild(closeBtn);

    modal.appendChild(inner);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.body.appendChild(modal);
  }

  function openModal(v) {
    buildModal();
    modalIframe.src = 'https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus close button for accessibility
    setTimeout(function () {
      var btn = modal.querySelector('.video-modal-close');
      if (btn) btn.focus();
    }, 50);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modalIframe.src = 'about:blank';
    document.body.style.overflow = '';
  }

  // Esc key to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  // ---- Footer year ----
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    renderVideos();
  });

  // If DOM already loaded (e.g., script at end of body), render immediately
  if (document.readyState !== 'loading') {
    renderVideos();
  }
})();
