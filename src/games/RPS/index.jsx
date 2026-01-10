import { useState } from "react";
import {
  Scissors,
  Hand,
  Square as RockIcon,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import GameHeader from "../../components/GameHeader";

const OPTIONS = [
  { id: "PEDRA", icon: <RockIcon size={48} />, beat: "TESOURA" },
  { id: "PAPEL", icon: <Hand size={48} />, beat: "PEDRA" },
  { id: "TESOURA", icon: <Scissors size={48} />, beat: "PAPEL" },
];

const RPS = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [result, setResult] = useState(null); // { player, computer, outcome, message }
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ wins: 0, losses: 0 });

  const playRound = (playerOption) => {
    setPlayerChoice(playerOption);
    setShowResult(false);

    // Delay to show suspense
    setTimeout(() => {
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
      setShowResult(true);
    }, 800);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setResult(null);
    setShowResult(false);
  };

  const resetSession = () => {
    setScore({ wins: 0, losses: 0 });
    resetGame();
  };

  const getSubtitle = () => {
    if (!playerChoice) return "Pedra, Papel e Tesoura - Escolha sua arma!";
    if (!showResult) return "Aguarde o resultado...";
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

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        {/* Arena - Always visible */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-4 md:gap-16 w-full">
            {/* Player */}
            <div
              className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                showResult && result.outcome === "win"
                  ? "scale-110 drop-shadow-[0_0_15px_rgba(44,182,125,0.5)]"
                  : playerChoice
                  ? "opacity-100"
                  : "opacity-40"
              }`}
            >
              <p className="text-text-secondary font-bold uppercase tracking-widest text-sm">
                Você
              </p>
              <div
                className={`p-8 rounded-full bg-black/40 border-4 transition-all ${
                  showResult && result.outcome === "win"
                    ? "border-[#2cb67d] text-[#2cb67d]"
                    : playerChoice
                    ? "border-highlight text-highlight"
                    : "border-white/10 text-white/20"
                }`}
              >
                {playerChoice ? playerChoice.icon : <HelpCircle size={48} />}
              </div>
              <span className="font-bold text-xl">
                {playerChoice ? playerChoice.id : "?"}
              </span>
            </div>

            <div className="text-4xl font-black italic text-tertiary drop-shadow-md">
              VS
            </div>

            {/* Computer */}
            <div
              className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                showResult && result.outcome === "loss"
                  ? "scale-110 drop-shadow-[0_0_15px_rgba(239,69,101,0.5)]"
                  : showResult
                  ? "opacity-100"
                  : "opacity-40"
              }`}
            >
              <p className="text-text-secondary font-bold uppercase tracking-widest text-sm">
                CPU
              </p>
              <div
                className={`p-8 rounded-full bg-black/40 border-4 transition-all ${
                  showResult && result.outcome === "loss"
                    ? "border-tertiary text-tertiary"
                    : showResult
                    ? "border-white/10 text-white"
                    : "border-white/10 text-white/20 animate-pulse"
                }`}
              >
                {showResult && result ? (
                  result.computer.icon
                ) : (
                  <HelpCircle size={48} className="animate-spin" />
                )}
              </div>
              <span className="font-bold text-xl">
                {showResult && result ? result.computer.id : "?"}
              </span>
            </div>
          </div>

          {/* Result Message */}
          {showResult && result && (
            <div
              className={`text-2xl font-bold px-8 py-4 rounded-xl text-center border shadow-lg animate-pop ${
                result.outcome === "win"
                  ? "bg-[#2cb67d]/20 border-[#2cb67d] text-[#2cb67d]"
                  : result.outcome === "loss"
                  ? "bg-tertiary/20 border-tertiary text-tertiary"
                  : "bg-white/10 border-white/20 text-white"
              }`}
            >
              {result.message}
            </div>
          )}
        </div>

        {/* Action Area */}
        {!playerChoice ? (
          <div className="bg-card w-full max-w-4xl p-8 rounded-3xl shadow-xl border border-white/5 flex flex-col items-center">
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
        ) : showResult ? (
          <button
            onClick={resetGame}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-12 rounded-xl text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,137,6,0.3)] hover:scale-105 transition-all cursor-pointer"
          >
            <RefreshCw size={24} /> Jogar Novamente
          </button>
        ) : (
          <div className="text-highlight text-lg font-bold animate-pulse">
            Preparando resultado...
          </div>
        )}
      </div>
    </div>
  );
};

export default RPS;
