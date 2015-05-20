keys = {}
for(var i = 0;i<255;i++){
  keys[i] = 0
}
var shipSpeed = .9
var speed = .25
var paused = false;

$(window).keydown(function(e){
  keys[e.which] = 1
  switch(e.which){
    case 80:
    paused = !paused;
    createjs.Ticker.paused = paused
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
  createjs.Ticker.paused = paused;
}).blur(function() {
  createjs.Ticker.paused = true;
});

$(window).keyup(function(e){
  keys[e.which] = 0
})

var waves = []
var lastWave = 0

function handleTick(event){
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width
  height = canvas.height
  radius = Math.sqrt(width*width+height*height)
  if(!event.paused){
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
    if(event.runTime > lastWave + 250){
      lastWave += 250;
      var wave = new createjs.Shape();
      wave.x = ship.x;
      wave.y = ship.y;
      wave.created = event.runTime;
      stage.addChildAt(wave,0);
      waves.push(wave);
    }
    var newWaves = []
    for(var i = 0;i<waves.length;i++){
      var wave = waves[i];
      var radius = (event.runTime-wave.created)*speed
      if(wave.x*wave.x + wave.y*wave.y < radius*radius &&
      (height-wave.x)*(height-wave.x) + wave.y*wave.y < radius*radius &&
      wave.x*wave.x + (width-wave.y)*(width-wave.y) < radius*radius &&
      (height-wave.x)*(height-wave.x) + (width-wave.y)*(width-wave.y) < radius*radius){
        stage.removeChild(wave)
      }else{
        wave.graphics.clear().setStrokeStyle(5).beginStroke("rgba(255,255,255,"+Math.min(100/radius,1)+")").drawCircle(0, 0, radius)
        newWaves.push(wave)
      }
    }
    console.log(newWaves.length)
    waves = newWaves
  }
  stage.update()
}

function init(){
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width
  height = canvas.height
  stage = new createjs.Stage("canvas");
  ship = new createjs.Shape();
  ship.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
  ship.x = width/2;
  ship.y = width/2;
  stage.addChild(ship);
  stage.update();
  createjs.Ticker.framerate = 60
  createjs.Ticker.addEventListener("tick", handleTick);
}
