/**
 * Autentikasi agen (demo, sessionStorage).
 * Tidak ada backend — hanya untuk alur UI.
 */
(function (w) {
    var SESSION_KEY = 'rumah123_agent_ok';
    var EMAIL_KEY = 'rumah123_agent_email';
    var NAME_KEY = 'rumah123_agent_name';

    w.AgentAuth = {
        isLoggedIn: function () {
            return w.sessionStorage.getItem(SESSION_KEY) === '1';
        },
        getEmail: function () {
            return w.sessionStorage.getItem(EMAIL_KEY) || '';
        },
        getName: function () {
            return w.sessionStorage.getItem(NAME_KEY) || 'Agen';
        },
        login: function (email, displayName) {
            w.sessionStorage.setItem(SESSION_KEY, '1');
            w.sessionStorage.setItem(EMAIL_KEY, email || '');
            w.sessionStorage.setItem(NAME_KEY, displayName || 'Agen');
        },
        logout: function () {
            w.sessionStorage.removeItem(SESSION_KEY);
            w.sessionStorage.removeItem(EMAIL_KEY);
            w.sessionStorage.removeItem(NAME_KEY);
        },
        /** Redirect ke login jika belum masuk. Return true jika boleh lanjut. */
        guard: function (loginPath) {
            loginPath = loginPath || 'login.html';
            if (!this.isLoggedIn()) {
                w.location.href = loginPath;
                return false;
            }
            return true;
        }
    };
})(window);
