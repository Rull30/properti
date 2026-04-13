async function mountFooter() {
  const host = document.querySelector('[data-footer-host]');
  if (!host) return;

  const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
  const res = await fetch(
    new URL('components/footer.html', window.location.origin + base).toString(),
    { cache: 'no-cache' }
  );
  if (!res.ok) return;
  host.innerHTML = await res.text();
}

mountFooter();
