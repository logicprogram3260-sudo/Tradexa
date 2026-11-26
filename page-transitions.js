(() => {
  let navigationStarted = false;
  const transitionDuration = 400;

  function isInternalHtmlUrl(url) {
    return url.origin === window.location.origin && /\.html$/i.test(url.pathname);
  }

  window.navigateWithTransition = destination => {
    const url = new URL(destination, window.location.href);
    if (!isInternalHtmlUrl(url)) {
      window.location.href = url.href;
      return;
    }

    if (navigationStarted) return;
    navigationStarted = true;
    document.body.style.removeProperty('animation');
    document.body.style.removeProperty('opacity');
    document.body.classList.add('page-transitioning-out');
    window.setTimeout(() => {
      window.location.href = url.href;
    }, transitionDuration);
  };

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a');
    if (!link || link.hasAttribute('download') ||
        (link.target && link.target.toLowerCase() !== '_self') ||
        link.getAttribute('data-bs-toggle') === 'modal' ||
        link.getAttribute('data-bs-dismiss') === 'modal') return;

    const href = link.getAttribute('href');
    if (!href || href.trim().startsWith('#')) return;

    const url = new URL(href, window.location.href);
    if (!isInternalHtmlUrl(url)) return;

    event.preventDefault();
    window.navigateWithTransition(url.href);
  });

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;

    navigationStarted = false;
    document.body.classList.remove('page-transitioning-out');
    document.body.style.animation = 'none';
    document.body.style.opacity = '1';
  });
})();
