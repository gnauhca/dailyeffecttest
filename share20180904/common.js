setTimeout(() => {
  document.querySelector('canvas').style.opacity = 0;
  document.querySelector('canvas').style.transition = "none";
}, 30);
setTimeout(() => {
  document.querySelector('canvas').style.opacity = 1;
  document.querySelector('canvas').style.transition = 'opacity 2s 1s';
}, 100);