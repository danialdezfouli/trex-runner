class Globe {
  constructor() {
    this.el = document.querySelector(".globe");

    this.bounds = this.el.getBoundingClientRect();
    this.radius = this.bounds.width / 2;
  }
}
