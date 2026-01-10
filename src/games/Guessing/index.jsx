import { useState, useRef, useEffect } from "react";
import { HelpCircle, RefreshCw, Trophy, Zap, ArrowLeft } from "lucide-react";
import GameHeader from "../../components/GameHeader";

const MODES = {
  easy: { max: 10, name: "Mentalista", range: "0 a 10" },
  hard: { max: 100, name: "Número Secreto", range: "1 a 100" },
};

const Guessing = () => {
  const [gameMode, setGameMode] = useState(null); // null, 'easy', 'hard'
  const [secretNumber, setSecretNumber] = useState(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ wins: 0, losses: 0 }); // Session Score (Losses don't really apply here unless we add a max attempts limit later, so maybe just wins?)
  // For now let's count a "win" when they find the number.

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameMode && !gameOver && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameMode, gameOver]);

  const startGame = (mode) => {
    let generatedSecret;
    if (mode === "easy") {
      generatedSecret = Math.floor(Math.random() * 11); // 0-10
    } else {
      generatedSecret = Math.floor(Math.random() * 100) + 1; // 1-100
    }

    setGameMode(mode);
    setSecretNumber(generatedSecret);
    setGuess("");
    setMessage("Tente adivinhar o número!");
    setAttempts(0);
    setGameOver(false);
  };

  const resetSession = () => {
    setScore({ wins: 0, losses: 0 });
    setGameMode(null);
    setSecretNumber(null);
    setMessage("");
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
      setMessage(`Acertou! O número era ${secretNumber}.`);
      setGameOver(true);
      setScore((prev) => ({ ...prev, wins: prev.wins + 1 }));
    } else if (val > secretNumber) {
      const isClose = val - secretNumber <= (gameMode === "easy" ? 2 : 5);
      setMessage(
        <span>
          O número secreto é <strong>MENOR</strong>.{" "}
          {isClose && (
            <span className="text-secondary ml-1 animate-pulse">
              (Tá quente!)
            </span>
          )}
        </span>
      );
    } else {
      const isClose = secretNumber - val <= (gameMode === "easy" ? 2 : 5);
      setMessage(
        <span>
          O número secreto é <strong>MAIOR</strong>.{" "}
          {isClose && (
            <span className="text-secondary ml-1 animate-pulse">
              (Tá quente!)
            </span>
          )}
        </span>
      );
    }

    setGuess("");
  };

  const resetSelection = () => {
    setGameMode(null);
    setSecretNumber(null);
    setMessage("");
  };

  const getSubtitle = () => {
    if (!gameMode) return "Escolha um modo de jogo para testar sua intuição.";
    if (gameOver)
      return `Parabéns! Você encontrou o número em ${attempts} tentativas.`;
    return `Modo: ${MODES[gameMode].name} (${MODES[gameMode].range})`;
  };

  return (
    <div className="flex flex-col h-full w-full gap-4 overflow-hidden relative">
      <GameHeader
        title="Adivinhação"
        subtitle={getSubtitle()}
        score={score}
        onResetSession={resetSession}
      />

      {!gameMode ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
          <div className="bg-card p-8 rounded-2xl flex flex-col items-center shadow-xl border border-white/5 max-w-lg w-full text-center">
            <HelpCircle size={64} className="text-primary mb-4" />
            <h3 className="text-2xl font-bold text-white mb-6">
              Escolha o Desafio
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => startGame("easy")}
                className="flex-1 bg-black/30 border border-white/10 p-6 rounded-xl hover:bg-primary/20 hover:border-primary hover:-translate-y-1 transition-all group flex flex-col items-center gap-2 cursor-pointer"
              >
                <Zap
                  size={32}
                  className="text-highlight group-hover:text-primary transition-colors"
                />
                <div>
                  <strong className="block text-lg text-white">
                    Mentalista
                  </strong>
                  <span className="text-sm text-text-secondary">0 a 10</span>
                </div>
              </button>

              <button
                onClick={() => startGame("hard")}
                className="flex-1 bg-black/30 border border-white/10 p-6 rounded-xl hover:bg-secondary/20 hover:border-secondary hover:-translate-y-1 transition-all group flex flex-col items-center gap-2 cursor-pointer"
              >
                <Trophy
                  size={32}
                  className="text-secondary transition-colors"
                />
                <div>
                  <strong className="block text-lg text-white">Master</strong>
                  <span className="text-sm text-text-secondary">1 a 100</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="bg-card w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/5 flex flex-col items-center relative">
            <button
              onClick={resetSelection}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
              title="Voltar"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="mb-6 relative">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold shadow-inner ${
                  gameOver
                    ? "bg-black/20 text-secondary border-4 border-secondary animate-zoom-in"
                    : "bg-black/40 text-text-secondary border-4 border-dashed border-white/20"
                }`}
              >
                {gameOver ? secretNumber : "?"}
              </div>
            </div>

            <div
              className={`min-h-[3rem] flex items-center justify-center text-center text-lg mb-6 px-4 py-2 rounded-lg bg-black/20 w-full ${
                gameOver ? "text-secondary font-bold" : "text-text-main"
              }`}
            >
              {message}
            </div>

            {!gameOver ? (
              <form onSubmit={handleGuess} className="w-full flex gap-3">
                <input
                  ref={inputRef}
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Digite..."
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xl text-center text-white focus:outline-none focus:border-highlight focus:shadow-[0_0_0_2px_rgba(61,169,252,0.3)] transition-all"
                  max={gameMode === "easy" ? 10 : 100}
                  min={0}
                />
                <button
                  type="submit"
                  className="bg-highlight hover:bg-[#3da9fc]/80 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  Chutar
                </button>
              </form>
            ) : (
              <button
                onClick={() => startGame(gameMode)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,137,6,0.3)] transition-all animate-bounce-in"
              >
                <RefreshCw size={24} /> Jogar Novamente
              </button>
            )}

            <div className="mt-6 text-sm text-text-secondary font-mono">
              Tentativas:{" "}
              <span className="text-white font-bold">{attempts}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guessing;
