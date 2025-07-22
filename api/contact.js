// ▼ contact.js ▼ — frontend script

const form = document.getElementById("contactForm");
const sentMsg = document.querySelector(".sent-message");
const errorMsg = document.querySelector(".error-message");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear previous messages
  form.querySelectorAll(".error").forEach(el => (el.textContent = ""));
  sentMsg.hidden = true;
  if (errorMsg) errorMsg.hidden = true;

  // Simple validation
  let hasError = false;
  ["name", "email", "message"].forEach((id) => {
    const input = form[id];
    if (!input.checkValidity()) {
      hasError = true;
      input.parentElement.querySelector(".error").textContent = input.validationMessage;
    }
  });
  if (hasError) return;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
      })
    });

    if (!response.ok) throw new Error("Failed to send");

    form.reset();
    sentMsg.hidden = false;
  } catch (error) {
    console.error("Form submission failed:", error);
    if (errorMsg) {
      errorMsg.hidden = false;
      errorMsg.textContent = "Failed to send message. Please try again.";
    }
  }
});

// !!!!!!! ANIMATION TEXT !!!!!!!!
const elts = {
  text1: document.getElementById("text1"),
  text2: document.getElementById("text2")
};

const texts = ["Drop", "me", "a", "line"];

const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
    cooldown = cooldownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

function setMorph(fraction) {
  elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
  morph = 0;

  elts.text2.style.filter = "";
  elts.text2.style.opacity = "100%";

  elts.text1.style.filter = "";
  elts.text1.style.opacity = "0%";
}

function animate() {
  requestAnimationFrame(animate);

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 1000;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
    if (shouldIncrementIndex) textIndex++;
    doMorph();
  } else {
    doCooldown();
  }
}

animate();
