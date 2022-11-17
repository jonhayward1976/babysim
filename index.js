//nappy emojis: 💧 💩 ❓
//baby emojis: 🙂😐☹️😭😴 (happy, neutral, sad, crying, asleep)

//TODO

//Sleep:
//when baby is tired enough, rocking has chance to send it to sleep, quicker with more tiredness / rocking
//putting down has a small chance to wake it up
//when down and asleep, there is a chance it will wake up, increasing to 100% at tiredness = 0
//poo, hunger and wind increase waking chance (decrease tiredness effect)
//need isAsleep flag and sleep checking in ticker

//Dummy: 
//increases happiness a little

const playerMessages = { //the text for the player message per state
    none:"resting",
    hold:"holding the baby",
    prep:"preparing food",
    feed:"feeding the baby",
    washb:"washing the bottle",
    wind:"winding the baby",
    check:"checking the nappy",
    change:"changing the baby",
    //etc
}
//game states
var foodstate = 0; // 0 = food not ready, 1 = food ready, 2 = bottle dirty
var playerState = "none"; // player status - see playermessages
var babyState = "happy"; // baby state - happy, sad, crying, asleep
var babyLocation = "in the crib"; // "in your arms" or "in the crib"
var sinceWee = 0; //time since last wee happened
var isWee = false; // true if there is a wee in the nappy
var sincePoo = 0; //time since last poo happened
var isPoo = false; //true if poo in nappy
var nappyReveal = false; //true if nappy contents are revealed (after check)
//parameter veriables
let hungryVar = 0;
let tiredVar = 0;
let windyVar = 0;
//parameter change consts & vars
//HUNGER
const HUNGER_RATE = 0.25;//default hunger increase rate
const FEED_RATE = -15;//speed of change of hungryVar during feed
var hungryDelta = HUNGER_RATE; //per second change to hungryVar
const FEED_TIME = 5000; //time (ms) it takes to feed
const PREPARE_TIME = 5000;//time it takes to prepare feed
const BOTTLEWASH_TIME = 5000;//time to wash bottle
//WIND
const WIND_RATE = 30;//speed of change of windVar during feed
const WIND_TIME = 5000;//time to wind baby
var windyDelta = 0;
//TIRED
const TIRED_RATE = 0.1;
const FEED_TIRED = 5; //extra tiredness when feeding
var tiredDelta = TIRED_RATE; //same
//DIRTY
var dirtyDelta = 1;
const CHANGE_TIME = 5000; //nappy change time
const CHECK_TIME = 2000; //nappy check time
const CHECK_TIMEOUT = 5000; //nappy reveal timeout
//element selects and click listeners
const pickupBtn = document.getElementById("pickup-btn");
pickupBtn.addEventListener("click", pickupclick);
const foodBtn = document.getElementById("food-btn");
foodBtn.addEventListener("click", foodclick);
const windBtn = document.getElementById("wind-btn");
windBtn.addEventListener("click", windclick);
const rockBtn = document.getElementById("rock-btn");
rockBtn.addEventListener("click", rockclick);
const dummyBtn = document.getElementById("dummy-btn");
dummyBtn.addEventListener("click", dummyclick);
const nappyBtn = document.getElementById("nappy-btn");
nappyBtn.addEventListener("click", nappyclick);

const hungryProgress = document.getElementById("hungry-progress");
const windyProgress = document.getElementById("windy-progress");
const tiredProgress = document.getElementById("tired-progress");
const dirtyEl = document.getElementById("dirty-el");
const playerstatusMsg = document.getElementById("playerstatus-msg");
const babystatusMsg = document.getElementById("babystatus-msg");
const babystatusEmoji = document.getElementById("babystatus-emoji")

