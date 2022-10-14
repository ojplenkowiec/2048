// IDEAS
// adjustable board size CHECK
// input sanitisation so only one move per key press CHECK
// adjustable factor of growth SHIT IDEA
// different animation types for different systems WIP
// create a function that "crosses out" positions as filled allowing for better find valid position
// create a move animation

var game;

function setup() {
  game = new Game(4, 4, 200, 1);
  game.showGrid(true);
  game.showText(true);
  game.begin();
}

function draw() {
  game.update();
}