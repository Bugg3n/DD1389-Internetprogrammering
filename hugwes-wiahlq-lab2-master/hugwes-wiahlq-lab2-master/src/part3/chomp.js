function chomp(matrix, stringRow, stringColumn) {
  const column = parseInt(stringColumn, 10);
  const row = parseInt(stringRow, 10);
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

function selectBlock(matrix, row, col) {
  const newMatrix = chomp(matrix, row, col);
  document.getElementById("gameboardHolder").innerHTML = "";
  const text = document.getElementById("message").innerText;
  const turn = parseInt(text.slice(7, 8), 10);
  if (checkWinner(newMatrix)) {
    document.getElementById("message").innerText = `The winner is player ${
      (turn % 2) + 1
    }!`;
  } else {
    document.getElementById("message").innerText = `Player ${
      (turn % 2) + 1
    } turn to select!`;
  }
  return newMatrix;
}

function printChocolateBar(matrix) {
  const currentDiv = document.getElementById("gameboardHolder");
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      const btn = document.createElement("BUTTON");
      btn.setAttribute("row", i);
      btn.setAttribute("col", j);
      btn.innerHTML = matrix[i][j];
      currentDiv.appendChild(btn);
    }
    currentDiv.innerHTML += "<br>";
  }

  // Attach event listeners to all buttons after they have been added to the DOM
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    if (
      !(
        button.getAttribute("row") === "0" && button.getAttribute("col") === "0"
      )
    ) {
      button.addEventListener("click", () => {
        const newMatrix = selectBlock(
          matrix,
          button.getAttribute("row"),
          button.getAttribute("col")
        );
        printChocolateBar(newMatrix);
      });
    }
  });
}

function createChocolateBar(rows, columns) {
  if (rows > 0 && columns > 0) {
    const matrix = [];
    let num = 11;
    for (let i = 0; i < rows; i += 1) {
      matrix[i] = [];
      for (let j = 0; j < columns; j += 1) {
        matrix[i][j] = num;
        num += 1;
      }
    }
    matrix[0][0] = "P&nbsp";
    return matrix;
  }
  return null;
}

const matrix = createChocolateBar(5, 5);
document.getElementById("message").innerText = `Player 1 turn to select!`;
printChocolateBar(matrix);
