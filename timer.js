var initialNumOfSeconds;
var timeRemainingInSeconds;
var currUserInputMax;
var userTimeInput;
var isStarted = false;
var isCountingDown = false;
var timerId;
let DEFAULT_INITIAL_TIME = 300;

/**************************** Event Listners **********************************/
// Pressing the Space or Enter key should Toggle the timer
window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode: e.which;
    if (key === 32 || key === 13) {
        toggleTimer();
    }
}

// Prevent the user from entering non-numerical data into the text field.
// Backspace is allowed.
var input = document.getElementById("initial-time");
input.addEventListener("keypress", function(e) {
    var key = e.keyCode ? e.keyCode: e.which;
    if ((key < 48 || key > 57) && key !== 8) {
        e.preventDefault();
    }
});

// Editing the textbox stops the timer.
input.onkeyup = handleTimeInputChange;
function handleTimeInputChange(e) {
    var key = e.keyCode ? e.keyCode: e.which;
    // ignore space bar and enter key events
    if ((key < 48 || key > 57) && key !== 8) {
        return;
    }
    console.log("Resetting the timer to textbox value");
    stopTimer();
    userTimeInput = input.value;
    // this is used to prevent the user from surpassing 6 digits.
    // stores user's last typed 6 digit value so even if they continue typing,
    // the value will max out at their last typed 6 digit value.
    if (input.value >= 100000 && input.value <= 999999) {
        currUserInputMax = input.value;
    }

    // Only supports input up to 99 99 99
    if (input.value > 999999) {
        userTimeInput = currUserInputMax;
    }

    displayUserTimeInput(userTimeInput);
    displayNumSecondsRemaining(computeInitSecsFromUserInput(userTimeInput));
    updateToggleButtonText();
}
/******************************************************************************/

// Displays the raw time for the user
function displayUserTimeInput(userTimeInput) {

    // retrives and displays the parts corresponding to hh, mm, and ss.
    let numHour = Math.floor(userTimeInput / 10000);
    let numMin = Math.floor(userTimeInput % 10000 / 100);
    let numSeconds = userTimeInput % 100;
    document.getElementById("hh").innerHTML = padWithZero(numHour);
    document.getElementById("mm").innerHTML = padWithZero(numMin);
    document.getElementById("ss").innerHTML = padWithZero(numSeconds);
}


// starts or stops the timer depending on current timer state.
function toggleTimer() {
    if (!isStarted) {
        let userTimeInput = document.getElementById("initial-time").value;
        // Allow a default timer value is user did not enter initial time.
        if (userTimeInput) {
            startTimer(computeInitSecsFromUserInput(userTimeInput));
        } else {
            startTimer(DEFAULT_INITIAL_TIME);
        }
    } else { // timer has already started
        if (isCountingDown === false) {
            console.log("timer is counting down");
            isCountingDown = true;
            timerId = setInterval(updateOneSecond, 1000);
        } else {
            pauseTimer();
        }
    }
    updateToggleButtonText();
}

// Start the Timer with specified number of seconds.
function startTimer(withNumSeconds) {
    isStarted = true;
    isCountingDown = true;
    initialNumOfSeconds = withNumSeconds;
    timeRemainingInSeconds = initialNumOfSeconds;
    // begins the counting down.
    timerId = setInterval(updateOneSecond, 1000);
}

// Pauses the timer.
function pauseTimer() {
    isCountingDown = false;
    clearInterval(timerId);
}

// Stop the timer
function stopTimer() {
    isCountingDown = false;
    isStarted = false;
    clearInterval(timerId);
}

// Update to timer after each second. Also update UI.
function updateOneSecond() {
    if (timeRemainingInSeconds > 0) {
        timeRemainingInSeconds -= 1;
        console.log(timeRemainingInSeconds);
    } else {
        alert("Timer has finished");
        stopTimer();
    }
    updateToggleButtonText();
    displayNumSecondsRemaining();
    displayTimeRemaining();
}

// Display the number of seconds remaining
function displayNumSecondsRemaining(optionallySpecified) {
    var numSecondsRemainingDisplayed = 0;
    if (typeof optionallySpecified !== "undefined") {
        numSecondsRemainingDisplayed = optionallySpecified
    } else {
        numSecondsRemainingDisplayed = timeRemainingInSeconds;
    }
    console.log(optionallySpecified);
    console.log(numSecondsRemainingDisplayed);
    document.getElementById("time-rem-in-seconds").innerHTML = numSecondsRemainingDisplayed;
}

