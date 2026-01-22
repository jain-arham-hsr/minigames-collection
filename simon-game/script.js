var level = 1;
var allowButtonClick = false;
var originalSignalSequence = [];
var inputSignalSequence = [];

const controlButton = document.getElementById("controlButton");
const levelLabel = document.getElementById("level");
const instructions = document.getElementById("instructions");

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

const note1 = new Audio("assets/MusicalNote1.wav");
const note2 = new Audio("assets/MusicalNote2.wav");
const note3 = new Audio("assets/MusicalNote3.wav");
const note4 = new Audio("assets/MusicalNote4.wav");

controlButton.onclick = function () {
  if (controlButton.innerHTML === "START!") {
    startGame();
  } else if (controlButton.innerHTML === "RESET") {
    resetGame();
  }
};

function startGame() {
  const signal = Math.floor(Math.random() * 4 + 1);
  originalSignalSequence.push(signal);

  inputSignalSequence = [];
  allowButtonClick = false;

  instructions.innerHTML = "Observe the sequence";

  originalSignalSequence.forEach((signal, index) => {
    setTimeout(
      () => {
        displaySignal(signal);
        if (index === originalSignalSequence.length - 1) {
          instructions.innerHTML = "Repeat the pattern";
          allowButtonClick = true;
        }
      },
      (index + 1) * 800,
    );
  });

  controlButton.innerHTML = "RESET";
}

function resetGame() {
  allowButtonClick = false;
  level = 1;
  originalSignalSequence = [];
  inputSignalSequence = [];

  levelLabel.innerHTML = "Level: " + level;
  instructions.innerHTML = "Press START to begin";
  controlButton.innerHTML = "START!";
}

function displaySignal(signal) {
  let audio;
  let signalButton;

  switch (signal) {
    case 1:
      audio = note1;
      signalButton = button1;
      break;
    case 2:
      audio = note2;
      signalButton = button2;
      break;
    case 3:
      audio = note3;
      signalButton = button3;
      break;
    case 4:
      audio = note4;
      signalButton = button4;
      break;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.play();

  signalButton.classList.add("active");
  setTimeout(() => {
    signalButton.classList.remove("active");
  }, 350);
}

function onButtonClick(signal) {
  if (!allowButtonClick) return;

  inputSignalSequence.push(signal);

  const correct =
    inputSignalSequence[inputSignalSequence.length - 1] ===
    originalSignalSequence[inputSignalSequence.length - 1];

  if (!correct) {
    instructions.innerHTML = "Wrong pattern — try again!";
    alert("Well played! Your score was: " + (level - 1));
    resetGame();
    return;
  }

  displaySignal(signal);

  if (inputSignalSequence.length === originalSignalSequence.length) {
    allowButtonClick = false;
    instructions.innerHTML = "Good job! Next level…";

    setTimeout(() => {
      level++;
      levelLabel.innerHTML = "Level: " + level;
      startGame();
    }, 1200);
  }
}
