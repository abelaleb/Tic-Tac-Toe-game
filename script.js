//The gameBoard represents the state of the board
function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];
  //Create a 2d array that will represent the state of the game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const getBoard = () => board; //getting the entire board
  const isMoveValid = (column, row) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
      return {
        success: false,
        message: "Move out of bounds",
      };
    }
    if (board[row][column].getValue() !== 0)
      return { success: false, message: "Cell already occuiped" }; //Cell already occupied
    return { success: true, message: "Move is valid" };
  };
  const dropToken = (column, row, player) => {
    const validation = isMoveValid(column, row);
    if (!validation.success) {
      return validation;
    }
    board[row][column].addToken(player);
    return { success: true, message: "Token added successfully" };
  };
  // To print our board to the console.
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) =>
        cell.getValue() === 1 ? "X" : cell.getValue() === 2 ? "0" : "-"
      )
    );
    console.log(boardWithCellValues);
  };
  const checkWinner = () => {
    //Check rows
    for (let i = 0; i < rows; i++) {
      if (
        board[i][0].getValue() !== 0 &&
        board[i][0].getValue() === board[i][1].getValue() &&
        board[i][1].getValue() === board[i][2].getValue()
      ) {
        return true;
      }
    }
    //Check columns
    for (let j = 0; j < columns; j++) {
      if (
        board[0][j].getValue() !== 0 &&
        board[0][j].getValue() === board[1][j].getValue() &&
        board[1][j].getValue() === board[2][j].getValue()
      ) {
        return true;
      }
    } //Check diagonals
    if (
      board[0][0].getValue() !== 0 &&
      board[0][0].getValue() === board[1][1].getValue() &&
      board[1][1].getValue() === board[2][2].getValue()
    ) {
      return true;
    }
    if (
      board[0][2].getValue() !== 0 &&
      board[0][2].getValue() === board[1][1].getValue() &&
      board[1][1].getValue() === board[2][0].getValue()
    ) {
      return true;
    }
    return false;
  };
  const isBoardFull = () => {
    return board.every((row) => row.every((Cell) => Cell.getValue() !== 0));
  };
  return { getBoard, dropToken, printBoard, checkWinner, isBoardFull };
}
function Cell() {
  let value = 0; //Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  return {
    addToken,
    getValue,
  };
}
function gameController( // Flow and state of the game's turns, as well as if anybody has won the game.
  playerOneName = "player One",
  playerTwoName = "player Two"
) {
  const board = gameBoard();
  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];
  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s switchPlayerTurn.`);
  };
  const playRound = (column, row) => {
    //Check winner and win message
    if (!makeMove(column, row, getActivePlayer())) {
      return;
    }
    if (board.checkWinner()) {
      console.log(`${getActivePlayer().name} wins!`);
      return;
    }
    if (board.isBoardFull()) {
      console.log(`It's a draw!`);
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };
  const makeMove = (column, row, player) => {
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s token into column ${column} and row ${row}`
    ); //drop a token for the current player
    const result = board.dropToken(column, row, getActivePlayer().token);
    if (!result.success) {
      console.log(result.message);
      return false; //Do not switch player if the move was not successful
    }
    return true;
  };
  printNewRound(); //Initial play game message
  //For the console version we will only use playRound
  //For the UI version, getActivePlayer
  return {
    playRound,
    getActivePlayer,
  };
}
// const game = gameController();
function screenController() {
  const game = gameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const updateScreen = () => {
    boardDiv.textContent = ""; //clear board
    const board = game.getBoard(); //new version of the board and player turn
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column; //make sure column is clicked
    if (!selectedColumn) return;
    game.playRound(selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();
}
screenController();
