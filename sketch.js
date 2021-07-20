var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood,feedFood;
var foodObj;
var feedingtime;
//create feed and lastFed variable here


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feedFood=createButton("Feed Dog");
  feedFood.position(700,95);
  feedFood.mousePressed(feedDog);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  getfeedtime = database.ref("feedTime").on("value",(data)=>{
    feedingtime = data.val();
  })

  //write code to read fedtime value from the database 
  fill("white");
  text("FED TIME : "+ feedingtime, 380 , 30);
 
  //write code to display text lastFed time here

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  //foodObj.deductFood();
}


function feedDog(){
  dog.addImage(happyDog);
  foodObj.deductFood();
  if(foodS>0){
    foodS--;
  }
  foodObj.updateFoodStock(foodS);
  database.ref("/").update({
    Food:foodS
  })
  getTime();
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
async function getTime(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

    var datetime = responseJSON.datetime;
    var hour = datetime.slice(11,13);
    database.ref("/").update({
      feedTime:hour
    })
}