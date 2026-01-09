import { useState } from "react";
import { Play, RefreshCw, Footprints, Skull } from "lucide-react";
import "./Bridge.css";

const TOTAL_ROUNDS = 5;

const Bridge = () => {
  const [gameState, setGameState] = useState("start"); // start, playing, won, lost
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState([]); // Array of 'left' or 'right' for visual path
  const [difficulty, setDifficulty] = useState(5); // 5 (Easy), 10 (Medium), 18 (Hard)
  const [message, setMessage] = useState(
    "Tente sua sorte atravessando a ponte de vidro."
  );

  const startGame = () => {
    setGameState("playing");
    setRound(1);
    setHistory([]);
    setMessage("Escolha um lado: Esquerda ou Direita?");
  };

  const handleChoice = (side) => {
    // 50% chance of survival
    const isSafe = Math.random() >= 0.5;

    // For demonstration, let's say 'safe' choice is random each time
    // Or pre-generate pattern? Let's keep it random each step like original

    const newHistory = [...history, { side, safe: isSafe }];
    setHistory(newHistory);

    if (isSafe) {
      setMessage("O vidro aguentou! Continue.");
      if (round >= difficulty) {
        setGameState("won");
        setMessage("Parabéns! Você atravessou a ponte com segurança!");
      } else {
        setRound(round + 1);
      }
    } else {
      setGameState("lost");
      setMessage("O vidro quebrou! Você caiu.");
    }
  };

  if (gameState === "start") {
    return (
      <div className="bridge-container start-screen">
        <Footprints size={64} color="var(--primary)" />
        <h1 className="game-title">Jogo da Ponte</h1>
        <p>Atravesse a ponte de vidro. Um passo em falso e... Crash!</p>
        <div className="rules">
          <h3>Sua missão:</h3>
          <p>Sobreviver cruzando a ponte de vidros.</p>
        </div>

        <div className="difficulty-selector">
          <p>Escolha a Dificuldade:</p>
          <div className="diff-buttons">
            <button
              className={`btn-diff ${difficulty === 5 ? "active" : ""}`}
              onClick={() => setDifficulty(5)}
            >
              Fácil (5)
            </button>
            <button
              className={`btn-diff ${difficulty === 10 ? "active" : ""}`}
              onClick={() => setDifficulty(10)}
            >
              Médio (10)
            </button>
            <button
              className={`btn-diff ${difficulty === 15 ? "active" : ""}`}
              onClick={() => setDifficulty(15)}
            >
              Difícil (15)
            </button>
          </div>
        </div>
        <button onClick={startGame} className="btn-primary">
          <Play size={24} /> Começar Desafio
        </button>
      </div>
    );
  }

  return (
    <div className="bridge-container game-screen">
      <div className="game-header">
        <h2>
          Rodada {gameState === "playing" ? round : round - 1} / {difficulty}
        </h2>
        <div className={`status-message ${gameState}`}>{message}</div>
      </div>

      <div className="bridge-visual">
        {/* Visual representation of the bridge blocks */}
        <div className="bridge-path">
          {/* Future steps (placeholders) */}
          {Array.from({ length: Math.max(0, difficulty - round) }).map(
            (_, i) => (
              <div key={`future-${i}`} className="bridge-row future">
                <div className="glass-block">?</div>
                <div className="glass-block">?</div>
              </div>
            )
          )}

          {/* Current Step */}
          {gameState === "playing" && (
            <div className="bridge-row current animate-pop">
              <button
                className="glass-block interactable"
                onClick={() => handleChoice("left")}
              >
                Esquerda
              </button>
              <button
                className="glass-block interactable"
                onClick={() => handleChoice("right")}
              >
                Direita
              </button>
            </div>
          )}

          {/* Past History (in reverse order to show path walked) */}
          {[...history].reverse().map((step, i) => (
            <div key={`hist-${i}`} className="bridge-row past">
              <div
                className={`glass-block ${
                  step.side === "left" ? (step.safe ? "safe" : "broken") : ""
                }`}
              >
                {step.side === "left" &&
                  (step.safe ? <Footprints size={24} /> : <Skull size={24} />)}
              </div>
              <div
                className={`glass-block ${
                  step.side === "right" ? (step.safe ? "safe" : "broken") : ""
                }`}
              >
                {step.side === "right" &&
                  (step.safe ? <Footprints size={24} /> : <Skull size={24} />)}
              </div>
            </div>
          ))}

          <div className="start-platform">PLATAFORMA INICIAL</div>
        </div>
      </div>

      {(gameState === "won" || gameState === "lost") && (
        <div className="result-actions">
          <button onClick={startGame} className="btn-primary">
            <RefreshCw size={24} /> Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default Bridge;
