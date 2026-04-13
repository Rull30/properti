const fs = require('fs');
const path = require('path');
const { defineConfig } = require('vite');

function collectHtmlInputs(dir, projectRoot = __dirname, out = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlInputs(full, projectRoot, out);
      return;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      let rel = path.relative(projectRoot, full).replace(/\\/g, '/').replace(/\.html$/, '');
      // Keep build output flat from "pages/" so project root URL serves index.html.
      if (rel.startsWith('pages/')) rel = rel.slice('pages/'.length);
      out[rel] = full;
    }
  });
  return out;
}

const pageInputs = collectHtmlInputs(path.join(__dirname, 'pages'));

module.exports = defineConfig({
  publicDir: 'public',
  base: '/properti/',
  build: {
    rollupOptions: {
      input: pageInputs,
    },
  },
});
