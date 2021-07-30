export default class Circle {
	DAMPING = 0;

	constructor(x, y, dx, dy, canvas, radius, color) {
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
	}

	draw() {
		if (this.connected){
		  this.context.fillStyle = this.color;
		} else {
		  this.context.fillStyle = "rgba(255, 62, 0, 1.0)";
		}
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, 3 * Math.PI);
		this.context.fill();
	}

	checkWalls() {
		if (this.x < this.radius) {

		  let vel_x = this.px - this.x;
			this.x = this.radius;
			this.px = this.x - vel_x * this.DAMPING;

		} else if (this.x + this.radius > this.canvas.width) {
			let vel_x = this.px - this.x;
			this.x = this.canvas.width - this.radius;
			this.px = this.x - vel_x * this.DAMPING;
		}

		if (this.y < this.radius) {
			let vel_y = this.py - this.y;
			this.y = this.radius;
			this.py = this.y - vel_y * this.DAMPING;

		} else if (this.y + this.radius > this.canvas.height) {
			let vel_y = this.py - this.y;
			this.y = this.canvas.height - this.radius;
			this.py = this.y - vel_y * this.DAMPING;
		}
	}

	update() {
		let nx = 2 * this.x - this.px;
		let ny = 2 * this.y - this.py;

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