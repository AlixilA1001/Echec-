// Fonction socket.io permettant d'avoir un chat en Ligne.

const socket=io(); 
              
      $(function(){
          const Utilisateur1="Utilisateur 1";
          $("form").submit(function(e){
              e.preventDefault();

              socket.emit("chat message",$("#msg").val() );
              $("#msg").val("");
              return false;
          });
          socket.on('chat message',function(msg){
              $("#messages").append($("<p>").text(Utilisateur1 +": "+msg));
              // $("#messages").append($("<br>"));
              Utilisateur1=(Utilisateur1==="Utilisateur 1") ? "Utilisateur 2":"Utilisateur 1";
              const messages=document.querySelector('#messages');
              messages.scrollTop=messages.scrollHeight;
          });
          });

// -------------- Importation de la librairie Chessboard.js -------------------------------//
// initialisation des variables.
var whiteSquareGrey='#a9a9a9'
var blackSquareGrey='#696969'
var board=null
var game=new Chess()
var $status=$('#status')
var $fen=$('#fen')
var $pgn=$('#pgn')

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square=$('#myBoard .square-' + square)

  var background=whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background=blackSquareGrey
  }
  $square.css('background', background)
}

function onDragStart (source, piece){
  // Permet de ne pas prendre une pièce une fois que la partie est finie.
  if (game.game_over()) return false
  // Ou quand ce n'est pas a la couleur de jouer.
  // if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
  //     (game.turn() === 'b' && piece.search(/^w/) !== -1)){
    if ((game.turn() === 'w' && assignedColor !== 'white') ||(game.turn() === 'b' && assignedColor !== 'black')){

    return false
  }
}

  // if (game.game_over() || game.turn() !== currentColor) return false;
  let assignedColor = null;

  socket.on('assignColor', (color) => {
    console.log('Assigned color:', color);
    assignedColor = color; // Stockage de la valeur dans une variable
  });
  
function onDrop (source, target){
  removeGreySquares();
  var move=game.move({
    from: source,
    to: target,
    promotion: 'q'
    //Optionnel: il faut modifier pour avoir tous les choix possibles. ---------------------------
  });
  if (move === null) return 'snapback';
  updateStatus();
  // Envoie le coup joué uniquement dans la salle spécifique
  socket.emit('move', {move: move, room: 'roomid'});
}

