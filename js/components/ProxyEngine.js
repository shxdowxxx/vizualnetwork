// VizualNetwork - Proxy Engine Management

class ProxyEngine {
  constructor() {
    this.engines = {
      rammerhead: {
        name: 'Rammerhead',
        description: 'Stable, full browser proxy with advanced features',
        icon: '🛡️',
        features: ['Full browser support', 'Advanced tab cloaking', 'Stable connections'],
        color: 'neon-blue'
      },
      scramjet: {
        name: 'Scramjet',
        description: 'Fast, lightweight proxy for quick browsing',
        icon: '⚡',
        features: ['Lightning fast', 'Low resource usage', 'Quick setup'],
        color: 'neon-light-blue'
      },
      wisp: {
        name: 'Wisp',
        description: 'Experimental, WebSocket-based proxy for cutting-edge performance',
        icon: '🌐',
        features: ['WebSocket technology', 'Experimental features', 'High performance'],
        color: 'neon-cyan'
      }
    };
    
    this.currentEngine = 'rammerhead';
  }

  getEngine(engineId) {
    return this.engines[engineId] || this.engines.rammerhead;
  }

  getAllEngines() {
    return Object.keys(this.engines).map(id => ({
      id,
      ...this.engines[id]
    }));
  }

  setCurrentEngine(engineId) {
    if (this.engines[engineId]) {
      this.currentEngine = engineId;
      this.updateUI();
    }
  }

  getCurrentEngine() {
    return this.getEngine(this.currentEngine);
  }

  updateUI() {
    const engine = this.getCurrentEngine();
    
    // Update engine description
    const descriptionElement = document.getElementById('engine-description');
    if (descriptionElement) {
      descriptionElement.textContent = `Using ${engine.name} - ${engine.description}`;
    }

    // Update engine selector
    const selector = document.getElementById('engine-selector');
    if (selector) {
      selector.value = this.currentEngine;
    }

    // Update visual indicators
    this.updateEngineIndicators(engine);
  }

  updateEngineIndicators(engine) {
    // Update any visual indicators based on the current engine
    const indicators = document.querySelectorAll('[data-engine-indicator]');
    indicators.forEach(indicator => {
      indicator.className = `engine-indicator ${engine.color}`;
      indicator.textContent = engine.icon;
    });
  }

  async testConnection(engineId = this.currentEngine) {
    const engine = this.getEngine(engineId);
    
    try {
      // Test connection to actual proxy services
      const testUrls = {
        'rammerhead': 'https://browser.rammerhead.org',
        'scramjet': 'https://scramjet.org', 
        'wisp': 'https://wisp.org'
      };
      
      const testUrl = testUrls[engineId] || 'https://www.croxyproxy.com';
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      return true; // If no error, assume connection is good
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  getEngineStats(engineId = this.currentEngine) {
    // Return mock stats for now
    return {
      uptime: '99.9%',
      latency: Math.floor(Math.random() * 50) + 10,
      requests: Math.floor(Math.random() * 10000) + 5000,
      status: 'online'
    };
  }

  renderEngineSelector() {
    const engines = this.getAllEngines();
    
    return `
      <div class="engine-selector-container">
        <label for="engine-selector" class="engine-selector-label">
          Choose Proxy Engine
        </label>
        <select id="engine-selector" class="engine-select">
          ${engines.map(engine => `
            <option value="${engine.id}" ${engine.id === this.currentEngine ? 'selected' : ''}>
              ${engine.icon} ${engine.name} - ${engine.description}
            </option>
          `).join('')}
        </select>
        
        <div class="engine-info">
          <div class="engine-icon">${this.getCurrentEngine().icon}</div>
          <div class="engine-details">
            <h4>${this.getCurrentEngine().name}</h4>
            <p>${this.getCurrentEngine().description}</p>
            <div class="engine-features">
              ${this.getCurrentEngine().features.map(feature => `
                <span class="feature-tag">${feature}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderEngineStats() {
    const stats = this.getEngineStats();
    const engine = this.getCurrentEngine();
    
    return `
      <div class="engine-stats">
        <h3>${engine.name} Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Status</span>
            <span class="stat-value status-${stats.status}">${stats.status}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Uptime</span>
            <span class="stat-value">${stats.uptime}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Latency</span>
            <span class="stat-value">${stats.latency}ms</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Requests</span>
            <span class="stat-value">${stats.requests.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Export for use in main application
window.ProxyEngine = ProxyEngine;
