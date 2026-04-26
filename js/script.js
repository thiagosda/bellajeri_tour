// Cursor
var cur=document.getElementById('cur'),ring=document.getElementById('ring');
var mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function anim(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim);})();

// Nav scroll
var nav=document.getElementById('nav');
window.addEventListener('scroll',function(){nav.classList.toggle('on',window.scrollY>60);});

// Mobile menu
var mm=document.getElementById('mm');
document.getElementById('burger').addEventListener('click',function(){mm.classList.add('open');});
document.getElementById('mmx').addEventListener('click',function(){mm.classList.remove('open');});
function closeMenu(){mm.classList.remove('open');}

// Scroll reveal
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in');});
},{threshold:0.1,rootMargin:'0px 0px -36px 0px'});
document.querySelectorAll('.rev,.rev-l,.rev-r').forEach(function(el){io.observe(el);});

// FAQ
function tFaq(btn){
  var item=btn.parentElement;
  var open=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});
  if(!open)item.classList.add('open');
}

// Lightbox
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

// Active nav
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
