
// // ------------------------------------------------------------------------------------------------------------------------------------//

// const {Socket}=require('socket.io');
// const express= require('express');
// const app= express();
// const http= require('http').createServer(app);
// const path= require('path');
// const port=8000;

// const io= require('socket.io')(http);
// app.use(express.static(__dirname));

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Pere.html'));
// });
// app.get('/Partie',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/LienPartie.html'));
// });
// app.get('/Ordi',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Ordi.html'));
// });
// app.get('/Accueil',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/pageAccueil.html'));
// });
// app.get('/Historique',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Historique.html'));
// });
// app.get('/Analyse',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Analyse.html'));
// });

// app.get('/Connexion',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Connexion.html'));
// });

// app.get('/Inscription',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/inscription.html'));
// });

// app.get('/Pere',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Pere.html'));
// });

// app.get('/game',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/game.html'));
// });

// app.get('/Historique2',function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/Historique2Partie.html'));
// });

// app.get('/Room', (req, res) => {
//     res.sendFile(`${__dirname}/html/room.html`);
//   });


//   app.get("/createRoom", (req, res) => {
//     const roomId = generateRoomId();
//     res.json({ roomId }); // On renvoie un JSON { roomId: "..." }
//   });
// // const maxClient = 2; // Limite max de clients par salle
// // const rooms = new Map(); // Map pour stocker les salles

// // io.on('connection', (socket) => {
  
// //   let JoinRoom = false;

// //   // Si une salle est disponible, la rejoindre
// //   if (rooms.size > 0) {
// //     let FRoomId;
// //     let FRoomSize = 100;

// //     for (const [roomId, clients] of rooms.entries()) {
// //       if (clients.size < maxClient && clients.size < FRoomSize) {
// //         FRoomId = roomId;
// //         FRoomSize = clients.size;
// //       }
// //     }

// //     if (FRoomId){
// //       const clients = rooms.get(FRoomId);

// //       // Vérifier si le nombre de clients dans la salle est inférieur à la limite (maxClient)
// //       if (clients.size < maxClient) {
// //         socket.join(FRoomId);
// //         clients.add(socket.id);
// //         const clientCount = clients.size;
// //           // Attribuer la couleur au premier client qui rejoint la salle
// //           if (clientCount === 1){
// //             assignedColor = 'white';

// //             socket.emit('assignColor', assignedColor); // Envoyer la couleur attribuée au client
// //             console.log(socket.id, assignedColor)
          
// //           } else if (clientCount === 2){
// //             assignedColor = 'black';
// //             socket.emit('assignColor', assignedColor); // Envoyer la couleur attribuée au client
// //             console.log(socket.id, assignedColor)
// //             io.to(FRoomId).emit('redirectClients', '/game');
// //           }
// //         // // Si il y a 2 clients dans la salle, rediriger les utilisateurs vers la partie suivante.
// //         // if (clientCount === maxClient){
// //         //   io.to(FRoomId).emit('redirectClients', '/game');
// //         // }
// //         JoinRoom = true;
// //       }
// //     }
// //   }

// //   // Si aucune salle n'est disponible, créer une nouvelle salle
// //   if (!JoinRoom){
// //     const newRoomId = generateRoomId();
// //     const clients = new Set();
// //     clients.add(socket.id);
// //     rooms.set(newRoomId, clients);
// //     socket.join(newRoomId);
// //     assignedColor = 'white'; // Attribuer la couleur blanche au premier utilisateur
// //     socket.emit('assignColor', assignedColor); // Envoyer la couleur attribuée au client
// //     console.log(socket.id,assignedColor)
// //   }

// //   // Gérer les événements de déconnexion
// //   socket.on('disconnect', () => {
// //     // Retirer le client de la salle lorsqu'il se déconnecte
// //     for (const [roomId, clients] of rooms.entries()){
// //       if (clients.has(socket.id)){
// //         clients.delete(socket.id);
// //         if (clients.size === 0){
// //           // Si la salle est vide après la déconnexion, la supprimer
// //           rooms.delete(roomId);
// //         }
// //         break;
// //       }
// //     }
// //   });

