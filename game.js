class Game{
    #board;
    #gridEnabled;
    #textEnabled;
    #score;
    #xSize;
    #ySize;
    #gridResolution;
    #ppm;
    #keyCurrentlyPressed;
    #leftPressed;
    #rightPressed;
    #upPressed;
    #downPressed;
    #spacesFree;
    #gameOver;
    constructor(x, y, resolutionPerSquare, piecesPerMove){
      this.#board = createArray(x, y);
      this.#gridEnabled = true;
      this.#textEnabled = true;
      this.#score = 0;
      this.#xSize = x;
      this.#ySize = y;
      this.#gridResolution = resolutionPerSquare;
      this.#ppm = piecesPerMove;
      this.#keyCurrentlyPressed = false;
      this.#leftPressed = false;
      this.#rightPressed = false;
      this.#upPressed = false;
      this.#downPressed = false;
      this.#spacesFree = x * y;
      this.#gameOver = false;
  
      // Create Canvas
      createCanvas(x * resolutionPerSquare, y * resolutionPerSquare);
    }
    
    begin(){
        this.addRandomPiece();
        this.draw();
    }

    // animateMove(x1, y1, x2, y2, steps = 50){
    //   let dx = x2 - x1;
    //   let dy = y2 - y1;
    //   let stepX = dx / steps;
    //   let stepY = dy / steps;
    //   for(let currentStep = 1; currentStep <= steps; currentStep++){
    //     stroke(255); // change
    //     fill(255); // change
    //     ellipse((this.#gridResolution * x1) + (this.#gridResolution / 2) + stepX * this.#gridResolution * currentStep, (this.#gridResolution * y1) + (this.#gridResolution / 2) + stepY * this.#gridResolution * currentStep, this.#gridResolution / 1.5);
    //   }
    // }
  
    update(){
      if(!this.#gameOver){
        if(this.#upPressed || this.#leftPressed || this.#downPressed || this.#rightPressed){
          this.#keyCurrentlyPressed = true;
        }
        else{
          this.#keyCurrentlyPressed = false;
        }
        if(keyIsDown(UP_ARROW) && !this.#keyCurrentlyPressed){ // need to fix input to only trigger move 1x
          this.#upPressed = true;
          this.move(2);
          this.addPieces();
          this.draw();
        }
        else if(keyIsDown(LEFT_ARROW) && !this.#keyCurrentlyPressed){
          this.#leftPressed = true;
          this.move(0);
          this.addPieces();
          this.draw();
        }
        else if(keyIsDown(DOWN_ARROW) && !this.#keyCurrentlyPressed){
          this.#downPressed = true;
          this.move(3);
          this.addPieces();
          this.draw();
        }
        else if(keyIsDown(RIGHT_ARROW) && !this.#keyCurrentlyPressed){
          this.#rightPressed = true;
          this.move(1);
          this.addPieces();
          this.draw();
        }
        if(!keyIsDown(UP_ARROW)){ // need to fix input to only trigger move 1x
          this.#upPressed = false;
        }
        if(!keyIsDown(LEFT_ARROW)){
          this.#leftPressed = false;
        }
        if(!keyIsDown(DOWN_ARROW)){
          this.#downPressed = false;
        }
        if(!keyIsDown(RIGHT_ARROW)){
          this.#rightPressed = false;
        }
      }
      else{
        this.displayGameOver();
      }
    }

    addPieces(){
      for(let i = 0; i < this.#ppm; i++){
        this.addRandomPiece();
      }
    }

    displayGameOver(){
      background(0);
      stroke(255);
      fill(255);
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      textSize(this.#gridResolution / 3);
      text("GAME OVER!", (this.#xSize / 2) * this.#gridResolution, (this.#ySize / 2) * this.#gridResolution);
      text("score : " + this.#score, (this.#xSize / 2) * this.#gridResolution, (this.#ySize / 2) * this.#gridResolution + this.#gridResolution / 2)
    }
  
    getGridResolution(){
      return this.#gridResolution;
    }
  
    setGridResolution(gridResolution){
      this.#gridResolution = gridResolution;
    }
  
    setPiecesPerMove(piecesPerMove){
      this.#ppm = piecesPerMove;
    }
  
    addPiece(xPos, yPos, value){
      this.#board[xPos][yPos] = new Piece(value);
    }
  
    showGrid(value){
      if(value != 0 && value != false){
        this.#gridEnabled = true;
      }
      else{
        this.#gridEnabled = false;
      }
    }
  
    showText(value){
      if(value != 0 && value != false){
        this.#textEnabled = true;
      }
      else{
        this.#textEnabled = false;
      }
    }
  
    addRandomPiece(){ // creates random piece with value 2 / 4
      if(this.#spacesFree > 0){
        let position = this.findValidPosition();
        if(!position){
          console.log("no free position found!"); // NOT NECESSARILY TRUE ATM
        }
        else{
          this.#board[position.x][position.y] = new Piece((random() < 0.5) ? 2 : 4);
        }
        this.#spacesFree -= 1;
        return true;
      }
      else{
        this.#gameOver = true;
        return false; // not possible to add piece cuz board full
      }
    }
  
    draw(){ // draw pieces... this will be OPENGL shite maybe
      background(200);
  
      stroke(0);
      strokeWeight(1);
      if(this.#gridEnabled){
        for(let x = 0; x <= this.#xSize; x++){
          line(x * this.#gridResolution, 0, x * this.#gridResolution, this.#gridResolution * this.#ySize);
        }
        for(let y = 0; y <= this.#ySize; y++){
          line(0, y * this.#gridResolution, this.#gridResolution * this.#xSize, y * this.#gridResolution);
        }
      }
  
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      for(let x = 0; x < this.#xSize; x++){
        for(let y = 0; y < this.#ySize; y++){
          if(!this.positionEmpty(x, y)){
            stroke(this.#board[x][y].getColor());
            fill(this.#board[x][y].getColor());
            ellipse((this.#gridResolution * x) + (this.#gridResolution / 2), (this.#gridResolution * y) + (this.#gridResolution / 2), this.#gridResolution / 1.5);
            if(this.#textEnabled){
              textSize(this.#gridResolution / 4);
              fill(0);
              stroke(0);
              text(String(this.#board[x][y].value), (this.#gridResolution * x) + (this.#gridResolution / 2), (this.#gridResolution * y) + (this.#gridResolution / 2));
            }
          }
        }
      }
    }
  
    findValidPosition(){ // rewrite this lol
      for(let i = 0; i < 500; i++){
        let x = Math.floor(random(this.#xSize));
        let y = Math.floor(random(this.#ySize));
        if(this.positionEmpty(x, y)){
          return(new Position(x, y));
        }
      }
      return false;
    }
  
    positionEmpty(x, y){
      if(this.#board[x][y] == 0){
        return true;
      }
      else{
        return false;
      }
    }
  
    move(direction){
      this.movePieces(direction);
    }
  
    movePieces(direction){ // abstract? probably doable but this works fine for now
      if(direction == 0){ // LEFT
        for(let i = 0; i < this.#ySize; i++){ // per row
          let lastPosition = -1;
          let lastValue = -1;
          for(let j = 0; j < this.#xSize; j++){ // per column
            if(!this.positionEmpty(j, i)){
              if(this.#board[j][i].value == lastValue){
                // this.animateMove(j, i, lastPosition, i);
                this.#board[j][i] = 0;
                this.#board[lastPosition][i] = new Piece(lastValue * 2);
                lastValue = lastValue * 2;
                this.#score += lastValue;
                this.#spacesFree += 1;
              }
              else{
                lastValue = this.#board[j][i].value;
                this.#board[lastPosition + 1][i] = new Piece(this.#board[j][i].value);
                if(j != lastPosition + 1){
                  // this.animateMove(j, i, lastPosition + 1, i);
                  this.#board[j][i] = 0;
                }
                lastPosition += 1;
              }
            }
          }
        }
      }
      else if(direction == 1){ // RIGHT
        for(let i = 0; i < this.#ySize; i++){ // per row
          let lastPosition = this.#xSize;
          let lastValue = -1;
          for(let j = 0; j < this.#xSize; j++){ // per column
            if(!this.positionEmpty(this.#xSize - 1 - j, i)){
              if(this.#board[this.#xSize - 1 - j][i].value == lastValue){
                // this.animateMove(this.#xSize - 1 - j, i, lastPosition, i);
                this.#board[this.#xSize - 1 - j][i] = 0;
                this.#board[lastPosition][i] = new Piece(lastValue * 2);
                lastValue = lastValue * 2;
                this.#score += lastValue;
                this.#spacesFree += 1;
              }
              else{
                lastValue = this.#board[this.#xSize - 1 - j][i].value;
                this.#board[lastPosition - 1][i] = new Piece(this.#board[this.#xSize - 1 - j][i].value);
                if(this.#xSize - 1 - j != lastPosition - 1){
                  // this.animateMove(this.#xSize - 1 - j, i, lastPosition - 1, i);
                  this.#board[this.#xSize - 1 - j][i] = 0;
                }
                lastPosition -= 1;
              }
            }
          }
        }
      }
      else if(direction == 2){ // UP
        for(let i = 0; i < this.#xSize; i++){ // per column
          let lastPosition = -1;
          let lastValue = -1;
          for(let j = 0; j < this.#ySize; j++){ // per row
            if(!this.positionEmpty(i, j)){
              if(this.#board[i][j].value == lastValue){
                // this.animateMove(i, j, i, lastPosition);
                this.#board[i][j] = 0;
                this.#board[i][lastPosition] = new Piece(lastValue * 2);
                lastValue = lastValue * 2;
                this.#score += lastValue;
                this.#spacesFree += 1;
              }
              else{
                lastValue = this.#board[i][j].value;
                this.#board[i][lastPosition + 1] = new Piece(this.#board[i][j].value);
                if(j != lastPosition + 1){
                  // this.animateMove(i, j, i, lastPosition + 1);
                  this.#board[i][j] = 0;
                }
                lastPosition += 1;
              }
            }
          }
        }
      }
      else if(direction == 3){ // DOWN
        for(let i = 0; i < this.#xSize; i++){ // per column
          let lastPosition = this.#ySize;
          let lastValue = -1;
          for(let j = 0; j < this.#ySize; j++){ // per row
            if(!this.positionEmpty(i, this.#ySize - 1 - j)){
              if(this.#board[i][this.#ySize - 1 - j].value == lastValue){
                // this.animateMove(i, this.#ySize - 1 - j, i, lastPosition);
                this.#board[i][this.#ySize - 1 - j] = 0;
                this.#board[i][lastPosition] = new Piece(lastValue * 2);
                lastValue = lastValue * 2;
                this.#score += lastValue;
                this.#spacesFree += 1;
              }
              else{
                lastValue = this.#board[i][this.#ySize - 1 - j].value;
                this.#board[i][lastPosition - 1] = new Piece(this.#board[i][this.#ySize - 1 - j].value);
                if(this.#ySize - 1 - j != lastPosition - 1){
                  // this.animateMove(i, this.#ySize - 1 - j, i, lastPosition - 1);
                  this.#board[i][this.#ySize - 1 - j] = 0;
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