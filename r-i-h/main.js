var radius = 240;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 120;
var imgHeight = 170;

setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');

var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

// 🔥 AUTOPLAY + PAUSE based on visibility
function updateVideoStates() {
  aVid.forEach(v => {
    const matrix = window.getComputedStyle(v).transform;
    if (matrix !== "none") {
      const values = matrix.split("(")[1].split(")")[0].split(",");
      const z = parseFloat(values[14] || values[13] || values[2]);
      if (z > radius - 50) {
        v.muted = true;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    }
  });
}

function init(delayTime) {
  for (let i = 0; i < aEle.length; i++) {
    aEle[i].style.transform =
      `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
  updateVideoStates();
}

function applyTranform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
  updateVideoStates();
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? 'running' : 'paused';
}

var desX = 0, desY = 0, tX = 0, tY = 10;

if (autoRotate) {
  var animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  let sX = e.clientX, sY = e.clientY;

  this.onpointermove = function (e) {
    let nX = e.clientX, nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX; sY = nY;
  };

  this.onpointerup = function () {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};

document.onmousewheel = function (e) {
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
