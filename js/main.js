// LENIS SMOOTH SCROLL
let lenis = new Lenis({
  lerp: 0.14,
  wheelMultiplier: 0.8,
  gestureOrientation: "vertical",
  normalizeWheel: false,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
$("[data-lenis-start]").on("click", function () {
  lenis.start();
});
$("[data-lenis-stop]").on("click", function () {
  lenis.stop();
});
$("[data-lenis-toggle]").on("click", function () {
  $(this).toggleClass("stop-scroll");
  if ($(this).hasClass("stop-scroll")) {
    lenis.stop();
  } else {
    lenis.start();
  }
});

// BUTTON HOVERS
function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}

// Header scroll
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".section_title",
  start: "top top",
  end: "+=350%", // Vergroot naar wens (100% is 1 viewport hoogte)
  pin: true,
  pinSpacing: true, // zorgt dat het volgende element naar beneden wordt gedrukt
  scrub: false
});

// Initialize Button Character Stagger Animation
initButtonCharacterStagger();

// Marquee Scroll
function initMarqueeScrollDirection() {
  document.querySelectorAll('[data-marquee-scroll-direction-target]').forEach((marquee) => {
    // Query marquee elements
    const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
    const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
    if (!marqueeContent || !marqueeScroll) return;

    // Get data attributes
    const {
      marqueeSpeed: speed,
      marqueeDirection: direction,
      marqueeDuplicate: duplicate,
      marqueeScrollSpeed: scrollSpeed
    } = marquee.dataset;

    // Convert data attributes to usable types
    const marqueeSpeedAttr = parseFloat(speed);
    const marqueeDirectionAttr = direction === 'right' ? 1 : -1; // 1 for right, -1 for left
    const duplicateAmount = parseInt(duplicate || 0);
    const scrollSpeedAttr = parseFloat(scrollSpeed);
    const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

    let marqueeSpeed = marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) *
      speedMultiplier;

    // Precompute styles for the scroll container
    marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
    marqueeScroll.style.width = `${(scrollSpeedAttr * 2) + 100}%`;

    // Duplicate marquee content
    if (duplicateAmount > 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < duplicateAmount; i++) {
        fragment.appendChild(marqueeContent.cloneNode(true));
      }
      marqueeScroll.appendChild(fragment);
    }

    // GSAP animation for marquee content
    const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
    const animation = gsap.to(marqueeItems, {
      xPercent: -100, // Move completely out of view
      repeat: -1,
      duration: marqueeSpeed,
      ease: 'linear'
    }).totalProgress(0.5);

    // Initialize marquee in the correct direction
    gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
    animation.timeScale(marqueeDirectionAttr); // Set correct direction
    animation.play(); // Start animation immediately

    // Set initial marquee status
    marquee.setAttribute('data-marquee-status', 'normal');

    // ScrollTrigger logic for direction inversion
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const isInverted = self.direction === 1; // Scrolling down
        const currentDirection = isInverted ? -marqueeDirectionAttr :
          marqueeDirectionAttr;

        // Update animation direction and marquee status
        animation.timeScale(currentDirection);
        marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
      }
    });

    // Extra speed effect on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0
      }
    });

    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
    const scrollEnd = -scrollStart;

    tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });
  });
}
initMarqueeScrollDirection();

// Change Page Title on Leave
const documentTitleStore = document.title;
const documentTitleOnBlur = "🚀 Lets's Create Digital Happiness"; // Define your custom title here

// Set original title if user is on the site
window.addEventListener("focus", () => {
  document.title = documentTitleStore;
});

// If user leaves tab, set the alternative title
window.addEventListener("blur", () => {
  document.title = documentTitleOnBlur;
});

// Niice-tag
const credits = document.querySelector('.credits');

credits.addEventListener('mouseenter', () => {
  credits.classList.remove('hover-out');
  credits.classList.add('hover-in');
});

credits.addEventListener('mouseleave', () => {
  credits.classList.remove('hover-in');
  credits.classList.add('hover-out');
});

