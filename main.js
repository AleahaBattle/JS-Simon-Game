let order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = false;
let noise = true;
let on = false;
let win;
let boardSound = [
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", //green
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", //red
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", //yellow 
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" //blue   
];

const turnCounter = document.querySelector(".count");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
const strictButton = document.querySelector("#strict");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");

//listener for switch button
onButton.addEventListener('click', (e) => {
  if (onButton.checked == true) {
    on = true;
    turnCounter.textContent = "--";
  } else {
    on = false;
    turnCounter.textContent = "";
    clearColor();
    clearInterval(intervalId);
  }
});

startButton.addEventListener('click', (e) => {
  if (on || win) {
    play();
  }
});

let play = () => {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalId = 0;
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;
  for (var i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * 4) + 1);
  }
  compTurn = true;

  intervalId = setInterval(gameTurn, 800);
}


strictButton.addEventListener('click', (e) => {
  if (strictButton.clicked == true) {
    strict = true;
  } else {
    strict = false;
  }
});

let gameTurn = () => {
  on = false;

  if (flash == turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true;
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      if (order[flash] == 1) one();
      if (order[flash] == 2) two();
      if (order[flash] == 3) three();
      if (order[flash] == 4) four();
      flash++;
    }, 200);
  }
}

let one = id => {
  if (noise) {
    let audio = new Audio(boardSound[1]);
    audio.play();
  }
  noise = true;
  topLeft.style.backgroundColor = "lightgreen";
}

let two = id => {
  if (noise) {
    let audio = new Audio(boardSound[2]);
    audio.play();
  }
  noise = true;
  topRight.style.backgroundColor = "red";
}

let three = id => {
  if (noise) {
    let audio = new Audio(boardSound[3]);
    audio.play();
  }
  noise = true;
  bottomLeft.style.backgroundColor = "yellow";
}

let four = id => {
  if (noise) {
    let audio = new Audio(boardSound[4]);
    audio.play();
  }
  noise = true;
  bottomRight.style.backgroundColor = "lightblue";
}

let clearColor = () => {
  topLeft.style.backgroundColor = "#009f50";
  topRight.style.backgroundColor = "#f00";
  bottomLeft.style.backgroundColor = "#ffea00";
  bottomRight.style.backgroundColor = "#00f";
}

let flashColor = () => {
  topLeft.style.backgroundColor = "lightgreen";
  topRight.style.backgroundColor = "red";
  bottomLeft.style.backgroundColor = "yellow";
  bottomRight.style.backgroundColor = "lightblue";
}

topLeft.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(1);
    check();
    one();
    if (!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

topRight.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(2);
    check();
    two();
    if (!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

bottomLeft.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(3);
    check();
    three();
    if (!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

bottomRight.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(4);
    check();
    four();
    if (!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

let check = () => {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
    good = false;

  if (playerOrder.length == 3 && good) {
    winGame();
  }

  if (good == false) {
    flashColor();
    turnCounter.textContent = "ERR";
    setTimeout(() => {
      turnCounter.innerHTML = turn;
      clearColor();

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
    intervalId = setInterval(gameTurn, 800);
  }

}

let winGame = () => {
  flashColor();
  turnCounter.textContent = "WIN!";
  on = false;
  win = true;
}
