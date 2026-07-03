document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav ---- */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('nav');
  var overlay = document.querySelector('.nav-overlay');
  function closeNav(){ nav.classList.remove('open'); overlay.classList.remove('open'); }
  function toggleNav(){ nav.classList.toggle('open'); overlay.classList.toggle('open'); }
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

  /* ---- Scroll reveals ---- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-pop');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1600, start = null;
        function step(ts){
          if (!start) start = ts;
          var progress = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var val = Math.floor(eased * target);
          el.textContent = val + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* ---- Magnetic buttons ---- */
  var magnets = document.querySelectorAll('.btn');
  magnets.forEach(function(btn){
    btn.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left - r.width/2;
      var y = e.clientY - r.top - r.height/2;
      btn.style.transform = 'translate(' + (x*0.18) + 'px,' + (y*0.35) + 'px)';
    });
    btn.addEventListener('mouseleave', function(){
      btn.style.transform = 'translate(0,0)';
    });
  });

  /* ---- Card glow follow + tilt physics ---- */
  document.querySelectorAll('.card').forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var mx = e.clientX - r.left, my = e.clientY - r.top;
      card.style.setProperty('--mx', mx + 'px');
      card.style.setProperty('--my', my + 'px');
      var rx = ((my / r.height) - 0.5) * -6;
      var ry = ((mx / r.width) - 0.5) * 6;
      card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });

  /* ---- Floating gradient tiles parallax ---- */
  var tiles = document.querySelectorAll('.g-tile');
  if (tiles.length) {
    window.addEventListener('mousemove', function(e){
      var cx = e.clientX / window.innerWidth - 0.5;
      var cy = e.clientY / window.innerHeight - 0.5;
      tiles.forEach(function(t, i){
        var depth = (i + 1) * 10;
        t.style.marginLeft = (cx * depth) + 'px';
        t.style.marginTop = (cy * depth) + 'px';
      });
    });
  }

  /* ---- Hero parallax ---- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = 'translateY(' + (y * 0.35) + 'px) scale(' + (1 + y*0.0002) + ')';
      }
    }, { passive:true });
  }
});
