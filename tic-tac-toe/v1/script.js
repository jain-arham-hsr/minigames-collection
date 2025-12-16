var gameOn = true;
var currentTurn = "O";
var gamePosition = [];

function renderMove(move) {
    if (gameOn === false || gamePosition[move - 1]) {
        return;
    }
    gamePosition[move - 1] = currentTurn;
    cellBtn = document.getElementById(`cell${move}`);
    const isWinningMove = ((gamePosition[0] && gamePosition[0] === gamePosition[1] && gamePosition[0] === gamePosition[2]) || // 1st Horizontal Row
                    (gamePosition[3] && gamePosition[3] === gamePosition[4] && gamePosition[3] === gamePosition[5]) || // 2nd Horizontal Row
                    (gamePosition[6] && gamePosition[6] === gamePosition[7] && gamePosition[6] === gamePosition[8]) || // 3rd Horizontal Row
                    (gamePosition[0] && gamePosition[0] === gamePosition[3] && gamePosition[0] === gamePosition[6]) || // 1st Vertical Row
                    (gamePosition[1] && gamePosition[1] === gamePosition[4] && gamePosition[1] === gamePosition[7]) || // 2nd Vertical Row
                    (gamePosition[2] && gamePosition[2] === gamePosition[5] && gamePosition[2] === gamePosition[8]) || // 3rd Vertical Row
                    (gamePosition[0] && gamePosition[0] === gamePosition[4] && gamePosition[0] === gamePosition[8]) || // Top-Left to Bottom-Right Diagonal
                    (gamePosition[2] && gamePosition[2] === gamePosition[4] && gamePosition[2] === gamePosition[6])); // Top-Right to Bottom Left Diagonal
    const isDraw = gamePosition.filter(Boolean).length === 9;
    if (isWinningMove) {
        document.getElementById("text").innerHTML = "Wins";
        gameOn = false;
    } else if (isDraw) {
        gameOn = false;
        document.getElementById("turn-symbol").hidden = true;
        document.getElementById("text").innerHTML = "Draw!";
    }
    const turnSymbol = document.getElementById("turn-symbol");
    if (currentTurn == "X") {
        cellBtn.innerHTML = "&times;";
        if (gameOn) {
            currentTurn = "O";
            turnSymbol.innerHTML = "&#9675;";
        }
    } else {
        cellBtn.innerHTML = "&#9675;";
        if (gameOn) {
            currentTurn = "X";
            turnSymbol.innerHTML = "&times;";
        }
    }
}

function refresh() {
    document.getElementById("turn-symbol").hidden = false;
    Array.from(document.getElementsByClassName("cell")).forEach(cell => {
        cell.innerHTML = "";
    });
    gameOn = true;
    currentTurn = ["X", "O"][Math.round(Math.random())];
    gamePosition = [];
    document.getElementById("turn-symbol").innerHTML = {"X": "&times;", "O": "&#9675"}[currentTurn];
    document.getElementById("text").innerHTML = "Turn";
}