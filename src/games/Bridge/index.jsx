import { useState } from "react";
import { Play, RefreshCw, Footprints, Skull } from "lucide-react";
import GameHeader from "../../components/GameHeader";

const Bridge = () => {
  const [gameState, setGameState] = useState("start"); // start, playing, won, lost
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState([]); // Array of 'left' or 'right' for visual path
  const [difficulty, setDifficulty] = useState(5); // 5 (Easy), 10 (Medium), 18 (Hard)
  const [score, setScore] = useState({ wins: 0, losses: 0 }); // Session Score

  const startGame = () => {
    setGameState("playing");
    setRound(1);
    setHistory([]);
  };

  const handleChoice = (side) => {
    // 50% chance of survival
    const isSafe = Math.random() >= 0.5;

    const newHistory = [...history, { side, safe: isSafe }];
    setHistory(newHistory);

    if (isSafe) {
      if (round >= difficulty) {
        setGameState("won");
        setScore((prev) => ({ ...prev, wins: prev.wins + 1 }));
      } else {
        setRound(round + 1);
      }
    } else {
      setGameState("lost");
      setScore((prev) => ({ ...prev, losses: prev.losses + 1 }));
    }
  };

  const resetSession = () => {
    setScore({ wins: 0, losses: 0 });
    setGameState("start");
    setRound(1);
    setHistory([]);
  };

  const getSubtitle = () => {
    if (gameState === "start")
      return "Atravesse a ponte de vidro. Um passo em falso e... Crash!";
    if (gameState === "won") return "Parabéns! Você atravessou com segurança!";
    if (gameState === "lost") return "O vidro quebrou! Você caiu.";
    return `Rodada ${round} / ${difficulty} - Escolha um lado`;
  };

  return (
    <div className="flex flex-col h-full w-full gap-4 overflow-hidden relative">
      <GameHeader
        title="Jogo da Ponte"
        subtitle={getSubtitle()}
        score={score}
        onResetSession={resetSession}
      />

      {gameState === "start" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
          <div className="bg-card p-8 rounded-2xl flex flex-col items-center shadow-xl border border-white/5 max-w-md w-full text-center">
            <Footprints size={64} className="text-primary mb-4" />
            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-bold text-white">Sua Missão</h3>
              <p className="text-text-secondary">
                Atravesse a ponte de vidro sem cair. <br />
                50% de chance de sobrevivência a cada passo.
              </p>
            </div>

            <div className="w-full space-y-4">
              <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                Dificuldade
              </p>
              <div className="flex gap-2 justify-center w-full">
                {[5, 10, 15].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all border ${
                      difficulty === level
                        ? "bg-primary text-white border-primary shadow-glow-primary scale-105"
                        : "bg-black/30 text-text-secondary border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {level === 5 ? "Fácil" : level === 10 ? "Médio" : "Difícil"}{" "}
                    ({level})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="mt-8 w-full bg-primary text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,137,6,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,137,6,0.5)] transition-all cursor-pointer"
            >
              <Play size={24} /> Começar Desafio
            </button>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 w-full flex flex-col items-center justify-start overflow-hidden bg-[#1a1a2e]/50 rounded-2xl border border-white/5 perspective-[800px] shadow-inner p-4">
          <div className="w-full max-w-md flex flex-col gap-4 transform rotate-x-[20deg] flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 mask-linear-fade">
            {/* Future Steps Placeholders */}
            {Array.from({ length: Math.max(0, difficulty - round) }).map(
              (_, i) => (
                <div
                  key={`future-${i}`}
                  className="flex justify-center gap-4 opacity-30 scale-95"
                >
                  <div className="w-[100px] h-[60px] rounded-lg border-2 border-[#3da9fc]/30 bg-[#3da9fc]/10 flex items-center justify-center text-text-secondary font-bold backdrop-blur-sm">
                    ?
                  </div>
                  <div className="w-[100px] h-[60px] rounded-lg border-2 border-[#3da9fc]/30 bg-[#3da9fc]/10 flex items-center justify-center text-text-secondary font-bold backdrop-blur-sm">
                    ?
                  </div>
                </div>
              )
            )}

            {/* Current Interaction Row */}
            {gameState === "playing" && (
              <div className="flex justify-center gap-4 animate-bounce-in z-20 my-2">
                <button
                  onClick={() => handleChoice("left")}
                  className="w-[100px] h-[60px] rounded-lg border-2 border-[#3da9fc] bg-[#3da9fc]/20 text-white font-bold cursor-pointer hover:bg-[#3da9fc]/40 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(61,169,252,0.2)] transition-all flex items-center justify-center"
                >
                  Esquerda
                </button>
                <button
                  onClick={() => handleChoice("right")}
                  className="w-[100px] h-[60px] rounded-lg border-2 border-[#3da9fc] bg-[#3da9fc]/20 text-white font-bold cursor-pointer hover:bg-[#3da9fc]/40 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(61,169,252,0.2)] transition-all flex items-center justify-center"
                >
                  Direita
                </button>
              </div>
            )}

            {/* History Rows (Reverse Order) */}
            {[...history].reverse().map((step, i) => (
              <div
                key={`hist-${i}`}
                className="flex justify-center gap-4 opacity-90"
              >
                {/* Left Block */}
                <div
                  className={`w-[100px] h-[60px] rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${
                    step.side === "left"
                      ? step.safe
                        ? "bg-[#2cb67d]/40 border-[#2cb67d] shadow-[0_0_20px_rgba(44,182,125,0.3)]"
                        : "bg-tertiary/40 border-tertiary rotate-3 scale-90 opacity-70"
                      : "border-white/5 bg-white/5 opacity-20"
                  }`}
                >
                  {step.side === "left" &&
                    (step.safe ? (
                      <Footprints size={24} className="text-white" />
                    ) : (
                      <Skull size={24} className="text-white animate-shake" />
                    ))}
                </div>

                {/* Right Block */}
                <div
                  className={`w-[100px] h-[60px] rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${
                    step.side === "right"
                      ? step.safe
                        ? "bg-[#2cb67d]/40 border-[#2cb67d] shadow-[0_0_20px_rgba(44,182,125,0.3)]"
                        : "bg-tertiary/40 border-tertiary -rotate-3 scale-90 opacity-70"
                      : "border-white/5 bg-white/5 opacity-20"
                  }`}
                >
                  {step.side === "right" &&
                    (step.safe ? (
                      <Footprints size={24} className="text-white" />
                    ) : (
                      <Skull size={24} className="text-white animate-shake" />
                    ))}
                </div>
              </div>
            ))}

            <div className="text-center mt-8 p-4 bg-black/40 rounded-lg text-text-secondary font-bold tracking-widest text-sm uppercase">
              Plataforma Inicial
            </div>
          </div>

          {/* Result Actions Overlay */}
          {(gameState === "won" || gameState === "lost") && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-card p-6 rounded-2xl border border-white/10 shadow-2xl text-center transform scale-110">
                {gameState === "won" ? (
                  <Trophy size={64} className="text-[#2cb67d] mx-auto mb-4" />
                ) : (
                  <Skull size={64} className="text-tertiary mx-auto mb-4" />
                )}
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    gameState === "won" ? "text-[#2cb67d]" : "text-tertiary"
                  }`}
                >
                  {gameState === "won" ? "VITÓRIA" : "GAME OVER"}
                </h2>
                <p className="text-text-secondary mb-6">
                  {gameState === "won"
                    ? "Você sobreviveu à ponte!"
                    : `Você caiu na rodada ${round}.`}
                </p>
                <button
                  onClick={startGame}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform cursor-pointer"
                >
                  <RefreshCw size={20} /> Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bridge;
