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
    return {success: true, message: "Move is valid"};
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
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };
  return { getBoard, dropToken, printBoard };
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
function gameController( // This controls the flow and state of the game's turns, as well as if anybody has won the game.
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
    //drop a token for the current player
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s token into column ${column} and row ${row}`
    );
    const result = board.dropToken(column, row, getActivePlayer().token);
    if (!result.success) {
      console.log(result.message);
      return; //Do not switch player if the move was not successful
    }
    //Check to find a winner and and win message
    //Switch player turn
    switchPlayerTurn();
    printNewRound();
  };
  printNewRound(); //Initial play game message
  //For the console version we will only use playRound
  //For the UI version, getActivePlayer
  return {
    playRound,
    getActivePlayer,
  };
}
const game = gameController();
