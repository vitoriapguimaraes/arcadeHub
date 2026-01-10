import { useState, useEffect } from "react";
import { Swords, RefreshCw, Trophy, Skull } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GameHeader from "../../components/GameHeader";

const VERSION = "15.7.1";

const TugOfWar = () => {
  const [champions, setChampions] = useState({});
  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState([]);
  const [enemyTeam, setEnemyTeam] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isBattling, setIsBattling] = useState(false);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    try {
      const url = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/pt_BR/champion.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const data = await response.json();
      setChampions(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getImageUrl = (id) =>
    `https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${id}.png`;

  const handleChampionSelect = (id) => {
    if (gameResult) return;

    if (myTeam.includes(id)) {
      setMyTeam(myTeam.filter((champId) => champId !== id));
    } else {
      if (myTeam.length < 3) {
        setMyTeam([...myTeam, id]);
      }
    }
  };

  const calculateForce = (team) => {
    return team.reduce((sum, id) => {
      const info = champions[id].info;
      return sum + info.attack + info.magic + info.defense;
    }, 0);
  };

  const startGame = () => {
    if (myTeam.length !== 3) return;

    const allChampionIds = Object.keys(champions);
    const availableEnemies = allChampionIds.filter(
      (id) => !myTeam.includes(id)
    );
    const enemies = [];

    while (enemies.length < 3) {
      const randomIndex = Math.floor(Math.random() * availableEnemies.length);
      const selected = availableEnemies[randomIndex];
      if (!enemies.includes(selected)) {
        enemies.push(selected);
      }
    }

    setEnemyTeam(enemies);
    setIsBattling(true);

    setTimeout(() => {
      const myForce = calculateForce(myTeam);
      const enemyForce = calculateForce(enemies);

      let result = "";
      if (myForce > enemyForce) {
        result = "win";
        setScore((prev) => ({ ...prev, wins: prev.wins + 1 }));
      } else if (myForce < enemyForce) {
        result = "loss";
        setScore((prev) => ({ ...prev, losses: prev.losses + 1 }));
      } else {
        result = "draw";
      }

      setGameResult({
        outcome: result,
        myForce,
        enemyForce,
      });
      setIsBattling(false);
    }, 2000); // 2 seconds battle animation
  };

  const resetGame = () => {
    setMyTeam([]);
    setEnemyTeam([]);
    setGameResult(null);
    setSearchTerm("");
  };

  const resetSession = () => {
    setScore({ wins: 0, losses: 0 });
    resetGame();
  };

  const filteredChampions = Object.entries(champions).filter(([_, champ]) =>
    champ.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isGameActive = isBattling || gameResult;

  // Removed early return for loading

  return (
    <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
      <GameHeader
        title="League of Legends: Cabo de Guerra"
        subtitle="Monte seu time de 3 campeões e desafie os oponentes!"
        score={score}
        onResetSession={resetSession}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-4 flex-1 min-h-0 pb-2 overflow-hidden">
        {/* LEFT COLUMN: Champion Draft */}
        <div className="flex flex-col bg-card rounded-2xl overflow-hidden border border-white/5 shadow-md h-full relative z-10">
          <div className="p-3 bg-black/20 border-b border-white/5 shrink-0">
            <input
              type="text"
              placeholder="Buscar campeão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-lg border border-text-secondary bg-black/30 text-text-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(255,137,6,0.2)] transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {loading ? (
              <div className="flex h-full items-center justify-center text-primary font-bold animate-pulse gap-2 flex-col">
                <RefreshCw className="animate-spin" size={24} />
                <span>Invocando Campeões...</span>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] auto-rows-[90px] gap-2 content-start">
                <AnimatePresence>
                  {filteredChampions.map(([id, champ]) => {
                    const isSelected = myTeam.includes(id);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        key={id}
                        className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-colors bg-black group hover:-translate-y-1 hover:border-text-secondary ${
                          isSelected
                            ? "border-primary opacity-50 grayscale"
                            : "border-transparent"
                        }`}
                        onClick={() => handleChampionSelect(id)}
                      >
                        <img
                          src={getImageUrl(id)}
                          alt={champ.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <span className="absolute bottom-0 w-full bg-black/80 text-[9px] text-center py-[2px] truncate px-1 text-white">
                          {champ.name}
                        </span>
                        {/* Hover Stats */}
                        <div className="absolute top-0 left-0 w-full p-[2px] flex justify-between opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-b from-black/90 to-transparent text-[8px] text-white font-mono">
                          <span className="text-primary flex items-center">
                            ⚔️{champ.info.attack}
                          </span>
                          <span className="text-[#3da9fc] flex items-center">
                            🛡️{champ.info.defense}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Battle Arena */}
        <div className="flex flex-col justify-between h-full gap-2 overflow-hidden">
          {/* My Team Section */}
          <div
            className={`p-4 rounded-xl border border-white/5 bg-gradient-to-r from-[#3da9fc]/10 to-transparent border-l-4 border-l-highlight transition-all shrink-0`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg text-text-secondary font-bold">
                Seu Time
              </h2>
              {gameResult && (
                <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-highlight text-black">
                  {gameResult.myForce} XP
                </span>
              )}
            </div>
            <div className="flex justify-center gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[80px] h-[100px] md:w-[100px] md:h-[120px]"
                >
                  {myTeam[i] ? (
                    <motion.div
                      layoutId={`my-team-${myTeam[i]}`}
                      className="w-full h-full rounded-lg bg-black/40 border-2 border-highlight flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group shadow-[0_0_15px_rgba(61,169,252,0.2)]"
                      onClick={() => handleChampionSelect(myTeam[i])}
                    >
                      <img
                        src={getImageUrl(myTeam[i])}
                        alt={champions[myTeam[i]].name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-1 text-center z-10">
                        <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md truncate w-full block">
                          {champions[myTeam[i]].name}
                        </span>
                      </div>
                      <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-secondary text-2xl opacity-0 transition-opacity group-hover:opacity-100 z-20">
                        ✕
                      </span>
                    </motion.div>
                  ) : (
                    <div className="w-full h-full rounded-lg bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-highlight cursor-pointer transition-all hover:border-highlight hover:bg-[#3da9fc]/10">
                      <span className="text-xs font-medium">Vaga</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Battle Controls / Result */}
          <div className="flex-1 flex items-center justify-center min-h-[120px] max-h-[300px] w-full px-4">
            {isBattling ? (
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <div className="flex justify-between w-full text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">
                  <span className="text-[#3da9fc]">Seu Time</span>
                  <span className="text-tertiary">Inimigos</span>
                </div>

                {/* Battle Animation: Oscillating Bar */}
                <div className="relative w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
                  {/* Center Indicator */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 z-10" />

                  <motion.div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-[#3da9fc] to-tertiary w-[20%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    initial={{ left: "40%" }}
                    animate={{
                      left: ["40%", "60%", "30%", "65%", "45%", "55%"],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    }}
                    style={{ x: "-50%" }} // Centering fix
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="text-sm font-bold text-white tracking-widest mt-2"
                >
                  DISPUTANDO FORÇA...
                </motion.div>
              </div>
            ) : gameResult ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                layout
                className={`text-center bg-black/40 px-8 py-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-4 w-full max-w-sm backdrop-blur-md ${
                  gameResult.outcome === "win"
                    ? "border-[#2cb67d] shadow-[0_0_30px_rgba(44,182,125,0.15)]"
                    : gameResult.outcome === "loss"
                    ? "border-tertiary shadow-[0_0_30px_rgba(239,69,101,0.15)]"
                    : ""
                }`}
              >
                <div className="relative">
                  {gameResult.outcome === "win" && (
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Trophy
                        size={56}
                        className="text-[#2cb67d] drop-shadow-[0_0_15px_rgba(44,182,125,0.6)]"
                      />
                    </motion.div>
                  )}
                  {gameResult.outcome === "loss" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Skull
                        size={56}
                        className="text-tertiary drop-shadow-[0_0_15px_rgba(239,69,101,0.6)]"
                      />
                    </motion.div>
                  )}
                  {gameResult.outcome === "draw" && (
                    <Swords size={56} className="text-text-secondary" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h3
                    className={`text-3xl font-black uppercase tracking-tighter ${
                      gameResult.outcome === "win"
                        ? "text-[#2cb67d]"
                        : gameResult.outcome === "loss"
                        ? "text-tertiary"
                        : "text-white"
                    }`}
                  >
                    {gameResult.outcome === "win"
                      ? "VITÓRIA!"
                      : gameResult.outcome === "loss"
                      ? "DERROTA"
                      : "EMPATE"}
                  </h3>
                  <p className="text-text-secondary text-sm font-medium">
                    {gameResult.outcome === "win"
                      ? "Seu time dominou a arena!"
                      : gameResult.outcome === "loss"
                      ? "O time inimigo foi mais forte."
                      : "Forças equivalentes."}
                  </p>
                </div>

                <div className="flex gap-8 w-full justify-center text-sm font-mono mt-2 bg-black/30 p-2 rounded-lg border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-[10px] uppercase">
                      Sua Força
                    </span>
                    <span className="text-[#3da9fc] font-bold">
                      {gameResult.myForce}
                    </span>
                  </div>
                  <div className="w-[1px] bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-[10px] uppercase">
                      Inimigo
                    </span>
                    <span className="text-tertiary font-bold">
                      {gameResult.enemyForce}
                    </span>
                  </div>
                </div>

                <button
                  onClick={resetGame}
                  className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                >
                  <RefreshCw size={18} /> Jogar Novamente
                </button>
              </motion.div>
            ) : (
              <button
                onClick={startGame}
                disabled={myTeam.length !== 3}
                className="group relative flex flex-col items-center gap-2 px-10 py-4 rounded-full border border-white/10 bg-gradient-to-br from-primary to-[#ff9e42] text-white font-black text-xl shadow-[0_0_20px_rgba(255,137,6,0.4)] transition-all cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(255,137,6,0.6)] disabled:from-[#444] disabled:to-[#333] disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="flex items-center gap-3 relative z-10">
                  <Swords
                    size={28}
                    className={myTeam.length === 3 ? "animate-pulse" : ""}
                  />
                  <span>INICIAR BATALHA</span>
                </div>
                {myTeam.length < 3 && (
                  <span className="text-xs font-medium opacity-80 relative z-10 font-mono">
                    Selecione {3 - myTeam.length} campeões
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Enemy Team Section */}
          <div
            className={`p-4 rounded-xl border border-white/5 bg-gradient-to-r from-[#e53170]/10 to-transparent border-l-4 border-l-tertiary shrink-0`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg text-text-secondary font-bold">
                Inimigos
              </h2>
              {gameResult && (
                <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-tertiary text-white">
                  {gameResult.enemyForce} XP
                </span>
              )}
            </div>
            <div className="flex justify-center gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[80px] h-[100px] md:w-[100px] md:h-[120px]"
                >
                  {enemyTeam[i] ? (
                    <motion.div
                      layoutId={`enemy-team-${enemyTeam[i]}`}
                      className="w-full h-full rounded-lg bg-black/40 border-2 border-tertiary flex flex-col items-center justify-center relative overflow-hidden cursor-default"
                    >
                      <img
                        src={getImageUrl(enemyTeam[i])}
                        alt={champions[enemyTeam[i]].name}
                        className="w-full h-full object-cover grayscale-[0.2]"
                      />
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-1 text-center z-10">
                        <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md truncate w-full block">
                          {champions[enemyTeam[i]].name}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-full h-full rounded-lg bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-text-secondary opacity-50">
                      <span className="text-2xl font-bold">?</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TugOfWar;
