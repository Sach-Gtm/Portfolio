/* ============================================================
   Sachin Gautam — portfolio v2
   Motion policy: one orchestrated load, reveals fire once,
   scroll-linked motion only on the timeline, nothing re-runs.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- theme ---------------- */
  var root = document.documentElement;
  var THEME_KEY = 'sg-theme';

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    if (window.__syncShaderTheme) window.__syncShaderTheme();
  }
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.setAttribute('data-theme', 'dark');
    }
  })();

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');

    var yr = $('#yr');
    if (yr) yr.textContent = String(new Date().getFullYear());

    var themeBtn = $('#themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    }

    initMenu();
    initReveals();
    initNavScroll();
    initCounters();
    initTimelineRail();
    initForm();
    initHeroArt();
    initParallax();
    initRoleRotator();
    initBooking();
  });

  /* ---------------- mobile menu ---------------- */
  function initMenu() {
    var burger = $('#burger'), links = $('#navLinks');
    if (!burger || !links) return;

    function close() {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', links).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------------- reveals (fire once) ---------------- */
  function initReveals() {
    var els = $$('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var group = en.target.parentNode;
        var idx = Array.prototype.indexOf.call(group.children, en.target);
        en.target.style.transitionDelay = Math.min(idx, 6) * 60 + 'ms';
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- nav: hide down / show up + active link ---------------- */
  function initNavScroll() {
    var nav = $('#nav');
    if (!nav) return;
    var last = window.scrollY, ticking = false;

    var linkMap = {};
    $$('#navLinks a').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id && id.charAt(0) === '#' && id.length > 1) linkMap[id.slice(1)] = a;
    });

    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle('solid', y > 20);
      if (y > last && y > 260 && !$('#navLinks').classList.contains('open')) nav.classList.add('hide');
      else nav.classList.remove('hide');
      last = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      var secs = Object.keys(linkMap).map(function (id) { return document.getElementById(id); }).filter(Boolean);
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var a = linkMap[en.target.id];
          if (a && en.isIntersecting) {
            $$('#navLinks a').forEach(function (x) { x.classList.remove('on'); });
            a.classList.add('on');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ---------------- metric count-up (once) ---------------- */
  function initCounters() {
    var els = $$('.mv');
    function render(el, val) {
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      var tr  = el.getAttribute('data-transform') || '';
      el.textContent = pre + val + suf + tr;
    }
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { render(el, el.getAttribute('data-to')); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, to = parseFloat(el.getAttribute('data-to')) || 0, t0 = null;
        function step(now) {
          if (t0 === null) t0 = now;
          var p = Math.min((now - t0) / 900, 1);
          render(el, Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- timeline rail (scroll-linked) ---------------- */
  function initTimelineRail() {
    var tl = $('#timeline'), fill = $('#railFill');
    if (!tl || !fill) return;
    if (reduce) { fill.style.height = '100%'; return; }

    var ticking = false;
    function update() {
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.72 - r.top) / (r.height + vh * 0.12);
      fill.style.height = Math.max(0, Math.min(1, p)) * 100 + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- contact form ---------------- */
  function initForm() {
    var form = $('#contactForm'), note = $('#formNote');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = (form.getAttribute('data-endpoint') || '').trim();
      var fd = new FormData(form);
      var name = (fd.get('name') || '').toString().trim();
      var email = (fd.get('email') || '').toString().trim();
      var msg = (fd.get('message') || '').toString().trim();

      note.className = 'form-note';

      if (!endpoint) {
        // No backend wired yet — hand off to the visitor's mail client so nothing is lost.
        var subject = encodeURIComponent('Portfolio enquiry from ' + (name || 'someone'));
        var body = encodeURIComponent(msg + '\n\n— ' + name + '\n' + email);
        window.location.href = 'mailto:Sachin.gautam8292@gmail.com?subject=' + subject + '&body=' + body;
        note.textContent = 'Opening your email app…';
        return;
      }

      var btn = $('button[type=submit]', form);
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      note.textContent = '';

      fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('bad status');
          form.reset();
          note.textContent = 'Thanks — message sent. I usually reply within a day.';
        })
        .catch(function () {
          note.className = 'form-note err';
          note.textContent = 'That didn’t send. Email me directly at Sachin.gautam8292@gmail.com.';
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  /* ---------------- book a 1:1 (emails Sachin) ---------------- */
  function initBooking() {
    var form = $('#bookForm'), note = $('#bookNote');
    if (!form) return;
    var to = form.getAttribute('data-to') || 'sachin.gautam8292@gmail.com';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = (fd.get('name') || '').toString().trim();
      var email = (fd.get('email') || '').toString().trim();
      var topic = (fd.get('topic') || '').toString().trim();
      var when = (fd.get('when') || '').toString().trim();
      var endpoint = (form.getAttribute('data-endpoint') || '').trim();
      note.className = 'form-note';

      if (endpoint) {
        var btn = $('button[type=submit]', form), label = btn.textContent;
        btn.disabled = true; btn.textContent = 'Sending…';
        fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw 0; form.reset();
            note.textContent = 'Sent — Sachin will confirm your slot by email.'; })
          .catch(function () { note.className = 'form-note err';
            note.textContent = 'Couldn’t send. Email ' + to + ' directly.'; })
          .finally(function () { btn.disabled = false; btn.textContent = label; });
        return;
      }

      // No backend: open a pre-filled email addressed to Sachin.
      var subject = encodeURIComponent('1:1 session request — ' + (name || 'someone'));
      var body = encodeURIComponent(
        'Hi Sachin, I\'d like to book a 1:1.\n\n' +
        'Name: ' + name + '\nEmail: ' + email + '\nTopic: ' + topic +
        '\nPreferred time: ' + when + '\n');
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      note.textContent = 'Opening your email app to send the request…';
    });
  }

  /* ---------------- hero parallax (depth on pointer move) ---------------- */
  function initParallax() {
    var stage = $('#stage');
    if (!stage || reduce) return;
    var layers = $$('[data-depth]', stage);
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    function onMove(e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / r.width);
      ty = ((e.clientY - (r.top + r.height / 2)) / r.height);
      if (!raf) raf = requestAnimationFrame(apply);
    }
    function apply() {
      raf = null;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 0;
        el.style.translate = (cx * d) + 'px ' + (cy * d) + 'px';
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(apply);
    }
    window.addEventListener('pointermove', onMove, { passive: true });
  }

  /* ---------------- hero role rotator ---------------- */
  function initRoleRotator() {
    var el = $('#roleRot');
    if (!el) return;
    var roles = ['Software Engineer', 'Founder', 'Builder', 'Problem-solver'];
    if (reduce) return;
    var i = 0;
    setInterval(function () {
      el.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % roles.length;
        el.textContent = roles[i];
        el.classList.remove('out');
      }, 300);
    }, 2600);
  }

  /* ============================================================
     HERO ART — raymarched signed-distance field.
     Geometry is described mathematically in the shader, so the
     whole illustration is ~4KB of text with no model to download.
     ============================================================ */
  function initHeroArt() {
    var cvs = $('#heroCanvas');
    if (!cvs) return;
    var frame = cvs.parentNode;

    function bail() { frame.classList.add('fallback'); cvs.style.display = 'none'; }
    if (reduce) { bail(); return; }

    var gl = null;
    try {
      gl = cvs.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
    } catch (e) {}
    if (!gl) { bail(); return; }

    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
    var FS = [
      'precision highp float;',
      'uniform vec2 uRes; uniform float uT; uniform vec2 uM;',
      'uniform vec3 uBg, uInk, uAcc, uSky;',
      'mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}',
      'float sdBox(vec3 p, vec3 b, float r){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r;}',
      'float sdSph(vec3 p,float r){return length(p)-r;}',
      'float sdTor(vec3 p, vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}',
      'float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}',
      'float map(vec3 p){',
      '  vec3 q=p; q.xz*=rot(uT*0.26); q.xy*=rot(uT*0.17);',
      '  float d=sdBox(q, vec3(0.50), 0.20);',
      '  vec3 s=p; s.xz*=rot(-uT*0.42);',
      '  d=min(d, sdSph(s-vec3(1.18,0.18,0.0),0.185));',
      '  vec3 t=p; t.yz*=rot(1.02+uT*0.13); t.xy*=rot(uT*0.09);',
      '  d=min(d, sdTor(t, vec2(1.34,0.038)));',
      '  return d;',
      '}',
      'vec3 nrm(vec3 p){vec2 e=vec2(0.0012,0.0);return normalize(vec3(',
      '  map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx)));}',
      'float ao(vec3 p, vec3 n){float o=0.0,s=1.0;for(int i=0;i<5;i++){float h=0.02+0.11*float(i);',
      '  o+=(h-map(p+n*h))*s; s*=0.72;} return clamp(1.0-1.4*o,0.0,1.0);}',
      'float sha(vec3 ro, vec3 rd){float r=1.0,t=0.06;for(int i=0;i<26;i++){float h=map(ro+rd*t);',
      '  if(h<0.001) return 0.0; r=min(r,9.0*h/t); t+=clamp(h,0.02,0.22); if(t>5.0) break;} return clamp(r,0.0,1.0);}',
      'void main(){',
      '  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/min(uRes.x,uRes.y);',
      '  vec3 ro=vec3(uM.x*0.50, uM.y*0.38, 8.60);',
      '  vec3 f=normalize(-ro), rt=normalize(cross(vec3(0.0,1.0,0.0),f)), u=cross(f,rt);',
      '  vec3 rd=normalize(uv.x*rt+uv.y*u+2.05*f);',
      '  float t=0.0, hit=0.0;',
      '  for(int i=0;i<86;i++){ float d=map(ro+rd*t);',
      '    if(d<0.0012){hit=1.0;break;} t+=d*0.92; if(t>9.0) break; }',
      '  vec3 col=uBg;',
      '  if(hit>0.5){',
      '    vec3 p=ro+rd*t, n=nrm(p);',
      '    vec3 ld=normalize(vec3(-0.55,0.82,0.62));',
      '    float dif=clamp(dot(n,ld),0.0,1.0);',
      '    float sh=sha(p+n*0.012, ld);',
      '    float occ=ao(p,n);',
      '    float fres=pow(1.0-clamp(dot(n,-rd),0.0,1.0),3.2);',
      '    float rim=clamp(dot(n,normalize(vec3(0.85,0.30,-0.45))),0.0,1.0);',
      '    vec3 base=mix(uBg, vec3(1.0), 0.72);',
      '    vec3 sur=base*(0.60+0.46*dif*mix(0.62,1.0,sh))*mix(0.80,1.0,occ);',
      '    sur=mix(sur, uInk, (1.0-dif)*0.26*mix(0.55,1.0,1.0-occ));',
      '    sur+=uAcc*pow(rim,1.9)*0.46;',
      '    sur+=uSky*fres*0.30;',
      '    float spec=pow(clamp(dot(reflect(-ld,n),-rd),0.0,1.0),42.0);',
      '    sur+=vec3(1.0)*spec*0.30*sh;',
      '    col=sur;',
      '  }',
      '  col*=1.0-0.16*dot(uv,uv);',
      '  col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-0.5)*0.012;',
      '  gl_FragColor=vec4(col, hit>0.5?0.97:0.0);',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { bail(); return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { bail(); return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var pLoc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var uRes = gl.getUniformLocation(prog, 'uRes'), uT = gl.getUniformLocation(prog, 'uT'),
        uM = gl.getUniformLocation(prog, 'uM'), uBg = gl.getUniformLocation(prog, 'uBg'),
        uInk = gl.getUniformLocation(prog, 'uInk'), uAcc = gl.getUniformLocation(prog, 'uAcc'),
        uSky = gl.getUniformLocation(prog, 'uSky');

    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    function resize() {
      var w = cvs.clientWidth, h = cvs.clientHeight;
      cvs.width = Math.max(1, (w * dpr) | 0);
      cvs.height = Math.max(1, (h * dpr) | 0);
      gl.viewport(0, 0, cvs.width, cvs.height);
      gl.uniform2f(uRes, cvs.width, cvs.height);
    }
    window.addEventListener('resize', resize);
    resize();

    window.__syncShaderTheme = function () {
      var cs = getComputedStyle(root);
      function v(name, fallback) {
        var s = cs.getPropertyValue(name).trim();
        return s ? s.split(',').map(Number) : fallback;
      }
      var bg = v('--gl-bg', [.894, .953, .996]),
          ink = v('--gl-ink', [.024, .165, .267]),
          acc = v('--gl-acc', [1, .788, .302]),
          sky = v('--gl-sky', [.220, .741, .972]);
      gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
      gl.uniform3f(uAcc, acc[0], acc[1], acc[2]);
      gl.uniform3f(uSky, sky[0], sky[1], sky[2]);
    };
    window.__syncShaderTheme();

    var mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Only render while the hero is actually on screen.
    var onScreen = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; })
        .observe(frame);
    }
    var visible = true;
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

    var t0 = performance.now();
    (function frameLoop(now) {
      requestAnimationFrame(frameLoop);
      if (!visible || !onScreen) return;
      mx += (tx - mx) * 0.045; my += (ty - my) * 0.045;
      gl.uniform2f(uM, mx, my);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    })(t0);
  }
})();
