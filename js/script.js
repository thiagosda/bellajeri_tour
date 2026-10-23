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

// ── BARRA DE PROGRESSO DE LEITURA ──
(function(){
  var bar=document.createElement('div');
  bar.className='scroll-prog';
  bar.setAttribute('aria-hidden','true');
  document.body.appendChild(bar);
  var pending=false;
  function update(){
    var max=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.transform='scaleX('+(max>0?Math.min(window.scrollY/max,1):0)+')';
    pending=false;
  }
  window.addEventListener('scroll',function(){if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
  update();
})();

// ── BARRA FIXA DE RESERVA (celular) ──
// Usa a mesma mensagem do botão flutuante da página, para cada página manter seu texto.
(function(){
  var wa=document.querySelector('.f-wa');
  if(!wa)return;
  var bar=document.createElement('div');
  bar.className='cta-bar';
  bar.innerHTML='<div class="cta-bar-txt"><strong>Planeje sua viagem a Jeri</strong><span>Resposta rápida das 7h às 21h</span></div>'+
    '<a class="cta-bar-btn" target="_blank" rel="noopener">'+wa.innerHTML+' WhatsApp</a>';
  bar.querySelector('a').href=wa.href;
  document.body.appendChild(bar);
  document.body.classList.add('has-cta-bar');
  var hero=document.querySelector('.hero,.page-hero');
  var footer=document.querySelector('.footer');
  var pastHero=!hero, atFooter=false;
  function sync(){bar.classList.toggle('show',pastHero&&!atFooter);}
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.target===hero)pastHero=!e.isIntersecting;
      if(e.target===footer)atFooter=e.isIntersecting;
    });
    sync();
  });
  if(hero)obs.observe(hero);
  if(footer)obs.observe(footer);
  sync();
})();

// ── ENTRADA EM CASCATA (cards de um mesmo grid aparecem um após o outro) ──
document.querySelectorAll('.cards,.difs,.tgrid,.trust-in,.pontos-grid,.related-grid').forEach(function(grid){
  var i=0;
  Array.prototype.forEach.call(grid.children,function(el){
    if(el.classList.contains('rev')){el.style.transitionDelay=(i++%4)*0.09+'s';}
  });
});

// ── SCROLL REVEAL (IntersectionObserver) ──
var io=new IntersectionObserver(function(entries){
  var appearing = entries.filter(function(e){ return e.isIntersecting; });
  appearing.forEach(function(e, idx){
    var el = e.target;
    el.classList.add('in');
    io.unobserve(el);
    // Limpa o atraso da cascata depois da entrada, para o hover responder na hora
    if(el.style.transitionDelay){ setTimeout(function(){ el.style.transitionDelay=''; }, 1400); }
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
          // "translate" separado para não brigar com o zoom lento (animation em transform)
          heroImg.style.translate='0 '+y*0.15+'px';
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


// ── VÍDEO KITESURF — carrega só perto da tela, toca enquanto visível ──
(function(){
  function initKitesurfVideo(){
    var vid = document.querySelector('.ativ-local-video');
    if(!vid) return;

    // Garante atributos essenciais
    vid.muted    = true;
    vid.loop     = true;
    vid.playsInline = true;

    function forcePlay(){
      var p = vid.play();
      if(p && typeof p.catch === 'function'){
        p.catch(function(){ /* bloqueado pelo browser — fica no poster */ });
      }
    }

    // O arquivo é pesado: só baixa quando o card chega perto da tela.
    // Fora da tela, pausa para não gastar bateria/dados.
    var visObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          if(!vid.getAttribute('src') && vid.dataset.src){ vid.src = vid.dataset.src; }
          forcePlay();
        } else if(!vid.paused){
          vid.pause();
        }
      });
    }, {rootMargin: '200px 0px'});
    visObs.observe(vid);
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
// O clique segue normalmente (nova aba); o evento vai por beacon, então não depende
// do gtag.js carregar — antes, com bloqueador de anúncios, o botão não abria nada.
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (!link) return;
  var href = link.href || '';
  if (
    (href.includes('wa.me') ||
    href.includes('api.whatsapp.com') ||
    href.includes('web.whatsapp.com')) &&
    typeof gtag === 'function'
  ) {
    gtag('event', 'conversion', {
      'send_to': 'AW-18276743148/xEvECN7n0MYcEOzvg4tE',
      'transport_type': 'beacon'
    });
  }
});
