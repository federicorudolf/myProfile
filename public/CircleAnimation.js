const initialScreenWidth = window.outerWidth;
const DAMPING = 0;
const GRAVITY = 0.0098;
const NUM_PARTICLES = 200;
const MOBILE_NUM_PARTICLES = 75;
const SMALL_DESKTOP_NUM_PARTICLES = 200;
const JUMBO_DESKTOP_NUM_PARTICLES = 300;
const MAXVEL = .2;
const MINVEL = -.2;
const mouse = {
  x: 0,
  y: 0
};

let isCanvasOnScreen = true;

let particles = [];
  
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

let canvas;
let ctx;

let colors = [
   
  "rgba(237, 115, 0, 1.0)",
  "rgba(102, 51, 130, 1.0)",
  "rgba(61, 140, 222, 1.0)",
  "rgba(0, 201, 191, 1.0)",
  "rgba(255, 163, 181, 1.0)",
  "rgba(255, 51, 99, 1.0)",
  "rgba(255, 191, 15, 1.0)",
  "rgba(135, 199, 15, 1.0)"
]

// Define particles to be used in hero animation

const Particle = function(x, y) {
    this.x = x;
    this.y = y;
    
    // particle position
    this.px = x;
    this.py = y;

    // particle forces
    this.fx = 0;
    this.fy = 0;
    
    // particle size
    this.radius = 25;
  
    // number of particle connections
    this.connected = 0;
    
    // assign a random color on start
    this.color = colors[Math.floor(Math.random()*9)];
};

Particle.prototype.paint = function() {

  let connected = this.connected;
  
  if (connected){
    ctx.fillStyle = this.color;
  } else {
    ctx.fillStyle = 'rgba(255,255,255,1)';
  }
  
  // Draw circle
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 3);
  ctx.fill();
};

Particle.prototype.apply_force = function() {
    
    // Adjust position by 'forces'.
    this.x += this.fx;
    this.y += this.fy;
  
    // Reset force vector after applying 
    this.fx = 0;
    this.fy = 0;
};

Particle.prototype.update = function() {

    let nx = (this.x * 2) - this.px;
    let ny = (this.y * 2) - this.py;

    this.px = this.x;
    this.py = this.y;

    this.x = nx;
    this.y = ny;
};

Particle.prototype.check_walls = function() {

    if (this.x < this.radius) {

        let vel_x = this.px - this.x;
        this.x = this.radius;
        this.px = this.x - vel_x * DAMPING;

    } else if (this.x + this.radius > canvas.width) {

        let vel_x = this.px - this.x;
        this.x = canvas.width - this.radius;
        this.px = this.x - vel_x * DAMPING;
    }

    if (this.y < this.radius) {

        let vel_y = this.py - this.y;
        this.y = this.radius;
        this.py = this.y - vel_y * DAMPING;

    } else if (this.y + this.radius > canvas.height) {

        let vel_y = this.py - this.y;
        this.y = canvas.height - this.radius;
        this.py = this.y - vel_y * DAMPING;
    }
};

setupAnimation = function(numParticles){
  ctx = canvas.getContext('2d');

  scaleFactor = 1;

  originalWidth = w;
  originalHeight = h;

  // Loop through and create particles
  while(numParticles--) {
      let particle = 
          new Particle(
              Math.random() * canvas.width,
              Math.random() * canvas.height
          );
      
      // Assign an initial force/velocity 
      particle.fx = -.5 + Math.random() * 1;
      particle.fy = -.5 + Math.random() * 1;
      // add the particle to the array
      particles.push(particle);
  }
  console.log(particles);
}

