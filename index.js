
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
const rooms = new Map();        
const socketToRoom = new Map(); 
const socketToColor = new Map();

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