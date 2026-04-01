/**
 * Simple Router for Client-Side Navigation
 */

class Router {
  constructor() {
    this.routes = {
      '/': '/index.html',
      '/training': '/training/index.html',
      '/stats': '/stats/index.html',
      '/resources': '/resources/index.html',
    };
    this.routeStyles = {
      '/': ['/src/css/home.css'],
      '/training': ['/src/css/home.css', '/src/css/training.css'],
      '/stats': [],
      '/resources': ['/src/css/home.css', '/src/css/training.css', '/src/css/resources.css'],
    };
    this.currentRoute = window.location.pathname;
    this.isInitialized = false;
  }

  normalizePath(path) {
    // Remove /index.html and trailing slashes
    if (path.endsWith('/index.html')) {
      path = path.replace('/index.html', '');
    }
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path || '/';
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    // On initial load, just set the current route without fetching
    // (page is already loaded by the server)
    const normPath = this.normalizePath(window.location.pathname);
    this.currentRoute = this.routes[normPath] ? normPath : '/';
    this.syncRouteStyles(this.currentRoute);
    this.updateActiveLink();

    // Intercept all internal link clicks
    document.body.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.classList.contains('navbar-link')) {
        const url = new URL(link.href, window.location.origin);
        const normPath = this.normalizePath(url.pathname);
        if (url.origin === window.location.origin && this.routes[normPath]) {
          e.preventDefault();
          this.go(normPath);
        }
      }
    });

    // Handle browser navigation (back/forward)
    window.addEventListener('popstate', () => {
      this.navigate(this.normalizePath(window.location.pathname));
    });
  }

  go(path) {
    if (this.currentRoute === path) return;
    window.history.pushState({}, '', path);
    this.navigate(path);
  }

  navigate(path) {
    const normPath = this.normalizePath(path);
    if (!this.routes[normPath]) {
      // fallback to home if route not found
      path = '/';
    } else {
      path = normPath;
    }
    
    // Skip loading if already on this route (avoids flickering on refresh)
    if (this.currentRoute === path) {
      this.updateActiveLink();
      return;
    }
    
    this.currentRoute = path;
    this.syncRouteStyles(path);
    this.loadPage(this.routes[path]);
    this.updateActiveLink();
  }

  syncRouteStyles(path) {
    const requiredStyles = this.routeStyles[path] || [];
    const managedSelector = 'link[data-route-style="true"]';

    document.querySelectorAll(managedSelector).forEach(link => {
      const href = new URL(link.href, window.location.origin).pathname;
      if (!requiredStyles.includes(href)) {
        link.remove();
      }
    });

    requiredStyles.forEach(href => {
      const existingLink = Array.from(document.querySelectorAll(managedSelector)).find(link => {
        return new URL(link.href, window.location.origin).pathname === href;
      });

      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.dataset.routeStyle = 'true';
        document.head.appendChild(link);
      }
    });
  }

  loadPage(page) {
    fetch(page)
      .then(r => r.text())
      .then(html => {
        this.renderPage(html);
      })
      .catch(e => console.error('Page load error:', e));
  }

  async renderPage(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const main = doc.querySelector('main');
    if (main) {
      const currentMain = document.querySelector('main');
      if (currentMain) {
        currentMain.innerHTML = main.innerHTML;
        // Scroll to hero element
        const hero = document.querySelector('.hero, #hero');
        if (hero) {
          hero.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        // Don't re-inject navbar on navigation - it persists
        // Only update active link state
        this.updateActiveLink();
        // Inject footer after main content update
        await this.injectPartial('footer-container', '/src/components/footer.html');
        setTimeout(async () => {
          document.querySelectorAll('.slide-up-fade-in, .fade-in-hero').forEach(el => {
            el.style.animation = 'none';
            el.offsetWidth;
            el.style.animation = '';
          });
          
          // Initialize components based on current route
          if (this.currentRoute === '/') {
            const { initHome } = await import('./components/home.js');
            initHome();
          } else if (this.currentRoute === '/training') {
            const { initTraining } = await import('./components/training.js');
            initTraining();
          } else if (this.currentRoute === '/resources') {
            const { initResources } = await import('./components/resources.js');
            initResources();
          }
          // Add more routes as needed
        }, 50);
      }
    }
  }

  // Utility to inject HTML partials into containers by ID
  async injectPartial(containerId, url) {
    const container = document.getElementById(containerId);
    if (container) {
      try {
        const resp = await fetch(url);
        if (resp.ok) {
          container.innerHTML = await resp.text();
        }
      } catch (e) {
        // fail silently
      }
    }
  }

  add(path, page) {
    this.routes[path] = page;
  }

  getCurrentPath() {
    return this.currentRoute;
  }

  updateActiveLink() {
    document.querySelectorAll('.navbar-link').forEach(link => {
      const url = new URL(link.href, window.location.origin);
      link.classList.toggle('active', url.pathname === this.currentRoute);
    });
  }
}

export default Router;
