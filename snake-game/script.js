/**
 * CONSTANTS & CONFIGURATION
 */
const canvas = document.getElementById("garden");
const FOOD_IMG = document.getElementById("food");
const scoreLabel = document.querySelector("#hud .score .value");
const controlBtn = document.querySelector(".control-btn");
const controlBtnIcon = document.querySelector(".control-btn i");
const ctx = canvas.getContext("2d");

const PATCH_SIZE = 32;
const BOARD_WIDTH = 17;
const BOARD_HEIGHT = 15;
const SNAKE_COLOR = { r: 80, g: 117, b: 249 };
const DRAG = 100; // Game speed in ms

const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

const GAME_STATES = {
  STAGED: "STAGED",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAMEOVER: "GAMEOVER",
};

const rgba = (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`;

class Game {
  score = 0;
  currentState = GAME_STATES.STAGED;
  snake;
  food;
  directionChanged = false;

  constructor() {
    this.initInput();
    this.stageGame();
  }

  initInput() {
    window.addEventListener("keydown", (e) => {
      if (this.currentState === GAME_STATES.PLAYING) {
        if (!this.directionChanged) {
          const success = this.snake.changeDirection(e.key);
          if (success) this.directionChanged = true;
        }
      } else if (this.currentState === GAME_STATES.STAGED) {
        if (e.key === " ") {
          e.preventDefault();

          this.stageGame();
          this.startGame();
        }
      }
    });
    controlBtn.addEventListener("click", (e) => {
      if (this.currentState === GAME_STATES.GAMEOVER) {
        this.stageGame();
      } else if (this.currentState === GAME_STATES.PLAYING) {
        this.pauseGame();
      } else if (
        this.currentState === GAME_STATES.PAUSED ||
        this.currentState === GAME_STATES.STAGED
      ) {
        this.startGame();
      }
    });
  }

  stageGame() {
    this.score = 0;
    this.snake = new Snake();
    this.food = new Food({ x: 11, y: 7 });
    this.currentState = GAME_STATES.STAGED;
    controlBtnIcon.className = "fa-solid fa-play";
    this._renderComponents();
  }

  startGame() {
    this.currentState = GAME_STATES.PLAYING;
    controlBtnIcon.className = "fa-solid fa-pause";
    this.loop();
  }

  loop = () => {
    if (this.currentState !== GAME_STATES.PLAYING) return;

    this.snake.move();
    this.directionChanged = false;

    const head = this.snake.bodySegments[0];

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.score++;
      this.food = new Food(this.generateFoodSpawnCoordinates());
    }

    // Check Self-Collision
    if (this.isCollision()) {
      this.stopGame();
      return;
    }

    this._renderComponents();

    setTimeout(() => {
      requestAnimationFrame(this.loop);
    }, DRAG);
  };

  pauseGame() {
    this.currentState = GAME_STATES.PAUSED;
    controlBtnIcon.className = "fa-solid fa-play";
  }

  stopGame() {
    this.currentState = GAME_STATES.GAMEOVER;
    controlBtnIcon.className = "fa-solid fa-rotate-right";
    this._renderComponents();
  }

  isCollision() {
    const [head, ...body] = this.snake.bodySegments;
    return body.some((seg) => seg.x === head.x && seg.y === head.y);
  }

  generateFoodSpawnCoordinates() {
    let coords = this._pickRandomCoordinates();
    while (
      this.snake.bodySegments.some(
        (seg) => seg.x === coords.x && seg.y === coords.y,
      )
    ) {
      coords = this._pickRandomCoordinates();
    }
    return coords;
  }

  _drawStartScreen() {
    // Semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Title
    ctx.font = "bold 36px Arial";
    ctx.fillText("CLASSIC SNAKE", canvas.width / 2, canvas.height / 2 - 30);

    // Subtitle / Instruction
    ctx.font = "18px Arial";
    ctx.fillStyle = "#adb5bd"; // Slightly grey for the secondary text
    ctx.fillText(
      "Press Space to begin",
      canvas.width / 2,
      canvas.height / 2 + 20,
    );
  }

  _drawGameOverText() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "20px Arial";
    ctx.fillText(
      `Final Score: ${this.score}`,
      canvas.width / 2,
      canvas.height / 2 + 25,
    );
  }

  _pickRandomCoordinates() {
    return {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
  }

  _renderComponents() {
    this._clearCanvas();
    this.food.render();
    this.snake.render();
    scoreLabel.innerHTML = this.score;

    if (this.currentState === GAME_STATES.GAMEOVER) {
      this._drawGameOverText();
    } else if (this.currentState === GAME_STATES.STAGED) {
      this._drawStartScreen();
    }
  }

  _clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

class Snake {
  bodySegments = [
    { x: 4, y: 7 },
    { x: 3, y: 7 },
    { x: 2, y: 7 },
  ];
  facingDirection = DIRECTIONS.RIGHT;

  changeDirection(key) {
    const keyMap = {
      ArrowUp: DIRECTIONS.UP,
      ArrowDown: DIRECTIONS.DOWN,
      ArrowLeft: DIRECTIONS.LEFT,
      ArrowRight: DIRECTIONS.RIGHT,
    };

    const opposites = {
      [DIRECTIONS.UP]: DIRECTIONS.DOWN,
      [DIRECTIONS.DOWN]: DIRECTIONS.UP,
      [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
      [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
    };

    const newDir = keyMap[key];
    if (newDir && newDir !== opposites[this.facingDirection]) {
      this.facingDirection = newDir;
      return true;
    }
    return false;
  }

  move() {
    const head = { ...this.bodySegments[0] };

    switch (this.facingDirection) {
      case DIRECTIONS.UP:
        head.y -= 1;
        break;
      case DIRECTIONS.DOWN:
        head.y += 1;
        break;
      case DIRECTIONS.LEFT:
        head.x -= 1;
        break;
      case DIRECTIONS.RIGHT:
        head.x += 1;
        break;
    }

    head.x = ((head.x % BOARD_WIDTH) + BOARD_WIDTH) % BOARD_WIDTH;
    head.y = ((head.y % BOARD_HEIGHT) + BOARD_HEIGHT) % BOARD_HEIGHT;

    this.bodySegments.unshift(head);
    this.bodySegments.pop();
  }

  grow() {
    const tail = this.bodySegments[this.bodySegments.length - 1];
    this.bodySegments.push({ ...tail });
  }

  render() {
    this.bodySegments.forEach((segment, index) => {
      const alpha = 1 - (index / this.bodySegments.length) * 0.5;
      ctx.fillStyle = rgba(SNAKE_COLOR.r, SNAKE_COLOR.g, SNAKE_COLOR.b, alpha);

      ctx.fillRect(
        segment.x * PATCH_SIZE,
        segment.y * PATCH_SIZE,
        PATCH_SIZE - 1,
        PATCH_SIZE - 1,
      );
    });
  }
}

class Food {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  render() {
    ctx.drawImage(
      FOOD_IMG,
      this.x * PATCH_SIZE,
      this.y * PATCH_SIZE,
      PATCH_SIZE,
      PATCH_SIZE,
    );
  }
}

window.onload = () => {
  new Game();
};
