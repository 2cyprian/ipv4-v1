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
    this.currentRoute = window.location.pathname;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.updateActiveLink();
    this.navigate(window.location.pathname);

    // Intercept all internal link clicks
    document.body.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.classList.contains('navbar-link')) {
        const url = new URL(link.href, window.location.origin);
        if (url.origin === window.location.origin && this.routes[url.pathname]) {
          e.preventDefault();
          this.go(url.pathname);
        }
      }
    });

    // Handle browser navigation (back/forward)
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname);
    });
  }

  go(path) {
    if (this.currentRoute === path) return;
    window.history.pushState({}, '', path);
    this.navigate(path);
  }

  navigate(path) {
    if (!this.routes[path]) {
      // fallback to home if route not found
      path = '/';
    }
    this.currentRoute = path;
    this.loadPage(this.routes[path]);
    this.updateActiveLink();
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
        window.scrollTo(0, 0);
        currentMain.innerHTML = main.innerHTML;
        // Inject navbar and footer after main content update
        await this.injectPartial('navbar-container', '/src/components/navbar.html');
        await this.injectPartial('footer-container', '/src/components/footer.html');
        setTimeout(async () => {
          document.querySelectorAll('.slide-up-fade-in, .fade-in-hero').forEach(el => {
            el.style.animation = 'none';
            el.offsetWidth;
            el.style.animation = '';
          });
          // Dynamically import JS for each route
          if (this.currentRoute === '/training') {
            await import('/src/js/components/training.js');
          } else if (this.currentRoute === '/stats') {
            await import('/src/js/components/stats.js');
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