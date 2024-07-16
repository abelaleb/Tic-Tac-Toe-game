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
  const dropToken = (column, row, player) => {
    if(board[row][column].getValue() !== 0) return false; //Cell already occupied
    board[row][column].addToken(player);
    return true;
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
      `Dropping ${getActivePlayer().name}'s token into column ${column} and row ${row}`
    );
    board.dropToken(column,row, getActivePlayer().token);
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
