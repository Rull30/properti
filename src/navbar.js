async function mountNavbar() {
  const host = document.querySelector('[data-navbar-host]');
  if (!host) return;

  const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
  const res = await fetch(
    new URL('components/navbar.html', window.location.origin + base).toString(),
    { cache: 'no-cache' }
  );
  if (!res.ok) return;
  host.innerHTML = await res.text();

  const activeKey = host.getAttribute('data-navbar-active') || '';
  if (!activeKey) return;

  const activeLink = host.querySelector('[data-nav-key="' + activeKey + '"]');
  if (!activeLink) return;
  activeLink.classList.remove('hover:text-brand');
  activeLink.classList.add('text-brand', 'font-semibold');
}

mountNavbar();
