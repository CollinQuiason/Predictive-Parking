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
let data;
let pos;
var maxparking = [10, 9, 0, 7, 5, 11, 11, 17, 20, 11, 8, 8, 0, 15, 4, 0, 1, 8, 4, 0, 4, 9, 12]; //Index = sensor# - 1
var predictions = [23];
var thecount = 0;
var nSensors;
var centX, centY, maxX, maxY, minX, minY;
var pixelMarginThreshold = 50; //Maximum pixels required to merge sensor predictions visually



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
  data = loadTable('/KansasCityData/sensorInformation.csv', 'csv', 'header');
  predictions[13] = loadTable('/KansasCityData/TimeSeries_Sensor14.csv', 'csv', 'header');
    //TODO: Sort via 'start_time' (Might be pre-processed)
}

//Called after HTML5 canvas loads
function setup(){

  //Get all sensor bounds

  nSensors = data.getRowCount();
  centX = [nSensors];
  centY = [nSensors];
  maxX = [nSensors];
  maxY = [nSensors];
  minX = [nSensors];
  minY = [nSensors];

  for (var i = 0; i < data.getRowCount(); i++){

    //Centroid
    centX[i] = parseFloat(data.getRow(i).getString('centroidX'));
    centY[i] = parseFloat(data.getRow(i).getString('centroidY'));

    //Bounds
    maxX[i] = parseFloat(data.getRow(i).getString('maxX'));
    maxY[i] = parseFloat(data.getRow(i).getString('maxY'));
    minX[i] = parseFloat(data.getRow(i).getString('minX'));
    minY[i] = parseFloat(data.getRow(i).getString('minY'));

}
  //frameRate(15);

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
  //areaMap.onChange(drawSensors);


}

//Called every frame
function draw(){
  //console.log(thecount);
  //console.log(frameRate());
  drawSensors();
}

function drawSensors(){
  clear();//Otherwise it looks like a crashing windows program where each frame doesn't clear
  var centroid = [nSensors];
  var maxCoord = [nSensors];
  var minCoord = [nSensors];
  //For each sensor

  for (var i = 0; i < nSensors; i++){

    //Draw the ellipse
    if (centX[i] != 0 || centY[i] != 0){ //If the sensor contains parking data


      var availability = parseFloat(predictions[13].getRow(thecount).getString('no_of_cars'))/maxparking[13]; 
      var availabilityRGB = [255*availability, 255*(1-availability), 0];
      //Convert lat/longitude to pixels on the screen
      centroid[i] = areaMap.latLngToPixel(centY[i], centX[i]); //TODO change csv file so that these aren't reverse X and Y
      maxCoord[i] = areaMap.latLngToPixel(maxY[i], maxX[i]);
      minCoord[i] = areaMap.latLngToPixel(minY[i], minX[i]);

      //Polygon around sensor area

      /*

      */
    }
    else{
      //console.log("Sensor number: -" + i + "- is null. No parking data for that sensor.");
    }
  }
  //console.log(maxCoord[10].x);
  for (var i = 0; i < nSensors - 1; i++){
    if (centX[i] != 0 || centY[i] != 0){
      for (var j = i + 1; j < nSensors; j++){
        if (centX[j] != 0 || centY[j] != 0){
          if (Math.abs(maxCoord[i].x - maxCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(maxCoord[i].y - maxCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].x - maxCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].y - maxCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(maxCoord[i].x - maxCoord[j].y) <= pixelMarginThreshold ||
                Math.abs(maxCoord[i].y - maxCoord[j].y) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].x - maxCoord[j].y) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].y - maxCoord[j].y) <= pixelMarginThreshold ||
                Math.abs(maxCoord[i].x - minCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(maxCoord[i].y - minCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].x - minCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].y - minCoord[j].x) <= pixelMarginThreshold ||
                Math.abs(maxCoord[i].x - minCoord[j].y) <= pixelMarginThreshold ||
                Math.abs(maxCoord[i].y - minCoord[j].y) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].x - minCoord[j].y) <= pixelMarginThreshold ||
                Math.abs(minCoord[i].y - minCoord[j].y) <= pixelMarginThreshold
                ){
            console.log(i + " " + j);
          }
      }
      }
  }
  }

  for (var i = 0; i < nSensors; i++){
    if (centX[i] != 0 || centY[i] != 0){
      noStroke();
      fill(availabilityRGB[0], availabilityRGB[1], availabilityRGB[2], 110);
      beginShape();

      curveVertex(minCoord[i].x, minCoord[i].y);
      curveVertex(maxCoord[i].x, minCoord[i].y);
      curveVertex(maxCoord[i].x, maxCoord[i].y);
      curveVertex(minCoord[i].x, maxCoord[i].y);
      curveVertex(minCoord[i].x, minCoord[i].y);
      curveVertex(maxCoord[i].x, minCoord[i].y);


      endShape(CLOSE);
    }
  }

  thecount += 1;
  thecount %= predictions[13].getRowCount();
}

function tick(){

}
//Adaptively resize window
function windowResized() {
  //TODO: resize map as well
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);

}