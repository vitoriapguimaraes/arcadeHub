import { useState, useEffect } from "react";
import { RefreshCw, Play, Trophy, XCircle, ArrowLeft } from "lucide-react";
import "./Hangman.css";

// Simple accent removal for comparison
const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const Hangman = () => {
  const [categoriesData, setCategoriesData] = useState(null);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [gameState, setGameState] = useState({
    status: "loading", // loading, select_category, playing, won, lost
    word: "",
    category: "",
    lettersChosen: [],
    lettersWrong: [],
    mistakes: 0,
    maxMistakes: 6,
  });

  // Fetch words on mount
  useEffect(() => {
    fetch("/hangman_words.json")
      .then((res) => res.json())
      .then((data) => {
        setCategoriesData(data);
        setGameState((prev) => ({ ...prev, status: "select_category" }));
      })
      .catch((err) => {
        console.error("Failed to load words:", err);
      });
  }, []);

  const selectCategory = (category) => {
    if (!categoriesData) return;
    const words = categoriesData[category];
    const randomWord = words[Math.floor(Math.random() * words.length)];

    setGameState({
      status: "playing",
      word: randomWord.toLowerCase(),
      category: category.toUpperCase(),
      lettersChosen: [],
      lettersWrong: [],
      mistakes: 0,
      maxMistakes: 6,
    });
  };

  const resetGame = () => {
    setGameState((prev) => ({ ...prev, status: "select_category" }));
  };

  const restartCurrentCategory = () => {
    if (!gameState.category) return resetGame();
    const catKey = gameState.category.toLowerCase();
    selectCategory(catKey);
  };

  const resetSession = () => {
    setScore({ wins: 0, losses: 0 });
    setGameState((prev) => ({
      ...prev,
      status: "select_category",
      category: "",
    }));
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
      return newLettersChosen.some((l) => normalize(l) === normChar);
    });

    const isLost = newMistakes >= gameState.maxMistakes;

    let newStatus = "playing";
    if (isWon) {
      newStatus = "won";
      setScore((s) => ({ ...s, wins: s.wins + 1 }));
    }
    if (isLost) {
      newStatus = "lost";
      setScore((s) => ({ ...s, losses: s.losses + 1 }));
    }

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

  // Loading Screen
  if (gameState.status === "loading") {
    return (
      <div className="hangman-container">
        <div className="loader">Carregando banco de palavras...</div>
      </div>
    );
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const displayWord = getDisplayWord();

  return (
    <div className="hangman-container">
      {/* Persistent Header */}
      <div className="start-header-row">
        <h1 className="game-title">Jogo da Forca</h1>
        <p className="start-instruction">
          {gameState.status === "select_category"
            ? "Escolha uma categoria para começar:"
            : "Boa sorte!"}
        </p>
        <div className="session-score-header">
          <span>Sessão: </span>
          <span className="win-count">
            <Trophy size={16} /> {score.wins}
          </span>
          <span className="loss-count">
            <XCircle size={16} /> {score.losses}
          </span>
          <button
            onClick={resetSession}
            className="btn-reset-session"
            title="Resetar Sessão"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Persistent Category Selection & Game Status */}
      <div className="category-status-row">
        <div
          className={`category-grid ${
            gameState.status !== "select_category" ? "compact" : ""
          }`}
        >
          {categoriesData &&
            Object.keys(categoriesData).map((cat) => (
              <button
                key={cat}
                className={`btn-category ${
                  gameState.category === cat.toUpperCase() ? "active" : ""
                }`}
                onClick={() => selectCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
        </div>

        {/* Game Status Notification (Right Side) */}
        {(gameState.status === "won" || gameState.status === "lost") && (
          <div className={`game-result-badge ${gameState.status}`}>
            <div className="result-info">
              <strong>
                {gameState.status === "won" ? "Vitória!" : "Derrota!"}
              </strong>
              <span className="result-text">
                {gameState.status === "won"
                  ? "Muito bem!"
                  : `Era: ${gameState.word.toUpperCase()}`}
              </span>
            </div>
            <button
              onClick={() => selectCategory(gameState.category.toLowerCase())}
              className="btn-play-again-mini"
              title="Jogar Novamente nesta Categoria"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Game Content - Visible when playing or finished */}
      {gameState.status !== "select_category" && (
        <div className="game-content animate-fade-in">
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
                <line
                  x1="140"
                  y1="90"
                  x2="140"
                  y2="150"
                  className="body-part"
                />
              )}
              {gameState.mistakes >= 3 && (
                <line
                  x1="140"
                  y1="100"
                  x2="110"
                  y2="130"
                  className="body-part"
                />
              )}
              {gameState.mistakes >= 4 && (
                <line
                  x1="140"
                  y1="100"
                  x2="170"
                  y2="130"
                  className="body-part"
                />
              )}
              {gameState.mistakes >= 5 && (
                <line
                  x1="140"
                  y1="150"
                  x2="120"
                  y2="190"
                  className="body-part"
                />
              )}
              {gameState.mistakes >= 6 && (
                <line
                  x1="140"
                  y1="150"
                  x2="160"
                  y2="190"
                  className="body-part"
                />
              )}
            </svg>

            <button
              onClick={restartCurrentCategory}
              className="btn-restart-round"
            >
              <RefreshCw size={16} /> Reiniciar
            </button>
          </div>

          <div className="play-area">
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
                    disabled={
                      gameState.status !== "playing" || isChosen || isWrong
                    }
                    className={`key-btn ${statusClass}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hangman;