// Wacht tot alle lettertypen zijn geladen
document.fonts.ready.then(() => {
  gsap.registerPlugin(ScrollTrigger);

  // Hero-heading animatie (zonder ScrollTrigger)
  const heroEl = document.querySelector('[data-animate="hero-heading"]');
  if (heroEl) {
    const parentSplit = new SplitText(heroEl, { type: "lines", linesClass: "lineParent" });
    const childSplit = new SplitText(heroEl, { type: "lines", linesClass: "lineChild" });

    gsap.from(childSplit.lines, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.25,
      duration: 0.5,
      delay: 0.5,
      ease: "expo.out",
    });
  }

  // Split-lines animatie met ScrollTrigger
  document.querySelectorAll('[data-animate="split-lines"]').forEach((el) => {
    const parentSplit = new SplitText(el, { type: "lines", linesClass: "lineParent" });
    const childSplit = new SplitText(el, { type: "lines", linesClass: "lineChild" });

    gsap.from(childSplit.lines, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.25,
      duration: 0.5,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true
      }
    });
  });
});

// Projects
$(".scroll_wrap").each(function () {
  let triggers = $(this).find(".scroll_trigger");
  let items = $(this).find(".scroll_item");
  triggers.each(function (index) {
    let background = $(this).find(".scroll_background");
    let item = items.eq(index);

    if (index === 0) {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        defaults: {
          ease: "none"
        }
      });
      tl.fromTo(
        item, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }
      );
    } else if (index === items.length - 1) {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        },
        defaults: {
          ease: "none"
        }
      });
      tl.fromTo(
        item, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
      );
    } else {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        defaults: {
          ease: "none"
        }
      });
      tl.fromTo(
        item, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
      );
      tl.to(item, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
    }

    let tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      defaults: {
        ease: "none"
      }
    });
    tl2.to(background, { yPercent: 50 });
  });
});

gsap.registerPlugin(SplitText, ScrollTrigger);

// SplitText voor headings (zonder ScrollTrigger)
let headings = document.querySelectorAll('[data-split="heading"]');
headings.forEach(heading => {
  SplitText.create(heading, {
    type: "lines",
    autoSplit: true,
    mask: "lines",
    onSplit(self) {
      gsap.from(self.lines, {
        duration: 0.8,
        yPercent: 110,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%',
          once: true,
        }
      });
    }
  });
});

// Client logos wisselen
const clientLogos = document.querySelectorAll('.client-logo-block');

if (clientLogos) {
  clientLogos.forEach(clientLogo => {
    const logos = clientLogo.querySelectorAll('.logo');
    const visibleLogos = Array.from(logos).slice(0, 1); // Eén zichtbaar
    const hiddenLogos = Array.from(logos).slice(1); // De rest verborgen

    visibleLogos.forEach(logo => {
      logo.style.display = 'block';
    });
    hiddenLogos.forEach(logo => {
      logo.style.display = 'none';
    });

    function getRandomIndex(array) {
      return Math.floor(Math.random() * array.length);
    }

    function switchLogos() {
      if (hiddenLogos.length === 0) return;

      const randomVisibleIndex = getRandomIndex(visibleLogos);
      const randomHiddenIndex = getRandomIndex(hiddenLogos);

      const logoToHide = visibleLogos[randomVisibleIndex];
      const logoToShow = hiddenLogos[randomHiddenIndex];

      visibleLogos.splice(randomVisibleIndex, 1);
      hiddenLogos.splice(randomHiddenIndex, 1);

      visibleLogos.push(logoToShow);
      hiddenLogos.push(logoToHide);

      // Verberg huidige logo
      gsap.to(logoToHide, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          logoToHide.style.display = 'none';

          // Toon nieuw logo van boven naar beneden
          logoToShow.style.display = 'block';
          gsap.fromTo(logoToShow, { y: '-100%', opacity: 0 }, {
            y: '0%',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
          });
        }
      });
    }

    const randomStartDelay = Math.random() * 6000;

    setTimeout(() => {
      setInterval(() => {
        switchLogos();
      }, 5000);
    }, randomStartDelay);
  });
}

