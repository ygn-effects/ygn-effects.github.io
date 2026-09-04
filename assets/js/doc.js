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
    const headings = Array.from(content.querySelectorAll('h2[id]'));

    if (headings.length > 0) {
      let updateQueued = false;

      const updateActiveSection = () => {
        updateQueued = false;

        // Consider a section active once its heading reaches the upper quarter
        // of the viewport. Default to the first section while above it.
        const readingLine = Math.min(window.innerHeight * 0.25, 240);
        let activeHeading = headings[0];

        for (const heading of headings) {
          if (heading.getBoundingClientRect().top > readingLine) break;
          activeHeading = heading;
        }

        tocLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${activeHeading.id}`;
          link.classList.toggle('active', isActive);

          if (isActive) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      };

      const queueActiveSectionUpdate = () => {
        if (updateQueued) return;
        updateQueued = true;
        window.requestAnimationFrame(updateActiveSection);
      };

      updateActiveSection();
      window.addEventListener('scroll', queueActiveSectionUpdate, { passive: true });
      window.addEventListener('resize', queueActiveSectionUpdate);
      window.addEventListener('hashchange', queueActiveSectionUpdate);
      window.addEventListener('load', queueActiveSectionUpdate);
      window.addEventListener('pageshow', queueActiveSectionUpdate);
    }
  }

  // Code block headers + copy buttons
  const LANG_NAMES = {
    sh: 'Shell', bash: 'Bash', plaintext: '', text: '',
    javascript: 'JavaScript', js: 'JavaScript', css: 'CSS',
    html: 'HTML', yaml: 'YAML', json: 'JSON',
    ruby: 'Ruby', python: 'Python', c: 'C', cpp: 'C++',
    ini: 'INI', powershell: 'PowerShell', html: 'SpinASM'
  };

  const LANG_ICONS = {
    sh: 'fa-solid fa-terminal', bash: 'fa-solid fa-terminal',
    javascript: 'fa-brands fa-js', js: 'fa-brands fa-js',
    css: 'fa-brands fa-css3-alt', html: 'fa-brands fa-html5',
    yaml: 'fa-solid fa-file-code', json: 'fa-solid fa-braces',
    ruby: 'fa-regular fa-gem', python: 'fa-brands fa-python',
    c: 'fa-solid fa-c', cpp: 'fa-solid fa-code',
    ini: 'fa-solid fa-sliders', powershell: 'fa-solid fa-terminal',
    html: 'fa-solid fa-microchip'
  };

  document.querySelectorAll('.doc-content div.highlighter-rouge').forEach(block => {
    const langClass = Array.from(block.classList).find(c => c.startsWith('language-'));
    const langKey = langClass ? langClass.replace('language-', '') : '';
    const langLabel = langKey in LANG_NAMES ? LANG_NAMES[langKey] : langKey.toUpperCase();

    if (!langLabel) return;

    const header = document.createElement('div');
    header.className = 'code-block-header';

    const label = document.createElement('span');
    label.className = 'code-lang';

    const langIcon = document.createElement('i');
    langIcon.className = LANG_ICONS[langKey] || 'fa-solid fa-code';
    langIcon.setAttribute('aria-hidden', 'true');

    label.appendChild(langIcon);
    label.appendChild(document.createTextNode(langLabel));

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

  // Lazy thumbnail/full-size image viewer
  const imageLinks = document.querySelectorAll('[data-doc-image]');

  if (imageLinks.length > 0 && typeof HTMLDialogElement !== 'undefined') {
    const dialog = document.createElement('dialog');
    dialog.className = 'doc-image-dialog';
    dialog.setAttribute('aria-label', 'Full-size documentation image');

    const fullImage = document.createElement('img');
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'doc-image-dialog-close';
    closeButton.setAttribute('aria-label', 'Close full-size image');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

    dialog.appendChild(fullImage);
    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      fullImage.removeAttribute('src');
      fullImage.removeAttribute('alt');
    });

    imageLinks.forEach(link => {
      link.addEventListener('click', event => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        const thumbnail = link.querySelector('img');
        fullImage.src = link.href;
        fullImage.alt = thumbnail ? thumbnail.alt : '';
        dialog.showModal();
      });
    });
  }

  // Preserve the original zoom treatment for guides not yet migrated.
  const docImages = document.querySelectorAll('.doc-img');
  docImages.forEach(img => {
    if (img.closest('[data-doc-image]')) return;

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
