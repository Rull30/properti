/**
 * Autentikasi agen via session server (cookie).
 */
(function (w) {
  w.AgentAuth = {
    me: null,

    async refresh() {
      try {
        const r = await fetch('/api/agent/me', { credentials: 'same-origin' });
        if (!r.ok) {
          this.me = null;
          return false;
        }
        const data = await r.json();
        this.me = data.agent || null;
        return true;
      } catch (e) {
        this.me = null;
        return false;
      }
    },

    isLoggedIn: function () {
      return !!this.me;
    },

    getEmail: function () {
      return (this.me && this.me.email) || '';
    },

    getName: function () {
      return (this.me && this.me.name) || 'Agen';
    },

    getId: function () {
      return (this.me && this.me.id) || '';
    },

    login: async function (email, password) {
      const r = await fetch('/api/agent/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: email, password: password }),
      });
      if (!r.ok) return false;
      await this.refresh();
      return true;
    },

    logout: async function () {
      try {
        await fetch('/api/agent/auth/logout', { method: 'POST', credentials: 'same-origin' });
      } catch (e) {}
      this.me = null;
    },

    guard: async function (loginPath) {
      loginPath = loginPath || '/agent/login';
      const ok = await this.refresh();
      if (!ok) {
        w.location.href = loginPath;
        return false;
      }
      return true;
    },
  };
})(window);
