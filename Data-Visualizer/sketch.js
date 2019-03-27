//Created by Collin Rottinghaus
//University of Missouri-Kansas City
//Febuary 22, 2019

        ///////////////////////////////////////////////////////////
        //DO NOT DELETE - REFERENCE FOR HOW TO GET VALUE FROM CSV//
        //data.getRow(1000).getString('start_time');             //
        ///////////////////////////////////////////////////////////

//Data
var mappa;
var parkingEvents = [];
var timeSelection;
let data;
let pos;
let timeText;

//GUI declaration 
let transparencyValue;
let timeBack1Month, timeBack1Day,timeBack5Hours,timeBack30Mins,timeBack5Mins;
let timeForward5Mins,timeForward30Mins,timeForward5Hours,timeForward1Day,timeForward1Month;

//Mappa API configuration
const options = {
  lat: 39.097242, //Initial Longitude Center
  lng: -94.583308, //Initial Latitude Center
  zoom: 17, //Initial Zoom Factor
  //maxNativeZoom: 22,
  studio: true,
  //style: 'mapbox://styles/mapbox/satellite-v9',
  style: 'mapbox://styles/mapbox/dark-v9',
};

//Called before HTML5 canvas loads
function preload(){
    data = loadTable('/KansasCityData/cleanedParking.csv', 'csv', 'header');
    //TODO: Sort via 'start_time' (Might be pre-processed)
}

//Called after HTML5 canvas loads
function setup(){
  //Canvas setup
  h = window.innerHeight;
  w = window.innerWidth;
  canvas = createCanvas(w, h);
  
  //API Call(s)
  //mappa = new Mappa('Google', 'AIzaSyAjAzuR4SDDwDHTaEbdWmtrgeDQvm3HUdQ');
  mappa = new Mappa('MapboxGL', 'pk.eyJ1IjoiY3lmdXJpeCIsImEiOiJjanNpaXQ2NnAwa2ZiM3lyN3A1YmZiNm1jIn0.w1r76syKPFLN-qsnp7Tmkw');

  //Initialize map
  areaMap = mappa.tileMap(options);
  areaMap.overlay(canvas);
  areaMap.onChange(drawCars);

  //GUI
    //Setup
  transparencyValue = createSlider(0, 100, 60);
  transparencyValue.position(0,0);
  timeBack1Month = createButton('<< 1 Month');
  timeBack1Day = createButton('<< 1 Day');
  timeBack5Hours = createButton('<< 5 Hours');
  timeBack30Mins = createButton('<< 30 Mins');
  timeBack5Mins = createButton('<< 5 Mins');
  timeText = createInput('Sun Aug 19 2018 23:54:29 GMT-0500 (Central Daylight Time)');
  timeForward5Mins = createButton('5 Mins >>');
  timeForward30Mins = createButton('30 Mins >>');
  timeForward5Hours = createButton('5 Hours >>');
  timeForward1Day = createButton('1 Day >>');
  timeForward1Month = createButton('1 Month >>');

  //timeSlider = createSlider(0, 2, 1);

    //Interaction
  timeText.changed(textChangeEvent);
  transparencyValue.changed(drawCars);
  timeBack1Month.mousePressed(back1month);
  timeBack1Day.mousePressed(back1day);
  timeBack5Hours.mousePressed(back5hour);
  timeBack30Mins.mousePressed(back30min);
  timeBack5Mins.mousePressed(back5min);
  timeForward5Mins.mousePressed(forward5min);
  timeForward30Mins.mousePressed(forward30min);
  timeForward5Hours.mousePressed(forward5hour);
  timeForward1Day.mousePressed(forward1day);
  timeForward1Month.mousePressed(forward1month);

  //Set time to the preset GUI value
  timeSelection = new Date(timeText.value());
  
}

//Called every frame
function draw(){
  

}

