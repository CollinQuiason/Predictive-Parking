//Created by Collin Rottinghaus
//University of Missouri-Kansas City
//Febuary 22, 2019

var mappa;
var parkingEvents = [];
var timeSelection;
let data;
let timeSlider;
let pos;
let c1;
let c2;
let c3;
let c4;
let c5;
let timeText;
let timeBack1Month, timeBack1Day,timeBack5Hours,timeBack30Mins,timeBack5Mins;
let timeForward5Mins,timeForward30Mins,timeForward5Hours,timeForward1Day,timeForward1Month;

const options = {
  lat: 39.097242, //Initial Longitude Center
  lng: -94.583308, //Initial Latitude Center
  zoom: 19,
  //maxNativeZoom: 22,
  studio: true,
  //style: 'mapbox://styles/mapbox/traffic-night-v2',
  style: 'mapbox://styles/mapbox/dark-v9',
};


  //DO NOT DELETE - REFERENCE FOR HOW TO GET VALUE FROM CSV
  //data.getRow(1000).getString('start_time');

function preload(){
    //TODO: Read in all parking events
    data = loadTable('/MainstParking/cleanedParking.csv', 'csv', 'header');
    //TODO: Sort via parking time (Might be pre-processed)
    

}

function setup(){
    //Canvas
  h = window.innerHeight;
  w = window.innerWidth;
  canvas = createCanvas(w, h);

  
  

  //mappa = new Mappa('Google', 'AIzaSyAjAzuR4SDDwDHTaEbdWmtrgeDQvm3HUdQ');
  mappa = new Mappa('MapboxGL', 'pk.eyJ1IjoiY3lmdXJpeCIsImEiOiJjanNpaXQ2NnAwa2ZiM3lyN3A1YmZiNm1jIn0.w1r76syKPFLN-qsnp7Tmkw');


  //background(0);
  areaMap = mappa.tileMap(options);
  areaMap.overlay(canvas);
  areaMap.onChange(drawCars);

  //GUI
  //timeSlider = createSlider(0, 2, 1);
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


  timeText.changed(textChangeEvent);
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



  timeSelection = new Date(timeText.value());
  
}

function draw(){
  

}

function drawCars(){
  clear();
  for(var i = 0; i < data.getRowCount(); i++){
  //for(var i = 0; i < 80; i++){
    currentRow = data.getRow(i);
    var startTime = new Date(currentRow.getString('start_time'));
    var endTime = new Date(currentRow.getString('end_time'));
    if(startTime < timeSelection && endTime > timeSelection){
      var geometryString = currentRow.getString('geometry');
      var coords = geometryString.split(',');
      fill(102, 153, 255, 60);
      beginShape();
      let xy;
      xy = areaMap.latLngToPixel(float(coords[1]), float(coords[0]));
      vertex(xy.x, xy.y);
      xy = areaMap.latLngToPixel(float(coords[3]), float(coords[2]));
      vertex(xy.x, xy.y);
      xy = areaMap.latLngToPixel(float(coords[5]), float(coords[4]));
      vertex(xy.x, xy.y);
      xy = areaMap.latLngToPixel(float(coords[7]), float(coords[6]));
      vertex(xy.x, xy.y);
      xy = areaMap.latLngToPixel(float(coords[9]), float(coords[8]));
      vertex(xy.x, xy.y);
      endShape(CLOSE);
    }
  }
}





function windowResized() {
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
  }
/*
function isWithinTimeBounds(selectedTime, carStart, carEnd){
    if (carStart)
}*/

function textChangeEvent(){
  timeSelection = new Date(timeText.value());
  drawCars();
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