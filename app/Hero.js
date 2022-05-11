class Hero {
  constructor(root) {
    /** @type HTMLElement */
    this.el = root;
    this.jumpCounter = 0;
    this.isFalling = false;
    this.bounds = this.el.getBoundingClientRect();
    this.radius = this.bounds.width / 2;

    this.addEvents();
  }

  get isJumping() {
    return this.jumpCounter > 0;
  }

  update() {
    this.bounds = this.el.getBoundingClientRect();
  }

  hit() {
    this.el.classList.add("hit");
    setTimeout(() => {
      this.el.classList.remove("hit");
    }, 200);
  }

  heal() {
    this.el.classList.add("heal");
    setTimeout(() => {
      this.el.classList.remove("heal");
    }, 200);
  }

  jump() {
    if (this.jumpCounter > 1 || this.isFalling) return;
    clearTimeout(this.timer);
    this.isFalling = false;

    this.jumpCounter++;
    this.el.classList.add("jump");
    this.el.classList.remove("sit");

    if (this.jumpCounter === 2) {
      this.el.classList.add("jump2");
    }

    this.timer = setTimeout(() => {
      this.isFalling = true;
      this.el.classList.remove("jump", "jump2");
      this.jumpCounter = 0;

      setTimeout(() => {
        this.isFalling = false;
      }, 150);
    }, 350);
  }

  sit() {
    if (this.isJumping) {
      return;
    }
    this.el.classList.add("sit");
  }

  addEvents() {
    addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.code === "Space") {
        this.jump();
      } else if (e.key === "ArrowDown") {
        this.sit();
      }
    });

    addEventListener("keyup", (e) => {
      if (e.key === "ArrowDown") {
        this.el.classList.remove("sit");
      }
    });
  }
}
