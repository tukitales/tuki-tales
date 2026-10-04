/* =========================================================
   Tuki Tales — Site JS
   Sections rendered live from YouTube:
     - Featured (most popular by lifetime)
     - Popular grid (all-time popular, live)
     - Latest slider (sorted by date, 10 items)
     - Shorts slider (hover-to-play with audio controls)
     - Playlists (live, popular-on-top)
   Fallbacks to seed data if live fetch fails.
   ========================================================= */

(function () {
  'use strict';

  // ---------------- Channel config ----------------
  var CHANNEL = {
    id: 'UCn1SrgsVonl3OUb9m5oM_vw',
    handle: 'Tuki-Tales',
    url: 'https://www.youtube.com/@Tuki-Tales',
    subscribeUrl: 'https://www.youtube.com/@Tuki-Tales?sub_confirmation=1',
    videosPopularUrl: 'https://www.youtube.com/@Tuki-Tales/videos?view=0&sort=p&flow=grid',
    videosLatestUrl:  'https://www.youtube.com/@Tuki-Tales/videos?view=0&sort=dd&flow=grid',
    shortsUrl: 'https://www.youtube.com/@Tuki-Tales/shorts',
    playlistsUrl: 'https://www.youtube.com/@Tuki-Tales/playlists',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCn1SrgsVonl3OUb9m5oM_vw'
  };

  // ---------------- Social media links ----------------
  // Active links come from the YouTube channel description.
  // Empty entries are placeholders for future — disabled visually in the footer.
  var SOCIALS = [
    { key: 'youtube',    label: 'YouTube',         icon: '▶', url: 'https://www.youtube.com/@Tuki-Tales' },
    { key: 'instagram',  label: 'Instagram',        icon: '📸', url: 'https://www.instagram.com/tukitales/' },
    { key: 'ytmusic',    label: 'YouTube Music',    icon: '🎵', url: 'https://music.youtube.com/@Tuki-Tales' },
    { key: 'spotify',    label: 'Spotify',          icon: '🎧', url: '' },                  // empty — to be added later
    { key: 'applemusic', label: 'Apple Music',      icon: '🍎', url: '' },                  // empty — to be added later
    { key: 'facebook',   label: 'Facebook',         icon: '👍', url: '' },                  // empty — to be added later
    { key: 'twitter',    label: 'X (Twitter)',      icon: '🐦', url: '' }                   // empty — to be added later
  ];

  // ---------------- Seed data (used immediately + as fallback) ----------------
  var SEED_POPULAR = [
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

  var SEED_LATEST = SEED_POPULAR.slice(0, 10);

  var SEED_SHORTS = [
    { id: 'NIuPE99BeHs', title: 'Mein Toh So Rhi Thi Mujhe Murge Ne Jagaya | मैं तो सो रही थी' },
    { id: '8mOwgjDN_mc', title: 'Thande Pani Se Nahana Chahiye | ठंडे-ठंडे पानी से नहाना चाहिए' },
    { id: 'h68s-FfPO1U', title: 'Tuki Tuki TamTam | तुकी तुकी तमतम | Chuha #song' },
    { id: 'rRikqlo1odo', title: 'Gol Matol Gol Gol | गोल मटोल गोल गोल | Hindi Kids Song' },
    { id: 'PzkhhZqSULY', title: 'Rail gaadi chuk chuk chuk | Hindi Cartoon poem | Tuki Tales' },
    { id: 'ZbHeTCARHXI', title: 'Chuha daud, billi aayi! #kids #childrensongs' },
    { id: 'v0jLpKWP8JU', title: 'Chuhe Ko Bukhar Hai #shorts | आज मंगलवार है चूहे को बुखार है' }
  ];

  var SEED_PLAYLISTS = [
    { id: 'PLENKsdD4mZME', title: 'Kaalu Madari Aaya & Popular Rhymes — Hindi Kids Songs Collection', videoId: '6NRaF2sK6c0' },
    { id: 'PLRbRDLC3Vcf8', title: 'Superhit Hindi Kids Songs Collection', videoId: 'lPWzqsULLqI' },
    { id: 'PLGwpHJ3N3wbA', title: 'Kids Learning Songs | ABC, Numbers & Counting', videoId: 'HISXIBiVW-g' }
  ];

  // ---------------- DOM helpers ----------------
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.startsWith('data-')) node.setAttribute(k, attrs[k]);
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
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function decodeEntities(s) {
    if (!s) return '';
    var t = document.createElement('textarea');
    t.innerHTML = s;
    return t.value;
  }
  function thumbUrl(id) { return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }
  function thumbUrlHd(id) { return 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg'; }

  // ---------------- Live fetch helpers ----------------
  // Use api.allorigins.win as a CORS proxy
  function proxiedFetch(url) {
    var proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
    return fetch(proxy, { credentials: 'omit', mode: 'cors' })
      .then(function (r) {
        if (!r.ok) throw new Error('Proxy fetch failed: ' + r.status);
        return r.text();
      });
  }

  // Extract ytInitialData JSON from raw HTML
  function extractYtInitialData(html) {
    var m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/)
           || html.match(/ytInitialData"\s*=\s*(\{[\s\S]*?\});/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch (e) { return null; }
  }

  // Walk JSON tree to collect all video IDs (in document order)
  function collectVideoIds(obj, seen) {
    var ids = [];
    function walk(o) {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(walk); return; }
      // Only collect IDs from video renderers, not from playlist metadata
      if (('videoId' in o) && typeof o.videoId === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(o.videoId)) {
        if (!seen || !seen[o.videoId]) {
          if (seen) seen[o.videoId] = true;
          ids.push(o.videoId);
        }
      }
      Object.keys(o).forEach(function (k) { walk(o[k]); });
    }
    walk(obj);
    return ids;
  }

  // Collect playlist IDs from the playlists page
  function collectPlaylistIds(html) {
    var ids = [];
    var seen = {};
    var re = /"playlistId":"(PL[a-zA-Z0-9_-]{10,})"/g;
    var m;
    while ((m = re.exec(html)) !== null) {
      if (!seen[m[1]]) { seen[m[1]] = true; ids.push(m[1]); }
    }
    return ids;
  }

  // Walk JSON to find titles near playlistId (best-effort)
  function findPlaylistTitle(html, playlistId) {
    var m = html.match(new RegExp('"playlistId":"' + playlistId + '"([\\s\\S]{0,5000})'));
    if (!m) return null;
    var chunk = m[1];
    var tm = chunk.match(/"title":\{"runs":\[\{"text":"([^"]+)"/)
          || chunk.match(/"title":\{"simpleText":"([^"]+)"/);
    return tm ? decodeEntities(tm[1]) : null;
  }

  function findPlaylistFirstVideoId(html, playlistId) {
    var m = html.match(new RegExp('"videoId":"([a-zA-Z0-9_-]{11})"[\\s\\S]{0,200}"playlistId":"' + playlistId + '"'));
    if (m) return m[1];
    // Try the other order
    m = html.match(new RegExp('"playlistId":"' + playlistId + '"[\\s\\S]{0,500}"videoId":"([a-zA-Z0-9_-]{11})"'));
    if (m) return m[1];
    return null;
  }

  // Fetch titles via oEmbed (CORS-enabled, no proxy needed)
  function fetchVideoMeta(videoId) {
    var url = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + videoId + '&format=json';
    return fetch(url, { credentials: 'omit', mode: 'cors' })
      .then(function (r) {
        if (!r.ok) throw new Error('oEmbed ' + r.status);
        return r.json();
      })
      .then(function (d) {
        return { id: videoId, title: d.title, author: d.author_name, thumb: d.thumbnail_url };
      })
      .catch(function () {
        return { id: videoId, title: 'Tuki Tales video', thumb: thumbUrl(videoId) };
      });
  }

  function fetchVideoMetas(videoIds) {
    return Promise.all(videoIds.map(fetchVideoMeta));
  }

  // ---------------- Live data: Popular videos ----------------
  // Fetch /videos?sort=p via proxy, parse ytInitialData, return video IDs sorted by popularity (as YT returns them).
  function fetchPopularVideos(limit) {
    limit = limit || 12;
    return proxiedFetch(CHANNEL.videosPopularUrl)
      .then(function (html) {
        var data = extractYtInitialData(html);
        if (!data) return null;
        var seen = {};
        var ids = collectVideoIds(data, seen);
        return ids.slice(0, limit);
      })
      .then(function (ids) {
        if (!ids || !ids.length) throw new Error('No popular video IDs');
        return fetchVideoMetas(ids);
      });
  }

  // ---------------- Live data: Latest videos ----------------
  // Use YouTube RSS feed (returns last ~15 videos in chronological order).
  // The RSS feed itself isn't CORS-enabled, so we proxy it.
  function fetchLatestVideos(limit) {
    limit = limit || 10;
    return proxiedFetch(CHANNEL.rssUrl)
      .then(function (xmlText) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xmlText, 'application/xml');
        var entries = doc.querySelectorAll('entry');
        var out = [];
        for (var i = 0; i < Math.min(entries.length, limit); i++) {
          var entry = entries[i];
          var link = entry.querySelector('link');
          var videoId = '';
          if (link) {
            var href = link.getAttribute('href') || '';
            var m = href.match(/v=([a-zA-Z0-9_-]{11})/);
            if (m) videoId = m[1];
          }
          var titleEl = entry.querySelector('title');
          var title = titleEl ? titleEl.textContent : '';
          var publishedEl = entry.querySelector('published');
          var published = publishedEl ? publishedEl.textContent : '';
          out.push({ id: videoId, title: title, published: published, thumb: thumbUrl(videoId) });
        }
        return out;
      });
  }

  // ---------------- Live data: Shorts ----------------
  function fetchShorts(limit) {
    limit = limit || 12;
    return proxiedFetch(CHANNEL.shortsUrl)
      .then(function (html) {
        var data = extractYtInitialData(html);
        if (!data) return null;
        var seen = {};
        var ids = collectVideoIds(data, seen);
        return ids.slice(0, limit);
      })
      .then(function (ids) {
        if (!ids || !ids.length) throw new Error('No shorts found');
        return fetchVideoMetas(ids);
      });
  }

  // ---------------- Live data: Playlists ----------------
  function fetchPlaylists() {
    return proxiedFetch(CHANNEL.playlistsUrl)
      .then(function (html) {
        var ids = collectPlaylistIds(html);
        if (!ids.length) return null;
        // For each playlist ID, fetch its page to get title + thumbnail
        return Promise.all(ids.map(function (pid) {
          return proxiedFetch('https://www.youtube.com/playlist?list=' + pid)
            .then(function (phtml) {
              var tm = phtml.match(/<meta property="og:title" content="([^"]+)"/);
              var im = phtml.match(/<meta property="og:image" content="([^"]+)"/);
              var cm = phtml.match(/"videoCount":"?(\d+)"?/);
              var title = tm ? decodeEntities(tm[1]) : 'Playlist';
              // Strip " - YouTube" suffix
              title = title.replace(/\s*-\s*YouTube\s*$/, '');
              // Extract first video ID from the playlist's HTML (used as thumb fallback)
              var firstVideoId = null;
              var vm = phtml.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
              if (vm) firstVideoId = vm[1];
              var thumb = im ? decodeEntities(im[1]) : (firstVideoId ? thumbUrl(firstVideoId) : null);
              var count = cm ? parseInt(cm[1], 10) : null;
              return { id: pid, title: title, thumb: thumb, videoCount: count, firstVideoId: firstVideoId };
            })
            .catch(function () {
              return { id: pid, title: 'Playlist', thumb: null, videoCount: null, firstVideoId: null };
            });
        }));
      });
  }

  // ---------------- Render: Featured ----------------
  function renderFeatured(video) {
    var frame = $('#featuredFrame');
    var titleEl = $('#featuredTitle');
    var descEl = $('#featuredDesc');
    var linkEl = $('#featuredLink');
    if (!frame || !video) return;
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + video.id + '?rel=0" title="' +
      escapeHtml(video.title) + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    if (titleEl) titleEl.textContent = video.title;
    if (descEl)  descEl.textContent = 'यह Tuki Tales का सबसे लोकप्रिय वीडियो है — lifetime views के आधार पर सबसे ऊपर। 🎵';
    if (linkEl)  linkEl.href = 'https://www.youtube.com/watch?v=' + video.id;
  }

  // ---------------- Render: Popular grid ----------------
  function renderPopularGrid(videos) {
    var grid = $('#videoGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var frag = document.createDocumentFragment();
    videos.slice(0, 12).forEach(function (v) {
      frag.appendChild(buildVideoCard(v));
    });
    grid.appendChild(frag);
  }

  function buildVideoCard(v) {
    var card = el('article', { class: 'video-card', role: 'button', tabindex: '0', 'aria-label': 'Play: ' + (v.title || '') });
    card.dataset.videoId = v.id;
    var thumb = el('div', { class: 'video-thumb' });
    var img = el('img', { src: thumbUrl(v.id), alt: v.title || 'Video', loading: 'lazy', width: 480, height: 270 });
    img.addEventListener('load', function () { img.style.opacity = '1'; });
    img.style.opacity = '0';
    img.style.transition = 'opacity .4s';
    thumb.appendChild(img);
    var playOverlay = el('div', { class: 'video-play' });
    playOverlay.appendChild(el('span', { class: 'video-play-btn', html: '▶' }));
    thumb.appendChild(playOverlay);
    card.appendChild(thumb);
    var info = el('div', { class: 'video-info' });
    info.appendChild(el('h3', { class: 'video-title', title: v.title || '' }, v.title || ''));
    info.appendChild(el('div', { class: 'video-channel', html: '<span>📺</span> Tuki Tales' }));
    card.appendChild(info);
    card.addEventListener('click', function () { openModal(v); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(v); }
    });
    return card;
  }

  // ---------------- Render: Latest slider ----------------
  function renderLatestSlider(videos) {
    var track = $('#latestSlider');
    if (!track) return;
    track.innerHTML = '';
    var frag = document.createDocumentFragment();
    videos.slice(0, 10).forEach(function (v) {
      var card = el('div', { class: 'slider-card' });
      card.appendChild(buildVideoCard(v));
      frag.appendChild(card);
    });
    track.appendChild(frag);
    setupSliderArrows(track);
  }

  // ---------------- Render: Shorts slider ----------------
  function renderShortsSlider(shorts) {
    var track = $('#shortsSlider');
    if (!track) return;
    track.innerHTML = '';
    var frag = document.createDocumentFragment();
    shorts.slice(0, 12).forEach(function (v) {
      frag.appendChild(buildShortCard(v));
    });
    track.appendChild(frag);
    setupSliderArrows(track);
    setupShortsHoverPlay(track);
  }

  function buildShortCard(v) {
    var card = el('div', { class: 'short-card', role: 'button', tabindex: '0', 'aria-label': 'Play short: ' + (v.title || '') });
    card.dataset.shortId = v.id;

    var thumb = el('img', { class: 'short-thumb', src: thumbUrl(v.id), alt: v.title || 'Short', loading: 'lazy' });
    card.appendChild(thumb);

    var badge = el('span', { class: 'short-badge', html: 'SHORT' });
    card.appendChild(badge);

    var overlay = el('div', { class: 'short-overlay' });
    overlay.appendChild(el('div', { class: 'short-title', title: v.title || '' }, v.title || ''));
    var controls = el('div', { class: 'short-controls' });
    var pauseBtn = el('button', { class: 'short-btn short-pause', type: 'button', 'aria-label': 'Pause / play', html: '❚❚' });
    var muteBtn  = el('button', { class: 'short-btn short-mute',  type: 'button', 'aria-label': 'Unmute / mute', html: '🔇' });
    controls.appendChild(pauseBtn);
    controls.appendChild(muteBtn);
    overlay.appendChild(controls);
    card.appendChild(overlay);

    // Click anywhere on card (except buttons) → open in modal with sound
    card.addEventListener('click', function (e) {
      if (e.target.closest('.short-btn')) return;
      openModal({ id: v.id, title: v.title });
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') openModal({ id: v.id, title: v.title });
    });

    return card;
  }

  // Wire up hover-to-play on shorts.
  // - On mouseenter: load iframe with autoplay=1&mute=1 (preview without sound)
  // - On mouseleave: stop and unload iframe, restore thumbnail
  // - On unmute button click: postMessage to unmute (allowed because it's a user gesture)
  // - On pause button click: postMessage to toggle play/pause
  function setupShortsHoverPlay(track) {
    var HOVER_DELAY = 250; // ms
    var timers = new WeakMap();

    $$('.short-card', track).forEach(function (card) {
      var id = card.dataset.shortId;
      if (!id) return;

      var iframe = null;
      var isPlaying = false;
      var isMuted = true;
      var isPaused = false;

      function ensureIframe() {
        if (iframe) return;
        iframe = el('iframe', {
          class: 'short-iframe',
          src: 'https://www.youtube-nocookie.com/embed/' + id +
               '?autoplay=1&mute=1&controls=0&loop=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1',
          title: card.getAttribute('aria-label') || 'Short',
          loading: 'lazy',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        });
        card.appendChild(iframe);
      }

      function destroyIframe() {
        if (iframe) {
          iframe.src = 'about:blank';
          iframe.parentNode.removeChild(iframe);
          iframe = null;
        }
        isPlaying = false;
        isMuted = true;
        isPaused = false;
        card.classList.remove('is-playing');
        var muteBtn = card.querySelector('.short-mute');
        var pauseBtn = card.querySelector('.short-pause');
        if (muteBtn)  { muteBtn.innerHTML = '🔇'; muteBtn.classList.remove('is-active'); }
        if (pauseBtn) { pauseBtn.innerHTML = '❚❚'; pauseBtn.classList.remove('is-active'); }
      }

      function postCommand(func) {
        if (!iframe || !iframe.contentWindow) return;
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: [] }), '*');
      }

      function onEnter() {
        var t = setTimeout(function () {
          ensureIframe();
          card.classList.add('is-playing');
          isPlaying = true;
        }, HOVER_DELAY);
        timers.set(card, t);
      }
      function onLeave() {
        var t = timers.get(card);
        if (t) { clearTimeout(t); timers.delete(card); }
        destroyIframe();
      }

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);

      // Pause/play button
      var pauseBtn = card.querySelector('.short-pause');
      if (pauseBtn) {
        pauseBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (!iframe) {
            // Force-start playback on click
            ensureIframe();
            card.classList.add('is-playing');
            isPlaying = true;
            isPaused = false;
            pauseBtn.innerHTML = '❚❚';
            pauseBtn.classList.remove('is-active');
            return;
          }
          if (isPaused) {
            postCommand('playVideo');
            isPaused = false;
            pauseBtn.innerHTML = '❚❚';
            pauseBtn.classList.remove('is-active');
          } else {
            postCommand('pauseVideo');
            isPaused = true;
            pauseBtn.innerHTML = '▶';
            pauseBtn.classList.add('is-active');
          }
        });
      }

      // Mute/unmute button
      var muteBtn = card.querySelector('.short-mute');
      if (muteBtn) {
        muteBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (!iframe) {
            ensureIframe();
            card.classList.add('is-playing');
            isPlaying = true;
          }
          if (isMuted) {
            postCommand('unMute');
            postCommand('setVolume');
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
            isMuted = false;
            muteBtn.innerHTML = '🔊';
            muteBtn.classList.add('is-active');
          } else {
            postCommand('mute');
            isMuted = true;
            muteBtn.innerHTML = '🔇';
            muteBtn.classList.remove('is-active');
          }
        });
      }
    });
  }

  // ---------------- Render: Playlists ----------------
  function renderPlaylists(playlists) {
    var grid = $('#playlistGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var frag = document.createDocumentFragment();
    playlists.forEach(function (p) {
      frag.appendChild(buildPlaylistCard(p));
    });
    grid.appendChild(frag);
  }

  function buildPlaylistCard(p) {
    var card = el('article', { class: 'playlist-card', role: 'button', tabindex: '0', 'aria-label': 'Open playlist: ' + (p.title || '') });
    card.addEventListener('click', function () {
      window.open('https://www.youtube.com/playlist?list=' + p.id, '_blank', 'noopener');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') window.open('https://www.youtube.com/playlist?list=' + p.id, '_blank', 'noopener');
    });

    var thumb = el('div', { class: 'playlist-thumb' });
    var imgSrc = p.thumb || (p.firstVideoId ? thumbUrl(p.firstVideoId) : null);
    if (imgSrc) {
      var img = el('img', { src: imgSrc, alt: p.title || 'Playlist', loading: 'lazy' });
      img.style.opacity = '0';
      img.style.transition = 'opacity .4s';
      img.addEventListener('load', function () { img.style.opacity = '1'; });
      img.addEventListener('error', function () {
        if (p.firstVideoId) img.src = thumbUrl(p.firstVideoId);
      });
      thumb.appendChild(img);
    }
    var overlay = el('div', { class: 'playlist-overlay' });
    var pillContent = p.videoCount != null ? ('▶ ' + p.videoCount + ' videos') : '▶ View Playlist';
    overlay.appendChild(el('div', { class: 'playlist-overlay-pill', html: pillContent }));
    thumb.appendChild(overlay);
    card.appendChild(thumb);

    var info = el('div', { class: 'playlist-info' });
    info.appendChild(el('h3', { class: 'playlist-title', title: p.title || '' }, p.title || 'Playlist'));
    info.appendChild(el('div', { class: 'playlist-meta', html: '<span>📚</span> View Playlist on YouTube' }));
    card.appendChild(info);
    return card;
  }

  // ---------------- Render: Footer socials ----------------
  function renderFooterSocials() {
    var wrap = $('#footerSocial');
    if (!wrap) return;
    wrap.innerHTML = '';
    SOCIALS.forEach(function (s) {
      var a = el('a', {
        class: 'social-link' + (s.url ? '' : ' is-disabled'),
        href: s.url || '#',
        'aria-label': s.label + (s.url ? '' : ' (coming soon)'),
        title: s.label,
        target: '_blank',
        rel: 'noopener',
        html: s.icon
      });
      if (!s.url) {
        a.addEventListener('click', function (e) { e.preventDefault(); });
      }
      wrap.appendChild(a);
    });
  }

  // ---------------- Slider arrows ----------------
  function setupSliderArrows(track) {
    var slider = track.closest('.slider');
    if (!slider) return;
    var prevBtn = slider.querySelector('.slider-prev');
    var nextBtn = slider.querySelector('.slider-next');
    if (!prevBtn || !nextBtn) return;

    function updateButtons() {
      var maxScroll = track.scrollWidth - track.clientWidth - 4;
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }
    function scrollByCards(dir) {
      var card = track.querySelector('.slider-card, .short-card');
      var cardW = card ? card.offsetWidth + 20 : 320;
      track.scrollBy({ left: dir * cardW * 1.5, behavior: 'smooth' });
    }
    prevBtn.addEventListener('click', function () { scrollByCards(-1); });
    nextBtn.addEventListener('click', function () { scrollByCards(1); });
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    // Initial state
    setTimeout(updateButtons, 100);
  }

  // ---------------- Modal player ----------------
  var modal = null;
  var modalIframe = null;

  function buildModal() {
    if (modal) return;
    modal = el('div', { class: 'video-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Video player' });
    var inner = el('div', { class: 'video-modal-inner' });
    var frameWrap = el('div', { class: 'video-modal-frame-wrap' });
    modalIframe = el('iframe', {
      src: 'about:blank',
      title: 'YouTube video',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      allowfullscreen: true
    });
    frameWrap.appendChild(modalIframe);
    inner.appendChild(frameWrap);

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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  // ---------------- Init ----------------
  function init() {
    // Render footer socials + year immediately
    renderFooterSocials();
    var yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Render seed data immediately so page never looks empty
    renderFeatured(SEED_POPULAR[0]);
    renderPopularGrid(SEED_POPULAR);
    renderLatestSlider(SEED_LATEST);
    renderShortsSlider(SEED_SHORTS);
    renderPlaylists(SEED_PLAYLISTS);

    // Then fetch live data and re-render if successful
    // (each section updates independently — if one fails the seed stays)

    fetchPopularVideos(12).then(function (videos) {
      if (videos && videos.length) {
        renderFeatured(videos[0]);      // Most popular by lifetime
        renderPopularGrid(videos);
        console.log('[Tuki Tales] Popular videos refreshed live:', videos.length);
      }
    }).catch(function (e) { console.warn('[Tuki Tales] Popular fetch failed, using seed:', e.message); });

    fetchLatestVideos(10).then(function (videos) {
      if (videos && videos.length) {
        renderLatestSlider(videos);
        var statEl = $('#statVideos');
        if (statEl && videos.length) {
          // Show "X+" with a reasonable cap (e.g. 30+) since RSS returns ~15
          statEl.textContent = (videos.length >= 15 ? '15+' : videos.length);
        }
        console.log('[Tuki Tales] Latest videos refreshed live:', videos.length);
      }
    }).catch(function (e) { console.warn('[Tuki Tales] Latest fetch failed, using seed:', e.message); });

    fetchShorts(12).then(function (shorts) {
      if (shorts && shorts.length) {
        renderShortsSlider(shorts);
        console.log('[Tuki Tales] Shorts refreshed live:', shorts.length);
      }
    }).catch(function (e) { console.warn('[Tuki Tales] Shorts fetch failed, using seed:', e.message); });

    fetchPlaylists().then(function (playlists) {
      if (playlists && playlists.length) {
        renderPlaylists(playlists);
        console.log('[Tuki Tales] Playlists refreshed live:', playlists.length);
      }
    }).catch(function (e) { console.warn('[Tuki Tales] Playlists fetch failed, using seed:', e.message); });
  }

  // Navbar: scroll state + mobile toggle
  function setupNavbar() {
    var navbar = $('#navbar');
    var navToggle = $('#navToggle');
    var navLinks = $('#navLinks');

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
      $$('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); setupNavbar(); });
  } else {
    init(); setupNavbar();
  }
})();
