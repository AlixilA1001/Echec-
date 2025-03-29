document.addEventListener("DOMContentLoaded", function () {
    const lines = [
      "CHESS SYSTEM v1.0",
      "Chargement des pièces...",
      "Mise en beauté de la reine...",
      "Test psychotechnique des fous...",
      "Lancement du bétonnage de la tour droite...",
      "Connexion à la base...",
      "Système prêt."
    ];
  
    const output = document.getElementById("typed-output");
    const jouerLink = document.getElementById("jouer-link");
  
    let currentLine = 0;
    let currentChar = 0;
  
    function typeLine() {
      if (currentLine >= lines.length) {
        // Affiche le lien seulement après tout le texte tapé
        setTimeout(() => {
          jouerLink.style.display = 'inline-block';
        }, 350);
        return;
      }
  
      const line = lines[currentLine];
  
      if (currentChar < line.length) {
        output.textContent += line[currentChar];
        currentChar++;
        setTimeout(typeLine, 25);
      } else {
        output.textContent += "\n";
        currentLine++;
        currentChar = 0;
        setTimeout(typeLine, 400);
      }
    }
  
    typeLine();
  });