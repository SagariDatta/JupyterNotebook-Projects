//Variables for media (images, fonts)
PImage imgGrey;
PImage imgBG;
PImage imgWater;
PFont myFont;

//Variables for waves
float angle = 0;                //initialized as a global variable since used in mutliple functions
float angleInc = 0.1;           //initialized as a global variable since used in mutliple functions
float amplitude = 100;          //initialized as a global variable since used in mutliple functions
float period = 0.5;             //initialized as a global variable since used in mutliple functions


//Variables for rain
float rainXPos;                 //initialized as a global variable since used inside and outside loops in more than one function
float rainYPos;                 //initialized as a global variable since used inside and outside loops in more than one function
int colRain;                    //initialized as a global variable since used inside and outside loops in more than one function

//Variables for circles
float d;                        //diameter for the drawCircle functions

//Variables for timer
int curTime;

//Variable for states
int curState;

void setup(){
  size(1000,800);
  imgGrey = loadImage("imgGrey.jpg");
  imgBG = loadImage("imgBG.jpg");
  imgWater = loadImage("imgWater.jpg");
  myFont = loadFont("CenturyGothic.vlw");
  int curState = 0;
}

void draw(){
 
  //State 0 - wavesMultiType
  if (curState == 0){
    curTime = millis();
    if (curTime < 10*1000){
      wavesMultiType();
    }
    else{
      curTime = 0;
      curState = 1;
    }
  }
  
  //State 1 - wavesTan
  else if (curState == 1){
    curTime = millis();
    if (curTime < 15*1000){
      wavesTan();
    }
    else{
      curTime = 0;
      curState = 2;
    }
  }
  
  //State 2 - wavesSinCos1
  else if (curState == 2){
    curTime = millis();
    if (curTime < 20*1000){
      wavesSinCos1();
    }
    else{
      curTime = 0;
      curState = 3;
    }
  }
  
  //State 3 - wavesSinCos2
  else if (curState == 3){
    curTime = millis();
    if (curTime < 23*1000){
      wavesSinCos2();
    }
    else{
      curTime = 0;
      curState = 4;
    }
  }

  //State 4 - wavesEnd
  else if (curState == 4){
    curTime = millis();
    if (curTime < 28*1000){
      wavesEnd();
    }
    else{
      curTime = 0;
      curState = 5;
    }
  }
  
  //State 5 - rainFall
  else if (curState == 5){
    curTime = millis();
    if (curTime < 30*1000){
      rainFall();
    }
    else{
      curTime = 0;
      curState = 6;
    }
  }
  
  //State 6 - rainFilled
  else if (curState == 6){
    curTime = millis();
    if (curTime < 35*1000){
      rainFilled();
    }
    else{
      curTime = 0;
      curState = 7;
    }
  }
  
  //State 7 - waterCircles
  else if (curState == 7){
    waterCircles();
  }

  //save images
  saveFrame("frames/####.png");

}

void mouseDragged(){
  drawCircles1();
  drawCircles2();
}

void keyPressed(){ 
}

// Wave functions
//Function 0
void wavesMultiType(){
  noStroke();
  frameRate(3);
  background(0,0,35);
   for (int i = 0; i<width; i++){
     //color mapped for grey scale 
    float greyVal = map(i, 0, height, 35, 75);
    fill(greyVal*i);
    //rectangles in the shape of cosine function
    rect(i*30, (amplitude*cos(period*(angle)))+height*0.9, 6,6);
    angle += angleInc;
  }
  for (int i = 0; i<width; i++){
    //color mapped for blue RGB value
    float blueVal = map(i, 0, height, 15, 50);
    fill(0,0,blueVal*i);
    //circles in the shape of sine function
    ellipse(i*30, (amplitude*sin(period*(angle)))+height*0.75, 10,10);
    angle += angleInc;
  }
  for (int i = 0; i<width; i++){
    //color mapped for blue RGB value
    float blueVal = map(i, 0, height, 50, 255);
    fill(0,0,blueVal*i);
    //larger circles in the shape of tan function
    ellipse(i*30, (amplitude*tan(period*(angle)))+height*0.5, 30,30);
    angle += angleInc;
  }
}

