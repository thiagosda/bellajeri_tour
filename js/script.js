// ── NAV SCROLL ──
var nav=document.getElementById('nav');
window.addEventListener('scroll',function(){nav.classList.toggle('on',window.scrollY>60);});

// ── MOBILE MENU ──
var mm=document.getElementById('mm');
var burger=document.getElementById('burger');
burger.addEventListener('click',function(){
  mm.classList.toggle('open');
  burger.classList.toggle('open');
});
function closeMenu(){
  mm.classList.remove('open');
  burger.classList.remove('open');
}

// ── SCROLL REVEAL (IntersectionObserver) ──
var io=new IntersectionObserver(function(entries){
  var appearing = entries.filter(function(e){ return e.isIntersecting; });
  appearing.forEach(function(e, idx){
    var el = e.target;
    el.classList.add('in');
    io.unobserve(el);
  });
},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rev,.rev-l,.rev-r').forEach(function(el){io.observe(el);});

// ── COUNTER ANIMATION ──
var counted=false;
function animateCounters(){
  if(counted)return;
  var nums=document.querySelectorAll('.count-up');
  if(!nums.length)return;
  counted=true;
  nums.forEach(function(el){
    var target=parseInt(el.dataset.target)||0;
    var suffix=el.dataset.suffix||'';
    var dur=1200;
    var start=0;
    var startTime=null;
    function step(ts){
      if(!startTime)startTime=ts;
      var p=Math.min((ts-startTime)/dur,1);
      var ease=1-Math.pow(1-p,3);
      el.textContent=Math.floor(ease*target)+suffix;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
var cio=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting)animateCounters();});
},{threshold:0.3});
var trustEl=document.querySelector('.trust-in');
if(trustEl)cio.observe(trustEl);

// ── FAQ ──
function tFaq(btn){
  var item=btn.parentElement;
  var open=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});
  if(!open)item.classList.add('open');
}

// ── LIGHTBOX ──
function openLB(src,alt){
  document.getElementById('lb-img').src=src;
  document.getElementById('lb-img').alt=alt||'';
  document.getElementById('lb').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeLB(){
  document.getElementById('lb').classList.remove('on');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLB();});

// ── ACTIVE NAV LINK ──
(function(){
  var secs=document.querySelectorAll('section[id]');
  var links=document.querySelectorAll('.nav-links a[href^="#"]');
  var io2=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var id=e.target.id;
        links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+id);});
      }
    });
  },{rootMargin:'-40% 0px -50% 0px'});
  secs.forEach(function(s){io2.observe(s);});
})();

// ── PARALLAX (lightweight, mobile-safe) ──
var heroImg=document.querySelector('.hero-img');
var frotaImg=document.querySelector('.frota-bg-img img');

if(window.innerWidth>768){
  var ticking=false;
  window.addEventListener('scroll',function(){
    if(!ticking){
      requestAnimationFrame(function(){
        var y=window.scrollY;
        // Hero Parallax
        if(heroImg && y<window.innerHeight){
          heroImg.style.transform='scale(1.08) translateY('+y*0.15+'px)';
        }
        // Frota Parallax
        if(frotaImg){
          var frotaSec = document.querySelector('.frota-sec');
          if(frotaSec){
            var rect = frotaSec.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0){
              // Center the movement relative to the section's position
              var offset = (window.innerHeight - rect.top) * 0.08;
              frotaImg.style.transform='translateY('+offset+'px)';
            }
          }
        }
        ticking=false;
      });
      ticking=true;
    }
  });
}