// //   // --------------------- Socket, envoi les messages, et les coups.--------------------------
// //   socket.on('chat message',(msg)=>{
// //     console.log('message:' + msg);
// //     const roomId = getRoomBySocketId(socket.id);
// //     if (roomId) {
// //         io.to(roomId).emit('chat message', msg);
// //     }
// //   });
    
// //   socket.on('move',(data) => {
// //     const roomId = getRoomBySocketId(socket.id);
// //         io.to(roomId).emit('move', data);
// //     // }
// //   // }
// // });

// // //   // Timer blanc
// // //   socket.on('updateWhiteTimer', (data) => {
// // //     const roomId = getRoomBySocketId(socket.id);
// // // // Emettre temps Blanc
// // //     io.to(roomId).emit('updateWhiteTimer', data);
// // //   });
// // //   // Timer Noir
// // //   socket.on('updateBlackTimer', (data) => {
// // //     const roomId = getRoomBySocketId(socket.id);


// // });
// // // Fonction pour obtenir l'ID de la salle à partir du socketID
// // function getRoomBySocketId(socketId) {
// // for (const [roomId, clients] of rooms.entries()){
// //     if (clients.has(socketId)){
// //         return roomId;
// //     }
// // }
// // return null;
// // }

// // http.listen(8000,function(){
// //     console.log(`server runnig on port ${port} : http://localhost:${port}/`);
// // })
// // ---------- LOGIQUE SOCKET.IO ----------
// function generateRoomId() {
//   return Math.random().toString(36).substring(2, 10);
// }

// // roomId -> Set<socketId>
// const rooms = new Map();
// // socketId -> roomId
// const socketToRoom = new Map();
// // socketId -> "white" ou "black"
// const socketToColor = new Map();
// const maxClients = 2;

// // ======================
// // Routes Express
// // ======================
// app.get("/Partie", (req, res) => {
//   // Page où on clique "Créer un lien" ou on colle un lien
//   res.sendFile(path.join(__dirname, "LienPartie.html"));
// });

// // Route pour générer un roomId
// app.get("/createRoom", (req, res) => {
//   const roomId = generateRoomId();
//   res.json({ roomId });
// });

// // Salle d’attente /Room/:roomId
// app.get("/Room/:roomId", (req, res) => {
//   res.sendFile(path.join(__dirname, "room.html"));
// });

// // Page de jeu /game/:roomId
// app.get("/game/:roomId", (req, res) => {
//   res.sendFile(path.join(__dirname, "game.html"));
// });

// // ======================
// // Socket.IO
// // ======================
// io.on("connection", (socket) => {
//   console.log("Nouveau client connecté :", socket.id);

//   // 1) Un joueur rejoint une room
//   socket.on("joinRoom", (roomId) => {
//     // Vérifier si la room existe
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Set());
//     }
//     const clients = rooms.get(roomId);

//     // Vérifier si la salle n'est pas pleine
//     if (clients.size < maxClients) {
//       clients.add(socket.id);
//       socketToRoom.set(socket.id, roomId);
//       socket.join(roomId);

//       // Assigner la couleur
//       if (clients.size === 1) {
//         socketToColor.set(socket.id, "white");
//       } else {
//         socketToColor.set(socket.id, "black");
//       }

//       console.log(
//         `Socket ${socket.id} rejoint la room ${roomId} (total: ${clients.size} joueur(s))`
//       );

//       // Quand on atteint 2 joueurs => redirection
//       if (clients.size === 2) {
//         io.to(roomId).emit("redirectClients", `/game/${roomId}`);
//       }
//     } else {
//       // Salle pleine
//       socket.emit("roomFull", "Cette salle est déjà pleine !");
//     }
//   });

//   // 2) Un client demande "quelle est ma couleur ?"
//   socket.on("getColor", () => {
//     const color = socketToColor.get(socket.id);
//     socket.emit("assignColor", color);
//   });

