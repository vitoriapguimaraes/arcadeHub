import { useState } from "react";
import { Scissors, Hand, Square as RockIcon, RefreshCw } from "lucide-react"; // Using icons for RSP
import "./RPS.css";

const OPTIONS = [
  { id: "PEDRA", icon: <RockIcon size={48} />, beat: "TESOURA" },
  { id: "PAPEL", icon: <Hand size={48} />, beat: "PEDRA" },
  { id: "TESOURA", icon: <Scissors size={48} />, beat: "PAPEL" },
];

const RPS = () => {
  const [result, setResult] = useState(null); // { player, computer, outcome, message }

  const playRound = (playerOption) => {
    const computerOption = OPTIONS[Math.floor(Math.random() * 3)];

    let outcome = "";
    let message = "";

    if (playerOption.id === computerOption.id) {
      outcome = "draw";
      message = `Empate! Ambos escolheram ${playerOption.id}.`;
    } else if (playerOption.beat === computerOption.id) {
      outcome = "win";
      message = `Você venceu! ${playerOption.id} vence ${computerOption.id}.`;
    } else {
      outcome = "loss";
      message = `Você perdeu! ${computerOption.id} vence ${playerOption.id}.`;
    }

    setResult({
      player: playerOption,
      computer: computerOption,
      outcome,
      message,
    });
  };

  const resetGame = () => {
    setResult(null);
  };

  return (
    <div className="rps-container">
      <h1 className="game-title">Jokenpô</h1>

      <div className="battle-area">
        {!result ? (
          <div className="selection-phase">
            <p className="instruction">Escolha sua arma:</p>
            <div className="options-grid">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => playRound(opt)}
                  className="option-btn"
                >
                  <div className="icon-wrapper">{opt.icon}</div>
                  <span>{opt.id}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="result-phase animate-pop">
            <div className="versus-display">
              <div
                className={`player-result ${
                  result.outcome === "win" ? "winner" : ""
                }`}
              >
                <p>Você</p>
                <div className="icon-wrapper large">{result.player.icon}</div>
                <span>{result.player.id}</span>
              </div>

              <div className="vs">VS</div>

              <div
                className={`player-result ${
                  result.outcome === "loss" ? "winner" : ""
                }`}
              >
                <p>Computador</p>
                <div className="icon-wrapper large">{result.computer.icon}</div>
                <span>{result.computer.id}</span>
              </div>
            </div>

            <div className={`outcome-message ${result.outcome}`}>
              {result.message}
            </div>

            <button onClick={resetGame} className="btn-primary">
              <RefreshCw size={20} /> Jogar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RPS;
