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
