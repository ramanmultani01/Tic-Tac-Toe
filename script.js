const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const pvpBtn = document.getElementById('pvpBtn');
const pvcBtn = document.getElementById('pvcBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let currentPlayer = 'X';
let mode = null;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGame(selectedMode) {
  mode = selectedMode;
  pvpBtn.classList.toggle('active', mode === 'pvp');
  pvcBtn.classList.toggle('active', mode === 'pvc');
  resetGame(false);
  gameActive = true;
  statusText.textContent = `Turn: ${currentPlayer}`;
  if (mode === 'pvc' && currentPlayer === 'O') {
    setTimeout(computerMove, 400);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `${currentPlayer} wins! 🎉`;
    highlightWinningCells(currentPlayer);
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Turn: ${currentPlayer}`;

  if (mode === 'pvc' && currentPlayer === 'O') {
    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  if (!gameActive) return;
  const emptyIndices = board.map((val, i) => val === '' ? i : null).filter(i => i !== null);
  const randIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  board[randIndex] = 'O';
  cells[randIndex].textContent = 'O';

  if (checkWinner('O')) {
    statusText.textContent = "Computer wins! 🤖";
    highlightWinningCells('O');
    gameActive = false;
  } else if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = 'X';
    statusText.textContent = `Turn: ${currentPlayer}`;
  }
}

function checkWinner(player) {
  return winConditions.some(comb => comb.every(i => board[i] === player));
}

function highlightWinningCells(player) {
  winConditions.forEach(comb => {
    if (comb.every(i => board[i] === player)) {
      comb.forEach(i => cells[i].classList.add('winner'));
    }
  });
}

function resetGame(showMessage = true) {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = false;
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winner');
  });

  if (showMessage) {
    statusText.textContent = "Select a mode to begin!";
    pvpBtn.classList.remove('active');
    pvcBtn.classList.remove('active');
    mode = null;
  } else {
    gameActive = true;
    statusText.textContent = `Turn: ${currentPlayer}`;
  }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', () => resetGame(true));