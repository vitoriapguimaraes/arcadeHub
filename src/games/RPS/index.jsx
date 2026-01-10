import { useState } from "react";
import { Scissors, Hand, Square as RockIcon, RefreshCw } from "lucide-react";
import GameHeader from "../../components/GameHeader";

const OPTIONS = [
  { id: "PEDRA", icon: <RockIcon size={48} />, beat: "TESOURA" },
  { id: "PAPEL", icon: <Hand size={48} />, beat: "PEDRA" },
  { id: "TESOURA", icon: <Scissors size={48} />, beat: "PAPEL" },
];

const RPS = () => {
  const [result, setResult] = useState(null); // { player, computer, outcome, message }
  const [score, setScore] = useState({ wins: 0, losses: 0 }); // Session Score

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
      setScore((prev) => ({ ...prev, wins: prev.wins + 1 }));
    } else {
      outcome = "loss";
      message = `Você perdeu! ${computerOption.id} vence ${playerOption.id}.`;
      setScore((prev) => ({ ...prev, losses: prev.losses + 1 }));
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

  const resetSession = () => {
    setScore({ wins: 0, losses: 0 });
    setResult(null);
  };

  const getSubtitle = () => {
    if (!result) return "Pedra, Papel e Tesoura - Escolha sua arma!";
    if (result.outcome === "win") return "Vitória Grande!";
    if (result.outcome === "loss") return "Derrota...";
    return "Empate!";
  };

  return (
    <div className="flex flex-col h-full w-full gap-4 overflow-hidden relative">
      <GameHeader
        title="Jokenpô"
        subtitle={getSubtitle()}
        score={score}
        onResetSession={resetSession}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!result ? (
          <div className="bg-card w-full max-w-4xl p-8 rounded-3xl shadow-xl border border-white/5 flex flex-col items-center relative z-10">
            <p className="text-xl text-text-secondary mb-8 font-medium">
              Escolha sua arma:
            </p>
            <div className="flex flex-wrap justify-center gap-8 w-full">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => playRound(opt)}
                  className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-black/30 border-2 border-transparent transition-all hover:-translate-y-2 hover:bg-black/50 hover:border-highlight hover:shadow-[0_0_20px_rgba(61,169,252,0.3)] cursor-pointer min-w-[160px]"
                >
                  <div className="text-highlight transition-transform group-hover:scale-110">
                    {opt.icon}
                  </div>
                  <span className="font-bold text-lg tracking-wider text-white group-hover:text-highlight">
                    {opt.id}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl flex flex-col items-center gap-8 animate-pop">
            <div className="flex items-center justify-center gap-4 md:gap-16 w-full">
              {/* Player */}
              <div
                className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                  result.outcome === "win"
                    ? "scale-110 drop-shadow-[0_0_15px_rgba(44,182,125,0.5)]"
                    : "opacity-80"
                }`}
              >
                <p className="text-text-secondary font-bold uppercase tracking-widest text-sm">
                  Você
                </p>
                <div
                  className={`p-8 rounded-full bg-black/40 border-4 ${
                    result.outcome === "win"
                      ? "border-[#2cb67d] text-[#2cb67d]"
                      : "border-white/10 text-white"
                  }`}
                >
                  {result.player.icon}
                </div>
                <span className="font-bold text-xl">{result.player.id}</span>
              </div>

              <div className="text-4xl font-black italic text-tertiary drop-shadow-md">
                VS
              </div>

              {/* Computer */}
              <div
                className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                  result.outcome === "loss"
                    ? "scale-110 drop-shadow-[0_0_15px_rgba(239,69,101,0.5)]"
                    : "opacity-80"
                }`}
              >
                <p className="text-text-secondary font-bold uppercase tracking-widest text-sm">
                  CPU
                </p>
                <div
                  className={`p-8 rounded-full bg-black/40 border-4 ${
                    result.outcome === "loss"
                      ? "border-tertiary text-tertiary"
                      : "border-white/10 text-white"
                  }`}
                >
                  {result.computer.icon}
                </div>
                <span className="font-bold text-xl">{result.computer.id}</span>
              </div>
            </div>

            <div
              className={`text-2xl font-bold px-8 py-4 rounded-xl text-center border shadow-lg ${
                result.outcome === "win"
                  ? "bg-[#2cb67d]/20 border-[#2cb67d] text-[#2cb67d]"
                  : result.outcome === "loss"
                  ? "bg-tertiary/20 border-tertiary text-tertiary"
                  : "bg-white/10 border-white/20 text-white"
              }`}
            >
              {result.message}
            </div>

            <button
              onClick={resetGame}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-12 rounded-xl text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,137,6,0.3)] hover:scale-105 transition-all mt-4 cursor-pointer"
            >
              <RefreshCw size={24} /> Jogar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RPS;
