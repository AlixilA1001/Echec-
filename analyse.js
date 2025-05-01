// === Variables globales ===
var whiteSquareGrey = '#a9a9a9';
var blackSquareGrey = '#696969';
var board = null;
var game = new Chess();
var $status = $('#status');
var $fen = $('#fen');
var $pgn = $('#pgn');
var pgnOriginal = '';
var allMoves = [];
var currentMove = 0;

// === Fonctions de survol ===
function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '');
}

function greySquare(square) {
  var $square = $('#myBoard .square-' + square);
  var background = $square.hasClass('black-3c85d') ? blackSquareGrey : whiteSquareGrey;
  $square.css('background', background);
}

function onMouseoverSquare(square, piece) {
  var moves = game.moves({ square: square, verbose: true });
  if (moves.length === 0) return;
  greySquare(square);
  moves.forEach(move => greySquare(move.to));
}

function onMouseoutSquare(square, piece) {
  removeGreySquares();
}

// === Interaction utilisateur ===
function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop(source, target) {
  removeGreySquares();
  var move = game.move({ from: source, to: target, promotion: 'q' });
  if (move === null) return 'snapback';
  updateStatus();
}

function onSnapEnd() {
  board.position(game.fen());
}

// === Mise à jour interface ===
function updateStatus() {
  var moveColor = game.turn() === 'b' ? 'Noir' : 'Blanc';
  var status = game.in_checkmate() ? `Fin de Partie, ${moveColor} est en Échec et Mat.` :
               game.in_draw() ? 'Fin de Partie, Égalité' :
               `${moveColor} de jouer${game.in_check() ? ', en Échec' : ''}`;

  $status.text(status);
  $fen.text(game.fen());
  $pgn.text(game.pgn());
  listePP(game);
}

function listePP(game) {
  const piecesP = {
    'w': { 'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0 },
    'b': { 'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0 }
  };
  game.history({ verbose: true }).forEach(move => {
    if (move.captured) {
      const color = move.color === 'w' ? 'b' : 'w';
      piecesP[color][move.captured]++;
    }
  });

  ['P','N','B','R','Q'].forEach(letter => {
    $('#w'+letter).text(piecesP['w'][letter.toLowerCase()]);
    $('#b'+letter).text(piecesP['b'][letter.toLowerCase()]);
  });

  return piecesP;
}

// === Configuration de l'échiquier ===
var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare
};

board = Chessboard('myBoard', config);
updateStatus();

// === Contrôles ===
$('#loadPgnBtn').on('click', function () {
  var pgnText = $('#pgnText').val();
  var cleanPgn = pgnText.split('\n').filter(line => !line.startsWith('[')).join(' ').trim();
  var success = game.load_pgn(cleanPgn);

  if (success) {
    pgnOriginal = cleanPgn;
    allMoves = game.history();
    currentMove = 0;
    game.reset();
    board.start();
    updateStatus();
    $('#pgn').text(cleanPgn);
  } else {
    alert('Erreur : le fichier PGN est invalide.');
  }
});

$('#restart').on('click', function () {
  game.load('');
  board.start();
  pgnOriginal = '';
  allMoves = [];
  currentMove = 0;
  updateStatus();
});

$('#prev').on('click', function () {
  if (currentMove > 0) {
    game.undo();
    currentMove--;
    board.position(game.fen());
    updateStatus();
  }
});

$('#next').on('click', function () {
  if (currentMove < allMoves.length) {
    var move = allMoves[currentMove];
    game.move(move);
    currentMove++;
    board.position(game.fen());
    updateStatus();
  }
});

$('#flip').on('click', board.flip);