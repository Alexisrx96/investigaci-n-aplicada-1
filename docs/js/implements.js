function newCanvas() {

    var cv = document.getElementById("cv");
    var context = cv.getContext("2d");

    context.beginPath();
    context.moveTo(200, 150);
    context.lineTo(200, 350);
    context.lineTo(350, 150);
    context.fillStyle = "lightGreen";
    context.fill();
    
}

function init() {
    window.requestAnimationFrame(draw);
  }

function draw(){
    
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    newCanvas();

    ctx.clearRect(0, 0, 500, 500); // clear canvas

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(200, 300);
    ctx.lineTo(310, 300);
    ctx.translate(5, -3.7);
    ctx.rotate((Math.PI/180)*1);
    ctx.fillStyle = "lightBlue";
    ctx.fill();
    window.requestAnimationFrame(draw);
}

init();