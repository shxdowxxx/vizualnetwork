// VizualNetwork - Animation Utilities

class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupHoverEffects();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerAnimation(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.observers.set('intersection', observer);
  }

  setupScrollAnimations() {
    let ticking = false;
    
    const updateScrollAnimations = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Parallax effect for background elements
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      // Scroll-triggered animations
      const scrollElements = document.querySelectorAll('[data-scroll-animation]');
      scrollElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible && !element.classList.contains('animate-in')) {
          element.classList.add('animate-in');
        }
      });
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick);
  }

  setupHoverEffects() {
    // Add hover effects to interactive elements
    const hoverElements = document.querySelectorAll('[data-hover-effect]');
    
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.addHoverEffect(element);
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeHoverEffect(element);
      });
    });
  }

  triggerAnimation(element) {
    const animationType = element.dataset.animation || 'fadeIn';
    const delay = parseInt(element.dataset.delay) || 0;
    
    setTimeout(() => {
      element.classList.add(`animate-${animationType}`);
    }, delay);
  }

  addHoverEffect(element) {
    const effect = element.dataset.hoverEffect || 'glow';
    
    switch (effect) {
      case 'glow':
        element.style.boxShadow = '0 0 20px hsl(var(--neon-blue) / 0.5)';
        break;
      case 'scale':
        element.style.transform = 'scale(1.05)';
        break;
      case 'slide':
        element.style.transform = 'translateX(10px)';
        break;
      case 'rotate':
        element.style.transform = 'rotate(5deg)';
        break;
    }
  }

  removeHoverEffect(element) {
    element.style.boxShadow = '';
    element.style.transform = '';
  }

  // Predefined animation functions
  fadeIn(element, duration = 500) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  slideInLeft(element, duration = 500) {
    element.style.transform = 'translateX(-100px)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  }

  slideInRight(element, duration = 500) {
    element.style.transform = 'translateX(100px)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  }

  slideInUp(element, duration = 500) {
    element.style.transform = 'translateY(50px)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  }

  zoomIn(element, duration = 500) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  }

  // Cyberpunk specific animations
  neonPulse(element, duration = 2000) {
    const originalBoxShadow = element.style.boxShadow;
    
    const pulse = () => {
      element.style.boxShadow = '0 0 30px hsl(var(--neon-blue) / 0.8)';
      setTimeout(() => {
        element.style.boxShadow = originalBoxShadow;
      }, duration / 2);
    };
    
    pulse();
    return setInterval(pulse, duration);
  }

  cyberGlitch(element, duration = 100) {
    const originalTransform = element.style.transform;
    const glitchFrames = [
      'translateX(-2px)',
      'translateX(2px)',
      'translateX(-1px)',
      'translateX(1px)',
      'translateX(0)'
    ];
    
    let frameIndex = 0;
    const glitchInterval = setInterval(() => {
      element.style.transform = glitchFrames[frameIndex];
      frameIndex = (frameIndex + 1) % glitchFrames.length;
    }, duration / glitchFrames.length);
    
    setTimeout(() => {
      clearInterval(glitchInterval);
      element.style.transform = originalTransform;
    }, duration);
  }

  matrixRain(container, options = {}) {
    const {
      characters = '01',
      fontSize = 14,
      speed = 50,
      density = 0.02
    } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.1';
    canvas.style.zIndex = '1';
    
    container.appendChild(canvas);
    
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, speed);
    
    return () => {
      clearInterval(interval);
      canvas.remove();
      window.removeEventListener('resize', resizeCanvas);
    };
  }

  // Utility methods
  observeElement(element, animationType = 'fadeIn') {
    const observer = this.observers.get('intersection');
    if (observer) {
      element.dataset.animation = animationType;
      observer.observe(element);
    }
  }

  unobserveElement(element) {
    const observer = this.observers.get('intersection');
    if (observer) {
      observer.unobserve(element);
    }
  }

  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    this.animations.clear();
  }
}

// CSS Animation Classes
const animationStyles = `
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-slideInLeft {
    animation: slideInLeft 0.5s ease-out;
  }
  
  .animate-slideInRight {
    animation: slideInRight 0.5s ease-out;
  }
  
  .animate-slideInUp {
    animation: slideInUp 0.5s ease-out;
  }
  
  .animate-zoomIn {
    animation: zoomIn 0.5s ease-out;
  }
  
  .animate-neonPulse {
    animation: neonPulse 2s ease-in-out infinite alternate;
  }
  
  .animate-cyberGlitch {
    animation: cyberGlitch 0.1s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-50px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(50px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(50px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes zoomIn {
    from { 
      opacity: 0; 
      transform: scale(0.8); 
    }
    to { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  @keyframes neonPulse {
    0% { 
      box-shadow: 0 0 20px hsl(var(--neon-blue) / 0.5);
      filter: brightness(1);
    }
    100% { 
      box-shadow: 0 0 40px hsl(var(--neon-blue) / 0.8);
      filter: brightness(1.2);
    }
  }
  
  @keyframes cyberGlitch {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-2px); }
    20% { transform: translateX(2px); }
    30% { transform: translateX(-1px); }
    40% { transform: translateX(1px); }
    50% { transform: translateX(0); }
  }
`;

// Add animation styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Export for use in main application
window.AnimationManager = AnimationManager;
