const socket=io(); 
              
      $(function(){
          const Utilisateur1="Gabriel";
          $("form").submit(function(e){
              e.preventDefault();
              socket.emit("chat message",$("#msg").val() );
              $("#msg").val("");
              return false;
          });
          socket.on('chat message',function(msg){
              $("#messages").append($("<p>").text(Utilisateur1 +": "+msg));
              // $("#messages").append($("<br>"));
              Utilisateur1=(Utilisateur1==="Gabriel") ? "Alix":"Gabriel";
              const messages=document.querySelector('#messages');
              messages.scrollTop=messages.scrollHeight;
          });
      });
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
var board = null
var game = new Chess();
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
  
  
  
  function minimax(depth, game, player, alpha, beta) {
    if (depth === 0 || game.game_over()) {
      
      return evaluateBoard(game);
    }
    
    var possibleMoves = game.moves();
  
    /*if (player === 'w') {
      var bestMove = -Infinity;
      for (var i = 0; i < possibleMoves.length; i++) {
          game.move(possibleMoves[i]);
          bestMove = Math.max(bestMove, minimax(depth - 1, game, 'b', alpha, beta));
          game.undo();
          alpha = Math.max(alpha, bestMove);
          if (beta <= alpha) {
              break;
          }
      }
      return bestMove;
  } else {*/
      var bestMove = Infinity;
      for (var i = 0; i < possibleMoves.length; i++) {
          game.move(possibleMoves[i]);
          bestMove = Math.min(bestMove, minimax(depth - 1, game, player, alpha, beta));
          game.undo();
          beta = Math.min(beta, bestMove);  
          if (beta <= alpha) {
              break;
          }
      }
      return bestMove;
    //}
  }
  
  function evaluateBoard(game) {
    
    var board = game.fen();
   let score = 0;
  const pieceValues = {
    P: 1,
    N: 3,
    B: 3,
    R: 5,
    Q: 9,
    K: 100,
  };
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece in pieceValues) {
        if (piece === piece.toLowerCase()) {
          // Pièce noire
          score -= pieceValues[piece.toUpperCase()];
        } else {
          // Pièce blanche
          score += pieceValues[piece];
        }
      }
    }
  }
  return score;
    /*var value = 0;
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        var piece = board[i][j];
        if (piece) {
          value += getPieceValue(piece, "w");
          value -= getPieceValue(piece, "b");
        }
      }
    }

    return value;*/
  }
  
  // Renvoie la valeur d'une pièce.
  function getPieceValue(piece, isWhite) {
    
    if (piece.type === 'p') {
      return 1 + (isWhite ? pawnEvalWhite[piece.position] : pawnEvalBlack[piece.position]);
    } else if (piece.type === 'n') {
      return 3 + knightEval[piece.position];
    } else if (piece.type === 'b') {
      return 3 + (isWhite ? bishopEvalWhite[piece.position] : bishopEvalBlack[piece.position]);
    } else if (piece.type === 'r') {
      return 5 + (isWhite ? rookEvalWhite[piece.position] : rookEvalBlack[piece.position]);
    } else if (piece.type === 'q') {
      return 9 + evalQueen[piece.position];
    } else if (piece.type === 'k') {
      return 900 + (isWhite ? kingEvalWhite[piece.position] : kingEvalBlack[piece.position]);
    }
    return 1;
  }
  
  
  
  
  function findBestMove(game, depth,player) {
    // Récupère les mouvements possibles
    var possibleMoves = game.moves();
    var bestMove = null;
    var bestMoveValue = -Infinity;
  // game over
    if (possibleMoves.length === 0) return
    // Initialise les variables pour stocker les meilleurs mouvements
    
  
    // Évalue chaque mouvement possible 
    for (var i = 0; i < possibleMoves.length; i++) {
      // Effectue le mouvement
      var move = possibleMoves[i];
      game.move(move);
      
  
      // Calcule la valeur du mouvement en utilisant l'algorithme Minimax
      var moveValue = minimax(depth - 1, game, player,-Infinity,Infinity);
      
      // Annule le mouvement
      game.undo();
  
      // Si la valeur du mouvement est meilleure que le meilleur mouvement actuel, le remplace
      if (moveValue > bestMoveValue) {
        bestMoveValue = moveValue;
        bestMove = move;
        
      }
    }
    
    // Retourne le meilleur mouvement
    console.log("Le meilleur mouvement est retourné");
    return bestMove;
  }
  
  
function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}
function greySquare (square) {
  var $square = $('#myBoard .square-' + square)
  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }
  $square.css('background', background)
}
function onDragStart (source, piece) {
  // Permet de ne pas prendre une pièce une fois que la partie est finie.
  if (game.game_over()) return false
  // seulement pour les blancs
  if (piece.search(/^b/) !== -1) return false
}

