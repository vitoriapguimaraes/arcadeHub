import { useState, useRef } from "react";
import { HelpCircle, RefreshCw, Trophy, Zap } from "lucide-react";
import "./Guessing.css";

const MODES = {
  easy: { max: 10, name: "Mentalista (0-10)" },
  hard: { max: 100, name: "Número Secreto (1-100)" },
};

const Guessing = () => {
  const [gameMode, setGameMode] = useState(null); // null, 'easy', 'hard'
  const [secretNumber, setSecretNumber] = useState(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);

  const startGame = (mode) => {
    const max = MODES[mode].max;
    const secret = Math.floor(Math.random() * max) + 1; // 1 to max (adjust logic if 0 needed for mentalista, script said 0-10 but random*11 is 0-10.99 so floor is 0-10)
    // Mentalista script was parseInt(Math.random()*11) -> 0 to 10.
    // SecretNumber script was parseInt(Math.random() * 100) + 1 -> 1 to 100.

    let generatedSecret;
    if (mode === "easy") {
      generatedSecret = Math.floor(Math.random() * 11); // 0-10
    } else {
      generatedSecret = Math.floor(Math.random() * 100) + 1; // 1-100
    }

    setGameMode(mode);
    setSecretNumber(generatedSecret);
    setGuess("");
    setMessage("Faça seu chute!");
    setAttempts(0);
    setGameOver(false);
    // Focus input usually fails here because render hasn't happened, handle in useEffect or autoFocus
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (gameOver) return;

    const val = parseInt(guess);
    if (isNaN(val)) {
      setMessage("Por favor, digite um número válido.");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (val === secretNumber) {
      setMessage(
        `Parabéns! Você acertou em ${newAttempts} ${
          newAttempts === 1 ? "tentativa" : "tentativas"
        }!`
      );
      setGameOver(true);
    } else if (val > secretNumber) {
      setMessage("O número secreto é MENOR que " + val);
    } else {
      setMessage("O número secreto é MAIOR que " + val);
    }

    // Custom feedback for 'easy' mode as per original script
    if (gameMode === "easy" && val !== secretNumber) {
      if (val === secretNumber + 1 || val === secretNumber - 1) {
        setMessage(
          "Eita, tá quente! " + (val > secretNumber ? "É menor." : "É maior.")
        );
      }
    }

    setGuess("");
  };

  const resetSelection = () => {
    setGameMode(null);
    setSecretNumber(null);
    setMessage("");
  };

  if (!gameMode) {
    return (
      <div className="guessing-container start-screen">
        <HelpCircle size={64} className="icon-main" />
        <h1 className="game-title">Adivinhação</h1>
        <p>Teste sua intuição e sorte.</p>
        <div className="mode-selection">
          <button onClick={() => startGame("easy")} className="btn-mode easy">
            <Zap size={20} />
            <div>
              <strong>Mentalista</strong>
              <span>0 a 10</span>
            </div>
          </button>
          <button onClick={() => startGame("hard")} className="btn-mode hard">
            <Trophy size={20} />
            <div>
              <strong>Master</strong>
              <span>1 a 100</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="guessing-container game-screen">
      <header className="game-header">
        <button onClick={resetSelection} className="btn-back">
          ← Voltar
        </button>
        <h2>{MODES[gameMode].name}</h2>
      </header>

      <div className="guessing-card">
        <div className="circle-display">
          {gameOver ? (
            <div className="secret-reveal animate-reveal">{secretNumber}</div>
          ) : (
            <div className="secret-hidden">?</div>
          )}
        </div>

        <p className={`status-text ${gameOver ? "won" : ""}`}>{message}</p>

        {!gameOver ? (
          <form onSubmit={handleGuess} className="guess-form">
            <input
              ref={inputRef}
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Digite..."
              autoFocus
              max={gameMode === "easy" ? 10 : 100}
              min={0}
            />
            <button type="submit" className="btn-guess">
              Chutar
            </button>
          </form>
        ) : (
          <button onClick={() => startGame(gameMode)} className="btn-primary">
            <RefreshCw size={20} /> Jogar Novamente
          </button>
        )}

        <div className="stats">Tetativas: {attempts}</div>
      </div>
    </div>
  );
};

export default Guessing;
