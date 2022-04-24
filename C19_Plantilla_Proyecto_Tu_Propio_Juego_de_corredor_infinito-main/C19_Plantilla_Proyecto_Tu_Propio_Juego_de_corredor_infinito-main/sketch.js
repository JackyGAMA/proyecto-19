//variables 
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cangrejo, cangrejo_caminando, cangrejo_chocado;
var ground, invisibleGround, groundImg;

var burbujasGroup,burbujasImg;
var coralesGroup, coral1, coral2, coral3, coral4;
var backgroundImg;
var score=0;

var gameOver, restart;

function preload(){

backgroundImg=loadImage("fondo.png");
groundImg=loadImage("ground.png");

cangrejo_inicio=loadImage("cangrejo_inicio.png");
//profa si lo hiba a animar pero no encontre 2 cangrejos iguales
cangrejo_caminando=loadAnimation("cangrejo2.png");
cangrejo_chocado=loadAnimation("cangrejo_enojado.png");

groundImg=loadImage("ground.png");
burbujasImg=loadImage("burbujas.png");

coral1=loadImage("coral1.png");
coral2=loadImage("coral2.png");
coral3=loadImage("coral3.png");
coral4=loadImage("coral4.png");

gameOverImg = loadImage("gameover.png");
restartImg = loadImage("reset.png");

}

function setup() {
    createCanvas(windowWidth, windowHeight-50);

    cangrejo = createSprite(100,height-70,20,50);
  
  
    cangrejo.addAnimation("caminando", cangrejo_caminando);
    cangrejo.addAnimation("chocando", cangrejo_chocado);
    cangrejo.scale = 0.15
    
    invisibleGround = createSprite(width/2,height-10,width,125);  
    invisibleGround.shapeColor = "#DEB887";
    
    ground = createSprite(width/2,height,width,2);
    ground.addImage("ground",groundImg);
    ground.x = width/2
    ground.velocityX = -(6 + 3*score/100);
    ground.visible=false;
    
    gameOver = createSprite(width/2,height/2-150);
    gameOver.addImage(gameOverImg);

    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
  
    gameOver.scale = 0.5;
    restart.scale = 0.09;

    gameOver.visible = false;
    restart.visible = false;

    burbujasGroup = new Group();
    coralesGroup = new Group();
  
    score = 0;
    
}


function draw() {

  background(backgroundImg);
  textSize(60);
  fill("#2F4F4F")
  text("Puntaje: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/200);
    
    if((touches.length > 0 || keyDown("SPACE")) && cangrejo.y  >= height-120) {
      cangrejo.velocityY = -15;
       touches = [];
    }
    
    cangrejo.velocityY = cangrejo.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    cangrejo.collide(invisibleGround);
    spawnburbujas();
    spawncorales();
  
    if(coralesGroup.isTouching(cangrejo)){
        gameState = END;
    
  }
}
  else if (gameState === END) {
    ground.velocityX=0;
     cangrejo.velocityY=0;
     cangrejo.changeAnimation("chocando",cangrejo_chocado);
     cangrejo.scale=0.10
     coralesGroup.setVelocityXEach(0);
     burbujasGroup.setVelocityXEach(0);
     burbujasGroup.setLifetimeEach(-1);
     coralesGroup.setLifetimeEach(-1);
     gameOver.visible=true;
     restart.visible=true;
    }
    drawSprites();

    if(mousePressedOver(restart)){
        reset();
      }
   }

  

function spawnburbujas() {
    if (frameCount % 60 === 0) {
      var burbuja = createSprite(width+20,height-300,40,10);
      burbuja.y = Math.round(random(100,220));
      burbuja.addImage(burbujasImg);
      burbuja.scale = 0.1;
      burbuja.velocityX = -3;
    
      burbuja.lifetime = windowHeight+100;
      
      burbuja.depth = cangrejo.depth;
      cangrejo.depth = cangrejo.depth+1;
      
      burbujasGroup.add(burbuja);
    }
    
  }
  
  function spawncorales() {
    if(frameCount % 60 === 0) {
      var coral = createSprite(width+50,height-95,20,30);
      coral.setCollider('circle',0,0,100)
    
      coral.velocityX = -(6 + 3*score/200);
    
      var rand = Math.round(random(1,4));
      switch(rand) {
        case 1: coral.addImage(coral1);
                break;
        case 2: coral.addImage(coral2);
                break;
        case 3: coral.addImage(coral3);
                break;
        case 4: coral.addImage(coral4);
                break;
            default: break;
      }
              
      coral.scale = 0.2;
      coral.lifetime = 300;
      coral.depth = cangrejo.depth;
      cangrejo.depth +=1;
      
      coralesGroup.add(coral);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    coralesGroup.destroyEach();
    burbujasGroup.destroyEach();
    
    cangrejo.changeAnimation("caminando",cangrejo_caminando);
    cangrejo.scale=0.15;
    score=0
  }