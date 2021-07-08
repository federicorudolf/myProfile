export default class Circle {

	constructor(x, y, dx, dy, canvas, radius, color) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.radius = radius;
		this.color = color;
	}

	draw() {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, 3 * Math.PI);
		this.context.fillStyle = this.color;
		this.context.fill();
	}

	update() {
		if ( this.x + this.radius > this.canvas.width || this.x - this.radius < 0 ) {
			this.dx = -this.dx;
		}
		if ( this.y + this.radius > this.canvas.height || this.y -this.radius < 0 ) {
			this.dy = -this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;
	}

/* 	applyForce() {
		this.x += this.fx;
		this.y += this.fy;
	  
		this.fx = 0;
		this.fy = 0;
	}; */


}


/* 

		// Begin routine to setup and run hero animation. 
		// ----------------------------------------------

		// Define variables needed for hero animation
		var initialScreenWidth = $(window).outerWidth();
		var screenSize;

		var DAMPING = 0;
		var GRAVITY = 0.0098;
		var NUM_PARTICLES = 200;
		var MOBILE_NUM_PARTICLES = 75;
		var SMALL_DESKTOP_NUM_PARTICLES = 200;
		var JUMBO_DESKTOP_NUM_PARTICLES = 300;
		var MAXVEL = .2;
		var MINVEL = -.2;
		var requestID;
		var isCanvasOnScreen = true;

		particles = [];

		var mouse = {
		  x: 0,
		  y: 0
		};
		  
		window.requestAnimFrame =
		    window.requestAnimationFrame ||
		    window.webkitRequestAnimationFrame ||
		    window.mozRequestAnimationFrame ||
		    window.oRequestAnimationFrame ||
		    window.msRequestAnimationFrame || function(callback) {
		    window.setTimeout(callback, 1000 / 60);
		};

		var canvas;
		var ctx;

		var colors = [
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

		// Define particles to be used in hero animation

		var Particle = function(x, y) {
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

		  var connected = this.connected;
		 
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

		    var nx = (this.x * 2) - this.px;
		    var ny = (this.y * 2) - this.py;

		    this.px = this.x;
		    this.py = this.y;

		    this.x = nx;
		    this.y = ny;
		};

		Particle.prototype.check_walls = function() {

		    if (this.x < this.radius) {

		        var vel_x = this.px - this.x;
		        this.x = this.radius;
		        this.px = this.x - vel_x * DAMPING;

		    } else if (this.x + this.radius > canvas.width) {

		        var vel_x = this.px - this.x;
		        this.x = canvas.width - this.radius;
		        this.px = this.x - vel_x * DAMPING;
		    }

		    if (this.y < this.radius) {

		        var vel_y = this.py - this.y;
		        this.y = this.radius;
		        this.py = this.y - vel_y * DAMPING;

		    } else if (this.y + this.radius > canvas.height) {

		        var vel_y = this.py - this.y;
		        this.y = canvas.height - this.radius;
		        this.py = this.y - vel_y * DAMPING;
		    }
		};

	
		$(window).resize(function(){
			if ( $('.page-template-page-team').length ) {

				canvas = document.getElementById('animation');
				canvas.height = $('#team-hero').outerHeight();
				canvas.width = $('#team-hero').outerWidth();

				var screenWidth = $(window).outerWidth();
				if (screenWidth < 980 && size != 1){
					resetAnimation();
					size = 1;
					setupAnimation($(window).width(), $('#team-hero').outerHeight(), MOBILE_NUM_PARTICLES);
				} else if (screenWidth < 1500 && screenWidth >= 980 && size != 2){
					resetAnimation();
					size = 2;
					setupAnimation($(window).width(), $('#team-hero').outerHeight(), SMALL_DESKTOP_NUM_PARTICLES);
				} else if (screenWidth >= 1500 && size != 3) {
					resetAnimation();
					size = 3;
					setupAnimation($('#team-hero').outerWidth(), $('#team-hero').outerHeight(), JUMBO_DESKTOP_NUM_PARTICLES);
				}

			}
		})

		setupAnimation = function(w, h, numParticles){
		    canvas = document.getElementById('animation');
		    container = document.getElementById('team-hero');
		    ctx = canvas.getContext('2d');
		    
		    canvas.width = w;
		    canvas.height = h;
		    scaleFactor = 1;

		    originalWidth = w;
		    originalHeight = h;
		  
		    // Loop through and create particles
		    while(numParticles--) {

		        var particle = 
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

		}
	
		if (initialScreenWidth < 980){
			size = 1;
			setupAnimation($(window).width(), $('#team-hero').outerHeight(), MOBILE_NUM_PARTICLES);
		} else if (initialScreenWidth < 1500){
			size = 2;
			setupAnimation($(window).width(), $('#team-hero').outerHeight(), SMALL_DESKTOP_NUM_PARTICLES);
		} else if (initialScreenWidth >= 1500){
			size = 3;
			setupAnimation($('#team-hero').outerWidth(), $('#team-hero').outerHeight(), JUMBO_DESKTOP_NUM_PARTICLES);
		}
	
	    container.onmousemove = function(e) {

	    	// Compute current scaleFactor
	    	scaleFactor = originalWidth /  $('#team-hero').width();
	    	scaleFactor = 1;
	        // Determine mouse position
	        var rect = this.getBoundingClientRect();
	        mouse.x = (e.clientX - rect.left) * scaleFactor;
	        mouse.y = (e.clientY - rect.top) * scaleFactor;
	    };

	   	resetAnimation = function(){
    		particles = [];
	   		ctx.clearRect(0, 0, canvas.width, canvas.height);
	   	}

		updateAnimation = function() {

		    ctx.clearRect(0, 0, canvas.width, canvas.height);

		    var connections = [];

		    var i = particles.length;
		    // Loop through all particles
		    while (i--) {

		        var particle_1 = particles[i];
		        
		        // Determine difference from mouse position and this particle
		        var diff_x = particle_1.x - mouse.x;
		        var diff_y = particle_1.y - mouse.y;
		        var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

		        // Gravitational force (F=G*(M*m)/r^2)
		        // Determine how much force to exert depending on how far mouse is from particles
		        var force = GRAVITY * ((particle_1.radius * 2) * 400) / Math.pow(dist, 2);
		        
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

		        var n = i;
		        
		        // Check all remaining particles in the array
		        while (n--) {

		          var particle_2 = particles[n];

		          var diff_x = (particle_2.x - particle_1.x);
		          var diff_y = (particle_2.y - particle_1.y);
		          var dist = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));

		          if (dist < 42) {

		            particles[i].connected++;
		            particles[n].connected++;

		            var diff = 40 - dist,
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

		    var i = connections.length;
		    // Loop through all known connections and draw them
		    while(i--) {
		        var connection = connections[i];
		        ctx.strokeStyle = 'rgba(70,70,70,.4)';
		        ctx.beginPath();
		        ctx.moveTo(connection[0].x, connection[0].y);
		        ctx.lineTo(connection[1].x, connection[1].y);
		        ctx.stroke();
		    }
		  
		     var i = particles.length;
		    //Loop through all particles
		    while (i--) {
		      var particle_1 = particles[i];
		      particles[i].paint();
		      particles[i].connected = 0;
		    }
		  
				if (isCanvasOnScreen) {
					requestID = requestAnimFrame(updateAnimation);
				}
		};

		var canvasWrapperHeight;
		var animationOffScreenRules = function() {
			canvasWrapperHeight = $('#team-hero').outerHeight();
			if ( $(window).scrollTop() > canvasWrapperHeight ) {
				isCanvasOnScreen = false;
			} else {
				if ( !isCanvasOnScreen ) {
					requestID = requestAnimFrame(updateAnimation);
				}
				isCanvasOnScreen = true;
			}
		};
		$(window).on('scroll resize', function() {
			if ( $('.page-template-page-team').length ) {
				animationOffScreenRules();
			}
		});

		// Fade in and start
		$('#animation').fadeIn(500);
		updateAnimation();
	});
	});
}


*/