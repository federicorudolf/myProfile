<script>
  import Circle from '../Models/Circle';

  const RADIUS = 25 * 0.3;
  const MOBILE_CIRCLES = 50;
  const DESKTOP_CIRCLES = 150;
  const MOBILE_SIZE = 785;
  const mouse = {
    x: undefined,
    y: undefined
  }
  const screen = {
    width: undefined,
    height: undefined
  }
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
		]

  let canvas;
  let context;
  let circles = [];
  let isMobile = false;

  const range = (a, b) => (b - a) * Math.random() + a;

  const setupAnimation = (circles) => {
    canvas = document.getElementById('animation');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d');
    createCircles(circles);
  }

  const createCircles = (circNum) => {
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
    
    circles.forEach(el => {
      el.update();
      el.draw();
    });
    requestAnimationFrame(updateAnimation);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
    
  setTimeout(() => {
    screen.height = window.innerHeight;
    screen.width = window.innerWidth;
    if ( screen.width < MOBILE_SIZE ) {
      isMobile = true;
      setupAnimation(MOBILE_CIRCLES);
    } else {
      setupAnimation(DESKTOP_CIRCLES);
    }
    updateAnimation();
  }, 1000);

  window.addEventListener('resize', () => {
    console.log('resizing', window.innerWidth);
    screen.height = canvas.height = window.innerHeight;
    screen.width = canvas.width = window.innerWidth;
    context = canvas.getContext('2d');

    if ( screen.width < MOBILE_SIZE && !isMobile  ) {
      resetAnimation();
      isMobile = true;
      setupAnimation(MOBILE_CIRCLES);
    } else if (screen.width >= MOBILE_SIZE && isMobile) {
      resetAnimation();
      isMobile = false;
      setupAnimation(DESKTOP_CIRCLES);
    }
  });


</script>
