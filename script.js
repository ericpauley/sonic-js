keys = {}
for(var i = 0;i<255;i++){
  keys[i] = 0
}
var shipSpeed = .9
var speed = .25
var paused = false;
var focus = true;
ship = {}

$(window).keydown(function(e){
  keys[e.which] = 1
  switch(e.which){
    case 80:
    paused = !paused;
    break;
    case 49:
    shipSpeed = .1
    break;
    case 50:
    shipSpeed = .5
    break;
    case 51:
    shipSpeed = .9
    break;
    case 52:
    shipSpeed = 1
    break;
    case 53:
    shipSpeed = 1.1
    break;
    case 54:
    shipSpeed = 1.5
    break;
  }
})

$(window).focus(function() {
  focus = true;
}).blur(function() {
  focus = false;
});

$(window).keyup(function(e){
  keys[e.which] = 0
})

var waves = []
var lastWave = 0
var last = Date.now()
var runTime = 0

function tick(){
  var now = Date.now()
  var isPaused = paused// || !focus
  if(!isPaused){
    var delta = Math.min(now-last, 250)
    if(runTime + delta > lastWave + 250){
      delta = lastWave+250-runTime
      runTime = lastWave + 250
      last += delta
      gameTick({delta:delta-(runTime-(lastWave+250)), paused:isPaused, runTime:lastWave + 250})
    }else{
      runTime += delta
      gameTick({delta:delta, paused:isPaused, runTime:runTime})
      last=now
    }
    requestAnimationFrame(tick)
  }else{
    gameTick({delta:0, paused:isPaused, runTime:runTime})
    last = now
    requestAnimationFrame(tick)
  }
}

function gameTick(event){
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  if(canvas.width != window.innerWidth || canvas.height != window.innerHeight){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width
    height = canvas.height
  }
  context.clearRect(0,0,width,height)
  var down = keys[83] + keys[40] - keys[87] - keys[38];
  var right = keys[68] + keys[39] - keys[65] - keys[37];
  down = Math.min(Math.max(down,-1),1)
  right = Math.min(Math.max(right,-1),1)
  if(right && down){
    right /= Math.sqrt(2)
    down /= Math.sqrt(2)
  }
  ship.x += right*event.delta*shipSpeed*speed;
  ship.x = Math.min(Math.max(ship.x,10),width-10)
  ship.y += down*event.delta*shipSpeed*speed;
  ship.y = Math.min(Math.max(ship.y,10),height-10)
  if(event.runTime >= lastWave + 250){
    lastWave += 250;
    var wave = {};
    wave.x = ship.x;
    wave.y = ship.y;
    wave.created = event.runTime;
    waves.push(wave);
  }
  context.lineWidth = 5
  newWaves = []
  for(var i = 0;i<waves.length;i++){
    var wave = waves[i];
    var radius = wave.radius
    if(wave.x*wave.x + wave.y*wave.y < radius*radius &&
    (width-wave.x)*(width-wave.x) + wave.y*wave.y < radius*radius &&
    wave.x*wave.x + (height-wave.y)*(height-wave.y) < radius*radius &&
    (width-wave.x)*(width-wave.x) + (height-wave.y)*(height-wave.y) < radius*radius){
    }else{
      var radius = (event.runTime-wave.created)*speed
      wave.radius = radius;
      context.beginPath()
      context.arc(wave.x, wave.y, radius, 0, 2*Math.PI, false);
      context.strokeStyle = "rgba(255,255,255,"+Math.min(100/radius,1)+")"
      context.stroke()
      newWaves.push(wave)
    }
  }
  waves = newWaves
  context.beginPath();
  context.arc(ship.x, ship.y, 10, 0, 2 * Math.PI, false);
  context.fillStyle = "green";
  context.fill()
}

function init(){
  var canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
  ship.x = canvas.width/2;
  ship.y = canvas.height/2;
  tick()
}
