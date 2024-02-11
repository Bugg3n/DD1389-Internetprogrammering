<template>
  <div class="chessboard">
    <div v-for="(column, columnIndex) in 8" :key="columnIndex" class="row">
      <div v-for="(row, rowIndex) in chessboard" :key="rowIndex" :class="getSquareClass(rowIndex, columnIndex)">
        <img :src="getPieceImage(row[columnIndex])" alt="images of chess pieces" @click="selectSquare(rowIndex, columnIndex)" >/>
      </div>
    </div>
  </div>
  <div>
    <h3> Playing as {{ playerName }} GameID: {{ gameID }}</h3>
  </div>
  <div>
    <h3>{{ turn }}'s turn</h3>
  </div>
  <div>
    <h3> You control {{ colorPlayer }} pieces</h3>
  </div>
</template>
  
  <script>
  // const express = require('express');
  export default {
    name: "ChessGame",
    data() {
      return {
        chessboard: null,
        // gameStarted: false,
        turn: "white",
        selectedSquare: null,
        selectedPiece: false,
        colorPlayer: null, // Måste ändras för den spelare som inte är svart på något sätt
        gameID: null,
        playerName: null,
      };
    },
    async mounted(){
      //console.log(this.$route.path.split("/"));
      [,,this.gameID,this.playerName] = this.$route.path.split("/");
      //console.log("gameID: " + this.gameID + " playername: " + this.playerName) 
      const { getters } = this.$store;
      const socket = getters.getSocket;
      await fetch('/api/gameboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId: this.gameID })
      })
        .then(response => response.json())
        .then(data => {
          // Handle the received game board data
          console.log(data.chessboard)
          this.chessboard = data.chessboard
          // Process the game board data as needed
        })
        .catch(error => {
          console.error('An error occurred:', error);
          // Handle the error case
        });
      //this.gameID = getters.getGameID;
      socket.emit("join", this.gameID)
      socket.off('move');
      // kommer bara aktiveras när motsåndarn gör ett move
      // gjort om så detta påverkar båda spelarna
      socket.on('move', (board) => {

        if (this.turn === "white"){
          this.turn = "black"
        } else {
          this.turn = "white"
        }
        
        this.chessboard = board;
        this.selectedSquare = null;
        this.selectedPiece = null;
        console.log("oponent succesfully moved piece");
        
        // titta ifall spelet är klart
        let isWhiteAlive = false;
        let isBlackAlive = false;

        for (let i = 0; i < 8; i+=1) {
          for (let j = 0; j < 8; j+=1) {
            if (this.chessboard[i][j] === 'k') {
              isWhiteAlive  = true;
            } else if (this.chessboard[i][j] === 'K') {
              isBlackAlive = true;
            }
          }
        }
        if (isWhiteAlive===false || isBlackAlive===false){
          // tittar ifall clienten vinner eller förlorar
          if (this.colorPlayer === "black" && isWhiteAlive===false || this.colorPlayer === "white" && isBlackAlive===false){
            socket.emit("win", this.gameID,this.playerName);
          } else {
            socket.emit("lose",this.gameID,this.playerName);
          }
          this.$router.push("/admin");
        }

    });
    socket.off("setColor")
    socket.on("setColor", (color) => {
      this.colorPlayer = color;
    });
    },
    methods: {
      diffrentColors(fromRow, fromColumn, toRow, toColumn){
        if (this.chessboard[fromRow][fromColumn]===" " || this.chessboard[toRow][toColumn]===" "){
          return false;
        }
        const isLower1 = this.chessboard[fromRow][fromColumn].toLowerCase() === this.chessboard[fromRow][fromColumn];
        const isLower2 = this.chessboard[toRow][toColumn].toLowerCase() === this.chessboard[toRow][toColumn];
        return (isLower1 !== isLower2);
      },

      getSquareClass(rowIndex, columnIndex) {
        return (rowIndex + columnIndex) % 2 === 0 ? 'square light' : 'square dark';
      },

      getPieceImage(piece) {
        // Provide the image URLs for each chess piece based on their representation
        const pieceImages = {
          'K': '/assets/king_black.png',
          'Q': '/assets/queen_black.png',
          'R': '/assets/rook_black.png',
          'N': '/assets/knight_black.png',
          'B': '/assets/bishop_black.png',
          'P': '/assets/pawn_black.png',
          'k': '/assets/king_white.png',
          'q': '/assets/queen_white.png',
          'r': '/assets/rook_white.png',
          'n': '/assets/knight_white.png',
          'b': '/assets/bishop_white.png',
          'p': '/assets/pawn_white.png',
        };
        if (piece in pieceImages) {
            if (this.isWhitePlayer) {
                // Ändra bild beroende på svart eller vit
                return pieceImages[piece];
            }
            return pieceImages[piece];
        }
        return undefined;
    },
    selectSquare(rowIndex, columnIndex) {
        console.log("trying to select square");
        // tittar att det är rätt spelare som gör drag
        if (this.colorPlayer===this.turn){
          // tittar ifall man tar upp en av rätt färg
          const piece = this.chessboard[rowIndex][columnIndex];
          // Check if the selected piece belongs to the current player
          const isPlayersPiece = ((piece.toLowerCase() === piece && this.colorPlayer === 'white') ||
                                (piece.toUpperCase() === piece && this.colorPlayer === 'black')) &&
                                 piece !== " ";
          // tar upp sin egna pjäs
          if (isPlayersPiece){
            this.selectedPiece = true;
            this.selectedSquare = { row: rowIndex, column: columnIndex };
          // om man flyttar en pjäs
          } else if (this.selectedPiece === true){
            this.movePiece(rowIndex, columnIndex);
            this.selectedPiece = false;
          }else{
            console.log("Select a piece first");
          }
        }
    },
    movePiece(rowIndex, columnIndex) {
        const {gameID} = this;
        const { getters } = this.$store
        const socket = getters.getSocket;
        const selectedRow = this.selectedSquare.row;
        const selectedColumn = this.selectedSquare.column;
        const piece = this.chessboard[selectedRow][selectedColumn];

        // Validate the move and update the chessboard
        if (this.isValidMove(selectedRow, selectedColumn, rowIndex, columnIndex, piece)) {
            this.chessboard[rowIndex][columnIndex] = piece;
            this.chessboard[selectedRow][selectedColumn] = ' ';
            // skicka över spelbrädet
            socket.emit('move', {
                move:{
                    from: { row: selectedRow, column: selectedColumn },
                    to: { row: rowIndex, column: columnIndex }
                },
                board: this.chessboard,
                gameID,
            });
        } else {
            // Handle invalid move
            console.log('Invalid move');
        }
        this.selectedSquare = null;
    },

    // mycket taget från chatgpt
    isValidMove(fromRow, fromColumn, toRow, toColumn, piece) {
      const absDeltaX = Math.abs(toColumn - fromColumn);
      const absDeltaY = Math.abs(toRow - fromRow);
      const deltaX = toColumn - fromColumn;
      const deltaY = toRow - fromRow;
      switch (piece) {        
        case 'p': // White Pawn
          // Moving forward
          console.log("white pawn")
          if (fromColumn === toColumn) {
            console.log("going one square forward")
            // White pawn moves one square forward
            if (deltaY === -1 && this.chessboard[toRow][toColumn] === ' ') {
              return true;
            }
            // White pawn moves two squares forward from starting position
            if (fromRow === 6 && deltaY === -2 && this.chessboard[toRow][toColumn] === ' ' && this.chessboard[toRow + 1][toColumn] === ' ') {
              return true;
            }
          }
          // Capturing diagonally
          if (absDeltaX === 1 && absDeltaY === 1) {
            // White pawn captures diagonally
            console.log("vi går diagonalt")
            if (deltaY === -1 && this.chessboard[toRow][toColumn] !== ' ' && this.diffrentColors(fromRow, fromColumn, toRow, toColumn)) {
              return true;
            }
          }
          break;

        case 'P': // Black Pawn
          // Moving forward
          console.log("black pawn")
          if (fromColumn === toColumn) {
            console.log("going one square forward")
            // Black pawn moves one square forward
            if (deltaY === 1 && this.chessboard[toRow][toColumn] === ' ') {
              return true;
            }
            // Black pawn moves two squares forward from starting position
            if (fromRow === 1 && deltaY === 2 && this.chessboard[toRow][toColumn] === ' ' && this.chessboard[toRow - 1][toColumn] === ' ') {
              return true;
            }
          }
          // Capturing diagonally
          if (absDeltaX === 1 && absDeltaY === 1) {
            // Black pawn captures diagonally
            if (deltaY === 1 && this.chessboard[toRow][toColumn] !== ' ' && this.diffrentColors(fromRow, fromColumn, toRow, toColumn)) {
              return true;
            }
          }
          break;

        case 'R': // Rook
        case 'r':
          // Moving horizontally or vertically
          if ((absDeltaX > 0 && absDeltaY === 0) || (absDeltaX === 0 && absDeltaY > 0)) {
            // Check if there are any obstructions along the path

            let stepX
            let stepY;

            if (deltaX === 0) {
              stepX = 0;
            } else if (deltaX > 0) {
              stepX = 1;
            } else {
              stepX = -1;
            }

            if (deltaY === 0) {
              stepY = 0;
            } else if (deltaY > 0) {
              stepY = 1;
            } else {
              stepY = -1;
            }

            for (let i = fromRow + stepY, j = fromColumn + stepX; i !== toRow || j !== toColumn; i += stepY, j += stepX) {
              if (this.chessboard[i][j] !== ' ') {
                return false; // Obstruction found
              }
            }
            return true; // No obstructions, valid move
          }
          break;

        case 'N': // Knight
        case 'n':
          // Moving in an L-shape
          if ((absDeltaX === 2 && absDeltaY === 1) || (absDeltaX === 1 && absDeltaY === 2)) {
            return true;
          }
          break;

        case 'B': // Bishop
        case 'b':
          // Moving diagonally
          if (absDeltaX === absDeltaY) {
            // Check if there are any obstructions along the diagonal path
            const stepX = deltaX > 0 ? 1 : -1;
            const stepY = deltaY > 0 ? 1 : -1;

            for (let i = fromRow + stepY, j = fromColumn + stepX; i !== toRow; i += stepY, j += stepX) {
              if (this.chessboard[i][j] !== ' ') {
                return false; // Obstruction found
              }
            }
            return true; // No obstructions, valid move
          }
          break;

        case 'Q': // Queen
        case 'q':
          // Moving horizontally, vertically, or diagonally
          if ((absDeltaX > 0 && absDeltaY === 0) || (absDeltaX === 0 && absDeltaY > 0) || absDeltaX === absDeltaY) {
            // Check if there are any obstructions along the path
            let stepX
            let stepY;

            if (deltaX === 0) {
              stepX = 0;
            } else if (deltaX > 0) {
              stepX = 1;
            } else {
              stepX = -1;
            }

            if (deltaY === 0) {
              stepY = 0;
            } else if (deltaY > 0) {
              stepY = 1;
            } else {
              stepY = -1;
            }

            for (let i = fromRow + stepY, j = fromColumn + stepX; i !== toRow || j !== toColumn; i += stepY, j += stepX) {
              if (this.chessboard[i][j] !== ' ') {
                return false; // Obstruction found
              }
            }
            return true; // No obstructions, valid move
          }
          break;

        case 'K': // King
        case 'k':
          // Moving one square in any direction
          if (absDeltaX <= 1 && absDeltaY <= 1) {
            return true;
          }
          break;
        default: 
          return null;

        }
      return null;
      }
    }
  }

    
  </script>
  
  <style scoped>
  .chessboard {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    width: 400px;
    height: 400px;
  }
  
  .row {
    display: flex;
  }
  
  .square {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
  }
  
  .square.light {
    background-color: #f0d9b5;
  }
  
  .square.dark {
    background-color: #b58863;
  }
  
  img {
    width: 80%;
    height: 80%;
  }
  </style>
  