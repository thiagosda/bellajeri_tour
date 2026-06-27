// ── CARROSSEL REVIEWS ──
function depScroll(dir){var el=document.getElementById('deps-scroll');if(el)el.scrollBy({left:dir*316,behavior:'smooth'});}
(function(){
  var sc=document.getElementById('deps-scroll');
  var dots=document.querySelectorAll('.dep-dot');
  if(!sc||!dots.length)return;
  dots.forEach(function(d,i){d.addEventListener('click',function(){sc.scrollTo({left:i*316,behavior:'smooth'});});});
  sc.addEventListener('scroll',function(){
    var idx=Math.round(sc.scrollLeft/316);
    dots.forEach(function(d,i){d.classList.toggle('active',i===idx);});
  });
})();

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

// ── GOOGLE ADS — Evento de conversão Lead WhatsApp ──
// Dispara somente em cliques em links de WhatsApp (wa.me / api.whatsapp.com / web.whatsapp.com).
// Não duplica a tag principal AW-18276743148, que já está no <head>.
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-18276743148/xEvECN7n0MYcEOzvg4tE',
      'event_callback': callback
  });
  return false;
}

document.addEventListener('click', function(e) {
  var link = e.target.closest('a');

  if (!link) return;

  var href = link.href || '';

  if (
    href.includes('wa.me') ||
    href.includes('api.whatsapp.com') ||
    href.includes('web.whatsapp.com')
  ) {
    e.preventDefault();
    gtag_report_conversion(href);
  }
});
