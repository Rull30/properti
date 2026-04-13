async function mountFooter() {
  const host = document.querySelector('[data-footer-host]');
  if (!host) return;

  const res = await fetch('/components/footer.html', { cache: 'no-cache' });
  if (!res.ok) return;
  host.innerHTML = await res.text();
}

mountFooter();
