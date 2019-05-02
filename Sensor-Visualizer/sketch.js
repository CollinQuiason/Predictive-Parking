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
var pixelMarginThreshold = 100; //Maximum pixels required to merge sensor predictions visually



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
  var clusters = [];


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
          if (polygonNearPolygon(minCoord[i], maxCoord[i], minCoord[j], maxCoord[j], pixelMarginThreshold)) //Check for clustering conditions
          {
            //console.log(i + " " + j + " coords: " + maxCoord[i].x + " " + maxCoord[j].x);
            clusters.push(new Set([i, j]));
            var centroidmedian = {};
            centroidmedian.x = (centroid[i].x + centroid[j].x) /2;
            centroidmedian.y = (centroid[i].y + centroid[j].y) /2;
            fill(0, 0, 255);
            circle(centroidmedian.x, centroidmedian.y, 5);
            fill(255);
            //circle(centroid[i].x, centroid[i].y, 3);
            //circle(centroid[j].x, centroid[j].y, 3);
            text(str(i), centroid[i].x, centroid[i].y);
            text(str(j), centroid[j].x, centroid[j].y);
          }
        }
      }
    }
  }

  var i = 0;
  while (i < clusters.length){
    var j = i + 1;
    while (j < clusters.length){
      if (hasIntersection(clusters[i], clusters[j])){
        clusters[j].forEach(clusters[i].add, clusters[i])
        clusters.splice(j, 1);

      }
      else{
        j+=1;
      }
    }
    i+=1;
  }
  //console.log(clusters[0]);



  var allSensors = new Set([0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 16, 17, 18, 20, 21, 22]);
  for (var cluster of clusters){

    




    
    noStroke();
    fill(availabilityRGB[0], availabilityRGB[1], availabilityRGB[2], 110);
    var clusterSensorIterator = cluster.values();
    var initial = clusterSensorIterator.next().value;
    clustervertices = {
      minx: minCoord[initial].x,
      maxx: maxCoord[initial].x,
      miny: minCoord[initial].y,
      maxy: maxCoord[initial].y,
    };

    for (var i = 1; i < cluster.size; i++){
      var current = clusterSensorIterator.next().value;
      allSensors.delete(current);
      if (minCoord[current].x < clustervertices.minx){
        clustervertices.minx = minCoord[current].x;
      }
      if (maxCoord[current].x > clustervertices.maxx){
        clustervertices.maxx = maxCoord[current].x;
      }
      if (minCoord[current].y < clustervertices.miny){
        clustervertices.miny = minCoord[current].y;
      }
      if (maxCoord[current].y > clustervertices.maxy){
        clustervertices.maxy = maxCoord[current].y;
      }
    }
    beginShape();
    curveVertex(clustervertices.minx, clustervertices.miny); //Draw clusters
    curveVertex(clustervertices.minx, clustervertices.maxy);
    curveVertex(clustervertices.maxx, clustervertices.maxy);
    curveVertex(clustervertices.maxx, clustervertices.miny);
    curveVertex(clustervertices.minx, clustervertices.miny);
    curveVertex(clustervertices.minx, clustervertices.maxy);
    endShape(CLOSE);
  }



  var nonClusteredSensors = allSensors.values();
  for (var i = 0; i < allSensors.size; i++){
    var currentSensor = nonClusteredSensors.next().value;
    beginShape();
    curveVertex(minCoord[currentSensor].x, minCoord[currentSensor].y);//Draw remaining sensors that are not in clusters
    curveVertex(maxCoord[currentSensor].x, minCoord[currentSensor].y);
    curveVertex(maxCoord[currentSensor].x, maxCoord[currentSensor].y);
    curveVertex(minCoord[currentSensor].x, maxCoord[currentSensor].y);
    curveVertex(minCoord[currentSensor].x, minCoord[currentSensor].y);
    curveVertex(maxCoord[currentSensor].x, minCoord[currentSensor].y);
    endShape(CLOSE);
  }
  

/*
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
*/









  thecount += 1;
  thecount %= predictions[13].getRowCount();


  //console.log(clusters);
}

function polygonNearPolygon(minCoords1, maxCoords1, minCoords2, maxCoords2, pixels){
  if (Math.abs(minCoords1.x - minCoords2.x) < pixels || Math.abs((maxCoords1.x - maxCoords2.x) < pixels)){  //If the left or right X values are close
    if (Math.abs(minCoords1.y - minCoords2.y) < pixels){                                                    //Check every combination of y values
      return true;}
    if (Math.abs(minCoords1.y - maxCoords2.y) < pixels){
      return true;}
    if (Math.abs(maxCoords1.y - minCoords2.y) < pixels){
      return true;}
    if (Math.abs(maxCoords1.y - maxCoords2.y) < pixels){
      return true;}}

  if (Math.abs(minCoords1.y - minCoords2.y) < pixels || Math.abs((maxCoords1.y - maxCoords2.y) < pixels)){  //If the left or right y values are close
    if (Math.abs(minCoords1.x - minCoords2.x) < pixels){                                                    //Check every combination of x values
      return true;}
    if (Math.abs(minCoords1.x - maxCoords2.x) < pixels){
      return true;}
    if (Math.abs(maxCoords1.x - minCoords2.x) < pixels){
      return true;}
    if (Math.abs(maxCoords1.x - maxCoords2.x) < pixels){
      return true;}}


  return false; //If none found

}

//Adaptively resize window
function windowResized() {
  //TODO: resize map as well
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);

}

function hasIntersection(set1, set2){
  for (var x of set1){
    if (set2.has(x)){
      //console.log("overlap");
      return true;
      
    }
  }
  //console.log("no");
  return false;
}