function onMouseoverSquare (square, piece) {
  // Donne les coups possibles
  var moves=game.moves({
    square: square,
    verbose: true
  })

  // Retourne si il n'y a pas de coup possible
  if (moves.length === 0) return

  // Fonction qui permet d'afficher les coups possibles en Gris
  greySquare(square)
  for (var i=0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}
//Quand la souris n'est plus sur la case enleve les coups possibles.
function onMouseoutSquare (square, piece) {
  removeGreySquares()
}


function onSnapEnd () {
  board.position(game.fen());
  socket.emit('update_board', {fen: game.fen(), room: 'roomid'});
}

function abandonnerPartie() {
  var status = ''
  if(assignedColor === "white"){
    game.game_over = true;
    var status = "Les blancs ont abandonné la partie."
    $status.html(status)
    //endGame("noirs")
   
  }else{
    game.game_over = true;
    var status = "Les noirs ont abandonné la partie."
    $status.html(status)
    //endGame("blancs")
    document.getElementById("fin-partie").classList.remove("d-none");

  }
}

/*function endGame(player) {
  console.log("end game est appelé");
  if(game.in_draw()){
    
    var winnerText = document.getElementById("winner-text");
    winnerText.textContent ="Les joueurs on fait égalité";
  
    var winnerDiv = document.getElementById("winner");
    winnerDiv.style.display = "block";}
  else{
    
    alert("Partie terminée", {
      className: "alert alert-success",
      buttons: false,
    });}
    
  
}*/

//Update le Status,
function updateStatus() {
  var status=''
  var moveColor='Blanc'
  if (game.turn() === 'b') {
    moveColor='Noir'
  }
  // Regarde si c'est Echec et mat.
  if (game.in_checkmate()){
    status='Fin de Partie, ' + moveColor + ' Est en Echec et Mat.'
    document.getElementById("fin-partie").classList.remove("d-none");    
  }
  // REgarde si c'est Egalité.
  else if (game.in_draw()){
    status='Fin de Partie,Egalité'
    document.getElementById("fin-partie").classList.remove("d-none");
  }
  // Si la partie est toujours en jeu.
  else{
    status=moveColor + ' de jouer'
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

// Renvoie au serveur la position des pièces grace au FEN.

socket.on('move', function (data){
  var resultat=game.move(data.move);
  if (resultat === null) return;
  board.position(game.fen());
  updateStatus();
});

socket.on('update_board', function(data){
  board.position(data.fen);
});
//Configuration des options du plateau.
var config={
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare
}
board=Chessboard('myBoard', config)


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
  
  const blackmin=document.getElementById('blackminutes');
  const blacksec=document.getElementById('blackseconds');
  const whitemin=document.getElementById('minutes');
  const whitesec=document.getElementById('seconds');

  // Fonction qui permet de decrementer le temps total des blancs.
  function updateTimer() {
    if (whitetot >=0 && game.game_over() === false) {
      whitetot--;
      const minutes=Math.floor((whitetot/ 60));
      const seconds=whitetot - (minutes * 60);
      // Change l'affichage du minuteur
      whitemin.innerHTML=pad(minutes);
      whitesec.innerHTML=pad(seconds);
          //si le temps est écoulé.
    if(whitetot==-1){
        alert("Temps écoulé");
        whitemin.innerHTML=pad(00);
        whitesec.innerHTML=pad(00);
      }
    }
    return whitetot;
  }
    // Fonction qui permet de decrementer le temps total des Noirs.

    function blackupdateTimer() {
    if (blacktot >=0 && game.game_over() === false) {
      blacktot--;
      const bminutes=Math.floor((blacktot/ 60));
      const bseconds=blacktot - (bminutes * 60);
            // Change l'affichage du minuteur

      blackmin.innerHTML=pad(bminutes);
      blacksec.innerHTML=pad(bseconds);
      //si le temps est écoulé.
    if(blacktot==-1){
        alert("Temps écoulé");
        blackmin.innerHTML=pad(00);
        blacksec.innerHTML=pad(00);
      }
    }
    return blacktot;
  }
  function listePP(game){
    const piecesP={
      'w': { 'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0 },
      'b': { 'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0 }
    }
  
    const history=game.history({ verbose: true })
  
    for (const move of history) {
      if (move.captured) {
        const piece=move.captured
        const color=move.color === 'w' ? 'b' : 'w'
        piecesP[color][piece]++;
      }
    }

    //BLANC
    const wp=piecesP['w']['p']
    document.getElementById('wP').innerHTML=wp
    const wn=piecesP['w']['n']
    document.getElementById('wN').innerHTML=wn
    const wb=piecesP['w']['b']
    document.getElementById('wB').innerHTML=wb  
    const wr=piecesP['w']['r']
    document.getElementById('wR').innerHTML=wr
    const wq=piecesP['w']['q']
    document.getElementById('wQ').innerHTML=wq
    //NOIR

    const bp=piecesP['b']['p']
    document.getElementById('bP').innerHTML=bp
    const bn=piecesP['b']['n']
    document.getElementById('bN').innerHTML=bn
    const bb=piecesP['b']['b']
    document.getElementById('bB').innerHTML=bb
    const br=piecesP['b']['r']
    document.getElementById('bR').innerHTML=br
    const bq=piecesP['b']['q']
    document.getElementById('bQ').innerHTML=bq

    return piecesP;
  }

  $('#flip').on('click', board.flip)
  $('#abandonner').on('click',abandonnerPartie)