//button arrays
const buttonRefs = [pickupBtn,foodBtn,windBtn,rockBtn,dummyBtn,nappyBtn];
const buttonStates = { //button disabled status vs player status
    none:[false,false,true,true,false,true],
    hold:[false,true,false,false,false,false],
    prep:[true,true,true,true,true,true],
    feed:[true,true,true,true,true,true],
    wind:[true,true,true,true,true,true],
    washb:[true,true,true,true,true,true],
    check:[true,true,true,true,true,true],
    change:[true,true,true,true,true,true],
}

//timer for refresh
let tickerStart = setInterval(ticker, 1000);
let nappytickerStart = setInterval(nappyticker,10000);
msgrender(); //update page

function nappyticker() { //creates wees and poos
    if (!isWee) { //if no wee already
        if ((Math.random() * sinceWee) > 100) { // randomly generate based on time since last wee
            isWee = true; //set iswee flag
            sinceWee = 0; //reset time since wee
        }
    }
    if (!isPoo) {
        if ((Math.random() * sincePoo) > 500) { //randomly generate poo in same fashion
            isPoo = true;
            sincePoo = 0;
        }
    }
}

//main ticker for variable updates, calculations and display
function ticker() {
    //add amount (const) to variables
    if (hungryVar) { //unless feeding is finished
        windyVar += Math.floor(Math.random() * windyDelta); //add random amt of wind
        if (windyVar < 0) {windyVar = 0;} //not below 0
        if (windyVar > 100) {windyVar = 100;} //not above 100 (for winding)
    }
    hungryVar += hungryDelta; //add to hungry var
    if (hungryVar < 0) {hungryVar = 0;} //not below 0 (feeding)
    if (hungryVar > 100) {hungryVar = 100;} // not above 100

    tiredVar += tiredDelta; //add to tired var
    if (tiredVar > 100) {tiredVar = 100;} //not above 100
    if (tiredVar < 0) {tiredVar = 0;} //not below 0 (sleeping)
    sinceWee += dirtyDelta; //add to time since wee
    sincePoo += dirtyDelta; //and poo

    //TODO - calculate babystate here
    //if ispoo, or hungry or tired or windy is high = crying
    //otherwise add up vars 

    //babystate calculations
    if (isPoo || hungryVar > 90 || windyVar > 90 || tiredVar > 90) {
        babyState = "crying"
    }
    else if ((hungryVar + windyVar + tiredVar) > 200) {
        babyState = "sad"
    }
    else {
        babyState = "happy"
    }


    msgrender(); //render changes
}

function msgrender() {
//render messages
playerstatusMsg.textContent = `You are ${playerMessages[playerState]}.`;
babystatusMsg.textContent = `Baby is ${babyState} ${babyLocation}.`;
//render progress bars
renderBars(hungryProgress, hungryVar)
renderBars(tiredProgress, tiredVar)
renderBars(windyProgress, windyVar)
//render nappy contents
let nappycontents = "";
if(nappyReveal) {
    if (isWee) {nappycontents += "💧";}
    if (isPoo) {nappycontents += " 💩";}
    if (!isWee && !isPoo) {nappycontents = "🌟";}
} else {nappycontents += "❓";}
dirtyEl.textContent = nappycontents;
//button active/inactive settings
for (let i = 0; i < buttonRefs.length; i++) {
     a = buttonStates[playerState];
     buttonRefs[i].disabled = a[i];}
if (foodstate == 1) {foodBtn.disabled = !foodBtn.disabled;}
//render babystate 🙂😐☹️😭😴
switch (babyState) {
    case "happy":
        babystatusEmoji.textContent = "🙂";
        break;
    case "sad":
        babystatusEmoji.textContent = "☹️";
        break;
    case "crying":
        babystatusEmoji.textContent = "😭";
        break;
    case "asleep":
        babystatusEmoji.textContent = "😴";
        break;
}
}

function renderBars(el, va) { //renders progress bars - pass in element var and register var
    el.style.width = va + "%"; //width
if (va > 85) {el.style.backgroundColor = "red";} //colours
else if (va > 65) {el.style.backgroundColor = "yellow";} 
else {el.style.backgroundColor = "green";}
}


