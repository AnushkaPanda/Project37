
var dog,dogIMG, happyDog, happyDogIMG;
var database, food, foodStock ;
var fedTime, lastFed, foodObj;
var BedRoom, Garden, WashRoom;
var gameState="";
function preload()
{
  dogIMG=loadImage("Dog.png")
  happyDogIMG=loadImage("Happy.png")
  BedRoom=loadImage("Bed Room.png")
  Garden=loadImage("Garden.png")
  WashRoom=loadImage("Wash Room.png")
}

function setup() {
	database = firebase.database();
    createCanvas(1000,500);

    foodObj=new Food();

   


    foodStock=database.ref('Food');
    foodStock.on("value",readStock);

    feed = createButton("Feed the dog");
    feed.position(700, 95);
    feed.mousePressed(feedDog)

    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);

    
    dog = createSprite(250,250,10,10);
    dog.addImage(dogIMG)
    dog.scale = 0.15;

  readState=database.ref('gameState')
  readState.on("value", function(data){
    gameState=data.val();
  })
}

function draw() {  
  background(46,139,87);
  foodObj.display();

  textSize(25)
  fill("blue");

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage();
  }

  fedTime = database.ref('FeedTime');
    fedTime.on("value", function(data){
     lastFed = data.val()
    })

 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("Playing")
   foodObj.garden();
 }else if(currentTime==(lastFed+2)){
   update("Sleeping");
   foodObj.bedroom();
 }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
   update("Bathing");
   foodObj.washroom();
 }else{
   update("Hungry")
   foodObj.display();
 }

// getState()
// update()

  if(lastFed>=12){
    text("Last Feed :"+ lastFed%12 + "PM", 350, 30)
  }else if(lastFed==0){
    text("Last Feed : 12 AM", 350, 30);
  }else{
    text("Last Feed :"+ lastFed + "AM", 350, 30)
  }
  drawSprites();
}

function readStock(data){
  food = data.val()
  foodObj.updateFoodStock(food);
}
function feedDog(){
  dog.addImage(happyDogIMG);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  food++;
  database.ref('/').update({
    Food:food
  })
}
function getState(){
  var gameStateRef  = database.ref('gameState');
  gameStateRef.on("value",function(data){
     gameState = data.val();
  });
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}
 
  