let emojiAnimationRunning = false;

function initEmojiRain(emojiTypes, emojiContainer) {
  if (emojiAnimationRunning) return;

  emojiAnimationRunning = true;

  const emojiContainerHeight = emojiContainer.offsetHeight;
  const emojiQuantity = 60;

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const createEmojiElement = () => {
    const emojiScale = Math.random() * 0.6 + 0.4;
    const emojiRotate = getRandomInt(1, 5);
    const emojiDelay = 0.001 * getRandomInt(0, 1250);
    const emojiSpeed = getRandomInt(500, 1500) * 0.001;
    const emojiPosition = `${getRandomInt(0, 10)}0%`;
    const emojiClass =
      `single-rain-emoji-image-${emojiTypes[Math.floor(Math.random() * emojiTypes.length)]}`;

    const singleEmoji = document.createElement("div");
    singleEmoji.className = "single-rain-emoji append";
    singleEmoji.style.left = emojiPosition;

    const singleEmojiChild = document.createElement("div");
    singleEmojiChild.className = emojiClass;
    singleEmoji.appendChild(singleEmojiChild);

    gsap.fromTo(
      singleEmoji, {
        y: emojiContainerHeight,
        xPercent: -50,
        rotate: 0.001,
        scale: emojiScale
      }, {
        y: "-100%",
        xPercent: -50,
        rotate: 0.001,
        delay: emojiDelay,
        ease: "Power1.easeIn",
        duration: emojiSpeed
      }
    );

    gsap.fromTo(
      singleEmojiChild, { xPercent: -25, rotate: emojiRotate }, {
        xPercent: 25,
        rotate: -
          emojiRotate,
        ease: "Power1.easeInOut",
        delay: emojiDelay,
        duration: 0.8,
        repeat: -1,
        yoyo: true
      }
    );

    emojiContainer.appendChild(singleEmoji);
  };

  Array.from({ length: emojiQuantity }).forEach(createEmojiElement);

  setTimeout(() => {
    emojiContainer.querySelectorAll(".single-rain-emoji.append").forEach(el => el.remove());
    emojiAnimationRunning = false;
  }, 2750);
}

function initEmojiRainActions() {
  document.querySelectorAll("[data-emoji-rain-type-1]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const type1 = trigger.getAttribute("data-emoji-rain-type-1");
      const type2 = trigger.getAttribute("data-emoji-rain-type-2") || type1;
      const emojiContainer = document.querySelector("[data-emoji-rain-container]");

      if (!emojiContainer) {
        console.warn("No emoji rain container found with [data-emoji-rain-container]");
        return;
      }

      initEmojiRain([type1, type2], emojiContainer);
    });
  });
}

// Initialize Emoji Rain Effect
initEmojiRainActions();

// Initialize Detect Scrolling Direction
initDetectScrollingDirection();

function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 10; // Minimal scroll distance to switch to up/down 
  const thresholdTop = 50; // Minimal scroll distance from top of window to start

  window.addEventListener('scroll', () => {
    const nowScrollTop = window.scrollY;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      // Update Scroll Direction
      const direction = nowScrollTop > lastScrollTop ? 'down' : 'up';
      document.querySelectorAll('[data-scrolling-direction]').forEach(el =>
        el.setAttribute('data-scrolling-direction', direction)
      );

      // Update Scroll Started
      const started = nowScrollTop > thresholdTop;
      document.querySelectorAll('[data-scrolling-started]').forEach(el =>
        el.setAttribute('data-scrolling-started', started ? 'true' : 'false')
      );

      lastScrollTop = nowScrollTop;
    }
  });
}

