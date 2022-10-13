// IDEAS
// adjustable board size CHECK
// adjustable factor of growth
// different animation types for different systems
// create a function that "crosses out" positions as filled allowing for better find valid position
// create a move animation

var game;

function setup() {
  game = new Game(10, 10, 50, 1);
  for(let i = 0; i < 1; i++){
    game.createRandomPiece();
  }
  game.showGrid(true);
  game.showText(true);
}

function draw() {
  if(keyIsDown(UP_ARROW)){ // need to fix input to only trigger move 1x
    game.move(2);
  }
  else if(keyIsDown(LEFT_ARROW)){
    game.move(0);
  }
  else if(keyIsDown(DOWN_ARROW)){
    game.move(3);
  }
  else if(keyIsDown(RIGHT_ARROW)){
    game.move(1);
  }
  game.draw();
}

class Game{
  constructor(x, y, resolutionPerSquare, piecesPerMove){
    // create member variables
    this.xSize = x;
    this.ySize = y;
    this.board = createArray(x, y);
    this.rps = resolutionPerSquare;
    this.ppm = piecesPerMove;
    this.gridEnabled = true;
    this.textEnabled = true;
    this.score = 0;

    // create canvas
    createCanvas(x * resolutionPerSquare, y * resolutionPerSquare);
  }

  createPiece(xPos, yPos, value){
    this.board[xPos][yPos] = new Piece(value);
  }

  showGrid(value){
    if(value != 0 && value != false){
      this.gridEnabled = true;
    }
    else{
      this.gridEnabled = false;
    }
  }

  showText(value){
    if(value != 0 && value != false){
      this.textEnabled = true;
    }
    else{
      this.textEnabled = false;
    }
  }

  createRandomPiece(){ // creates random piece with value 2 / 4
    let position = this.findValidPosition();
    if(!position){
      console.log("no free position found!"); // NOT NECESSARILY TRUE ATM
    }
    else{
      this.board[position.x][position.y] = new Piece((random() < 0.5) ? 2 : 4);
    }
  }

  draw(){ // draw pieces... this will be OPENGL shite maybe
    background(200);

    stroke(0);
    strokeWeight(1); 
    if(this.gridEnabled){
      for(let x = 0; x <= this.xSize; x++){
        line(x * this.rps, 0, x * this.rps, this.rps * this.ySize);
      }
      for(let y = 0; y <= this.ySize; y++){
        line(0, y * this.rps, this.rps * this.xSize, y * this.rps);
      }
    }

    strokeWeight(1);
    textAlign(CENTER, CENTER);
    for(let x = 0; x < this.xSize; x++){
      for(let y = 0; y < this.ySize; y++){
        if(!this.positionEmpty(x, y)){
          ellipse((this.rps * x) + (this.rps / 2), (this.rps * y) + (this.rps / 2), this.rps / 1.5);
          if(this.textEnabled){
            text(String(this.board[x][y].value), (this.rps * x) + (this.rps / 2), (this.rps * y) + (this.rps / 2));
          }
        }
      }
    }
  }

  findValidPosition(){ // rewrite this lollllllllll
    for(let i = 0; i < 500; i++){
      let x = Math.floor(random(this.xSize));
      let y = Math.floor(random(this.ySize));
      if(this.positionEmpty(x, y)){
        return(new Position(x, y));
      }
    }
    return false;
  }

  positionEmpty(x, y){
    if(this.board[x][y] == 0){
      return true;
    }
    else{
      return false;
    }
  }

  move(direction){
    this.movePieces(direction);
    for(let i = 0; i < this.ppm; i++){
      this.createRandomPiece();
    }
  }

  movePieces(direction){ // abstract? probably doable but this works fine for now
    if(direction == 0){ // LEFT
      for(let i = 0; i < this.ySize; i++){ // per row
        let lastPosition = -1;
        let lastValue = -1;
        for(let j = 0; j < this.xSize; j++){ // per column
          if(!this.positionEmpty(j, i)){
            if(this.board[j][i].value == lastValue){
              this.board[j][i] = 0;
              this.board[lastPosition][i] = new Piece(lastValue * 2);
              lastValue = lastValue * 2;
              this.score += lastValue;
            }
            else{
              lastValue = this.board[j][i].value;
              this.board[lastPosition + 1][i] = new Piece(this.board[j][i].value);
              if(j != lastPosition + 1){
                this.board[j][i] = 0;
              }
              lastPosition += 1;
            }
          }
        }
      }
    }
    else if(direction == 1){ // RIGHT
      for(let i = 0; i < this.ySize; i++){ // per row
        let lastPosition = this.xSize;
        let lastValue = -1;
        for(let j = 0; j < this.xSize; j++){ // per column
          if(!this.positionEmpty(this.xSize - 1 - j, i)){
            if(this.board[this.xSize - 1 - j][i].value == lastValue){
              this.board[this.xSize - 1 - j][i] = 0;
              this.board[lastPosition][i] = new Piece(lastValue * 2);
              lastValue = lastValue * 2;
            }
            else{
              lastValue = this.board[this.xSize - 1 - j][i].value;
              this.board[lastPosition - 1][i] = new Piece(this.board[this.xSize - 1 - j][i].value);
              if(this.xSize - 1 - j != lastPosition - 1){
                this.board[this.xSize - 1 - j][i] = 0;
              }
              lastPosition -= 1;
            }
          }
        }
      }
    }
    else if(direction == 2){ // UP
      for(let i = 0; i < this.xSize; i++){ // per column
        let lastPosition = -1;
        let lastValue = -1;
        for(let j = 0; j < this.ySize; j++){ // per row
          if(!this.positionEmpty(i, j)){
            if(this.board[i][j].value == lastValue){
              this.board[i][j] = 0;
              this.board[i][lastPosition] = new Piece(lastValue * 2);
              lastValue = lastValue * 2;
            }
            else{
              lastValue = this.board[i][j].value;
              this.board[i][lastPosition + 1] = new Piece(this.board[i][j].value);
              if(j != lastPosition + 1){
                this.board[i][j] = 0;
              }
              lastPosition += 1;
            }
          }
        }
      }
    }
    else if(direction == 3){ // DOWN
      for(let i = 0; i < this.xSize; i++){ // per column
        let lastPosition = this.ySize;
        let lastValue = -1;
        for(let j = 0; j < this.ySize; j++){ // per row
          if(!this.positionEmpty(i, this.ySize - 1 - j)){
            if(this.board[i][this.ySize - 1 - j].value == lastValue){
              this.board[i][this.ySize - 1 - j] = 0;
              this.board[i][lastPosition] = new Piece(lastValue * 2);
              lastValue = lastValue * 2;
            }
            else{
              lastValue = this.board[i][this.ySize - 1 - j].value;
              this.board[i][lastPosition - 1] = new Piece(this.board[i][this.ySize - 1 - j].value);
              if(this.ySize - 1 - j != lastPosition - 1){
                this.board[i][this.ySize - 1 - j] = 0;
              }
              lastPosition -= 1;
            }
          }
        }
      }
    }
    else{
      console.log("invalid direction value given!");
    }
  }
}

class Piece{
  constructor(startingValue){
    this.value = startingValue;
  }
}

class Position{ // bleh
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

function createArray(x, y){  // arrays in javascript suck
  array = [];
  for(let i = 0; i < x; i++){
    array.push([]);
    for(let j = 0; j < y; j++){
      array[i].push(0);
    }
  }
  return array;
}