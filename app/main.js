const root = document.querySelector("#app");
const game = new Game(root);

window.addEventListener("blur", () => {
  game.pause();
});

window.addEventListener("focus", () => {
  game.update();
});

document.querySelector(".restart").addEventListener("click", () => {
  game.restart();
});

addEventListener("keydown", (e) => {
  if (e.key == "Enter" && game.over) {
    game.restart();
  }
  if (e.code == "Space" && !game.playing && !game.over) {
    game.begin();
  }
});

// document.body.addEventListener("click", () => {
//   root.classList.toggle("day");
//   root.classList.toggle("night");
// });
