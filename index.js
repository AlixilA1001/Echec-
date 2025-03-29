
// ------------------------------------------------------------------------------------------------------------------------------------//

const {Socket}=require('socket.io');
const express= require('express');
const app= express();
const http= require('http').createServer(app);
const path= require('path');
const port=8000;

const io= require('socket.io')(http);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Pere.html'));
});
app.get('/Partie',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/LienPartie.html'));
});
app.get('/Ordi',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Ordi.html'));
});
app.get('/Accueil',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/pageAccueil.html'));
});
// app.get('/Historique',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Historique.html'));
// });
app.get('/Analyse',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Analyse.html'));
});

// app.get('/Connexion',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Connexion.html'));
// });

// app.get('/Inscription',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/inscription.html'));
// });

app.get('/Pere',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Pere.html'));
});

app.get('/game',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/game.html'));
});

// app.get('/Historique2',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Historique2Partie.html'));
// });

app.get('/Room', (req, res) => {
    res.sendFile(`${__dirname}/html/room.html`);
  });
// Fonction pour générer un ID de salle aléatoire
function generateRoomId() {
  return Math.random().toString(36).substring(2, 12);
}

const maxClient = 2; // Limite max de clients par salle
const rooms = new Map(); // Map pour stocker les salles

io.on('connection', (socket) => {
  
  let JoinRoom = false;

  // Si une salle est disponible, la rejoindre
  if (rooms.size > 0) {
    let FRoomId;
    let FRoomSize = 100;

    for (const [roomId, clients] of rooms.entries()) {
      if (clients.size < maxClient && clients.size < FRoomSize) {
        FRoomId = roomId;
        FRoomSize = clients.size;
      }
    }

    if (FRoomId){
      const clients = rooms.get(FRoomId);

      // Vérifier si le nombre de clients dans la salle est inférieur à la limite (maxClient)
      if (clients.size < maxClient) {
        socket.join(FRoomId);
        clients.add(socket.id);
        const clientCount = clients.size;
          // Attribuer la couleur au premier client qui rejoint la salle
          if (clientCount === 1){
            assignedColor = 'white';

            socket.emit('assignColor', assignedColor); // Envoyer la couleur attribuée au client
            console.log(socket.id, assignedColor)
          
          } else if (clientCount === 2){
            assignedColor = 'black';
            socket.emit('assignColor', assignedColor); // Envoyer la couleur attribuée au client
            console.log(socket.id, assignedColor)
            io.to(FRoomId).emit('redirectClients', '/game');
          }
        // // Si il y a 2 clients dans la salle, rediriger les utilisateurs vers la partie suivante.
        // if (clientCount === maxClient){
        //   io.to(FRoomId).emit('redirectClients', '/game');
        // }
        JoinRoom = true;
      }
    }
  }

  // Si aucune salle n'est disponible, créer une nouvelle salle
  if (!JoinRoom){
    const newRoomId = generateRoomId();
    const clients = new Set();
    clients.add(socket.id);
    rooms.set(newRoomId, clients);
    socket.join(newRoomId);
    assignedColor = 'white'; // Attribuer la couleur blanche au premier utilisateur
    socket.emit('assignColor', assignedColor); // Envoyer la couleur attribuée au client
    console.log(socket.id,assignedColor)
  }

  // Gérer les événements de déconnexion
  socket.on('disconnect', () => {
    // Retirer le client de la salle lorsqu'il se déconnecte
    for (const [roomId, clients] of rooms.entries()){
      if (clients.has(socket.id)){
        clients.delete(socket.id);
        if (clients.size === 0){
          // Si la salle est vide après la déconnexion, la supprimer
          rooms.delete(roomId);
        }
        break;
      }
    }
  });

  // --------------------- Socket, envoi les messages, et les coups.--------------------------
  socket.on('chat message',(msg)=>{
    console.log('message:' + msg);
    const roomId = getRoomBySocketId(socket.id);
    if (roomId) {
        io.to(roomId).emit('chat message', msg);
    }
  });
    
  socket.on('move',(data) => {
    const roomId = getRoomBySocketId(socket.id);
        io.to(roomId).emit('move', data);
    // }
  // }
});

//   // Timer blanc
//   socket.on('updateWhiteTimer', (data) => {
//     const roomId = getRoomBySocketId(socket.id);
// // Emettre temps Blanc
//     io.to(roomId).emit('updateWhiteTimer', data);
//   });
//   // Timer Noir
//   socket.on('updateBlackTimer', (data) => {
//     const roomId = getRoomBySocketId(socket.id);


});
// Fonction pour obtenir l'ID de la salle à partir du socketID
function getRoomBySocketId(socketId) {
for (const [roomId, clients] of rooms.entries()){
    if (clients.has(socketId)){
        return roomId;
    }
}
return null;
}

http.listen(8000,function(){
    console.log(`server runnig on port ${port} : http://localhost:${port}/`);
})

