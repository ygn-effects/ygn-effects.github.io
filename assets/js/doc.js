// Table of Contents functionality
document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.doc-content');
  const tocLinks = document.querySelectorAll('.doc-toc-link');
  const toggle = document.getElementById('doc-toc-toggle');
  const toc = document.getElementById('doc-toc');

  // Mobile TOC toggle
  if (toggle && toc) {
    toggle.addEventListener('click', () => {
      toc.classList.toggle('show');
      toggle.classList.toggle('active');
    });

    // Close TOC when clicking a link on mobile
    tocLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          toc.classList.remove('show');
          toggle.classList.remove('active');
        }
      });
    });
  }

  // Active section highlighting
  if (content && tocLinks.length > 0) {
    const headings = content.querySelectorAll('h2[id]');

    if (headings.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              tocLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);
              });
            }
          });
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0.1
        }
      );

      headings.forEach(heading => observer.observe(heading));
    }
  }

  // Image zoom functionality
  const docImages = document.querySelectorAll('.doc-img');
  docImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'img-overlay';
      overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
      overlay.style.cursor = 'zoom-out';
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
});