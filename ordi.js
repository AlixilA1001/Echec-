var board = null;
var game = new Chess();

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '');
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square);
  var background = $square.hasClass('black-3c85d') ? '#696969' : '#a9a9a9';
  $square.css('background', background);
}

function onDragStart (source, piece) {
  if (game.game_over()) return false;
  if (piece.search(/^b/) !== -1) return false; // l'utilisateur joue blanc
}

function onDrop (source, target) {
  removeGreySquares();

  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  board.position(game.fen());
  updateStatus();
  updateCapturedPieces();

  // Laisser l'ordi jouer après un petit délai
  setTimeout(makeBotMove, 300);
}

function onMouseoverSquare (square) {
  var moves = game.moves({
    square: square,
    verbose: true
  });

  if (moves.length === 0) return;

  greySquare(square);
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
}

function onMouseoutSquare (square) {
  removeGreySquares();
}

function onSnapEnd () {
  board.position(game.fen());
}

function updateStatus () {
  var status = '';
  var moveColor = game.turn() === 'b' ? 'Noir' : 'Blanc';

  const resultDiv = document.getElementById("game-result");

  if (game.in_checkmate()) {
    status = 'Échec et mat. ' + moveColor + ' a perdu.';
    const winner = (moveColor === 'Blanc') ? 'Noir' : 'Blanc';
    resultDiv.innerHTML = ` Victoire de ${winner} !`;
  } else if (game.in_draw()) {
    status = 'Égalité.';
    resultDiv.innerHTML = ` Partie nulle.`;
  } else {
    status = moveColor + ' de jouer';
    resultDiv.innerHTML = ''; // pas de résultat affiché tant que la partie continue
    if (game.in_check()) {
      status += ', en échec';
    }
  }

  $('#status').html(status);
  $('#fen').html(game.fen());
  $('#pgn').html(game.pgn());
}

function makeBotMove() {
  if (game.game_over()) return;

  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return;

  // simple logique : capture > aléatoire
  const captures = possibleMoves.filter(move => move.includes('x'));
  const move = (captures.length > 0 ? captures : possibleMoves)[Math.floor(Math.random() * (captures.length > 0 ? captures.length : possibleMoves.length))];

  game.move(move);
  board.position(game.fen());
  updateStatus();
  updateCapturedPieces();
}
function updateCapturedPieces() {
  const captured = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
  };

  const history = game.history({ verbose: true });

  history.forEach(move => {
    if (move.captured) {
      const color = move.color === 'w' ? 'b' : 'w'; // la pièce capturée appartient à l'autre
      const piece = move.captured.toLowerCase();
      captured[color][piece]++;
    }
  });

  // Met à jour l'affichage HTML
  document.getElementById('wP').textContent = captured.w.p;
  document.getElementById('wN').textContent = captured.w.n;
  document.getElementById('wB').textContent = captured.w.b;
  document.getElementById('wR').textContent = captured.w.r;
  document.getElementById('wQ').textContent = captured.w.q;

  document.getElementById('bP').textContent = captured.b.p;
  document.getElementById('bN').textContent = captured.b.n;
  document.getElementById('bB').textContent = captured.b.b;
  document.getElementById('bR').textContent = captured.b.r;
  document.getElementById('bQ').textContent = captured.b.q;
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoverSquare: onMouseoverSquare,
  onMouseoutSquare: onMouseoutSquare,
  onSnapEnd: onSnapEnd
};

board = Chessboard('myBoard', config);
updateStatus();
updateCapturedPieces();


// Flip & Abandonner
$('#flip').on('click', board.flip);
$('#abandonner').on('click', function () {
  alert("Vous avez abandonné.");
  game = new Chess();
  board.position('start');
  updateStatus();
});