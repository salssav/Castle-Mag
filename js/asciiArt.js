// ASCII CAMERA
const video = document.getElementById('ascii-video');
const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('ascii-start-btn');
const stopBtn = document.getElementById('ascii-stop-btn');

const asciiChars = "@#W$9876543210?!abc;:+=-,.___";
const charWidth = 10;
const charHeight = 22;
const asciiCols = 80;
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
      ctx.fillStyle = "#FFF";
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

// DRAGGABLE GALLERY
/* DRAGGABLE PHOTOS */

// Make the  elements draggable:
dragElement(document.getElementById("draggable"));
dragElement(document.getElementById("draggable_2"));
dragElement(document.getElementById("draggable_3"));
dragElement(document.getElementById("draggable_4"));
dragElement(document.getElementById("draggable_5"));
dragElement(document.getElementById("draggable_6"));


//Make the function to drag the elements
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "draggable_element")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "draggable_element").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }


  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
