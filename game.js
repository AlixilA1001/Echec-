
const socket = io();
const roomId = window.location.pathname.split("/").pop();
let assignedColor = null;
let pseudo = '';
let intervalChrono = null;

const game = new Chess();
let board = null;

const $status = $('#status');
const $fen = $('#fen');
const $pgn = $('#pgn');

let blacktot = 600; // 10 minutes
let whitetot = 600;

const blackmin = document.getElementById('blackminutes');
const blacksec = document.getElementById('blackseconds');
const whitemin = document.getElementById('minutes');
const whitesec = document.getElementById('seconds');

// ======== Fonctions Timer =========

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function updateTimers() {
  if (game.game_over()) return;

  if (game.turn() === 'w') {
    whitetot--;
    whitemin.innerHTML = pad(Math.floor(whitetot / 60));
    whitesec.innerHTML = pad(whitetot % 60);
    if (whitetot <= 0) endGame('Blancs ont perdu au temps');
  } else {
    blacktot--;
    blackmin.innerHTML = pad(Math.floor(blacktot / 60));
    blacksec.innerHTML = pad(blacktot % 60);
    if (blacktot <= 0) endGame('Noirs ont perdu au temps');
  }
}

// ======== Socket.IO Communication =========

// 1. Joindre la room
socket.emit('joinRoom', roomId);

// 2. Demander sa couleur
socket.emit('getColor');

// 3. Réception de la couleur
socket.on('assignColor', (color) => {
  assignedColor = color;
  pseudo = assignedColor === 'white' ? 'Joueur Blanc' : 'Joueur Noir';
  console.log('Color assigned:', assignedColor);
});

// 4. Réception du coup adverse
socket.on('move', function (data) {
  const moveResult = game.move(data.move);
  if (moveResult !== null) {
    board.position(game.fen());
    updateStatus();
  }
});

// 5. Chat
$('#boutonEnvoyer').on('click', function () {
  const message = $('#msg').val().trim();
  if (message !== '') {
    socket.emit('chat message', { pseudo, message });
    $('#msg').val('');
  }
});

socket.on('chat message', function (data) {
  const $p = $('<p>').text(`${data.pseudo}: ${data.message}`);
  if (data.pseudo === 'Joueur Blanc') {
    $p.addClass('joueurBlanc');
  } else if (data.pseudo === 'Joueur Noir') {
    $p.addClass('joueurNoir');
  }
  $('#chatMessages').append($p);
  const chat = document.getElementById('chatMessages');
  chat.scrollTop = chat.scrollHeight;
});

$('#chatForm').on('submit', function (e) {
  e.preventDefault(); // Empêche le rechargement de la page

  const message = $('#msg').val().trim();
  if (message !== '') {
    socket.emit('chat message', { pseudo, message });
    $('#msg').val('');
  }
});

// ======== Plateau Chessboard.js =========

const config = {
  draggable: true,
  position: 'start',
  onDragStart,
  onDrop,
  onSnapEnd,
  onMouseoverSquare,
  onMouseoutSquare
};

board = Chessboard('myBoard', config);

// Drag only if correct player
function onDragStart(source, piece) {
  if (game.game_over()) return false;
  if (!assignedColor) return false;
  if ((game.turn() === 'w' && assignedColor !== 'white') ||
      (game.turn() === 'b' && assignedColor !== 'black')) return false;
}

// Déposer une pièce
function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  board.position(game.fen());
  updateStatus();

  socket.emit('move', { roomId, move });
}

function onSnapEnd() {
  board.position(game.fen());
}

function onMouseoverSquare(square) {
  const moves = game.moves({ square, verbose: true });
  if (moves.length === 0) return;
  greySquare(square);
  moves.forEach(m => greySquare(m.to));
}

function onMouseoutSquare(square) {
  removeGreySquares();
}

function greySquare(square) {
  const $square = $('#myBoard .square-' + square);
  const background = $square.hasClass('black-3c85d') ? '#696969' : '#a9a9a9';
  $square.css('background', background);
}

function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '');
}

// ======== Statuts et Fin de Partie =========

function updateStatus() {
  let moveColor = (game.turn() === 'w') ? 'Blanc' : 'Noir';
  let status = '';

  if (game.in_checkmate()) {
    status = `Échec et Mat. ${moveColor} perd !`;
    endGame(status);
  } else if (game.in_draw()) {
    status = `Partie Nulle`;
    endGame(status);
  } else {
    status = `${moveColor} de jouer`;
    if (game.in_check()) {
      status += `, en échec`;
    }
  }

  $status.html(status);
  $fen.html('FEN: ' + game.fen());
  $pgn.html('PGN: ' + game.pgn());
}

function endGame(message) {
  clearInterval(intervalChrono);
  game.game_over = () => true;
  document.getElementById('fin-partie').style.display = 'block';
  document.getElementById('fin-partie').innerHTML = message;
}

// ======== Boutons =========

$('#flip').on('click', board.flip);

$('#abandonner').on('click', function () {
  if (assignedColor) {
    socket.emit('chat message', { pseudo: pseudo, message: 'a abandonné la partie.' });
    endGame(`${pseudo} a abandonné.`);
  }
});

// ======== Timer Start =========

// Chrono démarre quand page chargée
$(document).ready(function () {
  intervalChrono = setInterval(updateTimers, 1000);
});