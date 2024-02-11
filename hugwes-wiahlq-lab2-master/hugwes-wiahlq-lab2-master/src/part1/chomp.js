import readlineSync from "readline-sync";

function input(prompt) {
  return readlineSync.question(prompt);
}

function createChocolateBar(rows, columns) {
  if (rows > 0 && columns > 0) {
    const matrix = [];
    let num = 11;
    for (let i = 0; i < rows; i += 1) {
      matrix[i] = [];
      for (let j = 0; j < columns; j += 1) {
        matrix[i][j] = num.toString();
        num += 1;
      }
    }
    matrix[0][0] = "P ";
    return matrix;
  }
  return null;
}

function printChocolateBar(matrix) {
  let output = "";
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      output = `${output + matrix[i][j]} `;
    }
    console.log(output);
    output = "";
  }
}

function chomp(matrix, row, column) {
  if (column === 0) {
    matrix.splice(row, matrix.length);
  } else {
    for (let i = row; i < matrix.length; i += 1) {
      if (matrix[i].length > column) {
        matrix[i].splice(column, matrix[i].length);
      }
    }
  }
  return matrix;
}

function checkWinner(matrix) {
  if (matrix.length === 1 && matrix[0].length === 1) {
    return true;
  }
  return false;
}

function askCellNumber(matrix, message) {
  const array = [];
  let contains = false;
  const answer = input(message);
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      if (matrix[i][j] === answer) {
        contains = true;
        array[0] = i;
        array[1] = j;
        // gör en array
      }
    }
  }
  if (answer === "P") {
    contains = false;
  }
  if (contains === true) {
    return array;
  }
  console.log(
    "Fel val, ruta ",
    answer,
    " finns inte i spelplanen, försök igen!"
  );
  return askCellNumber(matrix);
}

const answer = input("Want to play Chomp? ");
if (answer === "yes") {
  let turn = 0;
  let row;
  let col;
  console.log(
    "Välkommen till spelet Chomp. \n\nInstruktioner: I spelet kommer du utmanas om att välja ett blocknummer från spelplanen. Det valda blocket och alla block under och till högre kommer att raderas. Spelet går ut på att undvika välja P, den spelare som väljer P förlorar och den andra spelare vinner."
  );

  let chocolateBar = createChocolateBar(6, 7);
  printChocolateBar(chocolateBar);

  while (!checkWinner(chocolateBar)) {
    let message = "";
    if (turn % 2 === 0) {
      message = "Första spelarens tur, välj en ruta: ";
    } else {
      message = "Andra spelarens tur, välj en ruta: ";
    }
    [row, col] = askCellNumber(chocolateBar, message);
    chocolateBar = chomp(chocolateBar, row, col);
    printChocolateBar(chocolateBar);
    turn += 1;
  }

  if (turn % 2 === 0) {
    console.log("Vinnaren är spelare 2!");
  } else {
    console.log("Vinnaren är spelare 1!");
  }
} else {
  console.log("Bye!");
}

/*
//createChocolateBar
console.log( createChocolateBar(2,6));
console.log( createChocolateBar(0 ,0));
console.log( createChocolateBar(-1,-1));

//print printChocolateBar
printChocolateBar( [  [ '11', '12', '13', '14', '15', '16' ], [ '21', '22', '23', '24', '25', '26' ] ] );
printChocolateBar( [  [ 'a', 'b', 'c' ], [ 'd' ],['e'] ] );

//chomp
console.log( chomp([  [ '11', '12', '13', '14', '15', '16' ], [ '21', '22', '23', '24', '25', '26' ] ], 0, 1));
console.log( chomp([  [ '11', '12', '13', '14', '15', '16' ], [ '21', '22', '23', '24', '25', '26' ] ], 1, 2));

//checkWinner
console.log( checkWinner([['11']]) );  // tre
console.log( checkWinner([ ['11', '12']]) );  // false
console.log( checkWinner([ ['11'], ['21']]) );  // false

//askCellNumber

printChocolateBar( [  [ '11', '12', '13', '14', '15', '16' ], [ '21', '22', '23', '24', '25', '26' ] ] );
printChocolateBar( [  [ 'a', 'b', 'c' ], [ 'd' ],['e'] ] );
var row;
var col;

[row, col] = askCellNumber([ ["11", "12", "13", "14"], ["21", "22", "23", "24"], ["31", "32", "33", "34"] ])
console.log(row,",",col)


*/
