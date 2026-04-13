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
const copiedStaticScripts = [
  { from: 'agents-data.js', to: 'agents-data.js' },
  { from: 'listings-data.js', to: 'listings-data.js' },
  { from: 'listings-user-storage.js', to: 'listings-user-storage.js' },
  { from: 'agent/auth.js', to: 'agent/auth.js' },
];

module.exports = defineConfig({
  publicDir: 'public',
  base: '/properti/',
  plugins: [
    {
      name: 'copy-static-runtime-scripts',
      writeBundle() {
        const distDir = path.join(__dirname, 'dist');
        copiedStaticScripts.forEach((entry) => {
          const src = path.join(__dirname, entry.from);
          const dst = path.join(distDir, entry.to);
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          fs.copyFileSync(src, dst);
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: pageInputs,
    },
  },
});