//Function 1
void wavesTan(){
  //framerate set to control how fast the sketch animates
  frameRate(10);  
  background(0,0,35);
  for (int i = 0; i<width; i++){
    //color mapped for blue RGB value
    float blueVal = map(i, 0, width, 230, 240);
    fill(180, 200, blueVal*i);
    //ellipses in the shape of tan
    ellipse(i, (amplitude*tan(period*(angle)))+height*0.5, 5,8);
    angle += angleInc;
  }
}

//Function 2
void wavesSinCos1(){ 
  //framerate set to control how fast the sketch animates
  frameRate(2);
  background(0,0,random(50,52));
  for (int i = 0; i<width; i++){
    //color mapped for blue RGB value
    float blueVal = map(i, 0, width, 240, 250);
    fill(120, 210, blueVal*i);
    //text water in shape of sine
    textSize(10);
    //textFont(myFont); 
    text("Water", i, ((amplitude)*sin((angle*1.2)))+height*0.35);
    angle += angleInc;
  }
  for (int i = 0; i<width; i++){
    //color mapped for blue RGB value
    float blueVal = map(i, 0, width, 240, 250);
    fill(70, 150, blueVal*i);
    //text waves in shape of cosine
    textSize(10);
    //textFont(myFont);
    text("Waves", i, ((amplitude)*cos((angle*1.3)))+height*0.65);
    angle += angleInc;
  }
}

//Function 3
void wavesSinCos2(){ 
  //framerate set to control how fast the sketch animates
  frameRate(2);
  background(0,0,random(50,52));
  for (int i = width/2; i<width; i++){
    //color mapped for blue RGB value
    float blueVal = map(i, 0, width, 240, 250);
    fill(70, 150, blueVal*i);
    //text water in shape of sine (half width)
    textSize(10);
    //textFont(myFont);
    text("Water", i, ((amplitude)*sin((angle*1.2)))+height*0.35);
    angle += angleInc;
  }
  for (int i = 0; i<width/2; i++){
    //color mapped for blue RGB value
    float blueVal = map(i, 0, width, 240, 250);
    fill(120, 210, blueVal*i);
    //text waves in shape of cosine (half width)
    textSize(10);
    //textFont(myFont);
    text("Waves", i, ((amplitude)*cos((angle*1.3)))+height*0.65);
    angle += angleInc;
  }
}

//Function 4
void wavesEnd(){
  //framerate set to control how fast the sketch animates
  frameRate(30);
  noStroke();
  for (int i = 0; i<width; i++){
    ellipse(i*20, ((height-(amplitude*4))*sin(angle))+height/2, 40,40);
    angle += angleInc;
  }
}



//Rainfall functions
//Function 5
void rainFall(){  
  background(169); 
  //initializing position increment value
  int rainInc = 40;                                               
  //initializing x position for while loop condition
  rainXPos = 0;                                               
  //while loop
  while (rainXPos < width){    
    //setting y position as random for every while loop
    rainYPos = random(0, height);                               
    //changing x position by increment value for every while loop 
    rainXPos += rainInc;                                      
    //creating raindrops
    noStroke();
    colRain = imgGrey.get(int(rainXPos),int(rainYPos));
    fill(colRain);
    ellipse(rainXPos, rainYPos, 4, 8);
   }
   
}

//Function 6
void rainFilled(){ //with randomseed
  background(imgBG);     
  //initializing increment value
  int rainInc = 1;
  //setting seed to return constant random values
  //randomSeed(0); - removed to give more movement
  //for loop
  for (int i=0; i < 100; i++){
    //initializing y position to for 'for' loop
    rainYPos = 0;    
    while (rainYPos < height){
      //setting x position to random
      rainXPos = random(0, width);
      //incrementing y position
      rainYPos += rainInc;
      //raindrops
      noStroke();
      colRain = imgBG.get(int(rainXPos),int(rainYPos));
      fill(colRain);
      ellipse(rainXPos, rainYPos, 7,14);
    }
  }
}