//   // 3) Gérer un coup d’échecs
//   socket.on("move", (data) => {
//     // data = { roomId, move: { from, to, etc.} }
//     const { roomId, move } = data;
//     // Émettre ce coup à l'autre joueur
//     socket.to(roomId).emit("move", { roomId, move });
//   });

//   // 4) Déconnexion
//   socket.on("disconnect", () => {
//     const roomId = socketToRoom.get(socket.id);
//     if (roomId && rooms.has(roomId)) {
//       const clients = rooms.get(roomId);
//       clients.delete(socket.id);
//       if (clients.size === 0) {
//         rooms.delete(roomId);
//       }
//     }
//     socketToRoom.delete(socket.id);
//     socketToColor.delete(socket.id);

//     console.log(`Socket ${socket.id} déconnecté`);
//   });
// });

// http.listen(8000,function(){
//   console.log(`server runnig on port ${port} : http://localhost:${port}/`);
//    })



const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const port = 8000;
const { Server } = require('socket.io');
const io = new Server(http);

// Middleware pour servir tous les fichiers statiques
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
app.get('/Historique',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Historique.html'));
});
app.get('/Analyse',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Analyse.html'));
});

app.get('/Connexion',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Connexion.html'));
});

app.get('/Inscription',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/inscription.html'));
});

app.get('/Pere',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Pere.html'));
});

app.get('/game',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/game.html'));
});

app.get('/Historique2',function(req, res) {
    res.sendFile(path.join(__dirname + '/html/Historique2Partie.html'));
});

// app.get('/Room', (req, res) => {
//     res.sendFile(`${__dirname}/html/room.html`);
//   });


// Création d'un ID unique pour une salle
function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

// Route pour créer une room
app.get('/createRoom', (req, res) => {
  const roomId = generateRoomId();
  res.json({ roomId });
});

// Page salle d'attente
app.get('/Room/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/room.html'));
});

// Page de la partie d'échecs
app.get('/game/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/game.html'));
});

// =====================
// Socket.IO - Logique des rooms et du jeu
// =====================

// Structures pour suivre l'état des salles
const rooms = new Map();        // roomId -> Set de socket IDs
const socketToRoom = new Map(); // socketId -> roomId
const socketToColor = new Map(); // socketId -> 'white' ou 'black'

const maxClients = 2;

io.on('connection', (socket) => {
  console.log('Nouveau client connecté :', socket.id);

  // Lorsqu'un joueur rejoint une salle
  socket.on('joinRoom', (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    const clients = rooms.get(roomId);

    if (clients.size < maxClients) {
      clients.add(socket.id);
      socketToRoom.set(socket.id, roomId);
      socket.join(roomId);

      // Attribution des couleurs
      if (clients.size === 1) {
        socketToColor.set(socket.id, 'white');
      } else {
        socketToColor.set(socket.id, 'black');
      }

      console.log(`Socket ${socket.id} a rejoint la room ${roomId} (${clients.size} joueur(s))`);

      if (clients.size === 2) {
        io.to(roomId).emit('redirectClients', `/game/${roomId}`);
      }
    } else {
      socket.emit('roomFull', 'Cette salle est déjà pleine.');
    }
  });

  // Attribution de la couleur
  socket.on('getColor', () => {
    const color = socketToColor.get(socket.id);
    socket.emit('assignColor', color);
  });

  // Réception et transmission d'un coup
  socket.on('move', (data) => {
    const { roomId, move } = data;
    socket.to(roomId).emit('move', { move });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    const roomId = socketToRoom.get(socket.id);

    if (roomId && rooms.has(roomId)) {
      const clients = rooms.get(roomId);
      clients.delete(socket.id);

      if (clients.size === 0) {
        rooms.delete(roomId);
      }
    }

    socketToRoom.delete(socket.id);
    socketToColor.delete(socket.id);

    console.log(`Socket ${socket.id} déconnecté`);
  });

  // Chat
  socket.on('chat message', (msg) => {
    const roomId = socketToRoom.get(socket.id);
    if (roomId) {
      io.to(roomId).emit('chat message', msg);
    }
  });
});

// =====================
// Lancement du serveur
// =====================
http.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});