//Overlay map with 'parking-polygons'
function drawCars(){
  clear(); //Clear all existing polygons from the last frame

  //Visual Key (text for visual key is coded after cars are visualized, so that text overlays ontop of cars)

  fill(102, 153, 255, transparencyValue.value()); //RGB value for polygons and key (red, green, blue, transparency)   values ε (0, 255)

  square(width-40, height/2, 40); //1 overlap

  square(width-40, height/2-40, 40); //2 overlaps
  square(width-40, height/2-40, 40);
  
  square(width-40, height/2-80, 40); //3 Overlaps
  square(width-40, height/2-80, 40);
  square(width-40, height/2-80, 40);

  square(width-40, height/2-120, 40); //4 Overlaps
  square(width-40, height/2-120, 40);
  square(width-40, height/2-120, 40);
  square(width-40, height/2-120, 40);

  square(width-40, height/2-160, 40); //5 Overlaps
  square(width-40, height/2-160, 40);
  square(width-40, height/2-160, 40);
  square(width-40, height/2-160, 40);
  square(width-40, height/2-160, 40);
  
  square(width-40, height/2-200, 40); //6 Overlaps
  square(width-40, height/2-200, 40);
  square(width-40, height/2-200, 40);
  square(width-40, height/2-200, 40);
  square(width-40, height/2-200, 40);
  square(width-40, height/2-200, 40);

  

  for(var i = 0; i < data.getRowCount(); i++){
  //for(var i = 0; i < data.getRowCount()/4; i++){ //For rendering a subset of the data (Heavy bias in data selection due to the way that data is somewhat pre-sorted. For debugging purposes only)
    currentRow = data.getRow(i); //Iterate through all rows
    var startTime = new Date(currentRow.getString('start_time')); //Create date objects for start and end time
    var endTime = new Date(currentRow.getString('end_time'));
    if(startTime < timeSelection && endTime > timeSelection){ //For each row, see if parking duration matches the time selection
      var geometryString = currentRow.getString('geometry'); //Input polygon coordinates
      var coords = geometryString.split(','); //Split coordinates with delimiter ','
      
      beginShape();  //Every vertex(x, y) call marks a corner of the polygon
      let xy;
      xy = areaMap.latLngToPixel(float(coords[1]), float(coords[0]));  //Convert lat/longitude coordinates into corresponding pixel coordinates
      vertex(xy.x, xy.y); //Draw pixel at found x and y location (top of screen y = 0, left of screen x = 0; down and right increase these values respectively)
      xy = areaMap.latLngToPixel(float(coords[3]), float(coords[2]));
      vertex(xy.x, xy.y);
      xy = areaMap.latLngToPixel(float(coords[5]), float(coords[4]));
      vertex(xy.x, xy.y);
      xy = areaMap.latLngToPixel(float(coords[7]), float(coords[6]));
      vertex(xy.x, xy.y);
      xy = areaMap.latLngToPixel(float(coords[9]), float(coords[8]));
      vertex(xy.x, xy.y);
      endShape(CLOSE); //Close the shape and fill (Should already be taken care of because vertex 0 == vertex 4 according to the data set)
    }
  }

  //Visual Key Text
  fill(255);

  textAlign(RIGHT);
  text('1 Overlap', width-45, height/2+25);
  text('2 Overlaps', width-45, height/2-15);
  text('3 Overlaps', width-45, height/2-55);
  text('4 Overlaps', width-45, height/2-95);
  text('5 Overlaps', width-45, height/2-135);
  text('6+ Overlaps', width-45, height/2-175);
}




//Adaptively resize window
function windowResized() {
  //TODO: resize map as well
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);

  }


//GUI Interaction functions (Values are multiplied by 60,000 to recieve a minute value)
function textChangeEvent(){
  timeSelection = new Date(timeText.value());
  drawCars(); //Redraw cars
}
function back5min(){
  timeSelection = new Date(timeSelection.getTime() - 5*60000)
  timeText.value(timeSelection);
  drawCars();
}
function back30min(){
  timeSelection = new Date(timeSelection.getTime() - 30*60000)
  timeText.value(timeSelection);
  drawCars();
}
function back5hour(){
  timeSelection = new Date(timeSelection.getTime() - 300*60000)
  timeText.value(timeSelection);
  drawCars();
}
function back1day(){
  timeSelection = new Date(timeSelection.getTime() - 1440*60000)
  timeText.value(timeSelection);
  drawCars();
}
function back1month(){
  timeSelection = new Date(timeSelection.getTime() - 43800*60000)
  timeText.value(timeSelection);
  drawCars();
}
function forward5min(){
  timeSelection = new Date(timeSelection.getTime() + 5*60000)
  timeText.value(timeSelection);
  drawCars();
}
function forward30min(){
  timeSelection = new Date(timeSelection.getTime() + 30*60000)
  timeText.value(timeSelection);
  drawCars();
}
function forward5hour(){
  timeSelection = new Date(timeSelection.getTime() + 300*60000)
  timeText.value(timeSelection);
  drawCars();
}
function forward1day(){
  timeSelection = new Date(timeSelection.getTime() + 1440*60000)
  timeText.value(timeSelection);
  drawCars();
}
function forward1month(){
  timeSelection = new Date(timeSelection.getTime() + 43800*60000)
  timeText.value(timeSelection);
  drawCars();
}