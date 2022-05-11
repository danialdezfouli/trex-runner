const START_AT = 0.25;
const END_AT = 0.75;

let lennn = 1;

class Obstacle {
  constructor(root, { speed, y = 0 }) {
    this.dom = {
      /** @type HTMLElement */
      el: null,
      /** @type HTMLElement */
      content: null,
    };

    this.x = START_AT;
    this.y = y;

    this.speed = speed;
    this.rotate = 0;
    this.active = true;

    this.position = {
      x: 0,
      y: 0,
    };

    this.bounds = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
    };

    this.createDom(root);
    this.createContent();

    this.onDestroy = () => {};
    this.onCollision = () => {};
  }

  createContent() {
    this.dom.el.classList.add("ground");
    this.dom.content.innerText = oneOf([
      "🌵🌵",
      "🌵",
      "🌵",
      "👽",
      "👾",
      "🔥",
      "🔥",
      "💣",
      "💀",
      "🎃",
    ]);

    lennn += 1;
    if (lennn > 2) {
      lennn = 1;
    }

    if (this.dom.content.innerText.length > 2) {
      this.dom.el.classList.add("double");
    }
  }

  createDom(root) {
    this.dom.el = document.createElement("div");
    this.dom.el.classList.add("obstacle");

    this.dom.wrap = document.createElement("div");

    this.dom.content = document.createElement("span");

    this.dom.el.appendChild(this.dom.wrap);
    this.dom.wrap.appendChild(this.dom.content);
    root.appendChild(this.dom.el);
  }

  /**
   * @param {Hero} hero
   */
  hasCollision(hero) {
    return (
      this.bounds.x < hero.bounds.x + hero.bounds.width &&
      this.bounds.x + this.dom.wrap.offsetWidth > hero.bounds.x &&
      this.bounds.y < hero.bounds.y + hero.bounds.height &&
      this.bounds.y + this.dom.wrap.offsetHeight > hero.bounds.y
    );
  }

  isInView() {
    return this.x >= START_AT && this.x < END_AT;
  }

  destroy(force) {
    this.dom.el.classList.add("fadeout");
    this.active = false;
    setTimeout(
      () => {
        this.dom.el.remove();
        this.onDestroy();
      },
      force ? 100 : 500
    );
  }

  /**
   * @param {globe: Globe}
   */
  update({ globe }) {
    this.x += this.speed;

    const r = globe.radius + this.y;
    const phi = this.x * Math.PI * 2;

    const rx = this.dom.el.offsetWidth / 2;
    const ry = this.dom.el.offsetHeight / 2;

    this.position.x = Math.floor(Math.sin(phi) * (r + rx) + r) - rx - this.y;
    this.position.y = Math.floor(Math.cos(phi) * (r + ry) + r) - ry - this.y;

    const dx = this.position.x + rx - r;
    const dy = this.position.y + ry - r;
    this.rotate = Math.floor(90 + (Math.atan2(dy, dx) / Math.PI) * 180);
  }

  render() {
    this.dom.el.style.cssText = `
    left: ${this.position.x}px;
    top: ${this.position.y}px; 
    transform: rotate(${this.rotate}deg);
    `;

    this.bounds = this.dom.wrap.getBoundingClientRect();
    // this.dom.content.textContent = this.x.toFixed(2);
  }
}

class Rocket extends Obstacle {
  constructor(root, opts) {
    super(root, { ...opts, y: 32 });
  }

  createContent() {
    const len = oneOf([1, 1, 2]);

    this.dom.el.classList.add("rocket");
    this.dom.content.innerText = "🚀".repeat(len);

    if (len === 2) {
      this.dom.el.classList.add("double");
      this.y = 35;
    }
  }
}

class Meteorite extends Obstacle {
  constructor(root, opts) {
    super(root, { ...opts, y: 50 });
  }

  createContent() {
    this.dom.el.classList.add("meteorite");
    this.dom.content.innerText = oneOf(["☄️", "🌠"]);
  }
}

class Heart extends Obstacle {
  constructor(root, opts) {
    super(root, { ...opts, y: 90 });
  }

  createContent() {
    this.dom.el.classList.add("heart");
    this.dom.content.innerText = "❤️";
  }
}
