const fs = require('fs');
const path = require('path');
const { defineConfig } = require('vite');

function collectHtmlInputs(dir, root = dir, out = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlInputs(full, root, out);
      return;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      const rel = path.relative(root, full).replace(/\\/g, '/').replace(/\.html$/, '');
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