// Depending on the state of the timer, display the appropriate button text.
function updateToggleButtonText() {
    var toggleButtonText = "";
    if (!isStarted) {
        toggleButtonText = "Start";
    } else {
        toggleButtonText = isCountingDown ? "Pause" : "Resume"
    }
    document.getElementById("toggleTimer-button").innerHTML = toggleButtonText;
}

// Resets the timer to its initial state
function resetTimer() {
    stopTimer();
    timeRemainingInSeconds = initialNumOfSeconds;
    updateToggleButtonText();
    displayNumSecondsRemaining();
    displayTimeRemaining();
}



// Input to this will be a number in the form of hhmmss.
// e.g.: 99 should set the timer for 99 seconds. 100 should set the timer for
// 1 minute. 199 should set the timer for 2 minutes and 39 seconds.
// Anything that works out to be greater than 100 hours caps to 100 hours.
function computeInitSecsFromUserInput(userTimeInput) {
    if (typeof userTimeInput === "undefined") {
        return 0;
    }
    if (userTimeInput <= 995959){ // this marks the max of 100 hours.
        let numHour = Math.floor(userTimeInput / 10000);
        let numMin = Math.floor(userTimeInput % 10000 / 100);
        let numSeconds = userTimeInput % 100;
        initialNumOfSeconds = numHour * 3600 + numMin * 60 + numSeconds;
    } else {
        // need to limit input to 6 digits. If the user tries to enter too many
        // digits it will just cut of to the default maximium value.
        console.log("Set time attempt more than 100 hours");
        initialNumOfSeconds = 100 * 3600 - 1;
    }
    console.log("initialNumOfSeconds is: " + initialNumOfSeconds);
    return initialNumOfSeconds;
}

// Displays the time remaining in the hh mm ss format.
function displayTimeRemaining() {
    document.getElementById("hh").innerHTML = padWithZero(hrPart(timeRemainingInSeconds));
    document.getElementById("mm").innerHTML = padWithZero(minPart(timeRemainingInSeconds));
    document.getElementById("ss").innerHTML = padWithZero(secPart(timeRemainingInSeconds));
}

function hrPart(numSeconds) {
    return Math.floor(numSeconds / 3600);
}

function minPart(numSeconds) {
    //return Math.floor((numSeconds / 3600) % 1 * 60)
    return Math.floor((numSeconds - hrPart(numSeconds) * 3600) / 60);
}

function secPart(numSeconds) {
    //return Math.floor(((numSeconds / 3600) % 1 * 60) % 1 * 60);
    return numSeconds - hrPart(numSeconds) * 3600 - minPart(numSeconds) * 60;
}

// turns inputs like 7 to a string "07". For aesthetic purposes of the timer.
function padWithZero(num) {
    if (num / 10 < 1) {
        return "0".concat(num);
    } else {
        return num;
    }
}

// test cases for computeInitSecsFromUserInput()
// 35 --> 35
// 99 --> 99
// 100 --> 60
// 123 --> 83
// 199 --> 2:39 --> 159
// 10 35 --> 10*60  + 35 --> 635
// 10: 62 --> 11*60 + 2 --> 662
// 60 00--> 60 * 60 --> 3600
// 99 00--> 99*60 --> 6534
// 10000 --> 3600
// 1 45 00 --> 3600 + 45*60 = 6300
// 1 97 00 --> 2 37 00 --> 2 * 3600 + 37 * 60 = 9420
// 1 35 21 --> 3600 + 35 * 60 + 21 = 5721
// 1 35 78 --> 3600 + 35 * 60 + 78 = 5778
// 2 79 99 --> 2 * 3600 + 79 * 60 + 99 = 12039
// 2 79 99 --> 2 80 39 --> 2 20 39 --> 3 * 3600 + 20 * 60 + 39 = 12039
// 99 00 00 --> 99 * 3600 = 356400
// 99 59 59 --> 99* 3600 + 60 * 60 + 60 = 359999
// 99 60 00 --> 99 * 360 + 60 * 60 = 360000
// anything above should floor to 360000
