let audioSecond = new Audio("./audio/audio-secound-page.mpeg");
let crashed;
const gameApp = {
  appName: "ghosts-forest",
  author: "Hesam,Bernard",
  version: "1.0.0",
  licensed: undefined,
  description: "A game where you can play with ghosts & trees",
  ctx: 0,
  framesIndex: 0,
  points: 0,
  canvasSize: { w: 1200, h: 350 },
  forestSpace: {
    pos: { x: 100, y: 150 },
    size: { w: 1200, h: 350 },
  },
  girlSpecs: {
    pos: { x: 100, y: 150 },
    size: { w: 85, h: 85 },
  },
  ghosts: [],
  init() {
    this.setContext();
    this.setImageInstance();
    this.setEventListeners();
    this.start();
  },
  setContext() {
    this.ctx = document.querySelector("canvas").getContext("2d");
  },
  setImageInstance() {
    this.girlInstance = new Image();
    this.girlInstance.src = "./image/girl-in-forest.png";
  },
  setEventListeners() {
    document.onkeyup = (event) => {
      const { key } = event;
      if (key == "ArrowUp") {
        this.girlSpecs.pos.y -= 45;
      }
      if (key == "ArrowDown") {
        this.girlSpecs.pos.y += 45;
      }
    };
  },
  //
  drawForest() {
    var img = document.getElementById("forest");
    this.ctx.drawImage(img, 10, 10, 1200, 350);
  },
  drawGirl() {
    this.ctx.drawImage(
      this.girlInstance,
      this.girlSpecs.pos.x,
      this.girlSpecs.pos.y,
      this.girlSpecs.size.w,
      this.girlSpecs.size.h
    );
  },
  start() {
    setInterval(() => {
      this.clearAll();
      this.drawAll();
      if (crashed === false) {
        this.points++;
      } else {
        audioSecond.pause();
      }
      this.framesIndex++;
      document.querySelector("#point-text1").innerHTML = gameApp.points;
      document.querySelector(".point-div").style = "display:flex";
    }, 50);
  },
  drawAll() {
    this.drawForest();
    this.drawGirl();
    this.ghosts.forEach((elm) => elm.drawGhosts());
    if (this.framesIndex % 30 === 0) this.createghosts();
  },
  //
  clearAll() {
    this.ctx.clearRect(0, 0, 1200, 350);
  },
  createghosts() {
    this.ghosts.push(
      new ghosts(
        this.ctx,
        Math.random() * (350 - 50),
        Math.random(),
        this.girlSpecs
      )
    );
  },
  repeatSound() {
    audioSecond.currentTime = 0;
    audioSecond.play();
  },
};

window.onload = () => {
  crashed = false;
  document.getElementById("start-button").onclick = () => {
    document.querySelector(".first-page-content").style = "display:none";
    document.querySelector(".game-page").style = "display:flex";
    document.querySelector("#forest").style =
      "position: fixed; filter:blur(100); display: inherit; opacity: 0.8; z-index: -1000; width: 100vw; height: 100vh;";
    startGame();
    audioSecond.loop = false;
    audioSecond.play();
  };

  function startGame() {
    gameApp.init();
  }
  audioSecond.addEventListener("ended", () => {
    gameApp.repeatSound();
  });
};

class ghosts {
  constructor(ctx, posX, randomW, girlSpecs) {
    this.ctx = ctx;
    this.posX = posX;
    this.randomW = randomW;
    this.girlSpecs = girlSpecs;
    this.speed = 10;
    this.ghostsSpecs = {
      pos: { x: posX, y: 1200 },
      size: { w: 50, h: 50 },
    };
    this.drawGhosts();
  }

  drawGhosts() {
    this.move();
    var img = document.getElementById("ghost");
    this.ctx.drawImage(
      img,
      this.ghostsSpecs.pos.y,
      this.ghostsSpecs.pos.x,
      this.ghostsSpecs.size.w,
      this.ghostsSpecs.size.h
    );
  }
  move() {
    this.ghostsSpecs.pos.y -= this.speed;
    let ghostPosition = this.ghostsSpecs.pos.x + this.ghostsSpecs.size.h;
    let maxGirlPosition = this.girlSpecs.pos.y + this.girlSpecs.size.h;
    let minGirlPosition = this.girlSpecs.pos.y;

    if (this.ghostsSpecs.pos.y === this.girlSpecs.pos.x) {
      if (maxGirlPosition > ghostPosition && minGirlPosition < ghostPosition) {
        crashed = true;
        document.querySelector(".first-page-content").style = "display:none";
        document.querySelector(".game-page").style = "display:none";
        document.querySelector(".end-game").style = "display:flex";
        document.querySelector(".point-div").style = "display:none";
        document.getElementById("restart-btn").onclick = () => {
          window.location.reload();
        };
        document.querySelector("#point-text2").innerHTML = gameApp.points;
      }
    }
  }
}