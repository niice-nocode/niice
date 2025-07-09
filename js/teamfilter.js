function initFilterBasic() {
  const groups = document.querySelectorAll('[data-filter-group]');

  groups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter-target]');
    const items = group.querySelectorAll('[data-filter-name]');
    const transitionDelay = 300;

    const updateStatus = (element, shouldBeActive) => {
      element.setAttribute('data-filter-status', shouldBeActive ? 'active' : 'not-active');
      element.setAttribute('aria-hidden', shouldBeActive ? 'false' : 'true');
    };

    const handleFilter = (target) => {
      items.forEach((item) => {
        const shouldBeActive = target === 'all' || item.getAttribute(
          'data-filter-name') === target;
        const currentStatus = item.getAttribute('data-filter-status');

        if (currentStatus === 'active') {
          item.setAttribute('data-filter-status', 'transition-out');
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      buttons.forEach((button) => {
        const isActive = button.getAttribute('data-filter-target') === target;
        button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-filter-target');
        if (button.getAttribute('data-filter-status') === 'active') return;
        handleFilter(target);
      });
    });
  });
}

initFilterBasic();