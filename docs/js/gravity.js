// Learn to code this at:
// https://www.youtube.com/watch?v=3b7FyIxWW94

// Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
var mouse = {
	x: innerWidth / 2,
    y: innerHeight / 2,
    click: false
};

var colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
];

var gravity = 0.2;
var friction = 0.98;


// Event Listeners
addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize',()=>{
    canvas.width=innerWidth>500?innerWidth:500;
    canvas.height=innerHeight>500?innerHeight:500;
    init();
});

addEventListener("mousedown", function(event) {
    mouse.click =true;
});
addEventListener("mouseup", function(event) {
    mouse.click = false
    
});


// Utility Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}


// Objects
function Ball(x, y, dx, dy, radius, color, date) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
    this.color = color;

    this.update = function(){
		if (this.y + this.radius + this.dy> canvas.height) {
			this.dy = -this.dy;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
		} else {
			this.dy += gravity;
		}

		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx * friction;
		}

		this.x += this.dx;
		this.y += this.dy;
        this.draw();
    } 

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
		c.closePath();
    };
    
    this.reset= function(x, y, dx, dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    };
}

function resetOnClick(){
    if(clicCount >= ballArray.length){
        clicCount = 0;
    }
    var dx = randomIntFromRange(-3, 3)
    var dy = randomIntFromRange(-2, 2)
    ballArray[clicCount].reset(mouse.x, mouse.y, dx, dy);
    clicCount++;
}
// Implementation
var ballArray = [];
var clicCount = 0;
function init() {
	ballArray = [];
	for (let i = 0; i < 600; i++) {
		var radius = randomIntFromRange(8, 20);
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var dx = randomIntFromRange(-3, 3)
		var dy = randomIntFromRange(-2, 2)
        ballArray.push(new Ball(x, y, dx, dy, radius, randomColor(colors)));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    if(mouse.click){
        resetOnClick();
    }

	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
    }
}
init();
animate();