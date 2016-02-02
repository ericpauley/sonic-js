keys = {}
for(var i = 0;i<255;i++){
  keys[i] = 0
}
var shipSpeed = .9
var speed = .07
var paused = false;
var focus = true;
var waveTime = 300;
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
    case 55:
    shipSpeed = 2.0
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
    var delta = Math.min(now-last, waveTime)
    if(runTime + delta > lastWave + waveTime){
      delta = lastWave+waveTime-runTime
      runTime = lastWave + waveTime
      last += delta
      gameTick({delta:delta-(runTime-(lastWave+waveTime)), paused:isPaused, runTime:lastWave + waveTime})
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
    sRadius = Math.sqrt(width*width+height*height)
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
  if(event.runTime >= lastWave + waveTime){
    lastWave += waveTime;
    var wave = {};
    wave.x = ship.x;
    wave.y = ship.y;
    wave.created = event.runTime;
    waves.push(wave);
  }
  context.lineWidth = 1
  newWaves = []
  for(var i = 0;i<waves.length;i++){
    var wave = waves[i];
    var radius = wave.radius
    if(radius > sRadius){
    }else{
      var radius = (event.runTime-wave.created)*speed
      wave.radius = radius;
      context.beginPath()
      for(var r=0;r>-3;r-=.5){
        context.moveTo(wave.x+Math.max(radius+r,0), wave.y)
        context.arc(wave.x, wave.y, Math.max(radius+r,0), 0, 2*Math.PI, false);
      }
      context.strokeStyle = "rgba(255,255,255,"+((75/radius))+")"
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
  sRadius = Math.sqrt(width*width+height*height)
  ship.x = canvas.width/2;
  ship.y = canvas.height/2;
  tick()
}
