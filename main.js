let order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = false;
let noise = true;
let isPoweredOn = false;
let areGameButtonsEnabled = false;
let win;

const boardData = [
  //green
  {
    id: 0,
    sound: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    onColor: "#40ff90",
    offColor: "#009f50",
    gameButton: document.querySelector("#topleft")
  },
  
  //red
  {
    id: 1,
    sound: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    onColor: "#f00",
    offColor: "#800",
    gameButton: document.querySelector("#topright")
  },
  
  //yellow
  {
    id: 2,
    sound: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    onColor: "#ffff40",
    offColor: "#d09300",
    gameButton: document.querySelector("#bottomleft")
  },
  
  //blue
  {
    id: 3,
    sound: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
    onColor: "#2af",
    offColor: "#00f",
    gameButton: document.querySelector("#bottomright")
  }
];

const turnCounter = document.querySelector(".count");
const strictButton = document.querySelector("#strict");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");

//listener for switch button
onButton.addEventListener('click', (e) => {
  areGameButtonsEnabled = false;
  if (onButton.checked == true) {
    isPoweredOn = true;
    turnCounter.textContent = "--";
  } else {
    isPoweredOn = false;
    turnCounter.textContent = "";
    unhiliteAllGameButtons();
    clearInterval(intervalId);
  }
});

startButton.addEventListener('click', (e) => {
  if (isPoweredOn || win) {
    play();
  }
});

let play = () => {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  clearInterval(intervalId);
  intervalId = 0;
  unhiliteAllGameButtons();
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;
  areGameButtonsEnabled = false;
  for (var i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * 4));
  }
  compTurn = true;

  intervalId = setInterval(gameTurn, 800);
};


strictButton.addEventListener('click', (e) => {
  if (!isPoweredOn) {
    return;
  }
  
  strict = !strict;
  let prevContent = turnCounter.textContent;
  turnCounter.textContent = strict ? "ON" : "OFF";
  
  setOneOffTimer(() => {
    turnCounter.textContent = prevContent;
  }, 500);
});

let gameTurn = () => {
  areGameButtonsEnabled = false;

  if (flash == turn) {
    clearInterval(intervalId);
    compTurn = false;
    unhiliteAllGameButtons();
    areGameButtonsEnabled = true;
  }

  if (compTurn) {
    unhiliteAllGameButtons();
    setOneOffTimer(() => {
      let index = order[flash];
      presentGameButton(index);
      flash++;
    }, 200);
  }
};

let presentGameButton = index => {
  let data = boardData[index];
  if (noise) {
    let audio = new Audio(data.sound);
    audio.play();
  }
  noise = true;
  data.gameButton.style.backgroundColor = data.onColor;
};

let unhiliteAllGameButtons = () => {
  boardData.forEach(data => {
    data.gameButton.style.backgroundColor = data.offColor;
  });
};

let hiliteAllGameButtons = () => {
  boardData.forEach(data => {
    data.gameButton.style.backgroundColor = data.onColor;
  });
};

var onGameButtonClicked = event => {
  if (!isPoweredOn || !areGameButtonsEnabled) {
    return;
  }

  let button = event.target;
  let boardDataIndex = button.boardDataIndex;
  playerOrder.push(boardDataIndex);
  check();
  presentGameButton(boardDataIndex);
  if (!win) {
    setOneOffTimer(() => {
      unhiliteAllGameButtons();
    }, 300);
  }
};

boardData.forEach((data, index) => {
  data.gameButton.boardDataIndex = index;
  data.gameButton.addEventListener('click', onGameButtonClicked);
});

let check = () => {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
    good = false;

  if (playerOrder.length == 3 && good) {
    winGame();
  }

  if (good == false) {
    hiliteAllGameButtons();
    areGameButtonsEnabled = false;
    turnCounter.textContent = "ERR";
    setOneOffTimer(() => {
      turnCounter.innerHTML = turn;
      unhiliteAllGameButtons();

      if (strict) {
        play();
      } else {
        compTurn = true;
        flash = 0;
        playerOrder = [];
        good = true;
        intervalId = setInterval(gameTurn, 800);
      }
    }, 800);

    noise = false;
  }

  if (turn == playerOrder.length && good && !win) {
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    turnCounter.innerHTML = turn;
    areGameButtonsEnabled = false;
    intervalId = setInterval(gameTurn, 800);
  }

};

let winGame = () => {
  hiliteAllGameButtons();
  turnCounter.textContent = "WIN!";
  areGameButtonsEnabled = false;
  win = true;
};

let setOneOffTimer = (callback, delay) => {
  setTimeout(() => {
    if (isPoweredOn) {
      callback();
    }
  }, delay);
};