import { useState, useEffect } from "react";
import { RefreshCw, Play } from "lucide-react";
import "./Hangman.css";

const CATEGORIES = {
  frutas: [
    "morango",
    "banana",
    "laranja",
    "uva",
    "abacaxi",
    "kiwi",
    "amora",
    "melancia",
  ],
  animais: [
    "leão",
    "tigre",
    "elefante",
    "cachorro",
    "gato",
    "golfinho",
    "baleia",
    "aguia",
  ],
  países: [
    "brasil",
    "canadá",
    "japão",
    "austrália",
    "alemanha",
    "méxico",
    "argentina",
  ],
  cores: [
    "vermelho",
    "azul",
    "verde",
    "amarelo",
    "roxo",
    "laranja",
    "ciano",
    "magenta",
  ],
  objetos: [
    "cadeira",
    "mesa",
    "computador",
    "telefone",
    "lápis",
    "mochila",
    "janela",
  ],
};

// Simple accent removal for comparison
const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const Hangman = () => {
  const [gameState, setGameState] = useState({
    status: "start", // start, playing, won, lost
    word: "",
    category: "",
    lettersChosen: [],
    lettersWrong: [],
    mistakes: 0,
    maxMistakes: 6,
  });

  const startGame = () => {
    const categories = Object.keys(CATEGORIES);
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const words = CATEGORIES[randomCat];
    const randomWord = words[Math.floor(Math.random() * words.length)];

    setGameState({
      status: "playing",
      word: randomWord.toLowerCase(),
      category: randomCat.toUpperCase(),
      lettersChosen: [],
      lettersWrong: [],
      mistakes: 0,
      maxMistakes: 6,
    });
  };

  const makeGuess = (letter) => {
    if (gameState.status !== "playing") return;

    const normalizedLetter = normalize(letter);
    const normalizedWord = normalize(gameState.word);

    let newLettersChosen = [...gameState.lettersChosen];
    let newLettersWrong = [...gameState.lettersWrong];
    let newMistakes = gameState.mistakes;

    // Check if already guessed
    if (newLettersChosen.includes(letter) || newLettersWrong.includes(letter))
      return;

    const isCorrect = normalizedWord.includes(normalizedLetter);

    if (isCorrect) {
      newLettersChosen.push(letter);
    } else {
      newLettersWrong.push(letter);
      newMistakes++;
    }

    // Check Win/Loss
    const isWon = gameState.word.split("").every((char) => {
      const normChar = normalize(char);
      // If char is space or special, ignore or handle?
      // Assuming simple words for now.
      return newLettersChosen.some((l) => normalize(l) === normChar);
    });

    const isLost = newMistakes >= gameState.maxMistakes;

    let newStatus = "playing";
    if (isWon) newStatus = "won";
    if (isLost) newStatus = "lost";

    setGameState({
      ...gameState,
      lettersChosen: newLettersChosen,
      lettersWrong: newLettersWrong,
      mistakes: newMistakes,
      status: newStatus,
    });
  };

  // Derived display word
  const getDisplayWord = () => {
    if (!gameState.word) return [];
    return gameState.word.split("").map((char) => {
      const normChar = normalize(char);
      const isRevealed = gameState.lettersChosen.some(
        (l) => normalize(l) === normChar
      );
      return isRevealed || gameState.status === "lost" ? char : "_";
    });
  };

  if (gameState.status === "start") {
    return (
      <div className="hangman-container start-screen">
        <h1 className="game-title">Jogo da Forca</h1>
        <p>Descubra a palavra secreta!</p>
        <button onClick={startGame} className="btn-primary">
          <Play size={24} /> Começar Jogo
        </button>
      </div>
    );
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const displayWord = getDisplayWord();

  return (
    <div className="hangman-container game-screen">
      <div className="game-header">
        <span className="badge category-badge">
          Categoria: {gameState.category}
        </span>
        <span className="badge mistakes-badge">
          Erros: {gameState.mistakes} / {gameState.maxMistakes}
        </span>
      </div>

      <div className="hangman-visual">
        <svg viewBox="0 0 200 250" className="hangman-svg">
          <line x1="20" y1="230" x2="100" y2="230" className="gallows" />
          <line x1="60" y1="230" x2="60" y2="20" className="gallows" />
          <line x1="60" y1="20" x2="140" y2="20" className="gallows" />
          <line x1="140" y1="20" x2="140" y2="50" className="gallows" />

          {gameState.mistakes >= 1 && (
            <circle cx="140" cy="70" r="20" className="body-part" />
          )}
          {gameState.mistakes >= 2 && (
            <line x1="140" y1="90" x2="140" y2="150" className="body-part" />
          )}
          {gameState.mistakes >= 3 && (
            <line x1="140" y1="100" x2="110" y2="130" className="body-part" />
          )}
          {gameState.mistakes >= 4 && (
            <line x1="140" y1="100" x2="170" y2="130" className="body-part" />
          )}
          {gameState.mistakes >= 5 && (
            <line x1="140" y1="150" x2="120" y2="190" className="body-part" />
          )}
          {gameState.mistakes >= 6 && (
            <line x1="140" y1="150" x2="160" y2="190" className="body-part" />
          )}
        </svg>
      </div>

      <div className="word-display">
        {displayWord.map((char, i) => (
          <span
            key={i}
            className={`char ${char === "_" ? "hidden" : "visible"}`}
          >
            {char}
          </span>
        ))}
      </div>

      <div className="keyboard">
        {alphabet.map((letter) => {
          const isChosen = gameState.lettersChosen.includes(letter);
          const isWrong = gameState.lettersWrong.includes(letter);
          let statusClass = "";
          if (isChosen) statusClass = "correct";
          if (isWrong) statusClass = "wrong";

          return (
            <button
              key={letter}
              onClick={() => makeGuess(letter)}
              disabled={gameState.status !== "playing" || isChosen || isWrong}
              className={`key-btn ${statusClass}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {(gameState.status === "won" || gameState.status === "lost") && (
        <div className="game-over-modal">
          <h2>{gameState.status === "won" ? "Vitória!" : "Derrota!"}</h2>
          <p>
            {gameState.status === "won"
              ? "Parabéns! Você venceu!!!"
              : `A palavra era: ${gameState.word}`}
          </p>
          <button onClick={startGame} className="btn-primary">
            <RefreshCw size={20} /> Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default Hangman;
