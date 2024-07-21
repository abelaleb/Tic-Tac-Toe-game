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
const declareWinner = (message) => {
  const winnerMessage = document.getElementById("winner-message");
  winnerMessage.textContent = message;

  const winnerDialog = document.getElementById("winner-dialog");
  winnerDialog.showModal();

  boardDiv.removeEventListener("click",clickHandlerBoard)
  disableBoard();
};

function gameController(
  declareWinner, // Flow and state of the game's turns, as well as if anybody has won the game.
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

  let getActivePlayer = () => activePlayer;

  const playRound = (column, row) => {
    //Check winner and win message
    if (!makeMove(column, row, getActivePlayer())) {
      return;
    }
    if (board.checkWinner()) {
      declareWinner(`${getActivePlayer().name} wins!`);
      return;
    }
    if (board.isBoardFull()) {
      declareWinner(`It's a draw!`);
      return;
    }
    switchPlayerTurn();
  };

  const makeMove = (column, row, player) => {
    const result = board.dropToken(column, row, player.token);
    if (!result.success) {
      declareWinner(result.message);
      return false; //Do not switch player if the move was not successful
    }
    return true;
  };
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function screenController() {
  let game = gameController(declareWinner);
  const playerTurnDiv = document.querySelector("#message");
  const boardDiv = document.querySelector(".board");
  const restartButton = document.querySelector("#restart-button");

  const updateScreen = () => {
    const board = game.getBoard(); //new version of the board and player turn
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    boardDiv.querySelectorAll(".field").forEach((cell, index) => {
      const row = Math.floor(index / 3);
      const column = index % 3;
      const cellValue = board[row][column].getValue();
      cell.textContent = cellValue === 1 ? "X" : cellValue === 2 ? "O" : "";
    });
  };

  const clickHandlerBoard = (e) => {
    const selectedField = e.target;
    const index = parseInt(selectedField.dataset.index);
    const row = Math.floor(index / 3);
    const column = index % 3;
    game.playRound(column, row);
    updateScreen();
  };
  const restartGame = () => {
    game = gameController(declareWinner);
    enableBoard();
    updateScreen();
  };

  function closeDialog() {
    const winnerDialog = document.getElementById("winner-dialog");
    winnerDialog.close();
    enableBoard();
  }
  const disableBoard = () => {
    boardDiv.querySelectorAll(".field").forEach((cell) => {
      cell.style.pointerEvents = "none";
    });
  };
  const enableBoard = () => {
    boardDiv.querySelectorAll(".field").forEach((cell) => {
      cell.style.pointerEvents = "auto";
    });
  };
  boardDiv.addEventListener("click", clickHandlerBoard);
  restartButton.addEventListener("click", restartGame);
  document
    .getElementById("close-dialog")
    .addEventListener("click", closeDialog);
  updateScreen();
}
screenController();
