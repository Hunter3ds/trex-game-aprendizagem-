var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var nuvem, grupoDeNuvens, nuvemImagem;
var grupoDeObstaculos, obstaculo1,  obstaculo2,  obstaculo3, obstaculo4, obstaculo5, obstaculo6

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pontuacao;

var restart, imagemRestart
var gameOver, imagemGameOver

var somPulo
var somMorte
var somCheckpoint

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");

  somCheckpoint = loadSound("checkpoint.mp3");
  somMorte = loadSound("die.mp3");
  somPulo = loadSound("jump.mp3");

  imagemRestart = loadImage("restart.png");
  imagemGameOver = loadImage("gameOver.png");

  nuvemImagem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png"); 
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  //criar um sprite do trex
  trex = createSprite(50,height-50,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  

  
  
  //criar um sprite do solo
  solo = createSprite(width/2,height-20,width,125);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
 
  
  //criando solo invisível
  soloinvisivel = createSprite(width/2,solo.height+10,width,125);
  soloinvisivel.visible = false;
  
  //gerar números aleatórios
  var rand =  Math.round(random(1,100))
  console.log(rand)

  grupoDeNuvens = new Group();
  grupoDeObstaculos = new Group();

  pontuacao = 0;

  trex.setCollider("circle", 0, 0, 40);
  trex.debug = false;

  restart = createSprite(width/2, height/2);
  restart.addImage(imagemRestart);
  restart.visible = false
  

  gameOver = createSprite(width/2, height/2 -50);
  gameOver.addImage(imagemGameOver);
  gameOver.visible = false
  

} 

function draw() {
  background(180);
 textSize(20)
  text("score:" + pontuacao, 500, 50);

 if(gameState === PLAY){
  pontuacao = pontuacao +Math.round(getFrameRate() / 30);
  
 if(touches.lenght > 0 || keyDown("space")&& trex.y >= height-100) {
    trex.velocityY = -13;
    somPulo.play();
    touches = [];
  }
 

 trex.velocityY = trex.velocityY + 0.5;

 solo.velocityX = -(4 + 3*pontuacao/300)

 

 if (solo.x < 0){
  solo.x = solo.width/2;
 }

 gerarNuvens();
 gerarObstaculos();

 if(pontuacao % 100 == 0){
  somCheckpoint.play();
 }

 if(grupoDeObstaculos.isTouching(trex)){
  gameState = END;
  somMorte.play();
 }
 } 
 else if(gameState === END){
  solo.velocityX = 0;
  trex.velocityY = 0;

  trex.changeAnimation("collided",trex_colidiu);

  grupoDeObstaculos.setVelocityXEach(0);
  grupoDeNuvens.setVelocityXEach(0);

  grupoDeObstaculos.setLifetimeEach(-1);
  grupoDeNuvens.setLifetimeEach(-1);

  gameOver.visible = true;
  restart.visible = true;
  
  if(touches.lenght > 0 || keyDown("space")){
    touches = [];
   reset();
  }
 
 }

  trex.collide(solo);

 
  
  drawSprites();
}

function gerarNuvens() {
 if(frameCount % 60 == 0){
  nuvem = createSprite(width+20, height-300, 40, 10);
  nuvem.addImage(nuvemImagem)
  nuvem.velocityX = -2;
  nuvem.y = Math.round(random(20, 200));
 
  nuvem.lifetime = width/2;
  grupoDeNuvens.add(nuvem);
  nuvem.depth = trex.depth;
  trex.depth = trex.depth +1;
 } 
 
}
function gerarObstaculos(){
 if(frameCount % 100 == 0){
  var obstaculo =  createSprite(width-10,height-30,20,300);
  obstaculo.velocityX = -(6 + pontuacao/300);
  
  
  var rand = Math.round(random(1,6));
  switch (rand){
    case 1: obstaculo.addImage(obstaculo1);
     break;
    case 2: obstaculo.addImage(obstaculo2);
     break;
    case 3: obstaculo.addImage(obstaculo3);
     break;
    case 4: obstaculo.addImage(obstaculo4);
     break;
    case 5: obstaculo.addImage(obstaculo5);
     break;
    case 6: obstaculo.addImage(obstaculo6);
     break;
    default:
     break;
  }
  obstaculo.lifetime = width/2;
  grupoDeObstaculos.add(obstaculo);
 }
 
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  pontuacao = 0;
  grupoDeNuvens.destroyEach();
  grupoDeObstaculos.destroyEach();
  trex.changeAnimation("running", trex_correndo);


}



