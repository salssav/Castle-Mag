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

  // ASCII CAMERA
  const video = document.getElementById('ascii-video');
const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('ascii-start-btn');
const stopBtn = document.getElementById('ascii-stop-btn');

const asciiChars = "@#W$9876543210?!abc;:+=-,._";
const charWidth = 8;
const charHeight = 16;
const asciiCols = 60;
let asciiRows;
let animationId;
let stream = null;

function resizeCanvas() {
  if (!video.videoWidth || !video.videoHeight) return;
  const aspectRatio = video.videoWidth / video.videoHeight;
  asciiRows = Math.round(asciiCols / aspectRatio / (charHeight / charWidth));
  canvas.width = asciiCols * charWidth;
  canvas.height = asciiRows * charHeight;
}

function drawAscii() {
  if (!video.videoWidth || !video.videoHeight) {
    animationId = requestAnimationFrame(drawAscii);
    return;
  }
  ctx.drawImage(video, 0, 0, asciiCols, asciiRows);
  const frame = ctx.getImageData(0, 0, asciiCols, asciiRows);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < asciiRows; y++) {
    for (let x = 0; x < asciiCols; x++) {
      const offset = (y * asciiCols + x) * 4;
      const r = frame.data[offset];
      const g = frame.data[offset + 1];
      const b = frame.data[offset + 2];
      const avg = (r + g + b) / 3;
      const charIdx = Math.floor((avg / 255) * (asciiChars.length - 1));
      const char = asciiChars[charIdx];
      ctx.fillStyle = "#fff";
      ctx.font = `${charHeight}px monospace`;
      ctx.fillText(char, x * charWidth, (y + 1) * charHeight - 4);
    }
  }
  animationId = requestAnimationFrame(drawAscii);
}

function startAsciiCam() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(mediaStream => {
      stream = mediaStream;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        resizeCanvas();
        animationId = requestAnimationFrame(drawAscii);
        stopBtn.disabled = false;
        startBtn.disabled = true;
      };
    })
    .catch(err => {
      alert("Could not access webcam: " + err);
    });
}

function stopAsciiCam() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  video.srcObject = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopBtn.disabled = true;
  startBtn.disabled = false;
}

startBtn.addEventListener('click', startAsciiCam);
stopBtn.addEventListener('click', stopAsciiCam);
window.addEventListener('resize', resizeCanvas);


  // GSAP SMOOTH SCROLL EXAMPLE (using CDN)
  if (typeof gsap !== "undefined" && typeof ScrollToPlugin !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
    // Example usage:
    // gsap.to(window, {duration: 1, scrollTo: "#target"});
  }

});