function initVimeoBGVideo() {
  const vimeoPlayers = document.querySelectorAll('[data-vimeo-bg-init]');

  vimeoPlayers.forEach(function (vimeoElement, index) {
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
    if (!vimeoVideoID) return;

    const iframe = vimeoElement.querySelector('iframe');
    if (!iframe) return;

    const vimeoVideoURL =
      `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=1&muted=1`;
    iframe.setAttribute('src', vimeoVideoURL);

    const videoIndexID = 'vimeo-bg-index-' + index;
    vimeoElement.setAttribute('id', videoIndexID);

    const player = new Vimeo.Player(iframe);

    let videoAspectRatio;

    // Aspect ratio aanpassen
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
      player.getVideoWidth().then(function (width) {
        player.getVideoHeight().then(function (height) {
          videoAspectRatio = height / width;
          const beforeEl = vimeoElement.querySelector('.vimeo-bg__before');
          if (beforeEl) {
            beforeEl.style.paddingTop = videoAspectRatio * 100 + '%';
          }
          adjustVideoSizing(); // pas aan zodra ratio bekend is
        });
      });
    }

    // Sizing logica
    function adjustVideoSizing() {
      if (!videoAspectRatio) return;

      const containerAspectRatio = vimeoElement.offsetHeight / vimeoElement.offsetWidth;
      const iframeWrapper = vimeoElement.querySelector('.vimeo-bg__iframe-wrapper');

      if (iframeWrapper) {
        if (containerAspectRatio > videoAspectRatio) {
          iframeWrapper.style.width = `${(containerAspectRatio / videoAspectRatio) * 100}%`;
        } else {
          iframeWrapper.style.width = '';
        }
      }
    }

    window.addEventListener('resize', adjustVideoSizing);

    // Video geladen
    player.on('play', function () {
      vimeoElement.setAttribute('data-vimeo-loaded', 'true');
    });

    // Autoplay
    const autoplay = vimeoElement.getAttribute('data-vimeo-autoplay') !== 'false';
    const pausedByUser = vimeoElement.getAttribute('data-vimeo-paused-by-user') === 'true';

    function checkVisibility() {
      const rect = vimeoElement.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      inView ? vimeoPlayerPlay() : vimeoPlayerPause();
    }

    if (autoplay && !pausedByUser) {
      checkVisibility();
      window.addEventListener('scroll', checkVisibility);
    }

    // Play/pause functies
    function vimeoPlayerPlay() {
      vimeoElement.setAttribute('data-vimeo-activated', 'true');
      vimeoElement.setAttribute('data-vimeo-playing', 'true');
      player.play();
    }

    function vimeoPlayerPause() {
      vimeoElement.setAttribute('data-vimeo-playing', 'false');
      player.pause();
    }

    // Knoppen
    const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
    if (playBtn) {
      playBtn.addEventListener('click', vimeoPlayerPlay);
    }

    const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        vimeoPlayerPause();
        if (autoplay) {
          vimeoElement.setAttribute('data-vimeo-paused-by-user', 'true');
          window.removeEventListener('scroll', checkVisibility);
        }
      });
    }
  });
}

window.addEventListener('load', function () {
  initVimeoBGVideo();
});

gsap.registerPlugin(ScrollTrigger, SplitText)

function initStickyTitleScroll() {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');

  wraps.forEach(wrap => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      }
    });

    const revealDuration = 0.7,
      fadeOutDuration = 0.7,
      overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      // Save original heading content for screen readers
      heading.setAttribute("aria-label", heading.textContent);

      const split = new SplitText(heading, { type: "lines" });

      // Hide all the separate words from screenreader
      split.words.forEach(word => word.setAttribute("aria-hidden", "true"));

      // Reset visibility on the 'stacked' headings
      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();
      headingTl.from(split.lines, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      });

      // Animate fade-out for every heading except the last one.
      if (index < headings.length - 1) {
        headingTl.to(split.lines, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration
        });
      }

      // Overlap the start of fade-in of the new heading a little bit
      if (index === 0) {
        masterTl.add(headingTl);
      } else {
        masterTl.add(headingTl, `-=${overlapOffset}`);
      }
    });
  });
}

// Initialize Sticky Title Scroll Effect
window.addEventListener('load', function () {
  initStickyTitleScroll();
});

