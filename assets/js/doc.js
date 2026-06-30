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

  // Code block headers + copy buttons
  const LANG_NAMES = {
    sh: 'Shell', bash: 'Bash', plaintext: '', text: '',
    javascript: 'JavaScript', js: 'JavaScript', css: 'CSS',
    html: 'HTML', yaml: 'YAML', json: 'JSON',
    ruby: 'Ruby', python: 'Python', c: 'C', cpp: 'C++'
  };

  document.querySelectorAll('.doc-content div.highlighter-rouge').forEach(block => {
    const langClass = Array.from(block.classList).find(c => c.startsWith('language-'));
    const langKey = langClass ? langClass.replace('language-', '') : '';
    const langLabel = langKey in LANG_NAMES ? LANG_NAMES[langKey] : langKey.toUpperCase();

    const header = document.createElement('div');
    header.className = 'code-block-header';

    const label = document.createElement('span');
    label.className = 'code-lang';
    label.textContent = langLabel;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    copyBtn.setAttribute('aria-label', 'Copy code');

    copyBtn.addEventListener('click', () => {
      const code = block.querySelector('code');
      if (!code) return;
      navigator.clipboard.writeText(code.textContent.trim()).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });

    header.appendChild(label);
    header.appendChild(copyBtn);
    block.insertBefore(header, block.firstChild);
  });

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