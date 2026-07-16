/* Patriot's Plumbing — site behavior
   Form wizard + photo compression + streaming chat advisor. No dependencies. */
(function () {
  'use strict';

  var API_BASE = 'https://patriots-plumbing-api.onrender.com';
  var PHONE_DISPLAY = '(276) 285-1392';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // Progressive enhancement flag: reveal-on-scroll only engages when JS runs.
  document.body.classList.add('js');

  // Warm the free-tier API the moment anyone lands on the page.
  try { fetch(API_BASE + '/api/health').catch(function () {}); } catch (e) {}

  /* ======================== nav ======================== */

  var nav = $('#nav');
  var navtoggle = $('#navtoggle');
  if (navtoggle) {
    navtoggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navtoggle.setAttribute('aria-expanded', String(open));
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navtoggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ======================== reveal on scroll ======================== */

  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ======================== mobile action bar ======================== */

  var mobilebar = $('#mobilebar');
  var hero = $('.hero');
  if (mobilebar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      mobilebar.classList.toggle('is-show', !entries[0].isIntersecting && !chatOpen);
    }, { threshold: 0.05 }).observe(hero);
  }

  /* ======================== lead form wizard ======================== */

  var form = $('#leadform');
  var steps = $$('.step', form);
  var progress = $$('.lead-card__progress span');
  var formError = $('#formerror');
  var loadedAt = Date.now();

  var lead = { problem: '', timing: '', photos: [] };

  function showStep(id) {
    steps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') === String(id)); });
    var n = Number(id);
    if (!isNaN(n)) {
      progress.forEach(function (seg, i) { seg.classList.toggle('is-on', i < n); });
    } else {
      progress.forEach(function (seg) { seg.classList.add('is-on'); });
    }
    hideError();
  }

  function showError(msg) { formError.textContent = msg; formError.hidden = false; }
  function hideError() { formError.hidden = true; }

  // Step 1: problem chips (auto-advance)
  $$('.chip[data-problem]', form).forEach(function (chip) {
    chip.addEventListener('click', function () {
      $$('.chip[data-problem]', form).forEach(function (c) { c.classList.remove('is-selected'); });
      chip.classList.add('is-selected');
      lead.problem = chip.getAttribute('data-problem');
      setTimeout(function () { showStep(2); }, 160);
    });
  });

  // Timing chips (toggle, single-select)
  $$('.chip--timing', form).forEach(function (chip) {
    chip.addEventListener('click', function () {
      var was = chip.classList.contains('is-selected');
      $$('.chip--timing', form).forEach(function (c) { c.classList.remove('is-selected'); });
      if (!was) { chip.classList.add('is-selected'); lead.timing = chip.getAttribute('data-timing'); }
      else { lead.timing = ''; }
    });
  });

  $$('[data-next]', form).forEach(function (b) { b.addEventListener('click', function () { showStep(3); }); });
  $$('[data-back]', form).forEach(function (b) {
    b.addEventListener('click', function () {
      var cur = $('.step.is-active', form).getAttribute('data-step');
      showStep(cur === '3' ? 2 : 1);
    });
  });
  $$('[data-reset]', form).forEach(function (b) {
    b.addEventListener('click', function () {
      form.reset();
      lead = { problem: '', timing: '', photos: [] };
      renderThumbs();
      $$('.chip', form).forEach(function (c) { c.classList.remove('is-selected'); });
      showStep(1);
    });
  });

  /* ---- photos: pick, drop, compress ---- */

  var dropzone = $('#dropzone');
  var fileInput = $('#photos');
  var thumbs = $('#thumbs');

  function openPicker() { fileInput.click(); }
  dropzone.addEventListener('click', openPicker);
  dropzone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(); } });
  fileInput.addEventListener('change', function () { addFiles(fileInput.files); fileInput.value = ''; });

  ['dragover', 'dragenter'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('is-drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('is-drag'); });
  });
  dropzone.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });

  function addFiles(list) {
    Array.prototype.slice.call(list).forEach(function (file) {
      if (!/^image\//.test(file.type)) return;
      if (lead.photos.length >= 6) return;
      compressImage(file).then(function (blob) {
        if (lead.photos.length >= 6) return;
        lead.photos.push({ blob: blob, url: URL.createObjectURL(blob) });
        renderThumbs();
      }).catch(function () {
        // fall back to the original file if canvas fails
        lead.photos.push({ blob: file, url: URL.createObjectURL(file) });
        renderThumbs();
      });
    });
  }

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        try {
          var max = 1600;
          var scale = Math.min(1, max / Math.max(img.width, img.height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(function (blob) {
            URL.revokeObjectURL(img.src);
            if (blob && blob.size < file.size) resolve(blob); else resolve(file);
          }, 'image/jpeg', 0.8);
        } catch (err) { reject(err); }
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  function renderThumbs() {
    thumbs.innerHTML = '';
    lead.photos.forEach(function (p, i) {
      var wrap = document.createElement('div');
      wrap.className = 'thumb';
      var img = document.createElement('img');
      img.src = p.url; img.alt = 'photo ' + (i + 1);
      var x = document.createElement('button');
      x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Remove photo ' + (i + 1));
      x.addEventListener('click', function () {
        URL.revokeObjectURL(p.url);
        lead.photos.splice(i, 1);
        renderThumbs();
      });
      wrap.appendChild(img); wrap.appendChild(x);
      thumbs.appendChild(wrap);
    });
  }

  /* ---- submit ---- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#f-name').value.trim();
    var phone = $('#f-phone').value.trim();
    if (name.length < 2) { showError('Please tell us your name.'); $('#f-name').focus(); return; }
    if (phone.replace(/\D/g, '').length < 7) { showError('Please enter a valid phone number.'); $('#f-phone').focus(); return; }

    var btn = $('#submitbtn');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var fd = new FormData();
    fd.append('name', name);
    fd.append('phone', phone);
    fd.append('address', $('#f-address').value.trim());
    fd.append('details', $('#details').value.trim());
    fd.append('problem', lead.problem || 'Service request');
    fd.append('timing', lead.timing);
    fd.append('source', 'website');
    fd.append('company', $('#company').value); // honeypot
    fd.append('elapsed_ms', String(Date.now() - loadedAt));
    var transcript = chatTranscriptForLead();
    if (transcript) fd.append('chat', transcript);
    lead.photos.forEach(function (p, i) { fd.append('photos', p.blob, 'photo-' + (i + 1) + '.jpg'); });

    fetch(API_BASE + '/api/lead', { method: 'POST', body: fd })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.j && r.j.error || 'failed');
        $('#success-title').textContent = 'Got it, ' + name.split(' ')[0] + '.';
        $('#success-copy').textContent = 'Your request is in' +
          (lead.photos.length ? ' with ' + lead.photos.length + ' photo' + (lead.photos.length > 1 ? 's' : '') : '') +
          '. We’ll call you at ' + phone + '.';
        showStep('done');
      })
      .catch(function (err) {
        showError((err && err.message) !== 'failed' && err.message ? err.message
          : 'Something went wrong sending your request. Please try again or call ' + PHONE_DISPLAY + '.');
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'Send request';
      });
  });

  /* ---- service cards prefill the form ---- */

  $$('.svc__go').forEach(function (b) {
    b.addEventListener('click', function () {
      var problem = b.getAttribute('data-problem');
      var chip = $('.chip[data-problem="' + problem + '"]', form);
      if (chip) chip.click();
      document.getElementById('request').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ======================== chat ======================== */

  var chatEl = $('#chat');
  var chatlaunch = $('#chatlaunch');
  var chatlog = $('#chatlog');
  var chatform = $('#chatform');
  var chatinput = $('#chatinput');
  var chatstarters = $('#chatstarters');
  var chatOpen = false;
  var chatBusy = false;
  var history = [];

  try {
    history = JSON.parse(sessionStorage.getItem('pp_chat') || '[]');
    if (!Array.isArray(history)) history = [];
  } catch (e) { history = []; }

  function saveHistory() {
    try { sessionStorage.setItem('pp_chat', JSON.stringify(history.slice(-30))); } catch (e) {}
  }

  function chatTranscriptForLead() {
    if (!history.length) return '';
    return history.map(function (m) {
      return (m.role === 'user' ? 'Customer: ' : 'Assistant: ') + m.content;
    }).join('\n');
  }

  function addBubble(role, text) {
    var div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'msg--user' : 'msg--bot');
    div.textContent = text;
    chatlog.appendChild(div);
    chatlog.scrollTop = chatlog.scrollHeight;
    return div;
  }

  function greet() {
    if (chatlog.children.length) return;
    if (history.length) {
      history.forEach(function (m) { addBubble(m.role, m.content); });
    } else {
      addBubble('bot', 'Welcome to Patriot’s Plumbing. Tell me what’s going on with your plumbing and I’ll point you in the right direction — or answer any question about our work.');
    }
    chatstarters.style.display = history.length ? 'none' : '';
  }

  function openChat() {
    chatEl.hidden = false;
    chatlaunch.style.display = 'none';
    chatlaunch.setAttribute('aria-expanded', 'true');
    chatOpen = true;
    if (mobilebar) mobilebar.classList.remove('is-show');
    greet();
    setTimeout(function () { chatinput.focus(); }, 120);
  }

  function closeChat() {
    chatEl.hidden = true;
    chatlaunch.style.display = '';
    chatlaunch.setAttribute('aria-expanded', 'false');
    chatOpen = false;
  }

  chatlaunch.addEventListener('click', openChat);
  $('#chatclose').addEventListener('click', closeChat);
  $$('[data-open-chat]').forEach(function (b) { b.addEventListener('click', openChat); });

  $$('button', chatstarters).forEach(function (b) {
    b.addEventListener('click', function () { sendMessage(b.textContent.trim()); });
  });

  // autosize the input
  chatinput.addEventListener('input', function () {
    chatinput.style.height = 'auto';
    chatinput.style.height = Math.min(chatinput.scrollHeight, 110) + 'px';
  });

  chatinput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatform.requestSubmit(); }
  });

  chatform.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = chatinput.value.trim();
    if (text) sendMessage(text);
  });

  function sendMessage(text) {
    if (chatBusy) return;
    chatBusy = true;
    chatstarters.style.display = 'none';
    chatinput.value = '';
    chatinput.style.height = 'auto';

    addBubble('user', text);
    history.push({ role: 'user', content: text });
    saveHistory();

    var bot = addBubble('bot', '');
    bot.classList.add('is-typing');
    var gotFirst = false;
    var slowTimer = setTimeout(function () {
      if (!gotFirst) bot.textContent = 'Connecting — waking our assistant up…';
    }, 6000);

    fetch(API_BASE + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-20) }),
    }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('bad response');
      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';
      var answer = '';

      function pump() {
        return reader.read().then(function (step) {
          if (step.done) return finish(answer, null);
          buffer += decoder.decode(step.value, { stream: true });
          var lines = buffer.split('\n\n');
          buffer = lines.pop();
          lines.forEach(function (line) {
            if (line.indexOf('data: ') !== 0) return;
            var payload;
            try { payload = JSON.parse(line.slice(6)); } catch (err) { return; }
            if (payload.t) {
              if (!gotFirst) { gotFirst = true; clearTimeout(slowTimer); bot.classList.remove('is-typing'); bot.textContent = ''; }
              answer += payload.t;
              bot.textContent = answer;
              chatlog.scrollTop = chatlog.scrollHeight;
            }
            if (payload.error) return finish(answer, payload.error);
          });
          return pump();
        });
      }
      return pump();
    }).catch(function () {
      finish('', 'I’m having trouble connecting right now. Please call us at ' + PHONE_DISPLAY + ' or use the Request service form on this page.');
    });

    function finish(answer, errText) {
      clearTimeout(slowTimer);
      bot.classList.remove('is-typing');
      if (errText && !answer) {
        bot.textContent = errText;
        answer = errText;
      }
      if (answer) {
        history.push({ role: 'assistant', content: answer });
        saveHistory();
      } else if (!bot.textContent) {
        bot.remove();
      }
      chatBusy = false;
      chatlog.scrollTop = chatlog.scrollHeight;
    }
  }

  // Chat → lead form handoff: prefill details with the conversation context.
  $$('[data-chat-handoff]').forEach(function (b) {
    b.addEventListener('click', function () {
      closeChat();
      var lastUser = '';
      for (var i = history.length - 1; i >= 0; i--) {
        if (history[i].role === 'user') { lastUser = history[i].content; break; }
      }
      var details = $('#details');
      if (lastUser && !details.value) details.value = lastUser;
      document.getElementById('request').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

})();