// ── CARROSSEL DOS CARDS DE PASSEIO ──
(function(){
  document.querySelectorAll('[data-carousel]').forEach(function(wrap){
    var slides = wrap.querySelectorAll('.carousel-slide');
    var dots   = wrap.querySelectorAll('.cdot');
    var prev   = wrap.querySelector('.carousel-prev');
    var next   = wrap.querySelector('.carousel-next');
    var current = 0;
    var total   = slides.length;
    if(total < 2) return;

    function goTo(idx){
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (idx + total) % total;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }

    if(prev) prev.addEventListener('click', function(e){ e.stopPropagation(); goTo(current - 1); });
    if(next) next.addEventListener('click', function(e){ e.stopPropagation(); goTo(current + 1); });

    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(e){ e.stopPropagation(); goTo(i); });
    });

    // Auto-play contínuo a cada 3.5s
    var timer = setInterval(function(){ goTo(current + 1); }, 3500);

    // Pausa no hover para permitir leitura/visualização
    wrap.addEventListener('mouseenter', function(){ clearInterval(timer); });
    wrap.addEventListener('mouseleave', function(){ 
      timer = setInterval(function(){ goTo(current + 1); }, 3500); 
    });

    // Swipe touch
    var touchStartX = 0;
    wrap.addEventListener('touchstart', function(e){ 
      clearInterval(timer); 
      touchStartX = e.changedTouches[0].clientX; 
    }, {passive:true});
    
    wrap.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - touchStartX;
      if(Math.abs(dx) > 40){ goTo(dx < 0 ? current + 1 : current - 1); }
      timer = setInterval(function(){ goTo(current + 1); }, 3500);
    }, {passive:true});
  });
})();

// ── LINHA DA TIMELINE (Como Funciona) ──
(function(){
  var cfSec = document.querySelector('.cf-section');
  if(!cfSec) return;
  var lineObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ cfSec.classList.add('line-in'); lineObs.disconnect(); }
    });
  },{threshold:0.18});
  lineObs.observe(cfSec);
})();

