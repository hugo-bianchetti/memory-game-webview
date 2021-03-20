gameContainer = document.getElementById("game_container");
resultContainer = document.getElementById("result_container");
cards = [...document.getElementsByClassName("card")];

progress = document.getElementById("progress");
errorCounter = document.getElementById("error_counter");
resetButton = document.getElementById("reset_button");
username = document.getElementById('user_name_input');
timer = document.getElementById("time");

nextCard = 0;
errors = 0;
minutes = 0;
seconds = 0;
isTimeRunning = true;

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function resetGame() {
    stopTimer();
    shuffle(cards);
    errors = 0;
    nextCard = 0;
    minutes = 0;
    seconds = 0;
    progress.value = 0;
    gameContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    errorCounter.innerHTML = "0";
    timer.innerHTML = "00:00";
    document.body.style.backgroundColor = 'white';
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.visibility = 'visible';
        cards[i].onclick = null;
    }
}

async function reset() {
    resetGame();
    for (let i = 0; i < cards.length; i++)
        cards[i].onclick = onCardClick;
    animateCards().then(startTimer);
};

async function animateCards() {
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = "scale(0)";
        await timeout(500);
        cards[i].style.transform = "scale(1)";
    }
}

function stopTimer() {
    isTimeRunning = false;
}

function updateTimer() {
    seconds++;
    if (seconds >= 60) { seconds = 0; minutes++;}
    label = '';
    if (minutes < 10) {label = '0';}
    label += minutes + ':';
    if (seconds < 10) {label += '0';}
    label += seconds;
    timer.innerHTML = label;
    setTimeout(() => {
        if (isTimeRunning) {
            updateTimer();
        }
    }, 995);
}

function startTimer() {
    isTimeRunning = true;
    updateTimer();
}

function saveRecords() {
    let recordsList = localStorage.records == null ? {} : 
        JSON.parse(localStorage.records);
    let currentTime = (60 * minutes) + seconds;
    let userCurrentRecord = {time: elapsedTime, errorCount: errors};

    let userRecord = recordsList[username.value];
    if(userRecord != null){
        if (userRecord.time > currentTime) userRecord.time = currentTime;
        if (userRecord.errorCount > errors) userRecord.errorCount = errors;
    }
    
    recordsList[username.value] = userRecord ?? userCurrentRecord;
    localStorage['records'] = JSON.stringify(records);
    window.location.href = "file:///android_asset/records.html";
}

function onCardClick(card) {
    if(card.srcElement !== cards[nextCard++]){
        nextCard = 0;
        errors++;
        errorCounter.innerHTML = '' + errors;
        document.body.style.backgroundColor = 'white';
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.visibility = 'visible';
        }
    }else{
        document.body.style.backgroundColor = window.getComputedStyle(card.srcElement)['background-color'];
        card.srcElement.style.visibility = 'hidden';
    }

    if (nextCard == 6) {
        gameContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        stopTimer();
    }

    progress.value = nextCard;    
}
