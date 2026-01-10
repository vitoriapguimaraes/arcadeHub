import { useState, useEffect } from "react";
import { RefreshCw, Play, Trophy, XCircle, ArrowLeft } from "lucide-react";

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
      <div className="flex flex-col h-full w-full gap-4 items-center justify-center">
        <div className="font-bold text-lg text-primary animate-pulse">
          Carregando banco de palavras...
        </div>
      </div>
    );
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const displayWord = getDisplayWord();

  return (
    <div className="flex flex-col h-full w-full gap-4">
      {/* Persistent Header */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-8 p-4 bg-black/20 rounded-xl gap-4">
        <h1 className="text-primary font-bold text-2xl drop-shadow-[0_0_10px_rgba(255,137,6,0.3)]">
          Jogo da Forca
        </h1>
        <p className="text-text-secondary text-lg font-medium m-0 text-center">
          {gameState.status === "select_category"
            ? "Escolha uma categoria para começar:"
            : "Boa sorte!"}
        </p>
        <div className="flex gap-4 text-base text-text-secondary items-center bg-black/30 px-4 py-2 rounded-full whitespace-nowrap">
          <span>Sessão: </span>
          <span className="flex items-center gap-2 text-[#2cb67d]">
            <Trophy size={16} /> {score.wins}
          </span>
          <span className="flex items-center gap-2 text-tertiary">
            <XCircle size={16} /> {score.losses}
          </span>
          <button
            onClick={resetSession}
            className="btn-reset-session flex items-center p-1 rounded-full text-text-secondary transition-all hover:bg-white/10 hover:text-primary hover:rotate-180 ml-2 bg-transparent border-none cursor-pointer"
            title="Resetar Sessão"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Persistent Category Selection & Game Status */}
      <div className="flex items-center gap-4 mb-8 min-h-[64px] relative">
        <div
          className={`grid gap-3 w-full transition-all duration-300 ${
            gameState.status !== "select_category"
              ? "flex flex-nowrap overflow-x-auto py-[10px] px-[5px] mb-0 scrollbar-thin w-full pr-[240px]"
              : "grid-cols-[repeat(auto-fit,minmax(120px,1fr))]"
          }`}
        >
          {categoriesData &&
            Object.keys(categoriesData).map((cat) => (
              <button
                key={cat}
                className={`p-4 text-text-main rounded-xl text-lg cursor-pointer transition-all border border-text-secondary bg-card hover:bg-primary hover:text-white hover:-translate-y-1 hover:shadow-md ${
                  gameState.status !== "select_category"
                    ? "py-2 px-4 text-sm min-w-auto whitespace-nowrap rounded-full bg-transparent"
                    : ""
                } ${
                  gameState.category === cat.toUpperCase()
                    ? "bg-primary text-white border-primary"
                    : ""
                }`}
                onClick={() => selectCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
        </div>

        {/* Game Status Notification (Right Side) */}
        {(gameState.status === "won" || gameState.status === "lost") && (
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4 py-2 px-4 rounded-xl bg-card border animate-slide-in-right whitespace-nowrap z-10 shadow-lg text-white ${
              gameState.status === "won"
                ? "border-[#2cb67d] bg-[#2cb67d]/95"
                : "border-tertiary bg-[#ef4565]/95"
            }`}
          >
            <div className="flex flex-col text-sm">
              <strong className="text-base mb-[2px]">
                {gameState.status === "won" ? "Vitória!" : "Derrota!"}
              </strong>
              <span>
                {gameState.status === "won"
                  ? "Muito bem!"
                  : `Era: ${gameState.word.toUpperCase()}`}
              </span>
            </div>
            <button
              onClick={() => selectCategory(gameState.category.toLowerCase())}
              className="bg-primary text-white border-none p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all hover:scale-110 hover:shadow-glow-primary"
              title="Jogar Novamente nesta Categoria"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Game Content - Visible when playing or finished */}
      {gameState.status !== "select_category" && (
        <div className="flex flex-1 gap-8 items-start justify-center p-4 animate-fade-in flex-col md:flex-row md:items-start md:justify-center">
          <div className="bg-card p-8 rounded-2xl flex flex-col items-center shadow-md w-full md:w-auto">
            <svg viewBox="0 0 200 250" className="h-[250px] md:h-auto">
              <line
                x1="20"
                y1="230"
                x2="100"
                y2="230"
                className="stroke-text-main stroke-[4px] stroke-round"
              />
              <line
                x1="60"
                y1="230"
                x2="60"
                y2="20"
                className="stroke-text-main stroke-[4px] stroke-round"
              />
              <line
                x1="60"
                y1="20"
                x2="140"
                y2="20"
                className="stroke-text-main stroke-[4px] stroke-round"
              />
              <line
                x1="140"
                y1="20"
                x2="140"
                y2="50"
                className="stroke-text-main stroke-[4px] stroke-round"
              />

              {gameState.mistakes >= 1 && (
                <circle
                  cx="140"
                  cy="70"
                  r="20"
                  className="stroke-secondary stroke-[4px] fill-none stroke-round"
                />
              )}
              {gameState.mistakes >= 2 && (
                <line
                  x1="140"
                  y1="90"
                  x2="140"
                  y2="150"
                  className="stroke-secondary stroke-[4px] fill-none stroke-round"
                />
              )}
              {gameState.mistakes >= 3 && (
                <line
                  x1="140"
                  y1="100"
                  x2="110"
                  y2="130"
                  className="stroke-secondary stroke-[4px] fill-none stroke-round"
                />
              )}
              {gameState.mistakes >= 4 && (
                <line
                  x1="140"
                  y1="100"
                  x2="170"
                  y2="130"
                  className="stroke-secondary stroke-[4px] fill-none stroke-round"
                />
              )}
              {gameState.mistakes >= 5 && (
                <line
                  x1="140"
                  y1="150"
                  x2="120"
                  y2="190"
                  className="stroke-secondary stroke-[4px] fill-none stroke-round"
                />
              )}
              {gameState.mistakes >= 6 && (
                <line
                  x1="140"
                  y1="150"
                  x2="160"
                  y2="190"
                  className="stroke-secondary stroke-[4px] fill-none stroke-round"
                />
              )}
            </svg>
            <span className="mt-4 font-mono text-tertiary">
              Erros: {gameState.mistakes} / {gameState.maxMistakes}
            </span>

            <button
              onClick={restartCurrentCategory}
              className="mt-6 bg-transparent border-2 border-text-secondary text-text-secondary px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm transition-all hover:border-tertiary hover:text-tertiary hover:-translate-y-[2px]"
            >
              <RefreshCw size={16} /> Reiniciar
            </button>
          </div>

          <div className="flex flex-col items-center flex-1 max-w-[800px] gap-8 w-full">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {displayWord.map((char, i) => (
                <span
                  key={i}
                  className={`text-5xl font-bold border-b-4 border-text-secondary min-w-[50px] text-center uppercase md:text-3xl md:min-w-[30px] ${
                    char === "_" ? "text-transparent" : "text-text-main"
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full">
              {alphabet.map((letter) => {
                const isChosen = gameState.lettersChosen.includes(letter);
                const isWrong = gameState.lettersWrong.includes(letter);
                let statusClass =
                  "bg-card border-white/10 text-text-main hover:bg-primary hover:text-white hover:-translate-y-1 hover:shadow-glow-primary";

                if (isChosen)
                  statusClass =
                    "bg-secondary text-background border-secondary opacity-40 hover:none hover:translate-y-0 hover:shadow-none";
                if (isWrong)
                  statusClass =
                    "bg-tertiary border-tertiary opacity-20 hover:none hover:translate-y-0 hover:shadow-none";

                return (
                  <button
                    key={letter}
                    onClick={() => makeGuess(letter)}
                    disabled={
                      gameState.status !== "playing" || isChosen || isWrong
                    }
                    className={`w-[60px] h-[60px] text-2xl rounded-xl border border-solid cursor-pointer transition-all uppercase md:w-[45px] md:h-[45px] md:text-lg ${statusClass}`}
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
