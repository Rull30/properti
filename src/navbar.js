async function mountNavbar() {
  const host = document.querySelector('[data-navbar-host]');
  if (!host) return;

  const res = await fetch('/components/navbar.html', { cache: 'no-cache' });
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