window.addEventListener('resize', () => {

  if ( document.readyState === 'complete' ) {
    canvas = document.getElementById('animation');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let screenWidth = window.innerWidth;
    if (screenWidth < 980) {
      resetAnimation();
      setupAnimation(window.innerWidth, window.innerHeight, MOBILE_NUM_PARTICLES);
    } else if (screenWidth < 1500 && screenWidth >= 980){
      resetAnimation();
      setupAnimation(window.innerWidth, window.innerHeight, SMALL_DESKTOP_NUM_PARTICLES);
    } else if (screenWidth >= 1500) {
      resetAnimation();
      setupAnimation(window.innerWidth, window.innerHeight, JUMBO_DESKTOP_NUM_PARTICLES);
    }
  }
});

document.onmousemove = (e) => {
  if (document.readyState === 'complete' && canvas) {
    // Compute current scaleFactor
    scaleFactor = 1;
    // Determine mouse position
    let rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * scaleFactor;
    mouse.y = (e.clientY - rect.top) * scaleFactor;
  }
}

resetAnimation = function(){
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

updateAnimation = function() {
    canvas = document.getElementById('animation');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let connections = [];

    let i = particles.length;
    // Loop through all particles
    while (i--) {

        let particle_1 = particles[i];
        
        // Determine difference from mouse position and this particle
        let diff_x = particle_1.x - mouse.x;
        let diff_y = particle_1.y - mouse.y;
        let dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

        // Gravitational force (F=G*(M*m)/r^2)
        // Determine how much force to exert depending on how far mouse is from particles
        let force = GRAVITY * ((particle_1.radius * 2) * 400) / Math.pow(dist, 2);
        
        // Never apply a force greater than 1
        force = Math.min(force, 5);
        
        // Apply the force in both the x and y dimensions
        particle_1.fx += ((diff_x / dist) * force);
        particle_1.fy += ((diff_y / dist) * force);

        //Clamp force applied to a reasonable amount
        particle_1.fx = Math.max(MINVEL, Math.min(particle_1.fx, MAXVEL))
        particle_1.fy = Math.max(MINVEL, Math.min(particle_1.fy, MAXVEL))

        particle_1.apply_force();
        particle_1.update();
        particle_1.check_walls();

        let n = i;
        
        // Check all remaining particles in the array
        while (n--) {

          let particle_2 = particles[n];

          let diff_x = (particle_2.x - particle_1.x);
          let diff_y = (particle_2.y - particle_1.y);
          let dist = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));

          if (dist < 42) {

            particles[i].connected++;
            particles[n].connected++;

            let diff = 40 - dist,
            off_x = (diff * diff_x / dist) / 2,
            off_y = (diff * diff_y / dist) / 2,
            // Flex determines the amount of 'bounce back'. Initial value was 0.25.
            FLEX = 0.15;

            particle_1.x -= off_x * FLEX;
            particle_1.y -= off_y* FLEX;
            particle_2.x += off_x * FLEX;
            particle_2.y += off_y* FLEX;
            // Add to the list of connections
            connections.push([particle_1,particle_2]);
          }
        }

        particle_1.paint();
    }

    let j = connections.length;
    // Loop through all known connections and draw them
    while(j--) {
        let connection = connections[j];
        ctx.strokeStyle = 'rgba(70,70,70,.4)';
        ctx.beginPath();
        ctx.moveTo(connection[0].x, connection[0].y);
        ctx.lineTo(connection[1].x, connection[1].y);
        ctx.stroke();
    }
  
    let k = particles.length;
    //Loop through all particles
    while (k--) {
      let particle_1 = particles[k];
      particle_1.paint();
      particle_1.connected = 0;
    }
  /* requestAnimationFrame(updateAnimation); */
  console.log('updating');
};

let canvasWrapperHeight;
let animationOffScreenRules = function() {
  canvasWrapperHeight = window.innerHeight;
  if ( window.scrollTop > canvasWrapperHeight ) {
    isCanvasOnScreen = false;
  } else {
    if ( !isCanvasOnScreen ) {
      requestID = requestAnimFrame(updateAnimation);
    }
    isCanvasOnScreen = true;
  }
};

document.addEventListener('scroll resize', () => {
  if ( document.readyState === 'complete' ) {
    animationOffScreenRules();
  }
});

updateAnimation();
