// notes
// Player states:
// - Relaxing - Sleeping - Washing - Eating - Holding Baby - Preparing Food - 
// - Feeding Baby - Washing the bottle - Burping baby - etc

//game states
var foodReady = false; //true when food ready
var playerBusy = false; //true when doing anything
//parameter veriables
let hungryVar = 0;
let tiredVar = 0;
let windyVar = 0;
let dirtyVar = 0;
//parameter change consts & vars
//HUNGER
const HUNGER_RATE = 1;//default hunger increase rate
const FEED_RATE = -10;//speed of change of hungryVar during feed
var hungryDelta = HUNGER_RATE; //per second change to hungryVar
const FEED_TIME = 5000; //time (ms) it takes to feed
const PREPARE_TIME = 5000;//time it takes to prepare feed
//WIND
const WIND_RATE = 5;//speed of change of windVar during feed
var windyDelta = 0;
//TIRED
var tiredDelta = 1; //same
//DIRTY
var dirtyDelta = 1;
//element selects and click listeners
const hungryEl = document.getElementById("hungry-el");
const feedBtn = document.getElementById("feed-btn");
feedBtn.addEventListener("click", feedclick);
const prepareBtn = document.getElementById("prepare-btn");
prepareBtn.addEventListener("click", prepareclick);
const windyEl = document.getElementById("windy-el");

const gamestatusMsg = document.getElementById("gamestatus-msg");


//timer for refresh
let tickerTimer = setInterval(ticker(), 1000);
setInterval(ticker, 1000);

//main ticker for variable updates, calculations and display
function ticker() {
    //add amount (const) to variables
    hungryVar += hungryDelta;
    if (hungryVar < 0) {
        hungryVar = 0;
    }
    windyVar += windyDelta;
    if (windyVar < 0) {
        windyVar = 0
    }
    //calculate stuff
    //update display
    hungryEl.textContent = hungryVar;
    windyEl.textContent = windyVar;
}

//click handlers
function feedclick() {
    if (foodReady) {
    hungryDelta = FEED_RATE;
    windyDelta = WIND_RATE;
    gamestatusMsg.textContent = "FEEDING";
    setTimeout(function() {
        hungryDelta = HUNGER_RATE;
        windyDelta = 0;
        gamestatusMsg.textContent = "";
        foodReady = false;
    }, FEED_TIME)}
    else {
        gamestatusMsg.textContent = "FOOD NOT READY!";
        setTimeout(() => {
            gamestatusMsg.textContent = "";
        }, 2000);
    }
}

function prepareclick() {
    if (foodReady) {
        hungryMsg.textContent = "FOOD ALREADY PREPARED!";
        setTimeout(() => {
            gamestatusMsg.textContent = "FOOD READY";
        }, 2000);
    } else {
        gamestatusMsg.textContent = "PREPARING...";
        setTimeout(() => {
            gamestatusMsg.textContent = "FOOD READY"
            foodReady = true
        }, PREPARE_TIME);
    }
}