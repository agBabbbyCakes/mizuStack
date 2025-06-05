// Copy button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add copy buttons to all code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        const container = block.parentNode;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        container.style.position = 'relative';
        container.appendChild(copyButton);

        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            }
        });
    });
});

// Alpine.js components
document.addEventListener('alpine:init', () => {
    // Stats counter component
    Alpine.data('statsCounter', () => ({
        count: 0,
        target: 0,
        init() {
            this.target = parseInt(this.$el.dataset.target);
            this.animateCount();
        },
        animateCount() {
            const duration = 2000;
            const steps = 60;
            const increment = this.target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                this.count = Math.round(current);
                
                if (current >= this.target) {
                    this.count = this.target;
                    clearInterval(timer);
                }
            }, duration / steps);
        }
    }));

    // Testimonial carousel component
    Alpine.data('testimonialCarousel', () => ({
        currentIndex: 0,
        items: [],
        init() {
            this.items = this.$el.querySelectorAll('.testimonial-card');
            this.showSlide(0);
            
            // Auto-advance slides
            setInterval(() => {
                this.next();
            }, 5000);
        },
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            this.showSlide(this.currentIndex);
        },
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            this.showSlide(this.currentIndex);
        },
        showSlide(index) {
            this.items.forEach((item, i) => {
                item.style.display = i === index ? 'block' : 'none';
            });
        }
    }));
});

// Universal Code Editor Functionality
function initCodeEditors() {
  document.querySelectorAll('.code-editor-container').forEach(function(editor) {
    const tabs = editor.querySelectorAll('.tab-btn');
    const codeBlocks = editor.querySelectorAll('.code-block-wrapper');
    const dropdownBtn = editor.querySelector('.dropdown-btn');
    const dropdownContent = editor.querySelector('.dropdown-content');
    const fileName = editor.querySelector('.editor-file-name');

    // Map tab to file name (fallback to tab name if not found)
    const tabFileNames = {};
    tabs.forEach(tab => {
      const tabId = tab.dataset.tab;
      if (tabId) {
        // Use custom file names for known editors
        if (editor.id === 'code-editor') {
          tabFileNames[tabId] = {
            deploy: 'deploy.py',
            interact: 'interact.py',
            multicall: 'multicall.py',
            publish: 'publish.py',
            test: 'test_ape.py'
          }[tabId] || (tabId + '.py');
        } else if (editor.id === 'quickstart-editor') {
          tabFileNames[tabId] = {
            install: 'install.sh',
            init: 'init.sh',
            deploy: 'deploy.sh',
            test: 'test.sh'
          }[tabId] || (tabId + '.sh');
        } else {
          tabFileNames[tabId] = tabId + '.txt';
        }
      }
    });

    function switchTab(tabId) {
      console.log('Switching tab:', tabId, 'in editor:', editor.id);
      tabs.forEach(tab => {
        if (tab.dataset.tab === tabId) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      codeBlocks.forEach(block => {
        if (block.dataset.tab === tabId) {
          block.style.display = 'block';
        } else {
          block.style.display = 'none';
        }
      });
      const activeTab = editor.querySelector(`.tab-btn[data-tab="${tabId}"]`);
      if (activeTab && dropdownBtn) {
        dropdownBtn.innerHTML = activeTab.innerHTML;
      }
      if (fileName && tabFileNames[tabId]) {
        fileName.textContent = tabFileNames[tabId];
      }
      if (dropdownContent) dropdownContent.classList.remove('show');
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        switchTab(tab.dataset.tab);
      });
    });
    if (dropdownBtn) {
      dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
      });
    }
    document.addEventListener('click', function() {
      if (dropdownContent) dropdownContent.classList.remove('show');
    });
    if (dropdownContent) {
      dropdownContent.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          switchTab(link.dataset.tab);
        });
      });
    }
    // Initialize with first tab
    if (tabs.length > 0) {
      switchTab(tabs[0].dataset.tab);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initCodeEditors();
});

// Minimal vanilla JS for .code-editor tab switching
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.code-editor').forEach(function(editor) {
    const tabs = editor.querySelectorAll('.tabs button');
    const contents = editor.querySelectorAll('.tab-content');
    const fileName = editor.querySelector('.editor-file-name');
    const fileNames = {
      deploy: 'deploy.py',
      interact: 'interact.py',
      multicall: 'multicall.py',
      publish: 'publish.py',
      test: 'test_ape.py'
    };
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.style.display = 'none');
        tab.classList.add('active');
        const tabId = tab.dataset.tab;
        editor.querySelector('.tab-content[data-tab="' + tabId + '"]').style.display = 'block';
        if (fileName && fileNames[tabId]) fileName.textContent = fileNames[tabId];
      });
    });
  });
});

