// Content stays visible even when scripting or scroll observation is unavailable.
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    }
  });
  document.querySelectorAll('[data-reveal]').forEach(section => observer.observe(section));
}

const viewer = document.querySelector('#photo-viewer');
if (viewer && typeof viewer.showModal === 'function') {
  const grid = document.querySelector('.album-grid');
  const photos = Array.from(grid.querySelectorAll('.album-photo'));
  const image = document.createElement('img');
  image.className = 'viewer-image';
  image.alt = ''; // The adjacent, visible caption describes the selected photograph.
  viewer.querySelector('.viewer-frame').append(image);
  const count = viewer.querySelector('.viewer-count');
  const caption = viewer.querySelector('.viewer-caption');
  let current = 0;
  let opener;

  function display(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    image.src = photo.href;
    count.textContent = `Photo ${current + 1} of ${photos.length}`;
    caption.textContent = photo.querySelector('img').alt;
  }

  function openPhoto(photo) {
    opener = photo;
    display(photos.indexOf(photo));
    viewer.showModal();
  }

  grid.addEventListener('click', event => {
    const photo = event.target.closest('.album-photo');
    if (!photo || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openPhoto(photo);
  });
  viewer.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => display(current + Number(button.dataset.step)));
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      display(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  viewer.addEventListener('close', () => opener.focus());

  // Homepage highlights link straight to their photograph in the album.
  const linkedPhoto = document.getElementById(location.hash.slice(1));
  if (linkedPhoto && grid.contains(linkedPhoto) && linkedPhoto.matches('.album-photo')) {
    openPhoto(linkedPhoto);
  }
}
