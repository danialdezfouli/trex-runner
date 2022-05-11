class GameUI {
  constructor(game) {
    this.game = game;
    this.particles = [];

    this.dom = {
      lifeIndicator: root.querySelector(".life-indicator"),
      score: root.querySelector(".score .value"),
      gameOver: root.querySelector(".modal.game-over"),
      start: root.querySelector(".modal.start"),
      particles: root.querySelector(".particles"),
      lifeIndicatorSpans: Array.from(
        root.querySelectorAll(".life-indicator .value span")
      ),
    };

    this.prevLives = -1;

    this.createParticles();
  }

  hideStart() {
    this.dom.start.classList.add("hidden");
  }

  createParticles() {
    const root = this.dom.particles;

    for (let index = 0; index < 5; index++) {
      const p = createParticle(root, "tree", index / 5 + rand() / 5);
      this.particles.push(p);
    }

    // for (let index = 0; index < 5; index++) {
    //   const p = createParticle(root, "mountain", rand());
    //   this.particles.push(p);
    // }
  }

  showGameOver() {
    const modal = this.dom.gameOver;
    modal.querySelector(".score span").textContent = this.game.score;
    modal.querySelector(".score.best span").textContent = this.game.bestScore;

    modal.classList.remove("hidden");
  }

  hideGameOver() {
    this.dom.gameOver.classList.add("hidden");
  }

  update() {
    if (this.prevLives !== this.game.lives) {
      this.updateLives();
    }

    if (this.prevScore !== this.game.score) {
      this.updateScore();
    }
  }

  updateLives() {
    const spans = this.dom.lifeIndicatorSpans;
    for (let index = 0; index < spans.length; index++) {
      const span = spans[index];

      span.classList.toggle("en", index < this.game.lives);
    }
    this.prevLives = this.game.lives;
  }

  updateScore() {
    this.dom.score.innerText = this.game.score;
    this.prevScore = this.game.score;
  }
}

function createParticle(root, type = "tree", theta = 0) {
  const el = document.createElement("div");
  const span = document.createElement("span");
  el.className = "particle " + type;

  const r = 40;

  const radius = 310;
  const phi = theta * Math.PI * 2;

  const x = Math.sin(phi) * (radius + r) + radius - r;
  const y = Math.cos(phi) * (radius + r) + radius - r;

  const dx = x + r - radius;
  const dy = y + r - radius;
  const rotate = Math.floor(90 + (Math.atan2(dy, dx) / Math.PI) * 180);

  if (type === "tree") {
    span.style.width = `${5 + rand() * 20}px`;
    span.style.height = `${60 + rand() * 50}px`;

    const leafs = Math.floor(rand() * 2 + 2);
    for (let i = 0; i < leafs; i++) {
      const leaf = document.createElement("i");
      leaf.style.setProperty("--x", `${(rand() - 0.5) * 5}px`);
      leaf.style.setProperty("--size", `${30 + rand() * 20}px`);
      span.appendChild(leaf);
    }
  }
  // else {
  //   span.style.width = `${10 + theta * 20}px`;
  //   span.style.transform = `rotateX(${rand() * 20}deg)`;
  //   span.style.setProperty("--rotateX", rand() * 20 + "deg");
  //   span.style.height = span.style.width;
  // }
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.transform = `rotate(${Math.floor(
    rotate
  )}deg) translate3d(0px, 2px, 0px)`;

  el.appendChild(span);
  root.appendChild(el);
}
