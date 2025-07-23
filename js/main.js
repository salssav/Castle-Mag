// Ensure code runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {

  /* DARK MODE */
  const darkModeButton = document.querySelector('.btn_dark-mode');

if (darkModeButton) {
  darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Optional: save preference in localStorage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

// On page load: check saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

  /* ROTATING ICON CLICK TO TOP */
  const topBtn = document.getElementById("rotating_icon");
  if (topBtn) {
    topBtn.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  /*make it rotate*/
  const rotatingIcon = document.getElementById("rotating_icon");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const rotation = scrollTop / 4; // Keep it within 0–360°
  rotatingIcon.style.transform = `rotate(${rotation}deg)`;
});


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

  
// SCROLL BAR
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

// HEADER LOGO ANIMATION 
const headerLogo = document.getElementById("header_logo");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Set threshold range similar to 100px – 800px
  const minScroll = 100;
  const maxScroll = 400;

  // Clamp scroll position
  const clampedScroll = Math.min(Math.max(scrollY, minScroll), maxScroll);
  const progress = (clampedScroll - minScroll) / (maxScroll - minScroll);

  // Interpolate height from 10rem to 2rem
  const maxHeight = 10;
  const minHeight = 2;
  const newHeight = maxHeight - (maxHeight - minHeight) * progress;

  headerLogo.style.height = `${newHeight}rem`;
});

//MARQUE TEXT FALLBACK

document.querySelectorAll(".marquee").forEach((marquee) => {
  const track = marquee.querySelector(".marquee-track");
  const direction = marquee.getAttribute("data-direction") === "reverse" ? -1 : 1;

  const text = track.innerHTML;
  track.innerHTML += text + text; // Duplicate to ensure seamless loop

  let offset = 0;

  function animate() {
    offset += direction * 1; // Speed control here
    track.style.transform = `translateX(${-offset}px)`;
    if (Math.abs(offset) >= track.scrollWidth / 3) offset = 0;
    requestAnimationFrame(animate);
  }

  track.style.whiteSpace = "nowrap";
  track.style.display = "inline-block";
  track.style.willChange = "transform";
  animate();
});



