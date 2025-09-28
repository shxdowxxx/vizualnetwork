// VizualNetwork - Main Application JavaScript

class VizualNetwork {
  constructor() {
    this.currentView = 'home';
    this.isSettingsOpen = false;
    this.proxyEngine = 'rammerhead';
    this.init();
  }

  init() {
    this.hideLoadingScreen();
    this.setupEventListeners();
    this.render();
  }

  hideLoadingScreen() {
    // Hide loading screen after a delay
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    }, 2000);
  }

  setupEventListeners() {
    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-nav-item]')) {
        const view = e.target.dataset.navItem;
        this.setCurrentView(view);
      }
      
      if (e.target.matches('[data-settings-toggle]')) {
        this.toggleSettings();
      }
      
      if (e.target.matches('[data-close-settings]')) {
        this.closeSettings();
      }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
    }
    
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        this.handleSearch();
      });
    }

    // Engine selector
    const engineSelector = document.getElementById('engine-selector');
    if (engineSelector) {
      engineSelector.addEventListener('change', (e) => {
        this.setProxyEngine(e.target.value);
      });
    }

    // Quick links
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-quick-link]')) {
        const url = e.target.dataset.quickLink;
        this.setSearchUrl(url);
      }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Settings navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-settings-section]')) {
        const section = e.target.dataset.settingsSection;
        this.setSettingsSection(section);
      }
      
      // Space-style navigation
      if (e.target.closest('.settingItem')) {
        const item = e.target.closest('.settingItem');
        const section = item.dataset.id;
        this.setSpaceSettingsSection(section);
      }
      
      // FAQ accordion
      if (e.target.matches('.faq-question')) {
        this.toggleFaqItem(e.target.closest('.faq-item'));
      }
      
      // Theme selection
      if (e.target.matches('[data-theme]')) {
        this.selectTheme(e.target.dataset.theme);
      }
      
      // Dropdown functionality
      if (e.target.matches('.dropdown-button')) {
        this.toggleDropdown(e.target.closest('.dropdown'));
      }
    });
  }

  setCurrentView(view) {
    this.currentView = view;
    this.render();
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    this.render();
  }

  closeSettings() {
    this.isSettingsOpen = false;
    this.render();
  }

  setProxyEngine(engine) {
    this.proxyEngine = engine;
    this.updateEngineDescription();
  }

  updateEngineDescription() {
    const descriptions = {
      'rammerhead': 'Stable, full browser proxy with advanced features',
      'scramjet': 'Fast, lightweight proxy for quick browsing',
      'wisp': 'Experimental, WebSocket-based proxy for cutting-edge performance'
    };
    
    const descriptionElement = document.getElementById('engine-description');
    if (descriptionElement) {
      descriptionElement.textContent = descriptions[this.proxyEngine] || descriptions.rammerhead;
    }
  }

  handleSearch() {
    const searchInput = document.getElementById('search-input');
    const url = searchInput ? searchInput.value.trim() : '';
    
    if (!url) {
      this.showNotification('Please enter a URL or search term', 'warning');
      return;
    }

    // Process the URL
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        processedUrl = 'https://' + url;
      } else {
        // It's a search term, redirect to Google
        processedUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    // Show loading notification
    this.showNotification(`Connecting through ${this.proxyEngine} proxy...`, 'info');
    
    // Use actual proxy services
    this.openProxyUrl(processedUrl);
  }

  openProxyUrl(url) {
    // Encode the URL for proxy services
    const encodedUrl = encodeURIComponent(url);
    
    let proxyUrl = '';
    
    switch (this.proxyEngine) {
      case 'rammerhead':
        // Use Rammerhead browser service
        proxyUrl = `https://browser.rammerhead.org/#${encodedUrl}`;
        break;
      case 'scramjet':
        // Use Scramjet proxy service
        proxyUrl = `https://scramjet.org/browse.php?u=${encodedUrl}`;
        break;
      case 'wisp':
        // Use Wisp proxy service
        proxyUrl = `https://wisp.org/browse.php?u=${encodedUrl}`;
        break;
      default:
        // Fallback to a working proxy service
        proxyUrl = `https://www.croxyproxy.com/start.php?b=0&u=${encodedUrl}`;
    }
    
    // Open the proxy URL in a new tab
    try {
      const proxyWindow = window.open(proxyUrl, '_blank', 'noopener,noreferrer');
      
      if (proxyWindow) {
        this.showNotification(`Opening ${url} through ${this.proxyEngine} proxy...`, 'success');
        
        // Focus the new window
        proxyWindow.focus();
      } else {
        // Popup blocked, show alternative
        this.showNotification('Popup blocked! Please allow popups or try clicking the link below.', 'warning');
        this.showAlternativeProxy(url, proxyUrl);
      }
    } catch (error) {
      console.error('Error opening proxy:', error);
      this.showNotification('Error opening proxy. Please try again.', 'error');
    }
  }

  showAlternativeProxy(originalUrl, proxyUrl) {
    // Create a modal with proxy options
    const modal = document.createElement('div');
    modal.className = 'proxy-modal';
    modal.innerHTML = `
      <div class="proxy-modal-content">
        <div class="proxy-modal-header">
          <h3>Proxy Navigation</h3>
          <button class="proxy-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="proxy-modal-body">
          <p><strong>Original URL:</strong> ${originalUrl}</p>
          <p><strong>Proxy Engine:</strong> ${this.proxyEngine}</p>
          <div class="proxy-actions">
            <button class="btn-cyber" onclick="window.open('${proxyUrl}', '_blank')">
              Open in New Tab
            </button>
            <button class="btn-secondary" onclick="navigator.clipboard.writeText('${proxyUrl}')">
              Copy Proxy URL
            </button>
            <button class="btn-secondary" onclick="window.location.href='${proxyUrl}'">
              Navigate Directly
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 30000);
  }

  setSearchUrl(url) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = url;
      searchInput.focus();
    }
  }

  toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }

  setSettingsSection(section) {
    // Update navigation
    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.settingsSection === section) {
        item.classList.add('active');
      }
    });

    // Update content sections
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === `settings-${section}`) {
        sec.classList.add('active');
      }
    });
  }

  setSpaceSettingsSection(section) {
    // Update Space-style navigation
    const navItems = document.querySelectorAll('.settingItem');
    navItems.forEach(item => {
      item.classList.remove('sideActive');
      if (item.dataset.id === section) {
        item.classList.add('sideActive');
      }
    });

    // Update content sections
    const sections = document.querySelectorAll('.scontent');
    sections.forEach(sec => {
      sec.style.display = 'none';
      if (sec.id === section) {
        sec.style.display = 'block';
      }
    });
  }

  toggleDropdown(dropdown) {
    const menu = dropdown.querySelector('.dropdown-menu');
    const isOpen = menu.style.display === 'block';
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(m => {
      m.style.display = 'none';
    });
    
    // Toggle current dropdown
    if (!isOpen) {
      menu.style.display = 'block';
    }
  }

  toggleFaqItem(faqItem) {
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
    }
  }

  selectTheme(theme) {
    // Update theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.remove('active');
    });
    
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    
    // Apply theme (this would be implemented based on your theme system)
    this.applyTheme(theme);
    
    this.showNotification(`Theme changed to ${theme.replace('-', ' ')}`, 'success');
  }

  applyTheme(theme) {
    // This would apply the actual theme changes
    // For now, we'll just store the preference
    localStorage.setItem('vizualnetwork-theme', theme);
    
    // In a real implementation, you would:
    // 1. Update CSS custom properties
    // 2. Change color schemes
    // 3. Update background patterns
    // 4. Modify animations
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  render() {
    console.log('Rendering VizualNetwork interface...');
    const appContainer = document.getElementById('root');
    if (!appContainer) {
      console.error('Root container not found!');
      return;
    }
    console.log('Root container found, updating innerHTML...');

    appContainer.innerHTML = `
      <div class="app-container">
        <!-- Cyber Grid Background -->
        <div class="cyber-grid-bg"></div>
        
        <!-- Top Navigation -->
        <nav class="top-nav">
          <div class="nav-brand">VizualNetwork</div>
          <button id="mobile-menu-toggle" class="mobile-menu-toggle">☰</button>
        </nav>
        
        <!-- Sidebar -->
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <a href="#" class="nav-item ${this.currentView === 'home' ? 'active' : ''}" data-nav-item="home" title="Home">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </a>
            
            <a href="#" class="nav-item ${this.currentView === 'proxy' ? 'active' : ''}" data-nav-item="proxy" title="Proxy Menu">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </a>
            
            <a href="#" class="nav-item ${this.currentView === 'about' ? 'active' : ''}" data-nav-item="about" title="About Us">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </a>
            
            <a href="#" class="nav-item" data-settings-toggle title="Settings Hub">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </a>
            
            <a href="#" class="nav-item ${this.currentView === 'news' ? 'active' : ''}" data-nav-item="news" title="News & Updates">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </a>
          </nav>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
          <div class="content-container">
            ${this.renderContent()}
          </div>
        </main>
        
        <!-- Settings Panel -->
        ${this.isSettingsOpen ? this.renderSettingsPanel() : ''}
      </div>
    `;
  }

  renderContent() {
    switch (this.currentView) {
      case 'home':
        return this.renderHome();
      case 'proxy':
        return this.renderProxy();
      case 'about':
        return this.renderAbout();
      case 'news':
        return this.renderNews();
      default:
        return this.renderHome();
    }
  }

  renderHome() {
    return `
      <div class="main-landing">
        <!-- Hero Section with Central Search Bar -->
        <div class="hero-section">
          <div class="hero-content">
        <h1 class="hero-title">VizualNetwork</h1>
        <p class="hero-subtitle">Access the web through our futuristic proxy network</p>
            
            <!-- Central Terminal-Style Search Bar -->
            <div class="central-search">
              <div class="terminal-search-container">
                <div class="terminal-prompt">
                  <span class="prompt-symbol">></span>
          <input 
            type="text" 
            id="search-input" 
                    class="terminal-input" 
            placeholder="Enter URL or search term..."
            autocomplete="off"
          >
                </div>
                <button id="search-button" class="terminal-button">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Links Section -->
        <div class="quick-links-section">
          <h3 class="section-title">Quick Links</h3>
        <div class="quick-links-grid">
            <button class="quick-link-btn" data-quick-link="https://google.com">
              <div class="link-icon">🔍</div>
              <span>Google</span>
          </button>
            
            <button class="quick-link-btn" data-quick-link="https://discord.com">
              <div class="link-icon">💬</div>
              <span>Discord</span>
          </button>
            
            <button class="quick-link-btn" data-quick-link="https://youtube.com">
              <div class="link-icon">📺</div>
              <span>YouTube</span>
          </button>
            
            <button class="quick-link-btn" data-quick-link="https://wikipedia.org">
              <div class="link-icon">📚</div>
              <span>Wikipedia</span>
          </button>
        </div>
      </div>
      
        <!-- Featured Games/Apps Cards -->
        <div class="featured-section">
          <h3 class="section-title">Featured Games & Apps</h3>
          <div class="featured-cards">
            <div class="featured-card">
              <div class="card-icon">🎮</div>
              <h4>Cool Math Games</h4>
              <p>Educational games and puzzles</p>
              <button class="card-button" data-quick-link="https://coolmathgames.com">Play</button>
            </div>
            
          <div class="featured-card">
              <div class="card-icon">🎯</div>
              <h4>Slope</h4>
              <p>Endless runner game</p>
              <button class="card-button" data-quick-link="https://slope-game.com">Play</button>
          </div>
            
          <div class="featured-card">
              <div class="card-icon">🧩</div>
              <h4>2048</h4>
              <p>Number puzzle game</p>
              <button class="card-button" data-quick-link="https://2048game.com">Play</button>
          </div>
            
          <div class="featured-card">
              <div class="card-icon">🎲</div>
              <h4>Unblocked Games</h4>
              <p>Collection of unblocked games</p>
              <button class="card-button" data-quick-link="https://unblockedgames.com">Play</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProxy() {
    return `
      <div class="proxy-menu-page">
        <div class="hero-section">
        <h1 class="hero-title">Proxy Menu</h1>
          <p class="hero-subtitle">Choose your proxy engine and browse the web</p>
        </div>
        
        <div class="proxy-configuration">
          <!-- Proxy Engine Dropdown -->
          <div class="proxy-engine-selector">
            <h3>Select Proxy Engine</h3>
            <div class="engine-dropdown">
              <select id="engine-selector" class="engine-select">
                <option value="rammerhead">Rammerhead - Stable, full browser proxy</option>
                <option value="scramjet">Scramjet - Fast, lightweight</option>
                <option value="wisp">Wisp - Experimental, WebSocket based</option>
                <option value="croxyproxy">CroxyProxy - Reliable fallback</option>
              </select>
            </div>
            <p id="engine-description" class="engine-description">
              Using Rammerhead - Stable, full browser proxy with advanced features
            </p>
      </div>
      
          <!-- Search Container -->
          <div class="proxy-search-container">
        <div class="search-container">
          <input 
            type="text" 
            id="search-input" 
            class="search-input" 
            placeholder="Enter URL to proxy..."
            autocomplete="off"
          >
              <button id="search-button" class="search-button">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
                Browse
              </button>
            </div>
          </div>
      </div>
    `;
  }

  renderAbout() {
    return `
      <div class="about-page">
        <div class="hero-section">
          <h1 class="hero-title">About VizualNetwork</h1>
          <p class="hero-subtitle">Learn more about our mission, team, and technology</p>
        </div>
        
        <div class="about-content">
          <div class="about-section">
            <h2>Our Mission</h2>
            <p>VizualNetwork is dedicated to providing secure, fast, and reliable proxy services to help users access the web freely and safely. We believe in digital freedom and privacy for all.</p>
          </div>
          
          <div class="about-section">
            <h2>Team Credits</h2>
            <div class="team-grid">
              <div class="team-member">
                <div class="member-avatar">👨‍💻</div>
                <h4>Development Team</h4>
                <p>Core developers and engineers</p>
              </div>
              <div class="team-member">
                <div class="member-avatar">🎨</div>
                <h4>Design Team</h4>
                <p>UI/UX designers and artists</p>
              </div>
              <div class="team-member">
                <div class="member-avatar">🔒</div>
                <h4>Security Team</h4>
                <p>Security researchers and analysts</p>
              </div>
            </div>
          </div>
          
          <div class="about-section">
            <h2>Version Information</h2>
            <div class="version-info">
              <div class="version-item">
                <span class="version-label">Current Version:</span>
                <span class="version-value">v2.1.0</span>
              </div>
              <div class="version-item">
                <span class="version-label">Last Updated:</span>
                <span class="version-value">December 2024</span>
              </div>
              <div class="version-item">
                <span class="version-label">Build:</span>
                <span class="version-value">#2024.12.15</span>
              </div>
            </div>
          </div>
          
          <div class="about-section">
            <h2>Technology Stack</h2>
            <p>Built with cutting-edge web technologies including HTML5, CSS3, JavaScript ES6+, and modern proxy technologies for maximum performance and security.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderNews() {
    return `
      <div class="news-page">
        <div class="hero-section">
          <h1 class="hero-title">News & Updates</h1>
          <p class="hero-subtitle">Latest changelog and patch notes</p>
        </div>
        
        <div class="news-content">
          <div class="changelog-section">
            <h2>Changelog</h2>
            
            <div class="version-entry">
              <div class="version-header">
                <h3>v2.1.0 - December 2024</h3>
                <span class="version-badge">Latest</span>
              </div>
              <div class="version-changes">
                <h4>✨ New Features</h4>
                <ul>
                  <li>Added Space-style settings panel</li>
                  <li>Implemented Tab Cloaking with multiple options</li>
                  <li>Added Panic Key functionality</li>
                  <li>New cyberpunk terminal-style search bar</li>
                </ul>
                
                <h4>🔧 Improvements</h4>
                <ul>
                  <li>Enhanced proxy engine selection</li>
                  <li>Improved mobile responsiveness</li>
                  <li>Better error handling and notifications</li>
                </ul>
                
                <h4>🐛 Bug Fixes</h4>
                <ul>
                  <li>Fixed proxy URL generation</li>
                  <li>Resolved settings panel navigation issues</li>
                  <li>Improved dropdown functionality</li>
                </ul>
              </div>
            </div>
            
            <div class="version-entry">
              <div class="version-header">
                <h3>v2.0.0 - November 2024</h3>
              </div>
              <div class="version-changes">
                <h4>✨ Major Update</h4>
                <ul>
                  <li>Complete UI redesign with cyberpunk theme</li>
                  <li>Added multiple proxy engines (Rammerhead, Scramjet, Wisp)</li>
                  <li>Implemented PWA functionality</li>
                  <li>Added quick links and featured games section</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="patch-notes-section">
            <h2>Recent Patches</h2>
            <div class="patch-item">
              <h4>Patch 2.1.1 - December 15, 2024</h4>
              <p>Fixed Rammerhead proxy URL configuration and improved connection stability.</p>
            </div>
            <div class="patch-item">
              <h4>Patch 2.1.0 - December 10, 2024</h4>
              <p>Initial release of Space-style settings panel with enhanced navigation.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSettingsPanel() {
    return `
      <div class="settings-overlay-space">
        <div class="settings-panel-space">
          <div class="settings-header-space">
            <h1>Settings</h1>
            <button class="settings-close" data-close-settings>×</button>
          </div>
          
          <div class="settings-layout-space">
            <div class="settings-sidebar-space">
              <ul class="sideSnav">
                <h1>Settings</h1>
                <div class="settingsShape"></div>
                
                <a href="#" data-settings-section="cloaking">
                  <li class="settingItem sideActive" data-id="cloaking">
                    <span class="material-symbols-outlined">ad_group_off</span>Cloaking
                  </li>
                </a>
                
                <a href="#" data-settings-section="plugins">
                  <li class="settingItem" data-id="plugins">
                    <span class="material-symbols-outlined">crossword</span>Plugins
                    <span class="coming-soon-badge">Coming Soon</span>
                  </li>
                </a>
                
                <a href="#" data-settings-section="performance">
                  <li class="settingItem" data-id="performance">
                    <span class="material-symbols-outlined">speed</span>Performance
                  </li>
                </a>
                
                <a href="#" data-settings-section="themes">
                  <li class="settingItem" data-id="themes">
                    <span class="material-symbols-outlined">palette</span>Themes
                  </li>
                </a>
                
                <a href="#" data-settings-section="proxy">
                  <li class="settingItem" data-id="proxy">
                    <span class="material-symbols-outlined">public</span>Proxy & Browser
                  </li>
                </a>
                
                <a href="#" data-settings-section="advertising">
                  <li class="settingItem" data-id="advertising">
                    <span class="material-symbols-outlined">ads_click</span>Advertising
                  </li>
                </a>
                
                <hr>
                
                <a href="#" data-settings-section="account">
                  <li class="settingItem" data-id="account">
                    <span class="material-symbols-outlined">account_circle</span>Account
                  </li>
                </a>
                
                <a href="#" data-settings-section="statistics">
                  <li class="settingItem" data-id="statistics">
                    <span class="material-symbols-outlined">help</span>About & Statistics
                  </li>
                </a>
                
                <hr>
                
                <a href="#" data-settings-section="news">
                  <li class="settingItem" data-id="news">
                    <span class="material-symbols-outlined">rocket_launch</span>News & Updates
                  </li>
                </a>
                
                <a href="#" data-settings-section="faq">
                  <li class="settingItem" data-id="faq">
                    <span class="material-symbols-outlined">contact_support</span>FAQ
                  </li>
                </a>
              </ul>
            </div>
            
            <div class="scontent" id="cloaking">
              <h1 class="settingsection1">Cloaking</h1>
                
                <div class="settingsection">
                  <h1>About:Blank & Blob Cloaking</h1>
                  <p>About:Blank allows you to hide your tab history, and blockers such as GoGuardian by appearing that you are on a blank tab. If About:Blank doesn't work, then you can try using the blob cloaking which uses temporary data.</p>
                  <div style="width: 100%; display: flex; justify-content: space-between;">
                    <button class="splitbutton" onclick="launchAboutBlank()">Launch About:Blank</button>
                    <button class="splitbutton" onclick="launchBlob()">Launch Blob</button>
                  </div>
                </div>
                
                <div class="settingsection">
                  <h1>Tab Cloaking</h1>
                  <p>Tab Cloaking cloaks the name of the tab & icon, so your tab stays hidden from sight. Select a cloak down below to activate it.</p>
                  <div class="dropdown dropdown-memory" id="tabCloak">
                    <button class="dropdown-button dropdown-toggle">
                      <span class="dropdown-selected">None (Default)</span>
                      <span id="arrow" class="material-symbols-outlined">chevron_right</span>
                    </button>
                    <ul class="dropdown-menu">
                      <li class="hidden">None (Default)</li>
                      <li class="second-to-first-conditional">Desmos</li>
                      <li>Google Classroom</li>
                      <li>Google Docs</li>
                      <li>Google Drive</li>
                      <li>Google Meet</li>
                      <li>Google Sheets</li>
                      <li>Google Slides</li>
                      <li>Google Translate</li>
                      <li>Khan Academy</li>
                      <li>Nearpod</li>
                      <li>Pear Deck</li>
                      <li>PowerSchool</li>
                      <li>Quizlet</li>
                      <li>Scholastic</li>
                      <li>Seesaw</li>
                      <li>Zoom</li>
                    </ul>
                  </div>
                </div>

                <div class="settingsection">
                  <h1>Automatic cloaking</h1>
                  <p>This toggles automatic cloaking when the site first loads which hides the site from entering your history.</p>
                  <p><b>Note: Only one automatic cloaking toggle is allowed at a time.</b></p>
                  <hr>
                  <p>Auto-Launch About:Blank</p>
                  <label class="switch">
                    <input class="checkbox checkbox-blob-aboutBlank autoLaunchAboutBlank" type="checkbox">
                    <span class="slider round"></span>
                  </label>
                  <p>Auto-Launch Blob</p>
                  <label class="switch">
                    <input class="checkbox checkbox-blob-aboutBlank autoLaunchBlob" type="checkbox">
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              
              <div class="scontent" id="plugins" style="display: none;">
                <h1 class="settingsection1">Plugins</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on bringing you amazing plugin functionality.</p>
                </div>
              </div>
              
              <div class="scontent" id="performance" style="display: none;">
                <h1 class="settingsection1">Performance</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on performance optimization tools.</p>
                </div>
              </div>
              
              <div class="scontent" id="themes" style="display: none;">
                <h1 class="settingsection1">Themes</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on theme customization options.</p>
                </div>
              </div>
              
              <div class="scontent" id="proxy" style="display: none;">
                <h1 class="settingsection1">Proxy & Browser</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on proxy and browser settings.</p>
                </div>
              </div>
              
              <div class="scontent" id="advertising" style="display: none;">
                <h1 class="settingsection1">Advertising</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on advertising controls.</p>
                </div>
              </div>
              
              <div class="scontent" id="account" style="display: none;">
                <h1 class="settingsection1">Account</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on account management features.</p>
                </div>
              </div>
              
              <div class="scontent" id="statistics" style="display: none;">
                <h1 class="settingsection1">About & Statistics</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on statistics and about information.</p>
                </div>
              </div>
              
              <div class="scontent" id="news" style="display: none;">
                <h1 class="settingsection1">News & Updates</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on news and updates.</p>
                </div>
              </div>
              
              <div class="scontent" id="faq" style="display: none;">
                <h1 class="settingsection1">FAQ</h1>
                <div class="settingsection">
                  <h1>Coming Soon</h1>
                  <p>This section is coming soon! We're working on frequently asked questions.</p>
                </div>
              </div>
              
              <div id="settings-plugins" class="settings-section">
                <div class="coming-soon-content">
                  <h3>Plugins</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-performance" class="settings-section">
                <div class="coming-soon-content">
                  <h3>Performance</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-themes" class="settings-section">
                <div class="coming-soon-content">
                  <h3>Themes</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-proxy" class="settings-section">
                <div class="coming-soon-content">
                  <h3>Proxy & Browser</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-advertising" class="settings-section">
                <div class="coming-soon-content">
                  <h3>Advertising</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-account" class="settings-section">
                <div class="coming-soon-content">
                  <h3>Account</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-statistics" class="settings-section">
                <div class="coming-soon-content">
                  <h3>About & Statistics</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-news" class="settings-section">
                <div class="coming-soon-content">
                  <h3>News & Updates</h3>
                  <p>This section is coming soon!</p>
                </div>
              </div>
              
              <div id="settings-website" class="settings-section">
                <h3>Website Settings</h3>
                
                <div class="settings-card">
                  <h4>Search Engine</h4>
                  <p>Customize your default search engine for proxy browsing.</p>
                  
                  <div class="settings-input">
                    <label for="search-engine">Default Search Engine:</label>
                    <select id="search-engine">
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="duckduckgo">DuckDuckGo</option>
                      <option value="yahoo">Yahoo</option>
              </select>
            </div>
                </div>
                
                <div class="settings-card">
                  <h4>UI Effects</h4>
                  <p>Control visual effects and animations for better performance.</p>
                  
                  <div class="settings-toggle">
                    <label>
                      <input type="checkbox" id="particles-enabled" checked>
                      <span class="toggle-slider"></span>
                      Enable Particle Effects
                    </label>
                  </div>
                  
                  <div class="settings-toggle">
                    <label>
                      <input type="checkbox" id="background-animations" checked>
                      <span class="toggle-slider"></span>
                      Enable Background Animations
                    </label>
            </div>
            
                  <div class="settings-toggle">
              <label>
                      <input type="checkbox" id="neon-glow">
                      <span class="toggle-slider"></span>
                      Enable Neon Glow Effects
              </label>
                  </div>
                </div>
              </div>
              
              <div id="settings-themes" class="settings-section">
                <h3>Themes</h3>
                
                <div class="settings-card">
                  <h4>Theme Selection</h4>
                  <p>Choose from different cyberpunk themes to customize your experience.</p>
                  
                  <div class="theme-grid">
                    <div class="theme-option active" data-theme="default-dark">
                      <div class="theme-preview default-dark"></div>
                      <h5>Default Dark</h5>
                      <p>Classic cyberpunk with neon blue accents</p>
                    </div>
                    
                    <div class="theme-option" data-theme="neon-grid">
                      <div class="theme-preview neon-grid"></div>
                      <h5>Neon Grid</h5>
                      <p>Grid-based design with glowing lines</p>
                    </div>
                    
                    <div class="theme-option" data-theme="cosmic-purple">
                      <div class="theme-preview cosmic-purple"></div>
                      <h5>Cosmic Purple</h5>
                      <p>Purple and pink cosmic theme</p>
                    </div>
                    
                    <div class="theme-option" data-theme="retro-terminal">
                      <div class="theme-preview retro-terminal"></div>
                      <h5>Retro Terminal</h5>
                      <p>Classic terminal green on black</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div id="settings-faq" class="settings-section">
                <h3>FAQ</h3>
                
                <div class="faq-container">
                  <div class="faq-item">
                    <button class="faq-question">
                      <span>Why is a site blocked?</span>
                      <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <div class="faq-answer">
                      <p>Sites may be blocked due to network restrictions, content filters, or geographic limitations. Our proxy servers help bypass these restrictions by routing your traffic through different servers.</p>
                    </div>
                  </div>
                  
                  <div class="faq-item">
                    <button class="faq-question">
                      <span>How to add links?</span>
                      <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <div class="faq-answer">
                      <p>You can add custom links by clicking the "Add Bookmark" button in the quick links section. Enter the URL and a custom name for easy access.</p>
                    </div>
                  </div>
                  
                  <div class="faq-item">
                    <button class="faq-question">
                      <span>How do proxies work?</span>
                      <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <div class="faq-answer">
                      <p>Proxies act as intermediaries between your device and the internet. They receive your requests, forward them to the target website, and return the response, effectively hiding your real location and IP address.</p>
                    </div>
                  </div>
                  
                  <div class="faq-item">
                    <button class="faq-question">
                      <span>Is using a proxy legal?</span>
                      <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <div class="faq-answer">
                      <p>Using proxies is generally legal for legitimate purposes like privacy protection and accessing geo-restricted content. However, always comply with local laws and website terms of service.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.vizualNetwork = new VizualNetwork();
});

// Add notification styles
const notificationStyles = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    padding: 1rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease-out;
  }
  
  .notification-info {
    background: linear-gradient(135deg, hsl(190 100% 50%), hsl(200 80% 70%));
  }
  
  .notification-success {
    background: linear-gradient(135deg, hsl(120 100% 50%), hsl(140 80% 70%));
  }
  
  .notification-warning {
    background: linear-gradient(135deg, hsl(45 100% 50%), hsl(60 80% 70%));
  }
  
  .notification-error {
    background: linear-gradient(135deg, hsl(0 100% 50%), hsl(20 80% 70%));
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    margin-left: 0.5rem;
  }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing VizualNetwork...');
  try {
    const app = new VizualNetwork();
    console.log('VizualNetwork initialized successfully:', app);
  } catch (error) {
    console.error('Error initializing VizualNetwork:', error);
  }
});