function onDrop (source, target) {
  removeGreySquares();

  // Regarde si le coup est autorisé.
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  // Si le coup est illégal, annule le coup.
  if (move === null) return 'snapback';

  // Met à jour l'état du jeu.
  updateStatus();

  // Envoie le coup joué au serveur.
  socket.emit('move', move);
  
  // Si la partie est terminée, arrête la fonction.
  if (game.game_over()) return;

  // Si c'est au tour de l'IA de jouer.
  if (game.turn() === 'b') {

    console.log("Tour de l'ia");
    
    var depth = 3; // Profondeur de recherche minimax.
    
    
    var bestMove = findBestMove(game, depth, 'b');
    game.move(bestMove);
    
    updateStatus()
    socket.emit('move', bestMove);
    
    console.log("Le coup est joué");
  
  }
}
  
  function onMouseoverSquare (square, piece) {
    // Donne les coups possibles
    var moves = game.move({
      square: square,
      verbose: true
    })
  
    // Retourne si il n'y a pas de coup possible
    if (moves.length === 0) return
  
    // Fonction qui permet d'afficher les coups possibles en Gris
    greySquare(square)
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
  }
  //Quand la souris n'est plus sur la case enleve les coups possibles.
  function onMouseoutSquare (square, piece) {
    removeGreySquares()
  }
  //retorune la position de l'echiquier.
  function onSnapEnd () {
    board.position(game.fen())
  // Envoie le message au serveur que le plateau a été modifié.
    socket.emit('update_board', game.fen())
  }
  
  //Update le Status,
  function updateStatus() {
    var status = ''
    var moveColor = 'Blanc'
    if (game.turn() === 'b') {
      moveColor = 'Noir'
    }
    // Regarde si c'est Echec et mat.
    if (game.in_checkmate()) {
      status = 'Fin de Partie, ' + moveColor + ' Est en Echec et Mat.'
      alert("CHECKMATE");
      
    }
    // REgarde si c'est Egalité.
    else if (game.in_draw()){
      status = 'Fin de Partie,Egalité'
    }
    // Si la partie est toujours en jeu.
    else {
      status = moveColor + ' de jouer'
      // Si il y'a echec.
      if (game.in_check()){
        status += ', ' + moveColor + ' Est en Echec'
      }
  
    }
    //Met a jour le Status, le FEN et PGN et appelle la fonction listePP qui permet de mettre a jour les pièces capturés.
    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())
    listePP(game)
  }

  function abandonnerPartie() {
    var status = ''
    alert("Vous avez abandonné la partie.");
    var status = "Les blancs ont abandonné la partie."
    game.game_over = true;
    $status.html(status) 
  }
  
  // Renvoie au serveur la position des pièces grace au FEN.
  socket.on('move', function (move) {
    var resultat = game.move(move)
    if (resultat === null) return
    board.position(game.fen())
    updateStatus()
  })
  socket.on('update_board', function (fen) {
    board.position(fen)
  })
  
  //Configuration des options du plateau.
  var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare
  }
  board = Chessboard('myBoard', config)
  
  
  //Création de la Pendule.
  var color='';
  function ColorTimer(){
    var color='Blanc'
    if(game.turn()==='b'){
      var color='Noir'
    }
    if(color=='Blanc'){
      updateTimer();
    }
    else{
      blackupdateTimer();
    }
  }
  
  //pour ne pas avoir un overflow
  function pad(chiffre) {
        if (chiffre < 10) {
          return '0' + chiffre;
        }
        return chiffre;
      }
  
  //grace a la methode de SetInterval d'appeler la fonction ColorTimer toute les secondes.
  setInterval(ColorTimer,1000)
  // initialisation des variables
  
    let blacktot=600; //10 min 
    let whitetot =600;
    
    const blackmin = document.getElementById('blackminutes');
    const blacksec = document.getElementById('blackseconds');
    const whitemin = document.getElementById('minutes');
    const whitesec = document.getElementById('seconds');
  
    // Fonction qui permet de decrementer le temps total des blancs.
    function updateTimer() {
      if (whitetot >=0 && game.game_over() === false) {
        whitetot--;
        const minutes = Math.floor((whitetot/ 60));
        const seconds = whitetot - (minutes * 60);
        // Change l'affichage du minuteur
        whitemin.innerHTML = pad(minutes);
        whitesec.innerHTML = pad(seconds);
            //si le temps est écoulé.
      if(whitetot==-1){
          alert("Temps écoulé");
          whitemin.innerHTML = pad(00);
          whitesec.innerHTML = pad(00);
        }
      }
      return whitetot;
    }
      // Fonction qui permet de decrementer le temps total des Noirs.
  
      function blackupdateTimer() {
      if (blacktot >=0 && game.game_over() === false) {
        blacktot--;
        const bminutes = Math.floor((blacktot/ 60));
        const bseconds = blacktot - (bminutes * 60);
              // Change l'affichage du minuteur
  
        blackmin.innerHTML = pad(bminutes);
        blacksec.innerHTML = pad(bseconds);
        //si le temps est écoulé.
      if(blacktot==-1){
          alert("Temps écoulé");
          blackmin.innerHTML = pad(00);
          blacksec.innerHTML = pad(00);
        }
      }
      return blacktot;
    }
    function listePP(game){
      const piecesP = {
        'w': { 'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0 },
        'b': { 'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0 }
      }
    
      const history = game.history({ verbose: true })
    
      for (const move of history) {
        if (move.captured) {
          const piece = move.captured
          const color = move.color === 'w' ? 'b' : 'w'
          piecesP[color][piece]++;
        }
      }
  
      //BLANC
      const wp = piecesP['w']['p']
      document.getElementById('wP').innerHTML = wp
      const wn = piecesP['w']['n']
      document.getElementById('wN').innerHTML = wn
      const wb = piecesP['w']['b']
      document.getElementById('wB').innerHTML = wb  
      const wr = piecesP['w']['r']
      document.getElementById('wR').innerHTML = wr
      const wq = piecesP['w']['q']
      document.getElementById('wQ').innerHTML = wq
      //NOIR
  
      const bp = piecesP['b']['p']
      document.getElementById('bP').innerHTML = bp
      const bn = piecesP['b']['n']
      document.getElementById('bN').innerHTML = bn
      const bb = piecesP['b']['b']
      document.getElementById('bB').innerHTML = bb
      const br = piecesP['b']['r']
      document.getElementById('bR').innerHTML = br
      const bq = piecesP['b']['q']
      document.getElementById('bQ').innerHTML = bq
  
      return piecesP;
    }
  
    $('#flip').on('click', board.flip)
    $('#abandonner').on('click',abandonnerPartie)