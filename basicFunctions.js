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