//click handlers
function foodclick() { //selects function based on foodstate
    if (foodstate == 2) {washbottle()}
    else if (foodstate == 1) {givefood()}
    else if (foodstate == 0) {preparefood()}
    }

function preparefood() { //clicked on 'prepare food' button
    playerState = "prep"; //select 'prep' status for player
    msgrender(); //render new status
    setTimeout(() => { //after specified time, return player to rest state and update food state and button text
        playerState = "none";
        foodBtn.textContent = "FEED BABY";
        foodstate = 1;
        msgrender();
    }, PREPARE_TIME);
}

function givefood() { //clicked on 'feed baby' button
    playerState = "feed"; //select 'feeding' state
    hungryDelta = FEED_RATE; //change hunger, wind and tiredness rates
    windyDelta = WIND_RATE;
    tiredDelta += FEED_TIRED;
    msgrender(); //render changes
    setTimeout(function() { //after set time,  reset hungry, tired and wind rates
        tiredDelta = TIRED_RATE;
        hungryDelta = HUNGER_RATE;
        windyDelta = 0;
        playerState = "hold"; //change player state to 'holding baby'
        foodstate = 2; //food state 2 (dirty bottle)
        foodBtn.textContent = "WASH BOTTLE"; //update button text
        msgrender(); //render changes
    }, FEED_TIME);
}

function washbottle() { //clicked on 'wash bottle' button
    playerState = "washb"; //update player state
    msgrender(); //render change
    setTimeout(function() { //after set time, reset player state, food state and button text
        playerState = "none";
        foodstate = 0;
        foodBtn.textContent = "PREPARE FOOD";
        msgrender();
    }, BOTTLEWASH_TIME);
}

function pickupclick() { //clicked on 'pick up' / 'put in crib' button
    if (playerState == "none") { // picking up baby
        playerState = "hold";
        babyLocation = "in your arms"
        pickupBtn.textContent = "PUT IN CRIB"
    } else { //putting down baby
        playerState = "none";
        babyLocation = "in the crib"
        pickupBtn.textContent = "PICK UP"
    }
    msgrender(); //render change
}

function windclick() { // clicked on 'wind baby' button
    playerState = "wind"; //update player status and render
    msgrender();
    setTimeout(function() { //after set time, burp if there is wind and reduce wind var by random amt
        if (windyVar > 0) {new Audio("sounds/burp.wav").play();}
        windyVar -= Math.floor((0.25 + (Math.random() * 0.5)) * windyVar);
        if (windyVar < 10) {windyVar = 0;} //reduce to zero, if close
        playerState = "hold"; //update player state and render
        msgrender();
    }, WIND_TIME)
}

function rockclick() { //clicked on 'rock baby' button
    //TODO - will just change statuses for a period
    console.log("rockclick");
}

function dummyclick() { //clicked on 'give dummy' / 'take dummy' button
    console.log("dummyclick");
}

function nappyclick() { //clicked on 'check nappy' / 'change nappy' button
    if (nappyReveal) { //nappy contents are already revealed, so change nappy
        playerState = "change"; //change player state and render
        msgrender()
        setTimeout(function() { //after set period
            playerState = "hold"; //reset player state
            isWee = false; //reset iswee and ispoo flags
            isPoo = false;
            nappyReveal = false; //reset nappy reveal flag
            msgrender() //render
        }, CHANGE_TIME);}
    else { //reveal nappy contents
        playerState = "check"; //player status
        msgrender() //render
        setTimeout(function() { //after set time
            playerState = "hold"; //reset player state
            nappyReveal = true; //set nappy reveal flag
            nappyBtn.textContent = "CHANGE" //and button text
            msgrender() //render
            setTimeout(function() { //after another time
                nappyReveal = false; //reset reveal flag
                nappyBtn.textContent = "CHECK" //and button text
                msgrender()
            }, CHECK_TIMEOUT)
        }, CHECK_TIME)
    }
}
