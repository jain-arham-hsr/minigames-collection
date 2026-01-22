/**
 * CONSTANTS & CONFIGURATION
 */
const birdElement = document.getElementById("flappy-bird");
const pipeContainer = document.getElementById("pipes");
const scoreLabel = document.getElementById("score");

const GRAVITY = -0.3;
const JUMP_STRENGTH = 6;
const PIPE_SPEED = 3;
const SPAWN_RATE = 2000;

const GAME_STATES = {
  STAGED: "STAGED",
  PLAYING: "PLAYING",
  GAMEOVER: "GAMEOVER",
};

/**
 * BACKGROUND ENTITY
 */
class Background {
  constructor() {
    this.x = 0;
    this.speed = 1; // Parallax speed (slower than pipes)
    this.width = window.innerWidth;
    this.bg1 = document.getElementById("background-1");
    this.bg2 = document.getElementById("background-2");
  }

  update(isPlaying) {
    // Only move if the game is actively PLAYING
    if (!isPlaying) return;

    this.x -= this.speed;
    if (this.x <= -this.width) {
      this.x = 0;
    }
  }

  render() {
    this.bg1.style.transform = `translate3d(${this.x}px, 0, 0)`;
    this.bg2.style.transform = `translate3d(${this.x + this.width}px, 0, 0)`;
  }
}

/**
 * GROUND ENTITY
 */
class Ground {
  constructor() {
    this.x = 0;
    this.speed = PIPE_SPEED; // Matches pipes exactly
    this.width = window.innerWidth;
    this.height = 112;
    this.g1 = document.getElementById("ground-1");
    this.g2 = document.getElementById("ground-2");
  }

  update(isPlaying) {
    // Only move if the game is actively PLAYING
    if (!isPlaying) return;

    this.x -= this.speed;
    if (this.x <= -this.width) {
      this.x = 0;
    }
  }

  render() {
    this.g1.style.transform = `translate3d(${this.x}px, 0, 0)`;
    this.g2.style.transform = `translate3d(${this.x + this.width}px, 0, 0)`;
  }
}

/**
 * BIRD ENTITY
 */
class Bird {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 200;
    this.y = 300;
    this.yVel = 0;
    this.width = 45;
    this.height = 32;
    birdElement.style.visibility = "visible";
    this.resetImage();
  }

  flap() {
    this.yVel = JUMP_STRENGTH;
    birdElement.src = "assets/Flappy Bird (flapped).png";
  }

  resetImage() {
    birdElement.src = "assets/Flappy Bird.png";
  }

  update() {
    this.y += this.yVel;
    this.yVel += GRAVITY;

    // Prevent flying off the top
    if (this.y > window.innerHeight - 50) this.y = window.innerHeight - 50;
  }

  render() {
    birdElement.style.left = `${this.x}px`;
    birdElement.style.bottom = `${this.y}px`;

    // Rotate based on velocity
    const rotation = Math.min(Math.max(-this.yVel * 3, -25), 90);
    birdElement.style.transform = `rotate(${rotation}deg)`;
  }
}

/**
 * PIPE ENTITY
 */
class Pipe {
  constructor(type, gapY) {
    this.type = type;
    this.x = window.innerWidth;
    this.width = 80;
    this.height = 600;
    const gapSize = 160;

    // "top" pipe sits at gapY
    // "bottom" pipe sits at gapY - height - gapSize
    this.y = type === "top" ? gapY : gapY - this.height - gapSize;

    this.element = document.createElement("div");
    this.element.className = "pipe";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    const img = document.createElement("img");
    img.src = `assets/Pipe (${this.type}).png`;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.display = "block";

    this.element.appendChild(img);
    pipeContainer.appendChild(this.element);
  }

  update() {
    this.x -= PIPE_SPEED;
  }

  render() {
    this.element.style.left = `${this.x}px`;
    this.element.style.bottom = `${this.y}px`;
  }

