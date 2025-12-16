var keyDownFired = false;

const bird = document.getElementById("flappy-bird");

class FlappyBird {
  constructor() {
    this.x = 300;
    this.y = 270;
    this.yVel = 0;
  }
  move() {
    bird.style.left = this.x + "px";
    bird.style.bottom = this.y + "px";
  }
}

var player = new FlappyBird();

document.body.onkeydown = function handleKeyPress(e) {
  if (!keyDownFired) {
    keyDownFired = true;
    e = e || window.event;

    if (e.keyCode == "38") {
      player.yVel = 9;
      document.getElementById("flappy-bird").src =
        "assets/Flappy Bird (flapped).png";
    }
  }
};

document.body.onkeyup = function () {
  keyDownFired = false;
  document.getElementById("flappy-bird").src = "assets/Flappy Bird.png";
};

var pause = false;

function update() {
  if (player.y <= 0) {
    console.log("Game Over");
    bird.style.visibility = "hidden";
    pause = true;
  }
  if (player.y + player.yVel < 592) {
    player.y += player.yVel;
  } else {
    player.y = 592;
  }
  player.yVel -= 0.5;
  pipes.forEach(function (pipe) {
    pipe.x -= 4;
  });
  if (pipes.length) {
    if (pipes[0].x <= -100) {
      pipes[0].pipeObj.style.visibility = "hidden";
      pipes.shift();
      pipes[0].pipeObj.style.visibility = "hidden";
      pipes.shift();
    }
  }
}

function render(progress) {
  player.move();
  pipes.forEach(function (pipe) {
    pipe.move();
    detectCollision(pipe, progress);
  });
  document.getElementById("score").innerHTML = "Score: " + Math.round(progress);
}

function loop(timestamp) {
  update();
  render(timestamp);
  if (pause) {
    console.log("Game Over!");
    console.log("Your Score: " + Math.round(timestamp));
    bird.style.visibility = "hidden";
    pipes.forEach(function (pipe) {
      pipe.pipeObj.style.visibility = "hidden";
    });
    document.getElementById("score").style.animation =
      "color-change 0.75s infinite";
  } else {
    requestAnimationFrame(loop);
  }
}

requestAnimationFrame(loop);

var pipe_id = 0;

class Pipe {
  constructor(position) {
    this.position = position;
    this.visibility = true;
    this.id = "pipe-" + this.position + "-" + pipe_id;
    this.x = 1366;
    if (position == "top") {
      this.y = randomYSpawn;
    } else {
      this.y = randomYSpawn - 696;
    }

    var div = document.createElement("DIV");
    div.className = "pipe";
    div.id = this.id;
    var img = document.createElement("IMG");
    img.className = "pipe-img";
    img.src = "assets/Pipe (" + this.position + ").png";

    div.appendChild(img);
    document.getElementById("pipes").appendChild(div);

    this.pipeObj = document.getElementById(this.id);
    pipe_id++;

    this.pipeObj.style.bottom = this.y + "px";
    this.move();
  }

  move() {
    this.pipeObj.style.left = this.x + "px";
  }
}

var pipes = [];

var randomYSpawn = 0;

function generatePipes() {
  setTimeout(function () {
    randomYSpawn = Math.random() * (503 - 276) + 276;
    pipes.push(new Pipe("top"));
    pipes.push(new Pipe("bottom"));
    if (!pause && pipes.length) {
      generatePipes();
    }
  }, 3000);
}

generatePipes();

function detectCollision(pipe, progress) {
  if (
    player.x < pipe.x + 110 &&
    player.x + 75 > pipe.x &&
    player.y < pipe.y + (110 / 211) * 995 &&
    player.y + (75 / 409) * 288 > pipe.y
  ) {
    pause = true;
  }
}
