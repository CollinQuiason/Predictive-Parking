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
  areaMap.onChange(drawSensors);


}

//Called every frame
function draw(){
  

}

function drawSensors(){
  clear();//Otherwise it looks like a crashing windows program where each frame doesn't clear

  //For each sensor
  for (var i = 0; i < data.getRowCount(); i++){

    //Parking Prediction for sensor: 'i'
    var availability = Math.random();
    var availabilityRGB = [255*availability, 255*(1-availability), 0];
    //Centroid
    var centX = parseFloat(data.getRow(i).getString('centroidX'));
    var centY = parseFloat(data.getRow(i).getString('centroidY'));

    //Bounds
    var maxX = parseFloat(data.getRow(i).getString('maxX'));
    var maxY = parseFloat(data.getRow(i).getString('maxY'));
    var minX = parseFloat(data.getRow(i).getString('minX'));
    var minY = parseFloat(data.getRow(i).getString('minY'));

    //Draw the ellipse
    if (centX != 0 || centY != 0){ //If the sensor contains parking data

      //Convert lat/longitude to pixels on the screen
      var centroid = areaMap.latLngToPixel(centY, centX); //TODO change csv file so that these aren't reverse X and Y
      var maxCoord = areaMap.latLngToPixel(maxY, maxX);
      var minCoord = areaMap.latLngToPixel(minY, minX);

      //Actually draw the ellipse
      //stroke(255, 0, 0, 50);
      /*
      fill(255);
      ellipse(centroid.x, centroid.y, 5, 5);
      fill(255, 100, 255);
      ellipse(maxCoord.x, maxCoord.y, 5, 5);
      fill(100, 255, 255);
      ellipse(minCoord.x, minCoord.y, 5, 5);
      */

      //Polygon around sensor area
      noStroke();
      fill(availabilityRGB[0], availabilityRGB[1], availabilityRGB[2], 110);
      beginShape();

      curveVertex(minCoord.x, minCoord.y);
      curveVertex(maxCoord.x, minCoord.y);
      curveVertex(maxCoord.x, maxCoord.y);
      curveVertex(minCoord.x, maxCoord.y);
      curveVertex(minCoord.x, minCoord.y);
      curveVertex(maxCoord.x, minCoord.y);


      endShape(CLOSE);

    }
    else{
      //console.log("Sensor number: -" + i + "- is null. No parking data for that sensor.");
    }
  }
}




//Adaptively resize window
function windowResized() {
  //TODO: resize map as well
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);

  }


