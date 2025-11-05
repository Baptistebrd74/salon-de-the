document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const container = document.querySelector('.carousel-container');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || !prevButton || !nextButton || !dotsContainer) {
    console.error('Carrousel : éléments manquants. Vérifie tes classes HTML.');
    return;
  }

  const originalSlides = Array.from(track.querySelectorAll('.carousel-item'));
  if (originalSlides.length === 0) {
    console.error('Carrousel : aucune .carousel-item trouvée.');
    return;
  }

  const slideCount = originalSlides.length;

 
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[slideCount - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  
  const slides = Array.from(track.querySelectorAll('.carousel-item'));
  let currentIndex = 1; 
  let isTransitioning = false;

 
  const setPosition = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

 
  dotsContainer.innerHTML = '';
  for (let i = 0; i < slideCount; i++) {
    const d = document.createElement('span');
    d.classList.add('dot');
    if (i === 0) d.classList.add('active');
    d.dataset.index = i + 1; 
    dotsContainer.appendChild(d);
  }
  const dots = Array.from(dotsContainer.children);

 
  const moveTo = (index) => {
    if (isTransitioning) return;
    isTransitioning = true;
    track.style.transition = 'transform 0.6s ease';
    currentIndex = index;
    setPosition();
  };

 
  const syncDots = () => {
    const logicalIndex = ((currentIndex - 1) % slideCount + slideCount) % slideCount; 
    dots.forEach(d => d.classList.remove('active'));
    dots[logicalIndex].classList.add('active');
  };

  
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
   
    if (slides[currentIndex].isEqualNode(firstClone)) {
      track.style.transition = 'none';
      currentIndex = 1;
      setPosition();
    }

    if (slides[currentIndex].isEqualNode(lastClone)) {
      track.style.transition = 'none';
      currentIndex = slideCount;
      setPosition();
    }
   
    syncDots();
  });

  // Buttons
  nextButton.addEventListener('click', () => {
    if (isTransitioning) return;
    moveTo(currentIndex + 1);
  });

  prevButton.addEventListener('click', () => {
    if (isTransitioning) return;
    moveTo(currentIndex - 1);
  });


  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = Number(e.currentTarget.dataset.index);
      if (!isNaN(targetIndex)) moveTo(targetIndex);
    });
  });

  // Autoplay with pause on hover
  let autoplayId = null;
  const startAuto = () => {
    stopAuto();
    autoplayId = setInterval(() => {
      moveTo(currentIndex + 1);
    }, 4500);
  };
  const stopAuto = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  container.addEventListener('mouseenter', stopAuto);
  container.addEventListener('mouseleave', startAuto);

  
  setPosition();
  
  startAuto();

  
  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    setPosition();
  });
});
