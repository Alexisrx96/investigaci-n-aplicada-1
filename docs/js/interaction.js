let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x:undefined,
    y:undefined
};

window.addEventListener('mousemove',
(event)=>{
    mouse.x= event.x;
    mouse.y= event.y;
});
addEventListener('resize',()=>{
    canvas.width=innerWidth>500?innerWidth:500;
    canvas.height=innerHeight>500?innerHeight:500;
    init();
});
class Circle {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;

        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.strokeStyle = this.color;
            c.fillStyle = this.color;
            c.stroke();
            c.fill();
        };
        this.update = () => {
            if(this.x + this.radius > innerWidth ||
                this.x - this.radius < 0){
                    this.dx = -this.dx;
            }
            if(this.y + this.radius > innerHeight ||
                this.y - this.radius < 0){
                    this.dy = -this.dy;
            }
            //interactivity
            if(mouse.x-this.x <maxRadius && mouse.x - this.x>-maxRadius
                && mouse.y-this.y<maxRadius && mouse.y-this.y>-maxRadius){
                if (this.radius<maxRadius) {
                    this.radius+=2;
                }
            }else if(this.radius>minRadius){
                this.radius -=2;
            }

            this.y+=this.dy;
            this.x+=this.dx;
            this.draw() 
        }
    }
}
let c;
let hideTrail;
let maxRadius;
let minRadius;
let circles;
init = ()=>{
    let c = canvas.getContext('2d');
    let hideTrail = true;
    let maxRadius = 50;
    let minRadius = 5;
    let circles = [];
    for (let index = 0; index < 500; index++) {
        let radius = minRadius;
        let x = Math.random() * (innerWidth - radius * 2) + radius;
        let dx = Math.random() -0.5;
        let y = Math.random() * (innerHeight - radius * 2) + radius;
        let dy = Math.random() -0.5;
        let color = getRandomHexColor();
        circles.push(new Circle(x,y,dx,dy,radius,color));
    }
    circles.forEach(circle=>{circle.draw();});
}
function animate(){
    if(hideTrail){
        c.clearRect(0,0, innerWidth, innerHeight)
    }
    requestAnimationFrame(animate);
    circles.forEach(circle=>{circle.update();})
}
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