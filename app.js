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
  // Each icon is an inline SVG string (real brand glyph).
  var SVG = {
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.5 3.02 3.02 0 0 0 2.12 2.14C4.5 20.15 12 20.15 12 20.15s7.5 0 9.38-.51A3.02 3.02 0 0 0 23.5 17.5 31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.5zM9.6 15.5v-7l6.2 3.5-6.2 3.5z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13-.67-.66-1.34-1.07-2.13-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg>',
    ytmusic: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 8.5 L15 12 L10 15.5 Z"/></svg>',
    spotify: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm5.5 17.32a.75.75 0 0 1-1.03.25 14.5 14.5 0 0 0-3.95-1.46 16.5 16.5 0 0 0-4.4-.3.75.75 0 0 1-.1-1.5 18 18 0 0 1 4.83.32 16 16 0 0 1 4.4 1.62.75.75 0 0 1 .25 1.07zm1.46-3.25a.94.94 0 0 1-1.29.3 17.5 17.5 0 0 0-4.66-1.76 18.5 18.5 0 0 0-5.1-.35.94.94 0 0 1-.12-1.87 20.3 20.3 0 0 1 5.6.38 19.5 19.5 0 0 1 5.18 1.96.94.94 0 0 1 .3 1.34zm.13-3.4a21.5 21.5 0 0 0-5.7-2.16 22 22 0 0 0-6.1-.42 1.13 1.13 0 0 1-.13-2.25 24 24 0 0 1 6.7.46 23.5 23.5 0 0 1 6.25 2.36 1.13 1.13 0 0 1 1.04 2z"/></svg>',
    applemusic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.4 5.34a3.06 3.06 0 0 0-2.16-2.17C19.32 2.55 12 2.55 12 2.55s-7.32 0-9.24.62A3.06 3.06 0 0 0 .6 5.34 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .6 6.66 3.06 3.06 0 0 0 2.16 2.17c1.92.62 9.24.62 9.24.62s7.32 0 9.24-.62a3.06 3.06 0 0 0 2.16-2.17A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.6-6.66zM9.6 15.6V8.4l6 3.6z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z"/></svg>'
  };

  var SOCIALS = [
    { key: 'youtube',    label: 'YouTube',         svg: SVG.youtube,    url: 'https://www.youtube.com/@Tuki-Tales' },
    { key: 'instagram',  label: 'Instagram',        svg: SVG.instagram,  url: 'https://www.instagram.com/tukitales/' },
    { key: 'ytmusic',    label: 'YouTube Music',    svg: SVG.ytmusic,    url: 'https://music.youtube.com/@Tuki-Tales' },
    { key: 'spotify',    label: 'Spotify',          svg: SVG.spotify,    url: '' },                  // empty — to be added later
    { key: 'applemusic', label: 'Apple Music',      svg: SVG.applemusic, url: '' },                  // empty — to be added later
    { key: 'facebook',   label: 'Facebook',         svg: SVG.facebook,   url: '' },                  // empty — to be added later
    { key: 'twitter',    label: 'X (Twitter)',      svg: SVG.twitter,    url: '' }                   // empty — to be added later
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
    { id: 'PLENKsdD4mZME', title: 'Kaalu Madari Aaya & Popular Rhymes — Hindi Kids Songs Collection', firstVideoId: '6NRaF2sK6c0' },
    { id: 'PLRbRDLC3Vcf8', title: 'Superhit Hindi Kids Songs Collection', firstVideoId: 'lPWzqsULLqI' },
    { id: 'PLGwpHJ3N3wbA', title: 'Kids Learning Songs | ABC, Numbers & Counting', firstVideoId: 'HISXIBiVW-g' }
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
  // Use the highest-resolution thumbnail available directly from YouTube's CDN.
  // No API key needed — these URLs are public and work for any video ID.
  function thumbUrl(id) { return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }
  function thumbUrlHd(id) { return 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg'; }
  // For playlists, we always use the first video's thumbnail (most reliable).
  function playlistThumbUrl(firstVideoId) {
    return firstVideoId ? thumbUrlHd(firstVideoId) : null;
  }

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

    // YouTube-feed style metadata row: [avatar] + (title + channel + views)
    var metaRow = el('div', { class: 'video-meta-row' });
    var avatar = el('div', { class: 'video-channel-avatar' });
    avatar.appendChild(el('img', { src: 'logo.png', alt: 'Tuki Tales', loading: 'lazy' }));
    metaRow.appendChild(avatar);

    var info = el('div', { class: 'video-info' });
    info.appendChild(el('h3', { class: 'video-title', title: v.title || '' }, v.title || ''));
    info.appendChild(el('div', { class: 'video-channel', html: 'Tuki Tales <span class="verified" aria-label="Verified">✓</span>' }));
    metaRow.appendChild(info);

    card.appendChild(metaRow);

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
    // Infinite scroll: clone cards onto the end so the slider loops seamlessly
    setupInfiniteScroll(track);
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
  function setupShortsHoverPlay(track, skipExisting) {
    var HOVER_DELAY = 250; // ms
    var timers = new WeakMap();

    $$('.short-card', track).forEach(function (card) {
      if (skipExisting && card.dataset.hoverWired === '1') return;
      card.dataset.hoverWired = '1';

      var id = card.dataset.shortId;
      if (!id) return;

      var iframe = null;
      var isPlaying = false;
      var isMuted = true;
      var isPaused = false;
      var isReady = false;          // YT iframe ready flag
      var pendingCommands = [];    // queued until iframe is ready

      function ensureIframe() {
        if (iframe) return;
        isReady = false;
        iframe = el('iframe', {
          class: 'short-iframe',
          src: 'https://www.youtube-nocookie.com/embed/' + id +
               '?autoplay=1&mute=1&controls=0&loop=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1',
          title: card.getAttribute('aria-label') || 'Short',
          loading: 'lazy',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        });
        card.appendChild(iframe);

        // Listen for YT iframe ready event so we know when it's safe to send commands
        window.addEventListener('message', onIframeMessage);
      }

      function onIframeMessage(e) {
        // Only handle messages from this iframe
        if (!iframe || e.source !== iframe.contentWindow) return;
        var data = e.data;
        if (typeof data === 'string') {
          try { data = JSON.parse(data); } catch (err) { return; }
        }
        // YouTube sends { event: 'onReady', ... } — flush pending commands
        if (data && data.event === 'onReady') {
          isReady = true;
          // Send 'listening' so YT starts sending us events too
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
          }
          // Flush any queued commands
          pendingCommands.forEach(function (cmd) { postCommand(cmd.func, cmd.args); });
          pendingCommands = [];
        }
      }

      function destroyIframe() {
        if (iframe) {
          window.removeEventListener('message', onIframeMessage);
          iframe.src = 'about:blank';
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
          iframe = null;
        }
        isPlaying = false;
        isMuted = true;
        isPaused = false;
        isReady = false;
        pendingCommands = [];
        card.classList.remove('is-playing');
        var muteBtn = card.querySelector('.short-mute');
        var pauseBtn = card.querySelector('.short-pause');
        if (muteBtn)  { muteBtn.innerHTML = '🔇'; muteBtn.classList.remove('is-active'); }
        if (pauseBtn) { pauseBtn.innerHTML = '❚❚'; pauseBtn.classList.remove('is-active'); }
      }

      function postCommand(func, args) {
        if (!iframe || !iframe.contentWindow) return;
        var payload = JSON.stringify({ event: 'command', func: func, args: args || [] });
        // If iframe isn't ready yet, queue the command — avoids "no listener" warnings
        if (!isReady && func !== 'listen') {
          pendingCommands.push({ func: func, args: args || [] });
          return;
        }
        try {
          iframe.contentWindow.postMessage(payload, '*');
        } catch (err) {
          // Swallow cross-origin postMessage errors (harmless during teardown)
        }
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
            postCommand('setVolume', [100]);
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
    // Always prefer the first video's maxres thumbnail — guaranteed available, no API needed.
    // Fall back to hqdefault if maxres fails (some videos don't have HD).
    var firstVideoId = p.firstVideoId || p.videoId;
    var imgSrc = (firstVideoId ? thumbUrlHd(firstVideoId) : null) || p.thumb;
    if (imgSrc) {
      var img = el('img', { src: imgSrc, alt: p.title || 'Playlist thumbnail', loading: 'lazy' });
      img.style.opacity = '0';
      img.style.transition = 'opacity .4s';
      img.addEventListener('load', function () { img.style.opacity = '1'; });
      // Cascade fallback: maxres → hq → placeholder
      img.addEventListener('error', function () {
        if (firstVideoId && img.src !== thumbUrl(firstVideoId)) {
          img.src = thumbUrl(firstVideoId);
        } else {
          img.style.display = 'none';
        }
      });
      thumb.appendChild(img);
    }

    // YouTube-style overlay on right edge: stacked list icon + video count
    var overlay = el('div', { class: 'playlist-thumb-overlay' });
    if (p.videoCount != null) {
      overlay.appendChild(el('div', { class: 'playlist-count', html: String(p.videoCount) }));
    }
    overlay.appendChild(el('svg', { class: 'playlist-list-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true', html: '<path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/><path d="M20 14v8l-6-4 6-4z"/>' }));
    thumb.appendChild(overlay);

    // Hover overlay: large play button (YT-style)
    var playOverlay = el('div', { class: 'playlist-thumb-play' });
    playOverlay.appendChild(el('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', html: '<path d="M8 5v14l11-7z"/>' }));
    thumb.appendChild(playOverlay);
    card.appendChild(thumb);

    // Metadata block: title + channel + verified
    var info = el('div', { class: 'playlist-info' });
    info.appendChild(el('h3', { class: 'playlist-title', title: p.title || '' }, p.title || 'Playlist'));
    info.appendChild(el('div', { class: 'playlist-meta', html: 'Tuki Tales <span class="verified" aria-label="Verified">✓</span> · View full playlist' }));
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
        'data-brand': s.key,
        html: s.svg
      });
      if (!s.url) {
        a.addEventListener('click', function (e) { e.preventDefault(); });
      }
      wrap.appendChild(a);
    });
  }

  // ---------------- Slider arrows ----------------
  // Setup infinite scroll: clone cards and silently reset scrollLeft when
  // user scrolls past the original set. This makes the slider feel endless.
  function setupInfiniteScroll(track) {
    if (!track || track.dataset.infinite === '1') return;
    track.dataset.infinite = '1';
    track.classList.add('is-infinite');

    // Wait a frame so children are measured
    requestAnimationFrame(function () {
      var cards = Array.prototype.slice.call(track.children);
      if (!cards.length) return;
      // Clone each card and append
      cards.forEach(function (orig) {
        var clone = orig.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.classList.add('is-clone');
        track.appendChild(clone);
      });
      // Re-wire hover handlers on clones too
      setupShortsHoverPlay(track, true);
    });

    // On scroll, when we've scrolled past the original set, jump back to start.
    track.addEventListener('scroll', function () {
      var halfScroll = track.scrollWidth / 2;
      if (track.scrollLeft >= halfScroll) {
        // Silently jump back by half the scrollWidth (one set of clones)
        track.scrollLeft -= halfScroll;
      } else if (track.scrollLeft <= 0) {
        // Allow left-arrow users to loop forward by jumping ahead by half
        // (only trigger when scrollLeft is exactly 0 or negative)
      }
    }, { passive: true });
  }

  function setupSliderArrows(track) {
    var slider = track.closest('.slider');
    if (!slider) return;
    var prevBtn = slider.querySelector('.slider-prev');
    var nextBtn = slider.querySelector('.slider-next');
    if (!prevBtn || !nextBtn) return;
    var isInfinite = track.classList.contains('is-infinite');

    function updateButtons() {
      if (isInfinite) {
        // Infinite sliders never disable arrows
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        return;
      }
      var maxScroll = track.scrollWidth - track.clientWidth - 4;
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }
    function scrollByCards(dir) {
      var card = track.querySelector('.slider-card, .short-card');
      var cardW = card ? card.offsetWidth + 20 : 320;
      track.scrollBy({ left: dir * cardW * 1.5, behavior: 'smooth' });
    }
    prevBtn.addEventListener('click', function () {
      // For infinite slider: if at very start, jump to cloned section first
      if (isInfinite && track.scrollLeft <= 0) {
        track.scrollLeft = track.scrollWidth / 2;
        return;
      }
      scrollByCards(-1);
    });
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
      }
    }).catch(function () { /* seed data already rendered */ });

    fetchLatestVideos(10).then(function (videos) {
      if (videos && videos.length) {
        renderLatestSlider(videos);
        var statEl = $('#statVideos');
        if (statEl && videos.length) {
          // Show "X+" with a reasonable cap (e.g. 30+) since RSS returns ~15
          statEl.textContent = (videos.length >= 15 ? '15+' : videos.length);
        }
      }
    }).catch(function () { /* seed data already rendered */ });

    fetchShorts(12).then(function (shorts) {
      if (shorts && shorts.length) {
        renderShortsSlider(shorts);
      }
    }).catch(function () { /* seed data already rendered */ });

    fetchPlaylists().then(function (playlists) {
      if (playlists && playlists.length) {
        renderPlaylists(playlists);
      }
    }).catch(function () { /* seed data already rendered */ });
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