// ── GOOGLE REVIEWS (Places API) ──
(function () {
  window.initGoogleReviews = function () {
    var cont = document.getElementById('google-reviews-container');
    var load = document.getElementById('reviews-loading');
    if (!cont || typeof google === 'undefined') return;

    var svc = new google.maps.places.PlacesService(document.createElement('div'));

    svc.findPlaceFromQuery(
      { query: 'Bella Jeri Tour Jericoacoara', fields: ['place_id'] },
      function (res, st) {
        if (st !== google.maps.places.PlacesServiceStatus.OK || !res || !res.length) {
          grFallback(cont, load); return;
        }
        svc.getDetails(
          { placeId: res[0].place_id, fields: ['reviews', 'url', 'user_ratings_total', 'rating'], language: 'pt-BR' },
          function (place, st2) {
            if (st2 !== google.maps.places.PlacesServiceStatus.OK || !place) {
              grFallback(cont, load); return;
            }
            grRender(place, cont, load);
          }
        );
      }
    );
  };

  function grRender(place, cont, load) {
    if (load) load.remove();

    var reviews = (place.reviews || []).filter(function (r) { return r.text && r.text.trim(); });
    if (!reviews.length) { grFallback(cont, null); return; }

    // Melhores avaliações primeiro
    reviews.sort(function (a, b) { return b.rating - a.rating || b.time - a.time; });

    var frag = document.createDocumentFragment();
    reviews.forEach(function (r, i) { frag.appendChild(grCard(r, i)); });
    cont.appendChild(frag);

    // Atribuição obrigatória pelos Termos de Uso da API do Google
    var attr = document.createElement('div');
    attr.className = 'gr-attr';
    attr.innerHTML =
      '<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="16" height="16">' +
        '<path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>' +
        '<path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>' +
        '<path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>' +
        '<path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>' +
      '</svg>' +
      '<span>Avaliações verificadas pelo Google</span>';
    cont.parentNode.insertBefore(attr, cont.nextSibling);

    // Scroll reveal nos novos cards
    cont.querySelectorAll('.dep').forEach(function (el) { io.observe(el); });
  }

  function grCard(r, i) {
    var card = document.createElement('div');
    card.className = 'dep rev';
    card.style.transitionDelay = (i * 0.09) + 's';

    // Estrelas
    var stars = '';
    for (var s = 1; s <= 5; s++) {
      stars += '<span style="color:' + (s <= r.rating ? '#d4920a' : '#dce0d8') + '">★</span>';
    }

    // Texto truncado
    var txt = (r.text || '').trim();
    if (txt.length > 320) txt = txt.slice(0, 320) + '\u2026';

    // Iniciais para avatar de fallback
    var inits = (r.author_name || '?')
      .split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (n) { return n[0].toUpperCase(); }).join('');

    // Avatar: foto do Google ou iniciais
    var errH = "this.style.display='none';this.nextSibling.style.display='flex';";
    var avHTML = r.profile_photo_url
      ? '<img src="' + r.profile_photo_url + '" alt="" class="dep-av-img" onerror="' + errH + '">' +
        '<span class="dep-av-ini" style="display:none">' + inits + '</span>'
      : '<span class="dep-av-ini">' + inits + '</span>';

    card.innerHTML =
      '<div class="dep-q">\u201C</div>' +
      '<div class="dep-stars">' + stars + '</div>' +
      '<p class="dep-txt">' + grEsc(txt) + '</p>' +
      '<div class="dep-auth">' +
        '<div class="dep-av dep-av-g">' + avHTML + '</div>' +
        '<div>' +
          '<div class="dep-name">' + grEsc(r.author_name || '') + '</div>' +
          '<div class="dep-loc">' +
            grEsc(r.relative_time_description || '') +
            ' &middot; <span class="dep-g-badge">Google</span>' +
          '</div>' +
        '</div>' +
      '</div>';

    return card;
  }

  function grFallback(cont, load) {
    if (load) load.remove();
    var fb = document.createElement('div');
    fb.className = 'gr-fallback';
    fb.innerHTML =
      '<p>Confira as avalia&ccedil;&otilde;es dos nossos clientes diretamente no Google.</p>' +
      '<a href="https://www.google.com/maps/place/BellaJeri+Tour" target="_blank" rel="noopener"' +
      ' class="btn-prim" style="display:inline-flex;margin-top:20px;">Ver avalia&ccedil;&otilde;es no Google</a>';
    cont.appendChild(fb);
  }

  function grEsc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();

// ── VÍDEO KITESURF — NUNCA PARA ──
(function(){
  function initKitesurfVideo(){
    var vid = document.querySelector('.ativ-local-video');
    if(!vid) return;

    // Garante atributos essenciais
    vid.muted    = true;
    vid.loop     = true;
    vid.autoplay = true;
    vid.playsInline = true;

    // Tenta dar play imediatamente
    function forcePlay(){
      var p = vid.play();
      if(p && typeof p.catch === 'function'){
        p.catch(function(){ /* bloqueado pelo browser — IntersectionObserver vai resolver */ });
      }
    }
    forcePlay();

    // Se pausou por qualquer motivo → relança
    vid.addEventListener('pause', function(){
      setTimeout(forcePlay, 50);
    });

    // Backup: quando o loop termina e o browser não retoma
    vid.addEventListener('ended', function(){
      vid.currentTime = 0;
      forcePlay();
    });

    // Quando o vídeo volta a aparecer na tela → retoma play
    var visObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && vid.paused) forcePlay();
      });
    }, {threshold: 0.1});
    visObs.observe(vid);

    // Retry por 3 segundos caso o autoplay tenha sido bloqueado no carregamento
    var retryCount = 0;
    var retryTimer = setInterval(function(){
      if(retryCount++ > 10){ clearInterval(retryTimer); return; }
      if(vid.paused) forcePlay();
      else clearInterval(retryTimer);
    }, 300);
  }

  // Roda depois do DOM estar pronto
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initKitesurfVideo);
  } else {
    initKitesurfVideo();
  }
})();
