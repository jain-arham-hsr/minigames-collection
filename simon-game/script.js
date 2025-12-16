var level = 1;
var allowButtonClick = false;
var originalSignalSequence = [];
var inputSignalSequence = [];

const controlButton = document.getElementById("controlButton");
const levelLabel = document.getElementById("level");
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");
const note1 = new Audio("assets/MusicalNote1.wav"); // Source: https://carolinegabriel.com/demo/js-keyboard/sounds/043.wav
const note2 = new Audio("assets/MusicalNote2.wav"); // Source: http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav
const note3 = new Audio("assets/MusicalNote3.wav"); // Source: http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav
const note4 = new Audio("assets/MusicalNote4.wav"); // Source: http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav

// Handles the game control
controlButton.onclick = function handleGameControl() {
  if (controlButton.innerHTML === "START!") {
    startGame();
  } else if (controlButton.innerHTML === "RESET") {
    resetGame();
  }
};

// Start Game
function startGame() {
  signal = Math.floor(Math.random() * 4 + 1);
  originalSignalSequence.push(signal);
  let i = 1;
  originalSignalSequence.forEach((signal) => {
    window.setTimeout(function () {
      displaySignal(signal);
    }, i * 1000);
    i++;
  });
  inputSignalSequence = [];
  allowButtonClick = true;
  controlButton.innerHTML = "RESET";
}

// Reset Game
function resetGame() {
  allowButtonClick = false;
  level = 1;
  originalSignalSequence = [];
  inputSignalSequence = [];
  levelLabel.innerHTML = "Level: " + level;
  controlButton.innerHTML = "START!";
}

// plays the signal as per the number parsed
function displaySignal(signal) {
  let audio;
  let signalButton;
  switch (signal) {
    case 1:
      // red signal
      audio = note1;
      signalButton = button1;
      break;
    case 2:
      // green signal
      audio = note2;
      signalButton = button2;
      break;
    case 3:
      // blue signal
      audio = note3;
      signalButton = button3;
      break;
    case 4:
      // yellow signal
      audio = note4;
      signalButton = button4;
  }
  console.log(audio);
  audio.currentTime = 0;
  audio.play();
  signalButton.style.animationName = "emphasize";
  window.setTimeout(function () {
    signalButton.style.animationName = "none";
  }, 1000);
}

function onButtonClick(signal) {
  if (!allowButtonClick) return;
  inputSignalSequence.push(signal);
  const correctSequence =
    inputSignalSequence[inputSignalSequence.length - 1] ===
    originalSignalSequence[inputSignalSequence.length - 1];
  if (correctSequence) {
    displaySignal(signal);
  } else {
    let score = parseInt(level - 1);
    alert("Well played! Your score was: " + score);
    resetGame();
  }
  const sequenceCompletedSuccessfully =
    originalSignalSequence.length === inputSignalSequence.length;
  if (sequenceCompletedSuccessfully) {
    allowButtonClick = false;
    window.setTimeout(function () {
      level = level + 1;
      levelLabel.innerHTML = "Level: " + level;
      startGame();
    }, 2000);
  }
}

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