  remove() {
    this.element.remove();
  }
}

/**
 * GAME ENGINE
 */
class Game {
  constructor() {
    this.bird = new Bird();
    this.background = new Background();
    this.ground = new Ground();
    this.pipes = [];
    this.score = 0;
    this.currentState = GAME_STATES.STAGED;
    this.lastPipeTime = 0;

    this.initInput();
    this.loop();
  }

  initInput() {
    const action = (e) => {
      if (e.type === "keydown" && e.code !== "Space") return;
      if (e.type === "keydown") e.preventDefault();
      this.handleAction();
    };

    window.addEventListener("keydown", action);
    window.addEventListener("mousedown", action); // Mouse support
    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") this.bird.resetImage();
    });
  }

  handleAction() {
    switch (this.currentState) {
      case GAME_STATES.STAGED:
        this.startGame();
        break;
      case GAME_STATES.PLAYING:
        this.bird.flap();
        break;
      case GAME_STATES.GAMEOVER:
        this.resetGame();
        break;
    }
  }

  startGame() {
    this.currentState = GAME_STATES.PLAYING;
    this.bird.flap();
    this.lastPipeTime = performance.now();
  }

  resetGame() {
    this.pipes.forEach((p) => p.remove());
    this.pipes = [];
    this.score = 0;
    this.bird.reset();
    this.currentState = GAME_STATES.STAGED;
    scoreLabel.style.animation = "none";
  }

  spawnPipes(timestamp) {
    if (timestamp - this.lastPipeTime > SPAWN_RATE) {
      // Ensure pipes don't spawn inside the floor
      const minGapY = 250;
      const maxGapY = window.innerHeight - 150;
      const randomGapY = Math.random() * (maxGapY - minGapY) + minGapY;

      this.pipes.push(new Pipe("top", randomGapY));
      this.pipes.push(new Pipe("bottom", randomGapY));
      this.lastPipeTime = timestamp;
    }
  }

  checkCollisions() {
    // 1. Ground Collision (bird hits the floor height)
    if (this.bird.y <= this.ground.height) return true;

    // 2. Pipe Collision
    return this.pipes.some((pipe) => {
      // Simple AABB collision
      return (
        this.bird.x < pipe.x + pipe.width &&
        this.bird.x + this.bird.width > pipe.x &&
        this.bird.y < pipe.y + pipe.height &&
        this.bird.y + this.bird.height > pipe.y
      );
    });
  }

  update(timestamp) {
    const isPlaying = this.currentState === GAME_STATES.PLAYING;

    // Background and Ground move ONLY when playing
    this.background.update(isPlaying);
    this.ground.update(isPlaying);

    if (!isPlaying) return;

    this.bird.update();
    this.spawnPipes(timestamp);

    // Update Pipes
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.update();

      // Remove off-screen pipes
      if (pipe.x + pipe.width < 0) {
        pipe.remove();
        this.pipes.splice(i, 1);
        this.score += 0.5;
      }
    }

    if (this.checkCollisions()) {
      this.currentState = GAME_STATES.GAMEOVER;
    }
  }

  render() {
    this.background.render();
    this.bird.render();
    this.pipes.forEach((pipe) => pipe.render());
    this.ground.render();

    // UI Updates
    if (this.currentState === GAME_STATES.STAGED) {
      scoreLabel.innerHTML = "PRESS SPACE TO START";
    } else if (this.currentState === GAME_STATES.GAMEOVER) {
      scoreLabel.innerHTML = `GAME OVER<br>Score: ${Math.floor(this.score)}`;
      scoreLabel.style.animation = "color-change 0.75s infinite";
    } else {
      scoreLabel.innerHTML = `Score: ${Math.floor(this.score)}`;
    }
  }

  loop = (timestamp) => {
    this.update(timestamp);
    this.render();
    requestAnimationFrame(this.loop);
  };
}

// Start Game
window.onload = () => new Game();
