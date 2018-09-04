


/* frames start */
// ...
// draw stars
stars.forEach((star) => {
  ctx.beginPath();
  ctx.moveTo(star.now.x, star.now.y);
  ctx.lineTo(star.prev.x, star.prev.y);
  ctx.stroke();
});

// clear canvas
ctx.fillStyle = 'rgba(0,0,0,0.8)';
ctx.fillRect(0, 0, cvs.width, cvs.height);
// ...
/* frames end */






/* frames start */
// ...
// draw stars
stars.forEach((star) => {
  ctx.beginPath();
  ctx.moveTo(star.now.x, star.now.y);
  ctx.lineTo(star.prev.x, star.prev.y);
  ctx.stroke();
});

// clear canvas
ctx.globalCompositeOperation = "destination-in";
ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; 
ctx.fillRect(0, 0, cvs.width, cvs.height);
// ...
/* frames end */




/* fire */

// execute once
ctx.globalCompositeOperation = 'lighter';

/* frames start */
particles.forEach(particle => {
  particle.pos.add(particle.v.clone().multiplyScalar(delta));
  ctx.fillRect(
    particle.pos.x * step - particle.radius * step / 2,
    particle.pos.y * step - particle.radius * step / 2,
    particle.radius * step,
    particle.radius * step
  );
});
/* frames end */



/* cloud */
const gradient = ctx.createRadialGradient(240, 280, 0, 240, 280, 400);
gradient.addColorStop(0, '#dc8f21');
gradient.addColorStop(0.2, '#dc8f21');
gradient.addColorStop(0.5, '#1000c3');
gradient.addColorStop(1, '#1000c3');

// ...
// draw particles
// ...

ctx.globalCompositeOperation = 'source-atop';
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, cvs.width, cvs.height);