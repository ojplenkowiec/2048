class Piece{
    constructor(startingValue){
      this.value = startingValue;
    }
    getColor(){
      return color(this.getLog() * (255 / 11), 100, 255 - this.getLog() * (255 / 11), 255);
    }
    getLog(){
      let log = 1;
      let currentValue = this.value;
      while(currentValue > 2){
        currentValue = currentValue / 2;
        log += 1;
      }
      return log;
    }
  }