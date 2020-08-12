let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x:undefined,
    y:undefined,
    click:false,
    radius: 50
};

addEventListener('mousemove',
(event)=>{
    mouse.x= event.x;
    mouse.y= event.y;
})

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
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;
    const friction = 0.9;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x * friction;
        particle.velocity.y = vFinal1.y * friction;

        otherParticle.velocity.x = vFinal2.x * friction;
        otherParticle.velocity.y = vFinal2.y * friction;
    }
}
class Particle {
    constructor(x, y, dx, dy, radius, color, mass) {
        this.x = x;
        this.y = y;
        this.velocity={
            x: dx,
            y: dy
        }
        this.radius = radius;
        this.color = color;
        this.mass = mass;

        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.strokeStyle = this.color;
            c.fillStyle = this.color;
            c.stroke();
            c.fill();
        };
        this.update = particles => {
            for (let i = 0; i < particles.length; i++) {
                if(this === particles[i]) continue;
                if(distance(this.x, this.y,particles[i].x,particles[i].y)-(this.radius+particles[i].radius)<0){
                    resolveCollision(this,particles[i]);
                }
                
            }
            if(this.x + this.radius >= innerWidth ||
                this.x - this.radius <= 0){
                    this.velocity.x = -this.velocity.x;
            }
            if(this.y + this.radius >= innerHeight ||
                this.y - this.radius <= 0){
                    this.velocity.y = -this.velocity.y;
            }
            this.y+=this.velocity.y;
            this.x+=this.velocity.x;
            this.draw() 
            this.click();
        }
        this.click = ()=>{
            if (mouse.click) {
                if(mouse.x-this.x <(mouse.radius+this.radius) && mouse.x - this.x>-(mouse.radius+this.radius)
                    && mouse.y-this.y<(mouse.radius+this.radius) && mouse.y-this.y>-(mouse.radius+this.radius)){
                        this.velocity.y *= 1.1;
                        this.velocity.x *= 1.1;
                }
            }
        }
    }
}
let distance= (x1,y1,x2,y2)=>{
    let xDistance = x2 -x1;
    let yDistance = y2-y1;
    return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
}
let randomIntFromRange = (max, min)=>{
    return Math.floor(Math.random() * (max - min) + min);
}
let c = canvas.getContext('2d');
let particles;
let maxRadius=50;
let minRadius=20;
let mouseParticle= new Particle(mouse.x,mouse.y,0,0,mouse.radius,'rgba(0,0,0,0.3)');
function init(){
    let area= Math.floor(Math.pow(maxRadius*2,2));
    particles = [];
    let particleAmount = Math.floor(canvas.height*canvas.width/area/2);
    particleAmount = particleAmount>0?particleAmount:1;
    for (let i = 0; i < particleAmount; i++) {
        let radius = randomIntFromRange(50,20);
        let x = randomIntFromRange(canvas.width-radius,radius);
        let y = randomIntFromRange(canvas.height-radius,radius);
        let dx = Math.random() -0.5;
        let dy = Math.random() -0.5;
        let color = getRandomHexColor();
        let mass = radius*2/10;
        if (!i==0) {
            for (let j = 0; j < particles.length; j++) {
                if (distance(x,y,particles[j].x,particles[j].y) - (radius+particles[j].radius) <= 0) {
                    x = randomIntFromRange(canvas.width-radius,radius);
                    y = randomIntFromRange(canvas.height-radius,radius);
                    j=-1;
                }
            }
        }
        particles.push(new Particle(x,y,dx,dy,radius,color,mass));
        particles.forEach(particle=>{particle.draw();})
    }
}
function animate(){
    c.clearRect(0,0, canvas.width, canvas.height)
    requestAnimationFrame(animate);
    particles.forEach(particle=>{particle.update(particles);})
    if(mouse.click){
        mouseParticle.x = mouse.x;
        mouseParticle.y = mouse.y;
        mouseParticle.draw();
        mouseParticle.update();
    }
}
init()
animate();
function getRandomHexColor() {
    let color='#';
    let hex;
    for (let i = 0; i < 3; i++) {
        hex = Math.floor(Math.random() * (255 - 0)) + 0;
        color+= hex.toString(16);
    }
    return color;
}function getRandomRgbColor() {
    let color='rgb(';
    let rgb;
    for (let i = 0; i < 3; i++) {
        rgb = Math.floor(Math.random() * (255 - 0)) + 0;
        color+= i<2 ? rgb.toString()+',': rgb.toString()+')';
    }
    return color;
}
function getRandomRgbaColor() {
    let color='rgb(';
    let rgb;
    for (let i = 0; i < 3; i++) {
        rgb = Math.floor(Math.random() * (255 - 0)) + 0;
        color+= rgb.toString()+',';
    }
    color+= Math.random()+")";
    return color;
}