var gameOn = true;
var currentTurn = "O";
var gamePosition = [];

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/* ---------- HANDLE MOVE ---------- */

function renderMove(move) {
  if (!gameOn || gamePosition[move - 1]) return;

  const cell = document.getElementById(`cell${move}`);
  gamePosition[move - 1] = currentTurn;

  cell.innerHTML =
    currentTurn === "X"
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-regular fa-o"></i>';

  cell.classList.add("filled");

  let winningCombo = null;

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      gamePosition[a] &&
      gamePosition[a] === gamePosition[b] &&
      gamePosition[a] === gamePosition[c]
    ) {
      winningCombo = combo;
      break;
    }
  }

  const isDraw = gamePosition.filter(Boolean).length === 9;

  const turnSymbol = document.getElementById("turn-symbol");
  const text = document.getElementById("text");

  if (winningCombo) {
    winningCombo.forEach((index) => {
      document.getElementById(`cell${index + 1}`).classList.add("win");
    });

    // Show winner symbol instead of "Turn"
    turnSymbol.innerHTML =
      currentTurn === "X"
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-regular fa-o"></i>';

    text.innerHTML = "Wins";
    gameOn = false;
    return;
  }

  if (isDraw) {
    text.innerHTML = "Draw!";
    turnSymbol.hidden = true;
    gameOn = false;
    return;
  }

  currentTurn = currentTurn === "X" ? "O" : "X";
  turnSymbol.innerHTML =
    currentTurn === "X"
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-regular fa-o"></i>';
}

/* ---------- RESET GAME ---------- */

function refresh() {
  const turnSymbol = document.getElementById("turn-symbol");
  const text = document.getElementById("text");

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("filled", "win");
  });

  gameOn = true;
  gamePosition = [];
  currentTurn = ["X", "O"][Math.round(Math.random())];

  turnSymbol.hidden = false;
  turnSymbol.innerHTML =
    currentTurn === "X"
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-regular fa-o"></i>';

  text.innerHTML = "Turn";
}