// Mouse-following light effect for section.card
function setupCardMouseLight() {
  document.querySelectorAll('section.card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
    card.addEventListener('mouseleave', function() {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}
document.addEventListener('DOMContentLoaded', setupCardMouseLight);

// Subtle, exciting 3D scroll effect (extended, with vanishing point distortion)
function setupSubtle3DScroll() {
  document.body.setAttribute('data-3d-scroll', 'true');
  const main = document.querySelector('main.container');
  const cards = document.querySelectorAll('section.card');
  const hero = document.querySelector('.hero');
  const featureGrids = document.querySelectorAll('.feature-grid');
  const toolsGrids = document.querySelectorAll('.tools-grid');
  const ctaGroups = document.querySelectorAll('.cta-button-group');
  const footer = document.querySelector('footer.container');

  function updatePerspectiveOrigin(scrollY) {
    // Vanishing point moves horizontally as you scroll (oscillates), and vertically with scroll
    const wh = window.innerHeight;
    const docH = document.body.scrollHeight - wh;
    const percentY = docH > 0 ? scrollY / docH : 0;
    // X oscillates from 40% to 60% as you scroll, Y from 45% to 55%
    const x = 50 + Math.sin(scrollY / 400) * 10; // 40% to 60%
    const y = 50 + (percentY - 0.5) * 10; // 45% to 55%
    main.style.setProperty('--perspective-origin-x', `${x}%`);
    main.style.setProperty('--perspective-origin-y', `${y}%`);
  }

  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY || window.pageYOffset;
    const wh = window.innerHeight;
    // Subtle tilt and scale
    const tilt = Math.max(-8, Math.min(8, (scrollY / 1200) * 8 - 2)); // -2deg to 6deg
    const scale = 1 - Math.min(0.06, scrollY / 6000); // Slight zoom out
    const skew = Math.max(-2, Math.min(2, (scrollY / 2000) * 2)); // -2deg to 2deg
    main.style.transform = `perspective(1600px) rotateX(${tilt}deg) scale(${scale}) skewY(${-skew}deg)`;
    updatePerspectiveOrigin(scrollY);
    // Each card: subtle parallax, pop, and vertical movement
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2 - wh / 2;
      const depth = Math.max(-1, Math.min(1, cardCenter / wh));
      card.style.transform = `translateZ(${depth * 24}px) translateY(${depth * 18}px) scale(${1 + depth * 0.025}) rotateX(${depth * 4}deg) skewY(${-skew * depth}deg)`;
    });
    // Hero, feature grid, tools grid, cta group, footer: less intense effect
    if (hero) hero.style.transform = `translateZ(0px) scale(${scale + 0.01}) rotateX(${tilt * 0.5}deg)`;
    featureGrids.forEach(grid => grid.style.transform = `translateZ(0px) scale(${scale + 0.01}) rotateX(${tilt * 0.5}deg)`);
    toolsGrids.forEach(grid => grid.style.transform = `translateZ(0px) scale(${scale + 0.01}) rotateX(${tilt * 0.5}deg)`);
    ctaGroups.forEach(cta => cta.style.transform = `translateZ(0px) scale(${scale + 0.01}) rotateX(${tilt * 0.5}deg)`);
    if (footer) footer.style.transform = `translateZ(0px) scale(${scale + 0.01}) rotateX(${tilt * 0.5}deg)`;
  });

  // Optionally, add mousemove for extra vanishing point excitement
  main.addEventListener('mousemove', function(e) {
    const rect = main.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    main.style.setProperty('--perspective-origin-x', `${x}%`);
    main.style.setProperty('--perspective-origin-y', `${y}%`);
  });
  main.addEventListener('mouseleave', function() {
    main.style.setProperty('--perspective-origin-x', `50%`);
    main.style.setProperty('--perspective-origin-y', `50%`);
  });

  // Initial call
  window.dispatchEvent(new Event('scroll'));
}
document.removeEventListener('DOMContentLoaded', setupSubtle3DScroll);
document.addEventListener('DOMContentLoaded', setupSubtle3DScroll); 