// Image trail
function initImageTrail(config = {}) {

  // config + defaults
  const options = {
    minWidth: config.minWidth ?? 992,
    moveDistance: config.moveDistance ?? 15,
    stopDuration: config.stopDuration ?? 300,
    trailLength: config.trailLength ?? 5
  };

  const wrapper = document.querySelector('[data-trail="wrapper"]');

  if (!wrapper || window.innerWidth < options.minWidth) {
    return;
  }

  // State management
  const state = {
    trailInterval: null,
    globalIndex: 0,
    last: { x: 0, y: 0 },
    trailImageTimestamps: new Map(),
    trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')),
    isActive: false
  };

  // Utility functions
  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
  };

  function getRelativeCoordinates(e, rect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function activate(trailImage, x, y) {
    if (!trailImage) return;

    const rect = trailImage.getBoundingClientRect();
    const styles = {
      left: `${x - rect.width / 2}px`,
      top: `${y - rect.height / 2}px`,
      zIndex: state.globalIndex,
      display: 'block'
    };

    Object.assign(trailImage.style, styles);
    state.trailImageTimestamps.set(trailImage, Date.now());

    // Here, animate how the images will appear!
    gsap.fromTo(
      trailImage, { autoAlpha: 0, scale: 0.8 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.2,
        overwrite: true
      }
    );

    state.last = { x, y };
  }

  function fadeOutTrailImage(trailImage) {
    if (!trailImage) return;

    // Here, animate how the images will disappear!
    gsap.to(trailImage, {
      opacity: 0,
      scale: 0.2,
      duration: 0.8,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(trailImage, { autoAlpha: 0 });
      }
    });
  }

  function handleOnMove(e) {
    if (!state.isActive) return;

    const rectWrapper = wrapper.getBoundingClientRect();
    const { x: relativeX, y: relativeY } = getRelativeCoordinates(e, rectWrapper);

    const distanceFromLast = MathUtils.distance(
      relativeX,
      relativeY,
      state.last.x,
      state.last.y
    );

    if (distanceFromLast > window.innerWidth / options.moveDistance) {
      const lead = state.trailImages[state.globalIndex % state.trailImages.length];
      const tail = state.trailImages[(state.globalIndex - options.trailLength) % state.trailImages
        .length];

      activate(lead, relativeX, relativeY);
      fadeOutTrailImage(tail);
      state.globalIndex++;
    }
  }

  function cleanupTrailImages() {
    const currentTime = Date.now();
    for (const [trailImage, timestamp] of state.trailImageTimestamps.entries()) {
      if (currentTime - timestamp > options.stopDuration) {
        fadeOutTrailImage(trailImage);
        state.trailImageTimestamps.delete(trailImage);
      }
    }
  }

  function startTrail() {
    if (state.isActive) return;

    state.isActive = true;
    wrapper.addEventListener("mousemove", handleOnMove);
    state.trailInterval = setInterval(cleanupTrailImages, 100);
  }

  function stopTrail() {
    if (!state.isActive) return;

    state.isActive = false;
    wrapper.removeEventListener("mousemove", handleOnMove);
    clearInterval(state.trailInterval);
    state.trailInterval = null;

    // Clean up remaining trail images
    state.trailImages.forEach(fadeOutTrailImage);
    state.trailImageTimestamps.clear();
  }

  // Initialize ScrollTrigger
  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom top",
    onEnter: startTrail,
    onEnterBack: startTrail,
    onLeave: stopTrail,
    onLeaveBack: stopTrail
  });

  // Clean up on window resize
  const handleResize = () => {
    if (window.innerWidth < options.minWidth && state.isActive) {
      stopTrail();
    } else if (window.innerWidth >= options.minWidth && !state.isActive) {
      startTrail();
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    stopTrail();
    window.removeEventListener('resize', handleResize);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const imageTrail = initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 8
  });
});

