document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav ---- */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('nav');
  var overlay = document.querySelector('.nav-overlay');
  function setBurgerState(open){
    if (!burger) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  function closeNav(){ nav.classList.remove('open'); overlay.classList.remove('open'); setBurgerState(false); }
  function toggleNav(){
    var open = nav.classList.toggle('open');
    overlay.classList.toggle('open', open);
    setBurgerState(open);
  }
  if (burger) burger.addEventListener('click', toggleNav);
  if (overlay) overlay.addEventListener('click', closeNav);
  document.querySelectorAll('nav a').forEach(function(a){ a.addEventListener('click', closeNav); });

  /* ---- Header scroll state ---- */
  var header = document.querySelector('header');
  function onScroll(){
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  var hasGSAP = (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasGSAP && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    /* ---- Scroll reveals: real timeline, not just fade ---- */
    gsap.utils.toArray('.reveal').forEach(function(el){
      gsap.fromTo(el,
        { opacity:0, y:46 },
        {
          opacity:1, y:0, duration:1, ease:'power3.out',
          scrollTrigger:{ trigger: el, start:'top 88%', toggleActions:'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.reveal-pop').forEach(function(el){
      gsap.fromTo(el,
        { opacity:0, y:60, scale:0.9, rotate:-2 },
        {
          opacity:1, y:0, scale:1, rotate:0, duration:1.1, ease:'back.out(1.5)',
          scrollTrigger:{ trigger: el, start:'top 85%', toggleActions:'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.reveal-stagger').forEach(function(group){
      var items = group.children;
      gsap.fromTo(items,
        { opacity:0, y:36 },
        {
          opacity:1, y:0, duration:0.85, ease:'power3.out', stagger:0.12,
          scrollTrigger:{ trigger: group, start:'top 85%', toggleActions:'play none none none' }
        }
      );
    });

    /* ---- Animated counters, GSAP-timed ---- */
    gsap.utils.toArray('[data-count]').forEach(function(el){
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el, start:'top 90%', once:true,
        onEnter: function(){
          gsap.to(obj, {
            val: target, duration:1.7, ease:'power2.out',
            onUpdate: function(){ el.textContent = Math.floor(obj.val) + suffix; },
            onComplete: function(){ el.textContent = target + suffix; }
          });
        }
      });
    });

    /* ---- Hero: scroll-scrubbed parallax + zoom ---- */
    document.querySelectorAll('.hero-bg').forEach(function(bg){
      var hero = bg.closest('.hero');
      gsap.to(bg, {
        yPercent: 22, scale: 1.12, ease:'none',
        scrollTrigger:{ trigger: hero, start:'top top', end:'bottom top', scrub:0.6 }
      });
    });

    /* ---- Section background image overlays: slow drift as they scroll through ---- */
    document.querySelectorAll('.section-bg').forEach(function(sec){
      var img = sec.querySelector('.section-bg-img');
      if (!img) return;
      gsap.fromTo(img, { scale:1.08, yPercent:-6 }, {
        scale:1, yPercent:6, ease:'none',
        scrollTrigger:{ trigger: sec, start:'top bottom', end:'bottom top', scrub:0.8 }
      });
    });

    /* ---- Pin the stat strip briefly while counters resolve ---- */
    var statStrip = document.querySelector('.stat-strip');
    if (statStrip && window.innerWidth > 900) {
      ScrollTrigger.create({
        trigger: statStrip.closest('section'),
        start:'top 20%', end:'+=200', pin:true, pinSpacing:true
      });
    }

    /* ---- Gradient tile ring: GSAP timeline instead of CSS keyframes ---- */
    document.querySelectorAll('.tile-ring').forEach(function(ring){
      var tiles = ring.querySelectorAll('.g-tile');
      tiles.forEach(function(tile, i){
        gsap.to(tile, {
          x: (i % 2 === 0 ? 1 : -1) * (60 + i * 20),
          y: (i % 3 === 0 ? -1 : 1) * (30 + i * 14),
          rotate: (i % 2 === 0 ? 1 : -1) * 8,
          duration: 5 + i, ease:'sine.inOut', yoyo:true, repeat:-1,
          delay: i * 0.4
        });
      });
      gsap.from(ring, {
        opacity:0, scale:0.85, duration:1.2, ease:'power3.out',
        scrollTrigger:{ trigger: ring, start:'top 85%' }
      });
    });

  } else {
    /* ---- Fallback: no GSAP loaded, just show content ---- */
    document.querySelectorAll('.reveal, .reveal-pop').forEach(function(el){
      el.style.opacity = 1; el.style.transform = 'none';
    });
    document.querySelectorAll('.reveal-stagger').forEach(function(g){
      Array.prototype.forEach.call(g.children, function(c){ c.style.opacity = 1; c.style.transform='none'; });
    });
  }

  /* ---- Magnetic buttons ---- */
  document.querySelectorAll('.btn').forEach(function(btn){
    if (reduceMotion) return;
    btn.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left - r.width/2;
      var y = e.clientY - r.top - r.height/2;
      if (hasGSAP) {
        gsap.to(btn, { x:x*0.18, y:y*0.35, duration:0.3, ease:'power2.out' });
      } else {
        btn.style.transform = 'translate(' + (x*0.18) + 'px,' + (y*0.35) + 'px)';
      }
    });
    btn.addEventListener('mouseleave', function(){
      if (hasGSAP) gsap.to(btn, { x:0, y:0, duration:0.4, ease:'power3.out' });
      else btn.style.transform = 'translate(0,0)';
    });
  });

  /* ---- Card glow follow + tilt physics ---- */
  document.querySelectorAll('.card').forEach(function(card){
    if (reduceMotion) return;
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var mx = e.clientX - r.left, my = e.clientY - r.top;
      card.style.setProperty('--mx', mx + 'px');
      card.style.setProperty('--my', my + 'px');
      var rx = ((my / r.height) - 0.5) * -6;
      var ry = ((mx / r.width) - 0.5) * 6;
      if (hasGSAP) {
        gsap.to(card, { rotateX:rx, rotateY:ry, y:-8, duration:0.4, ease:'power2.out', transformPerspective:800 });
      } else {
        card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px)';
      }
    });
    card.addEventListener('mouseleave', function(){
      if (hasGSAP) gsap.to(card, { rotateX:0, rotateY:0, y:0, duration:0.5, ease:'power3.out' });
      else card.style.transform = '';
    });
  });
});
