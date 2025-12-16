const canvas = document.getElementById("garden");
const foodImg = document.getElementById("food");
const ctx = canvas.getContext("2d");
const patch = 32;
var gameStatus;
var snake;
var food;
var drag;

// Snake Constructor Function
function Snake() {
  this.bodySegments = [
    { x: 5, y: 8 },
    { x: 4, y: 8 },
    { x: 3, y: 8 },
  ];
  this.facingDirection = "right";
  this.renderSnake();
}

// Draws the snake on screen
Snake.prototype.renderSnake = function () {
  const opacityReduction = 0.6 / this.bodySegments.length;
  var alpha = 1;
  this.bodySegments.forEach((segment) => {
    const x = segment.x - 1;
    const y = segment.y - 1;
    ctx.fillStyle = "rgba(80, 117, 249," + alpha + ")";
    alpha -= opacityReduction;
    ctx.fillRect(x * patch, y * patch, 32, 32);
  });
};

// Move the snake in its required direction
Snake.prototype.move = function () {
  const direction = this.facingDirection;
  const head = this.bodySegments[0];
  ctx.clearRect((head.x - 1) * patch, (head.y - 1) * patch, patch, patch);
  for (i = this.bodySegments.length - 1; i > 0; i--) {
    var x = this.bodySegments[i].x - 1;
    var y = this.bodySegments[i].y - 1;
    ctx.clearRect(x * patch, y * patch, 32, 32);
    this.bodySegments[i].x = this.bodySegments[i - 1].x;
    this.bodySegments[i].y = this.bodySegments[i - 1].y;
  }
  switch (direction) {
    case "up":
      this.bodySegments[0].y -= 1;
      break;
    case "right":
      this.bodySegments[0].x += 1;
      break;
    case "down":
      this.bodySegments[0].y += 1;
      break;
    case "left":
      this.bodySegments[0].x -= 1;
  }
  this.testCollisionWithWalls();
  this.testCollisionWithItself();
  this.testCollisionWithFood();
  this.renderSnake();
};

// Teleport to opposite side when Snake hits a wall
Snake.prototype.testCollisionWithWalls = function () {
  const head = this.bodySegments[0];
  if (head.y < 1) {
    // Test for left wall
    this.bodySegments[0].y = 15;
  } else if (head.y > 15) {
    // Test for right wall
    this.bodySegments[0].y = 1;
  }
  if (head.x < 1) {
    // Test for top wall
    this.bodySegments[0].x = 18;
  } else if (head.x > 17) {
    // Test for bottom wall
    this.bodySegments[0].x = 1;
  }
};

// End game if snake collides with itself
Snake.prototype.testCollisionWithItself = function () {
  const headX = this.bodySegments[0].x;
  const headY = this.bodySegments[0].y;
  const snakeBody = this.bodySegments.slice(1);
  const collidedWithItself = snakeBody.some((segment) => {
    return segment.x === headX && segment.y === headY;
  });
  if (collidedWithItself) {
    endGame();
  }
};

// Increment score and length of snake if it collides with/eats food
Snake.prototype.testCollisionWithFood = function () {
  const head = this.bodySegments[0];
  if (head.x === food.x && head.y === food.y) {
    const newSegment = { x: head.x, y: head.y };
    this.bodySegments.push(newSegment);
    incrementScore();
    food = new Food();
  }
};

// Food Constructor Function
function Food() {
  this.generateSpawnCoordinates();
  this.renderFood();
}

// Generate the x and y coordinates for the food to spawn
Food.prototype.generateSpawnCoordinates = function () {
  let locationValidity = false;
  while (!locationValidity) {
    if (snake.bodySegments.length > 3) {
      this.x = Math.floor(Math.random() * 17 + 1);
      this.y = Math.floor(Math.random() * 15 + 1);
    } else {
      this.x = 12;
      this.y = 8;
    }
    locationValidity = snake.bodySegments.every((segment) => {
      return segment.x != this.x || segment.y != this.y;
    });
  }
};

// Draw the food on the screen
Food.prototype.renderFood = function () {
  ctx.drawImage(foodImg, (this.x - 1) * patch, (this.y - 1) * patch);
};

// Increment Score
function incrementScore() {
  document.getElementById("score").innerHTML =
    "Score: " + (snake.bodySegments.length - 3);
}

// Start game if game not already started
function startGame() {
  if (gameStatus === "Staged") {
    gameStatus = "Ongoing";
    requestAnimationFrame(loop);
  }
}

// Game Over
function endGame() {
  gameStatus = "Over";
  document.getElementById("score").style.backgroundColor = "#ffffff";
  document.getElementById("score").style.color = "#e8481d";
  document.getElementById("score").innerHTML =
    "Game Over - Your Score: " + (snake.bodySegments.length - 3);
  document.getElementById("restartBtn").style.display = "block";
}

// Resets the game components to their original state
function restageGame() {
  if (gameStatus == "Over") {
    document.getElementById("score").style.backgroundColor = "#4a752c";
    document.getElementById("score").style.color = "#fff";
    document.getElementById("score").innerHTML = "Score: 0";
    ctx.clearRect(0, 0, 17 * patch, 15 * patch);
    snake = new Snake();
    food = new Food();
    gameStatus = "Staged";
    document.getElementById("restartBtn").style.display = "none";
  }
}

// Provide delay in the Gameplay
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// Loop game
function loop() {
  if (gameStatus == "Ongoing") {
    snake.move();
    sleep(drag);
    requestAnimationFrame(loop);
  }
}

// Listen for arrow key presses
document.onkeydown = function (event) {
  let facingDirection = snake.facingDirection;
  switch (event.key) {
    case "ArrowLeft":
      if (facingDirection !== "right") {
        snake.facingDirection = "left";
      }
      break;
    case "ArrowUp":
      if (facingDirection !== "down") {
        snake.facingDirection = "up";
      }
      break;
    case "ArrowRight":
      if (facingDirection !== "left") {
        snake.facingDirection = "right";
        // Start game on pressing the right key for the first time
        startGame();
      }
      break;
    case "ArrowDown":
      if (facingDirection !== "up") {
        snake.facingDirection = "down";
      }
  }
};

// Initialize Game Objects
window.onload = function () {
  snake = new Snake();
  food = new Food();
  drag = 65;
  gameStatus = "Staged";
};