// Formulier Check
function initBasicFormValidation() {
  const forms = document.querySelectorAll('[data-form-validate]');

  forms.forEach((form) => {
    const fields = form.querySelectorAll('[data-validate] input, [data-validate] textarea');
    const submitButtonDiv = form.querySelector(
      '[data-submit]'); // The div wrapping the submit button
    const submitInput = submitButtonDiv.querySelector(
      'input[type="submit"]'); // The actual submit button

    // Capture the form load time
    const formLoadTime = new Date().getTime(); // Timestamp when the form was loaded

    // Function to validate individual fields (input or textarea)
    const validateField = (field) => {
      const parent = field.closest('[data-validate]'); // Get the parent div
      const minLength = field.getAttribute('min');
      const maxLength = field.getAttribute('max');
      const type = field.getAttribute('type');
      let isValid = true;

      // Check if the field has content
      if (field.value.trim() !== '') {
        parent.classList.add('is--filled');
      } else {
        parent.classList.remove('is--filled');
      }

      // Validation logic for min and max length
      if (minLength && field.value.length < minLength) {
        isValid = false;
      }

      if (maxLength && field.value.length > maxLength) {
        isValid = false;
      }

      // Validation logic for email input type
      if (type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
        isValid = false;
      }

      // Add or remove success/error classes on the parent div
      if (isValid) {
        parent.classList.remove('is--error');
        parent.classList.add('is--success');
      } else {
        parent.classList.remove('is--success');
        parent.classList.add('is--error');
      }

      return isValid;
    };

    // Function to start live validation for a field
    const startLiveValidation = (field) => {
      field.addEventListener('input', function () {
        validateField(field);
      });
    };

    // Function to validate and start live validation for all fields, focusing on the first field with an error
    const validateAndStartLiveValidationForAll = () => {
      let allValid = true;
      let firstInvalidField = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid && !firstInvalidField) {
          firstInvalidField = field; // Track the first invalid field
        }
        if (!valid) {
          allValid = false;
        }
        startLiveValidation(field); // Start live validation for all fields
      });

      // If there is an invalid field, focus on the first one
      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    };

    // Anti-spam: Check if form was filled too quickly
    const isSpam = () => {
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - formLoadTime) /
        1000; // Convert milliseconds to seconds
      return timeDifference < 5; // Return true if form is filled within 5 seconds
    };

    // Handle clicking the custom submit button
    submitButtonDiv.addEventListener('click', function () {
      // Validate the form first
      if (validateAndStartLiveValidationForAll()) {
        // Only check for spam after all fields are valid
        if (isSpam()) {
          alert('Form submitted too quickly. Please try again.');
          return; // Stop form submission
        }
        submitInput.click(); // Simulate a click on the <input type="submit">
      }
    });

    // Handle pressing the "Enter" key
    form.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form first
        if (validateAndStartLiveValidationForAll()) {
          // Only check for spam after all fields are valid
          if (isSpam()) {
            alert('Form submitted too quickly. Please try again.');
            return; // Stop form submission
          }
          submitInput.click(); // Trigger our custom form submission
        }
      }
    });
  });
}

initBasicFormValidation();

// Custom Cursor 

const cursor = document.querySelector('.custom-cursor');
const hoverZones = document.querySelectorAll('.project-scroll, .scroll_img');

hoverZones.forEach((zone) => {
  zone.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.opacity = '1';
  });

  zone.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(0)';
    cursor.style.opacity = '0';
  });

  zone.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  });
});

// Item Count 
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    console.log('cmsfilter Successfully loaded!');

    const [filterInstance] = filterInstances;

    // Pak alle elementen waar je het aantal wilt tonen (bijv. btn-count-text)
    const resultsNumber = document.querySelectorAll('.btn-count-text');

    // Functie om alle count-teksten te updaten
    function updateCounts() {
      let filterResult = filterInstance.resultsElement.innerHTML;
      resultsNumber.forEach((result) => {
        result.innerHTML = filterResult;
      });
    }

    // Eerste keer count updaten bij laden
    updateCounts();

    // Update count na elke render van gefilterde items
    filterInstance.listInstance.on('renderitems', () => {
      updateCounts();
    });
  },
]);
