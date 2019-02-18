// tuning
var width = 1600;
var height = 900;
var zoom = 0;
var fps = 60;

// globals
var canvas;
var context;
var imageData;

// CA variables
var cellSize = 5;
var gridWidth = width / cellSize;
var gridHeight = height / cellSize;
var generation = 0;

var ruleset = Array(7);			// I set array size to accomodate max index calculated below
var cells = Array(gridWidth);
var nextgen = Array();

console.log("gridWidth: " + gridWidth);

console.log("gridHeight: " + gridHeight);

// Array initialization
function initializeArrays() {

	// seed the cells[] 1d array with random values set at 0, 1 or 2
	for (let i = 0; i < cells.length; i++) {
	cells[i] = (Math.floor(Math.random() * Math.floor(3)));
	}

	console.log("Cells seed: {" + cells + "}");

	for (let i = 0; i < cells.length; i++){ 	//draws the first cells[] seed row

		if (cells[i] == 0) {
			context.fillStyle = '#FB8604';  //orange
			context.fillRect(((i * cellSize) + (width /2)) - ((cells.length * cellSize) / 2), generation * cellSize, cellSize, cellSize);
		
		} else if (cells[i] == 1) {
			context.fillStyle = "#FCBA12"; //light orange
			context.fillRect(((i * cellSize) + (width /2)) - ((cells.length * cellSize) / 2), generation * cellSize, cellSize, cellSize);
		
		} else if (cells[i] == 2) {
			context.fillStyle = "#FDED2A"; //yellow
			context.fillRect(((i * cellSize) + (width /2)) - ((cells.length * cellSize) / 2), generation * cellSize, cellSize, cellSize);
		}
		
	}
	generation++;

	// seed the ruleset[] 1d array with random values set at 0, 1 or 2
	for (let i = 0; i < ruleset.length; i++) {
	ruleset[i] = (Math.floor(Math.random() * Math.floor(3)));
	}

	console.log("Ruleset: {" + ruleset + "}");
}

// graphics initialization
const createDrawSurfaces = () => {
	canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext("2d");
	imageData = context.getImageData(0, 0, width, height);

	// add to document
	document.body.appendChild(canvas);
}

//  ____                     _             
// |  _ \ _ __ __ ___      _(_)_ __   __ _ 
// | | | | '__/ _` \ \ /\ / / | '_ \ / _` |
// | |_| | | | (_| |\ V  V /| | | | | (_| |
// |____/|_|  \__,_| \_/\_/ |_|_| |_|\__, |
//                                   |___/ 

// TODO: bind functions to keys: 
//		** Mutate rules with input: use JSON.stringify, JSON.parse to save/load array values
//		** reset rules 
//		** print console information to text file

const redraw = () => {

	if (generation < (gridHeight)) { // added so it doesnt just keep "drawing" outside of the canvas (defined by gridHeight)

		for (let i = 0; i < cells.length; i++) { 
			var left = cells[(i - 1 + cells.length) % cells.length]; // handles edges by wrapping around
			var middle = cells[i];
			var right = cells[(i + 1) % cells.length];
			
			var index = left + middle + right;	// with states: 0, 1 or 2: max index is 6
			
			nextgen[i] = ruleset[index];
			cells[i] = nextgen[i];

		}

		for (let i = 0; i < cells.length; i++){ 

			if (cells[i] == 0) {
				context.fillStyle = '#FB8604';  //orange
				context.fillRect(((i * cellSize) + (width /2)) - ((cells.length * cellSize) / 2), generation * cellSize, cellSize, cellSize);
			
			} else if (cells[i] == 1) {
				context.fillStyle = "#FCBA12"; //light orange
				context.fillRect(((i * cellSize) + (width /2)) - ((cells.length * cellSize) / 2), generation * cellSize, cellSize, cellSize);
			
			} else if (cells[i] == 2) {
				context.fillStyle = "#FDED2A"; //yello
				context.fillRect(((i * cellSize) + (width /2)) - ((cells.length * cellSize) / 2), generation * cellSize, cellSize, cellSize);

			}
		}
		generation++;

		}
}
const loop = () => {
	redraw();
	
	// allow fps to be modified, using fps global var
	setTimeout(function() {
		requestAnimationFrame(loop);
	}, 1000 / fps);
}

/*
set canvas size to match window
this uses an offscreen canvas with your specified resolution to draw to
it then cleanly resizes and draws this to a second canvas in the browser window
this second canvas is set to the nearest clean multiple of your desired size
*/
const setSize = () => {
	console.log("setting size. base width = " + width + ", base height = " + height);
	console.log("window inner size is " + window.innerWidth + ", " + window.innerHeight);
	// how many times will this fit in horizontally?
	var zoomX = Math.floor(window.innerWidth / width);
	// vertically?
	var zoomY = Math.floor(window.innerHeight / height);
	// the window won't necessarily be a clean match to the shape of the offscreen canvas, so check to see whether width or height will be the limiting factor
	console.log("x / y zoom: " + zoomX + " / " + zoomY);
	// we pick the lower number here. that's how far we can scale up cleanly.
	zoom = Math.min(zoomX, zoomY);
	zoom = Math.max(1, zoom);
	
	// it would be neat to add borders to all canvasses
	canvas.style.borderWidth = zoom + "px";
	
	canvas.style.width = zoom * width + "px";
	canvas.style.height = zoom * height + "px";
	console.log("setting canvas width to " + canvas.style.width);
	console.log("setting canvas height to " + canvas.style.height);
		
	// resizing clears the canvas, so redraw contents
	// imageSmoothingEnabled doesn't work in firefox
	// use webkitImageSmoothingEnabled instead
	context.imageSmoothingEnabled = false; // don't interpolate
	context.mozImageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled = false;

	redraw();

	console.log("--------------------------------");
}


const initializeGraphics = () => {
	createDrawSurfaces();
	initializeArrays();
	setSize(); // run once at top, then on resize
	window.onresize = setSize;
}

// entry point
// when everything is loaded, set up and start running
window.onload = () => {
	initializeGraphics();
	loop(); // calling the update loop once starts it running
}