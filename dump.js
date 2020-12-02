//Don't even think that I am gonna comment this 200 lines file to explain



class Puck{
  constructor(){
    this.size=20;
    this.pos=createVector((width-this.size)/2,(height-this.size)/2);
    //this.speed=createVector(random([random(1,2),random(-2,-1)]),random([random(1),random(-1)]));
    this.angle=radians(random([random(25,-25),random(180+25,180-25)]))
    this.speed=createVector(cos(this.angle)*2,sin(this.angle))
  }
  show(){
    ellipseMode(CORNER);
    fill(255);
    // ellipse(this.pos.x,this.pos.y,this.size,this.size);
    ellipse(this.pos.x,this.pos.y,this.size,this.size);
  }
  update(mag=width/100){
    this.pos.x+=this.speed.x*mag;
    this.pos.y+=this.speed.y*mag;
  }
  boundaryOut(){
    if(this.pos.x<0){
      return "left";
    }else if(this.pos.x+this.size>width){
      return "right"
      }else{
      return false;
    }
  }
  boundary(){
    if(this.pos.y<0 || this.pos.y+this.size>height && !left.hit(this)){
      return true;
    }else{
      return false;
    }
  }
  bounce(axis){
    //print(axis)
    if(axis=="all" || axis=="ALL"){
      this.speed.x*=-1;
      this.speed.y*=-1;
    }else if(axis=="x" || axis=="X"){
      this.speed.x*=-1;
    }else if(axis=="y" || axis=="Y"){
      this.speed.y*=-1;
    }
  }
  reflectAngle(puddle){
    if(puddle.pos.x<width/2){
      this.angle=map((puddle.pos.y+puddle.h/2)-puck.pos.y,
      puddle.h/2,-puddle.h/2,
      radians(-45),
      radians(45))
    }else{
      this.angle=map((puddle.pos.y+puddle.h/2)-puck.pos.y,
      puddle.h/2,-puddle.h/2,
      radians(180+45),
      radians(180-45))
    }
    this.speed=createVector(cos(this.angle)*2,sin(this.angle))
  }
}
class LeftPuddle{
  constructor(x,y,w,h){
    this.pos=createVector(x+w,y)
    this.w=-w
    this.h=h
    this.speed=3
  }
  autoPlay(){
    if(puck.speed.x<0){
      this.update(constrain(puck.pos.y-(this.pos.y+this.h/2-puck.size/2),-3,3))
    }
  }
  show(){
    fill(255)
    strokeWeight(3)
    rect(this.pos.x,this.pos.y,this.w,this.h)
  }
  update(speed){
    this.pos.y=constrain(this.pos.y+speed,0,height-this.h)
    //print("updating")
  }
  hit(puck){
    if(this.pos.y<=puck.pos.y+puck.size && this.pos.y+this.h>=puck.pos.y){
      if(this.pos.x>=puck.pos.x){
        puck.pos.x=this.pos.x
        return true;
      }
    }
    return false
  }
}
class RightPuddle{
  constructor(x,y,w,h){
    this.pos=createVector(x,y)
    this.w=w
    this.h=h
    this.speed=3
  }
  autoPlay(){
    if(puck.speed.x>0){
      this.update(constrain(puck.pos.y-(this.pos.y+this.h/2-puck.size/2),-3,3))
    }
  }
  show(){
    strokeWeight(3)
    fill(255)
    rect(this.pos.x,this.pos.y,this.w,this.h)
  }
  update(speed){
    this.pos.y=constrain(this.pos.y+speed,0,height-this.h)
    //print("updating")
  }
  hit(puck){
    if(this.pos.y<=puck.pos.y+puck.size && this.pos.y+this.h>=puck.pos.y){
      if(this.pos.x<=puck.pos.x+puck.size){
        puck.pos.x=this.pos.x-puck.size
        return true;
      }
    }
    return false
  }
}

function createOnce(){
  imgloaded=false
  soundloaded=false
  failSoundLoaded=false
  stopSoundLoaded=false
  stop=loadSound('fai.mp3',()=>stopSoundLoaded=true)
  leftP=createP('')
  fail=loadSound('fail.mp3',()=>{
    failSoundLoaded=true
  })
  back=loadImage('ping-pong_background.jpeg',()=>imgloaded=true)
  hitSound=loadSound('hit.mp3',()=>{
    soundloaded=true;
    hitSound.setVolume(0.5)
  })
  createCanvas(windowWidth-40,windowWidth/2)
  left=new LeftPuddle(width/30,(height-100)/2,width/30,height/3)
  right=new RightPuddle(width-width/15,(height-100)/2,width/30,height/3)
}

function initialize(){
  leftScore=0
  bg=50
  up=false
  down=false
  puck=new Puck()
  left=new LeftPuddle(width/30,(height-100)/2,width/30,height/3)
  leftP.html(leftScore)
  right=new RightPuddle(width-width/15,(height-100)/2,width/30,height/3)
}

function createPads(){
  restart=createImg('restart.png')
  restart.size(50,50)
  restart.touchStarted((event)=>{
    event.preventDefault()
    initialize();
    loop()
    })
  restart.mousePressed(initialize)
  upB=createImg('up.png')
  downB=createImg('down.png')
  upB.position(100,height+10)
  upB.size(100,100)
  downB.position(100,height+110)
  downB.size(100,100)
  upB.style={
    color:'red'
  }
  upB.touchStarted((event)=>{
    event.preventDefault()
    up=true
    down=false
  })
  downB.touchStarted((event)=>{
    event.preventDefault()
    down=true
    up=false
  })
  upB.touchEnded(()=>{
    up=false
    down=false
  })
  downB.touchEnded(()=>{
    down=false
    up=false
  })
}

function show(){
  puck.show()//Shows the puck Object
  left.show() //Shows the left Paddle
  right.show()  //Shows the right Puddle
}

function update(){
  puck.update() //Updates puck's position
  left.autoPlay() //Left plays the game by itself
  if(up){
    right.update(-width/100)  //if up button is pressed
  }else if(down){
    right.update(width/100) //if down button is pressed
  }
  if(keyIsPressed){
    if(keyCode==UP_ARROW){
      right.update(-width/100)  //moves the player's puddle upward if up arrow is pressed
    }
if(keyCode==DOWN_ARROW){
      right.update(width/100) //moves the player's puddle upward if down arrow is pressed
    }
  }
}