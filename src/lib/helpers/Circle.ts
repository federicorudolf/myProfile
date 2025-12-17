export default class Circle {
	DAMPING = 0;

	x: number;
	y: number
	dx: number
	dy: number
	fx = 0;
	fy = 0;
	px: number
	py: number
	canvas;
	context;
	radius;
	color;
	connected = 0;
	enlargeFactor = 0;
	unconnectedColor = '';
	colorArray = ['#ED1B2E', '#FFF'];
	
	constructor(x: number, y: number, dx: number, dy: number, canvas: HTMLCanvasElement, radius: number, color: string) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.fx = 0;
		this.fy = 0;
		this.px = x;
		this.py = y;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.radius = radius;
		this.color = color;
		this.connected = 0;
		this.enlargeFactor = 0;

		this.unconnectedColor = !this.connected ? this.colorArray[Math.floor(Math.random() * this.colorArray.length)] : '';
	}

	draw() {
		if (this.connected){
		  this.context!.fillStyle = this.color;
		} else {
			// const gradient = this.context!.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius);

			// // Add color stops to the gradient
			// gradient.addColorStop(0, "rgb(16, 185, 129)");
			// gradient.addColorStop(1, "rgb(99, 102, 241)");

			// // Set the gradient as the fillStyle
			// this.context!.fillStyle = gradient;
			this.context!.fillStyle = this.unconnectedColor;
		}
		this.context!.beginPath();
		this.context!.arc(this.x, this.y, this.radius, 0, 3 * Math.PI);
		this.context!.fill();
	}

	checkWalls() {
		if (this.x < this.radius) {

		  const vel_x = this.px - this.x;
			this.x = this.radius;
			this.px = this.x - vel_x * this.DAMPING;

		} else if (this.x + this.radius > this.canvas.width) {
			const vel_x = this.px - this.x;
			this.x = this.canvas.width - this.radius;
			this.px = this.x - vel_x * this.DAMPING;
		}

		if (this.y < this.radius) {
			const vel_y = this.py - this.y;
			this.y = this.radius;
			this.py = this.y - vel_y * this.DAMPING;

		} else if (this.y + this.radius > this.canvas.height) {
			const vel_y = this.py - this.y;
			this.y = this.canvas.height - this.radius;
			this.py = this.y - vel_y * this.DAMPING;
		}
	}

	update() {
		const nx = 2 * this.x - this.px;
		const ny = 2 * this.y - this.py;

		this.px = this.x;
		this.py = this.y;

		this.x = nx;
		this.y = ny;
	}

	applyForce() {
		this.x += this.fx;
		this.y += this.fy;
	  
		this.fx = 0;
		this.fy = 0;
	}
}