//Circle functions
//Function 7
void waterCircles(){
  background(255);
  frameRate(1);
  
  //Matrix transformation for main origin filledin circle
  pushMatrix();
  noStroke();
  // Setting random x,y translate positions
  float x1 = random(0,width);
  float y1 = random(0,height);
  translate(x1,y1);
  //Setting diameter of circle to the distance function 
  float diam1 = dist(random(200,350),random(200,350),width/2,height/2);
  //Setting fill color for circle 1 based on imgWater
  int colorCircle = imgWater.get(mouseX, mouseY);
  fill(colorCircle);
  ellipse(0,0,diam1,diam1);
  popMatrix();
  
  //Complementary filledin circles (same logic but without transformations)
  noStroke();
  //Setting random x,y positions for circle 2
  float x2 = random(0,width);
  float y2 = random(0,height);
  //Setting diameter of circle 2 to the distance function
  float diam2 = dist(random(200,350),random(200,350),width/3,height/3);
  //Setting fill color for circle 1 based on imgWater
  fill(colorCircle);
  ellipse(x2,y2,diam2,diam2);
  //Setting random x,y positions for circle 3
  float x3 = random(0,width);
  float y3 = random(0,height);
  //Setting diameter of circle 3 to the distance function 
  float diam3 = dist(random(90,350),random(90,350),width/8,height/8);
  //Setting fill color for circle 3 to random grey color value
  fill(random(200,235));
  ellipse(x3,y3,diam3,diam3);

  
  //Matrix transformation for four noFill circles
  pushMatrix();
  noFill();
  //Setting stroke blue RGB to random 
  stroke(0,0,random(60,200));
  //Setting diameter of circles to random 
  float diam1A = random(10,300);
  float diam2A = random(300,600);
  float diam3A = random(200, 450);
  float diam4A = random(100, 150);
  //Setting stroke weight to random and translating positions for circle 1A
  strokeWeight(random(1));
  translate(mouseX,mouseY);
  ellipse(0,0,diam1A,diam1A);
  //Setting stroke weight to random and translating positions for circle 2A
  strokeWeight(random(0.25));
  translate(mouseX+10, mouseY+10);
  ellipse(0,0,diam2A,diam2A);
  //Setting stroke weight to random and translating positions for circle 3A
  strokeWeight(random(1.5));
  translate(mouseX-10,mouseY-10);
  ellipse(0,0,diam3A,diam3A);
  //Setting stroke weight to random and translating positions for circle 4A
  strokeWeight(random(0.5));
  translate(mouseX+20, mouseY+20);
  ellipse(0,0,diam4A,diam4A);
  popMatrix();
  
  //Drawing four other noFill circles (same logic but no matrix transformations)
  noFill();
  //Setting stroke color to random blue RGB value
  stroke(0,0,random(60,200));
  //Setting diamter of circles to random
  float diam1B = random(10,300);
  float diam2B = random(300,600);
  float diam3B = random(200, 450);
  float diam4B = random(100, 150);
  //Setting strokeWeight to random and drawing circle 1B
  strokeWeight(random(1));
  ellipse(mouseX,mouseY,diam1B,diam1B);
  //Setting strokeWeight to random and drawing circle 2B
  strokeWeight(random(0.25));
  ellipse(mouseX+100,mouseY+100,diam2B,diam2B);
  //Setting strokeWeight to random and drawing circle 3B
  strokeWeight(random(1.5));
  ellipse(mouseX-100,mouseY-100,diam3B,diam3B);
  //Setting strokeWeight to random and drawing circle 4B
  strokeWeight(random(0.5));
  ellipse(mouseX+150,mouseY+150,diam4B,diam4B);
   
}

//Function 8
void drawCircles1(){
  d = dist(mouseX,mouseY, width/8,height/8);
  d = map(d, width/3,width, 20,400);
  int colorCircle = imgWater.get(mouseX, mouseY);
  noStroke();
  fill(colorCircle);
  ellipse(mouseX,mouseY,d, d);
}


//Function 9
void drawCircles2(){
  d = dist(mouseX,mouseY, width/8,height/8);
  //diam = map(mouseX, width/3,width, 20,400);
  int colorCircle = imgBG.get(mouseX, mouseY);
  stroke(colorCircle);
  stroke(d);
  strokeWeight(3);
  noFill();
  ellipse(mouseX,mouseY,d, d);
}
