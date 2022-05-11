const MAX_LIVES = 4;
const CHANGE_THEME_SCORE = 50;
const DEFAULT_SPEED = 0.001;
const INCREASE_SPEED = 0.00005;
const INCREASE_SPEED_SCORE = 50;

class Game {
  constructor(root) {
    this.dom = {
      app: root,
      hero: root.querySelector(".hero"),
      globe: root.querySelector(".globe"),
      globeShape: root.querySelector(".globe-shape"),
      obstacles: root.querySelector(".obstacles"),
      particles: root.querySelector(".particles"),
    };

    this.playing = false;

    /** @type Obstacle[]  */
    this.obstacles = [];

    this.reqId = null;
    this.globe = new Globe();
    this.hero = new Hero(this.dom.hero);
    this.ui = new GameUI(this);

    // for (let index = 0; index < 15; index++) {
    //   const p = this.createParticle();
    //   p.x = index / 15;
    // }
  }

  get bestScore() {
    const value = localStorage.getItem("trex-best-score");
    if (parseInt(value) > 0) {
      return parseInt(value);
    }
    return 0;
  }

  set bestScore(value = 0) {
    localStorage.setItem("trex-best-score", parseInt(value));
  }

  begin() {
    this.lives = MAX_LIVES;
    this.speed = DEFAULT_SPEED;
    this.distance = 0;
    this.score = "0";
    this.playing = true;
    this.over = false;

    this.nextObstacle = Date.now();
    this.nextLevelUpdate = 0;
    this.nextThemeChange = 0;
    this.obstacles = [];
    
    this.ui.hideStart();

    this.setTtheme("day");

    this.updateUI();

    this.update();
  }
  restart() {
    this.ui.hideGameOver();
    this.obstacles.forEach((p) => p.destroy(true));
    this.begin();
  }

  createParticle() {
    const root = this.dom.obstacles;
    const type = oneOf([
      "heart",
      "ground",
      "ground",
      "ground",
      "rocket",
      "rocket",
      "meteorite",
      "meteorite",
    ]);

    const opts = { speed: this.speed };
    let p;

    switch (type) {
      case "rocket":
        p = new Rocket(root, opts);
        break;
      case "meteorite":
        p = new Meteorite(root, opts);
        break;
      case "heart":
        p = new Heart(root, opts);
        break;
      default:
        p = new Obstacle(root, opts);
        break;
    }

    p.onCollision = () => {
      if (type === "heart") {
        if (this.lives < MAX_LIVES) {
          this.lives++;
          this.hero.heal();
        }
      } else {
        if (this.lives > 0) {
          this.lives--;
          this.hero.hit();
        }

        if (this.lives === 0) {
          this.gameOver();
        }
      }
    };

    p.onDestroy = () => {
      this.obstacles = this.obstacles.filter((item) => item !== p);
    };

    this.obstacles.push(p);
    this.nextObstacle = Date.now() + 300 + Math.random() * 1500;

    return p;
  }

  gameOver() {
    this.over = true;
    this.playing = false;
    this.bestScore = Math.max(this.bestScore, this.score);
    this.pauseAnimation();
    this.ui.showGameOver();
  }
  updateUI() {
    this.ui.update();
  }

  updateObstacles() {
    const Obstacle = this.obstacles;
    const globe = this.globe;

    for (const p of Obstacle) {
      p.update({
        globe,
      });

      if (p.active && p.hasCollision(this.hero)) {
        p.destroy();
        p.onCollision(game);
        p.render();
        this.updateUI();
      }

      if (p.isInView()) {
        p.render();
      } else {
        p.destroy();
      }
    }
  }

  nextLevel() {
    this.nextLevelUpdate = Date.now() + 2000;
    this.speed += INCREASE_SPEED;
  }

  setTtheme(theme) {
    const reverse = theme === "day" ? "night" : "day";

    this.dom.app.classList.add(theme);
    this.dom.app.classList.remove(reverse);
  }
  toggleTheme() {
    if (this.dom.app.classList.contains("day")) {
      this.setTtheme("night");
    } else {
      this.setTtheme("day");
    }
  }

  update() {
    if (!this.playing) return;

    if (document.hasFocus()) {
      this.reqId = requestAnimationFrame(this.update.bind(this));
    }

    const now = Date.now();
    this.distance += this.speed;
    this.score = Math.floor(this.distance * 10);

    if (
      this.score > 0 &&
      this.score % INCREASE_SPEED_SCORE === 0 &&
      now > this.nextLevelUpdate
    ) {
      this.nextLevel();
    }

    if (
      this.score > 0 &&
      this.score % CHANGE_THEME_SCORE === 0 &&
      now > this.nextThemeChange
    ) {
      this.toggleTheme();
    }

    this.hero.update();

    if (now > this.nextObstacle) {
      this.createParticle();
    }

    this.updateObstacles();

    this.dom.particles.style.rotate = `${(-this.distance * 360) % 360}deg`;
    this.ui.update();
  }

  pauseAnimation() {
    if (this.reqId) {
      cancelAnimationFrame(this.reqId);
      this.reqId = null;
    }
  }

  pause() {
    this.pauseAnimation();
  }
}
