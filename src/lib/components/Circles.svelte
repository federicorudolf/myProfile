<script lang="ts">
  import { browser } from '$app/environment';
  import Circle from '../helpers/Circle';
  import { onMount } from 'svelte';

  const RADIUS = 25 * 0.3;
  const MOBILE_CIRCLES = 150;
  const DESKTOP_CIRCLES = 250;
  const MOBILE_SIZE = 785;
  const GRAVITY = 0.0098;
  const MAXFORCE = .2;
	const MINFORCE = -.2;
  const mouse = {
    x: 0,
    y: 0
  }
  let screen: {
    width: number,
    height: number
  } = {
    width: 0,
    height: 0
  }
/*   
Change variable to use animation with colors
const colors = [
		  "rgba(237, 28, 13, 1.0)",
		  "rgba(237, 115, 0, 1.0)",
		  "rgba(102, 51, 130, 1.0)",
		  "rgba(61, 140, 222, 1.0)",
		  "rgba(0, 201, 191, 1.0)",
		  "rgba(255, 163, 181, 1.0)",
		  "rgba(255, 51, 99, 1.0)",
		  "rgba(255, 191, 15, 1.0)",
		  "rgba(135, 199, 15, 1.0)"
		] */

  const colors = [
  	"rgba(170, 170, 170, 1.0)",
  	"rgba(150, 150, 150, 1.0)",
    "rgba(130, 130, 130, 1.0)",
    "rgba(110, 110, 110, 1.0)",
    "rgba(90, 90, 90, 1.0)",
    "rgba(70, 70, 70, 1.0)",
    "rgba(50, 50, 50, 1.0)",
    "rgba(30, 30, 30, 1.0)",
    "rgba(10, 10, 10, 1.0)"
  ];
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let circles: Circle[] = [];
  let isMobile = false;

  const range = (a: number, b: number) => (b - a) * Math.random() + a;

  const setupAnimation = (circles: number) => {
    canvas = document.getElementById('animation') as HTMLCanvasElement;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d') as CanvasRenderingContext2D;
    createCircles(circles);
  }

  const createCircles = (circNum: number) => {
    while (circNum--) {
      let color = colors[~~range(0, colors.length - 1)];
      let x = ~~range((0 + 2 * RADIUS), canvas.width - (RADIUS * 2));
      let y = ~~range((0 + 2 * RADIUS), canvas.height - (RADIUS * 2));
      let dx = range(-0.75, 0.75);
      let dy = range(-0.75, 0.75);
      let newCircle = new Circle(x, y, dx, dy, canvas, RADIUS, color);
      circles.push(newCircle);
    }
  }

  const resetAnimation = () => {
    console.log('clearing');
    circles = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const updateAnimation = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
    
    let connections = [];
    let i = circles.length;

    while (i--) {
      let circle_1 = circles[i];
      /* Calculate distance from mouse to circle */
      let dist_x = circle_1.x - mouse.x;
      let dist_y = circle_1.y - mouse.y;
      let distance = Math.sqrt((dist_x * dist_x) + (dist_y * dist_y));
      let force = GRAVITY * ((circle_1.radius * 2) * 400) / Math.pow(distance, 2);
      force = Math.min(force, 5);
      
      circle_1.fx += ((dist_x / distance) * force);
      circle_1.fy += ((dist_y / distance) * force);
      
      circle_1.fx = Math.max(MINFORCE, Math.min(circle_1.fx, MAXFORCE));
      circle_1.fy = Math.max(MINFORCE, Math.min(circle_1.fy, MAXFORCE));

      if (distance < 10 * RADIUS && distance > 5 * RADIUS) {
        circle_1.radius += 0.25;
      } else if (distance < 5 * RADIUS) {
        circle_1.radius += 0.5;
      } else {
        circle_1.radius = RADIUS;
      }
      
      circle_1.applyForce();
      circle_1.update();
      circle_1.checkWalls();
      
      let n = i;

      while (n--) {
        let circle_2 = circles[n];
        let dist_x = circle_2.x - circle_1.x;
        let dist_y = circle_2.y - circle_1.y;
        let distance = Math.sqrt((dist_x * dist_x) + (dist_y * dist_y));

        if(distance < 42) {
          circles[i].connected++;
          circles[n].connected++;

          let diff = 40 - distance;
          let off_x = (diff * dist_x / distance) / 2;
		      let off_y = (diff * dist_y / distance) / 2;
          let flex = 0.15

          circle_1.x -= off_x * flex;
          circle_1.y -= off_y* flex;
          circle_2.x += off_x * flex;
          circle_2.y += off_y* flex;          
          connections.push([circle_1,circle_2]);
        }
      }
      circle_1.draw();
    }

    let j = connections.length;
    // Loop through all known connections and draw them
    while(j--) {
      let connection = connections[j];
      context.strokeStyle = 'rgba(70,70,70,.4)';
      context.beginPath();
      context.moveTo(connection[0].x, connection[0].y);
      context.lineTo(connection[1].x, connection[1].y);
      context.stroke();
    }

    let k = circles.length;
    while (k--) {
      let circle_1 = circles[k];
      circle_1.draw();
      circle_1.connected = 0;
    }

    requestAnimationFrame(updateAnimation);
  }

  if (browser) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
  
    window.addEventListener('touchstart', (e) => {
      console.log(e);
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    });

    window.addEventListener('resize', () => {
      screen.height = canvas.height = window.innerHeight;
      screen.width = canvas.width = window.innerWidth;
      context = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (screen.width < MOBILE_SIZE && !isMobile) {
        resetAnimation();
        isMobile = true;
        setupAnimation(MOBILE_CIRCLES);
      } else if (screen.width >= MOBILE_SIZE && isMobile) {
        resetAnimation();
        isMobile = false;
        setupAnimation(DESKTOP_CIRCLES);
      }
    });
  }

  onMount(() => {
    setTimeout(() => {
      screen.height = window.innerHeight;
      screen.width = window.innerWidth;
      if (screen.width < MOBILE_SIZE ) {
        isMobile = true;
        setupAnimation(MOBILE_CIRCLES);
      } else {
        setupAnimation(DESKTOP_CIRCLES);
      }
      updateAnimation();
    }, 1000);
  });

</script>

<canvas id="animation"></canvas>
<slot></slot>

<style>
  #animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
