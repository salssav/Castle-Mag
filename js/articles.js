window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(InertiaPlugin);
  
    let oldX = 0,
        oldY = 0,
        deltaX = 0,
        deltaY = 0;
  
    const root = document.querySelector('.mwg_effect000');
  
    // 🖱️ DESKTOP MOVEMENT
    root.addEventListener("mousemove", (e) => {
      deltaX = e.clientX - oldX;
      deltaY = e.clientY - oldY;
      oldX = e.clientX;
      oldY = e.clientY;
    });
  
    // 📱 MOBILE MOVEMENT
    root.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        deltaX = touch.clientX - oldX;
        deltaY = touch.clientY - oldY;
        oldX = touch.clientX;
        oldY = touch.clientY;
      }
    });
  
    root.querySelectorAll('.media').forEach(el => {
      const image = el.querySelector('img');
  
      function runAnimation() {
        const tl = gsap.timeline({
          onComplete: () => tl.kill()
        });
  
        tl.timeScale(1.2);
  
        tl.to(image, {
          inertia: {
            x: {
              velocity: deltaX * 30,
              end: 0
            },
            y: {
              velocity: deltaY * 30,
              end: 0
            },
          },
        });
  
        tl.fromTo(image, {
          rotate: 0
        }, {
          duration: 0.4,
          rotate: (Math.random() - 0.5) * 30,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        }, '<');
      }
  
      // 🖱️ DESKTOP
      el.addEventListener('mouseenter', runAnimation);
  
      // 📱 MOBILE
      el.addEventListener('touchstart', runAnimation);
    });
  });
  