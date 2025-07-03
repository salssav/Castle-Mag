// Ensure code runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {

  /* DARK MODE */
  const darkModeButton = document.querySelector('.btn_dark-mode');
  if (darkModeButton) {
    darkModeButton.addEventListener('click', () => {
      const currentTheme = getComputedStyle(document.documentElement).getPropertyValue('--theme').trim();
      if (currentTheme === 'dark') {
        document.documentElement.style.setProperty('--theme', 'light');
      } else {
        document.documentElement.style.setProperty('--theme', 'dark');
      }
    });
  }

  /* ROTATING ICON CLICK TO TOP */
  const topBtn = document.getElementById("rotating_icon");
  if (topBtn) {
    topBtn.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Side Navigation for Mobile */
  const menuBtn = document.getElementById('menu-sandwich');
  const sidenav = document.getElementById('mobile_sidenav');
  const overlay = document.getElementById('sidenav-overlay');

  function closeMenu() {
    if (sidenav && overlay) {
      sidenav.classList.remove('open');
      overlay.classList.remove('active');
    }
  }

  if (menuBtn && sidenav && overlay) {
    menuBtn.addEventListener('click', () => {
      sidenav.classList.add('open');
      overlay.classList.add('active');
    });
    overlay.addEventListener('click', closeMenu);
    document.querySelectorAll('#mobile_sidenav a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // IMAGE REVEAL FOR INTERVIEW (hover/click/tap toggle)
  document.querySelectorAll('.bb9000-hover-area').forEach(area => {
    const img = area.querySelector('.bb9000-fly-img');
    let visible = false;

    // Desktop hover
    area.addEventListener('mouseenter', () => {
      img.style.display = 'block';
      img.style.opacity = '1';
      visible = true;
    });
    area.addEventListener('mouseleave', () => {
      img.style.opacity = '0';
      img.style.display = 'none';
      visible = false;
    });
    area.addEventListener('mousemove', e => {
      if (visible) {
        img.style.left = (e.clientX + 20) + 'px';
        img.style.top = (e.clientY + 20) + 'px';
      }
    });

    // Mobile tap/click toggle
    area.addEventListener('click', function(e) {
      e.stopPropagation();
      visible = !visible;
      if (visible) {
        img.style.display = 'block';
        img.style.opacity = '1';
        // Optionally position image for touch events
        if (e.touches && e.touches.length > 0) {
          img.style.left = (e.touches[0].clientX + 20) + 'px';
          img.style.top = (e.touches[0].clientY + 20) + 'px';
        }
      } else {
        img.style.opacity = '0';
        img.style.display = 'none';
      }
    });

    // Optional: Hide image if user taps elsewhere
    document.addEventListener('click', function(event) {
      if (!area.contains(event.target)) {
        img.style.opacity = '0';
        img.style.display = 'none';
        visible = false;
      }
    });
  });

  
// SCROLL BAR AND SCROLL EVENT
//esto hace que la consola te devuelva el scroll de tu mouse
console.log('Scroll bar JS loaded');

document.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (window.scrollY / maxScroll) * 100;

  const scrollBars = document.querySelectorAll('.scroll_bar');
  scrollBars.forEach(bar => {
    bar.style.height = scrollPercent + '%';
  });
});


  // GSAP SMOOTH SCROLL EXAMPLE (using CDN)
  if (typeof gsap !== "undefined" && typeof ScrollToPlugin !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
    // Example usage:
    // gsap.to(window, {duration: 1, scrollTo: "#target"});
  }

});


