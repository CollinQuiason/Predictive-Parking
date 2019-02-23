//Created by Collin Rottinghaus
//University of Missouri-Kansas City
//Febuary 22, 2019

var mappa;


function setup(){
    //Canvas
  h = window.innerHeight;
  w = window.innerWidth;
  canvas = createCanvas(w, h);

  mappa = new Mappa('Google', 'AIzaSyAjAzuR4SDDwDHTaEbdWmtrgeDQvm3HUdQ');


  //background(0);
  areaMap = mappa.tileMap(39.099809, -94.583226, 16);
  areaMap.overlay(canvas);
}

function draw(){
    //areaMap = 
    
}





function windowResized() {
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
  }