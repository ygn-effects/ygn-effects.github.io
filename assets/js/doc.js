document.addEventListener("DOMContentLoaded",()=>{
  const headings = [...document.querySelectorAll("#doc-content h2")];
  const links    = [...document.querySelectorAll(".doc-toc a")];

  if(!headings.length || !links.length) return;

  /* map heading.id → link element */
  const linkById = {};
  links.forEach(l => linkById[l.getAttribute("href").slice(1)] = l);

  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const id  = en.target.id;
        links.forEach(l=>{
          const active = l === linkById[id];
          l.classList.toggle("is-active", active);
          if(active){
            l.scrollIntoView({block:"nearest", inline:"nearest"});
          }
        });
      }
    });
  },{
    rootMargin: "0px 0px -70% 0px",
    threshold: .1
  });

  headings.forEach(h => io.observe(h));
});

document.querySelectorAll('.doc-img').forEach(img=>{
  img.addEventListener('click',()=>{
    const overlay = document.createElement('div');
    overlay.className = 'img-overlay';
    overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    overlay.addEventListener('click',()=>overlay.remove());
    document.body.appendChild(overlay);
  });
});