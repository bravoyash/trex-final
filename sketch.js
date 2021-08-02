var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOverimg, gameOver, restartimg, restart;
var jumpSound, checkPointSound, dieSound;

var score;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartimg = loadImage("restart.png");
  
  gameOverimg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3")

  dieSound = loadSound("die.mp3");

  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverimg);
  gameOver.scale = 0.5;

  restart = createSprite(300, 140);
  restart.addImage(restartimg);
  restart.scale = 0.5;
  restart.visible = false;

  //Obstacles and Cloud group
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup()

  //Creating trex collider
  trex.setCollider("circle",0,0,40)
  trex.debug=true;

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  score = 0;
}

function draw() {
  background(255);

  fill("red");
  text("Score: "+ score, 500,50);

  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;

    trex.changeAnimation("running", trex_running);

    ground.velocityX = -(4 + score/100);

    if(score > 0 && score % 1000 === 0) {
      checkPointSound.play();
    }
  
  if(keyDown("space")&& trex.y >= 150) {
    trex.velocityY = -15;
    jumpSound.play();
  }
  
  score = score + Math.round(frameCount/60);

  // add gravity to bring trex down
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //spawn the clouds
  spawnClouds();
  
  //spawn obstacles on the ground
  spawnObstacles();
  
  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    
    dieSound.play();
  }
}

  else if(gameState === END){
    ground.velocityX = 0;
 
   trex.velocityY = 0;

    gameOver.visible = true;
    restart.visible = true;

   //Change the trex Animation
    trex.changeAnimation("collided", trex_collided);

    //Freeze
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    //Freeze
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }

  if(mousePressedOver(restart)){
    reset();
  }

  trex.collide(invisibleGround);

  drawSprites();
}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  //restart.destroy();

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  ground.velocityX = -1;

  score = 0;

  frameCount = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -6;

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime =100;

    //Adding obstacle to group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //Adding clouds to the group
    cloudsGroup.add(cloud);
  }
}