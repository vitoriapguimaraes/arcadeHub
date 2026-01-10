import { useState, useEffect } from "react";
import { Swords, RefreshCw, Trophy, Skull } from "lucide-react";
import "./TugOfWar.css";

const VERSION = "15.7.1";

const TugOfWar = () => {
  const [champions, setChampions] = useState({});
  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState([]);
  const [enemyTeam, setEnemyTeam] = useState([]);
  const [gameResult, setGameResult] = useState(null);
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

    setEnemyTeam(enemies);
    setIsBattling(true);

    setTimeout(() => {
      const myForce = calculateForce(myTeam);
      const enemyForce = calculateForce(enemies);

      let result = "";
      if (myForce > enemyForce) result = "win";
      else if (myForce < enemyForce) result = "loss";
      else result = "draw";

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

  const filteredChampions = Object.entries(champions).filter(([_, champ]) =>
    champ.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Carregando Campeões...</div>;

  return (
    <div className="tug-of-war-container">
      <header className="game-header">
        <h1>League of Legends: Cabo de Guerra</h1>
        <p>Monte seu time de 3 campeões e desafie os oponentes!</p>
      </header>

      <div className="game-content-wrapper">
        {/* LEFT COLUMN: Champion Draft */}
        <div className="draft-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar campeão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="champions-grid-scroll">
            {loading ? (
              <div className="loading-spinner">
                <RefreshCw className="spin" /> Carregando...
              </div>
            ) : (
              filteredChampions.map(([id, champ]) => {
                const isSelected = myTeam.includes(id);
                return (
                  <div
                    key={id}
                    className={`champion-card-draft ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => handleChampionSelect(id)}
                  >
                    <img
                      src={getImageUrl(id)}
                      alt={champ.name}
                      loading="lazy"
                    />
                    <span className="caption">{champ.name}</span>
                    <div className="stats-mini">
                      <span className="stat-atk">⚔️ {champ.info.attack}</span>
                      <span className="stat-def">🛡️ {champ.info.defense}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Battle Arena */}
        <div className="arena-panel">
          {/* My Team Section */}
          <div className="team-section my-team">
            <div className="team-header">
              <h2>Seu Time</h2>
              {gameResult && (
                <span className="force-badge player">
                  {gameResult.myForce} XP
                </span>
              )}
            </div>
            <div className="team-slots">
              {[0, 1, 2].map((i) => (
                <div key={i} className="slot player-slot">
                  {myTeam[i] ? (
                    <div
                      className="champion-display filled"
                      onClick={() => handleChampionSelect(myTeam[i])}
                    >
                      <img
                        src={getImageUrl(myTeam[i])}
                        alt={champions[myTeam[i]].name}
                      />
                      <div className="champion-info">
                        <span className="name">
                          {champions[myTeam[i]].name}
                        </span>
                      </div>
                      <span className="remove-hint">✕</span>
                    </div>
                  ) : (
                    <div className="champion-display empty">
                      <span>Selecionar</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Battle Controls / Result */}
          <div className="battle-zone">
            {isBattling ? (
              <div className="battling-status">
                <Swords size={64} className="swords-clash" />
                <h3>BATALHANDO...</h3>
              </div>
            ) : gameResult ? (
              <div className={`result-card ${gameResult.outcome}`}>
                {gameResult.outcome === "win" && (
                  <Trophy size={48} className="icon-win" />
                )}
                {gameResult.outcome === "loss" && (
                  <Skull size={48} className="icon-loss" />
                )}

                <div className="result-text">
                  <h3>
                    {gameResult.outcome === "win"
                      ? "VITÓRIA!"
                      : gameResult.outcome === "loss"
                      ? "DERROTA"
                      : "EMPATE"}
                  </h3>
                  <p>
                    {gameResult.outcome === "win"
                      ? "Seu time dominou a arena!"
                      : "O time inimigo foi mais forte."}
                  </p>
                </div>

                <button onClick={resetGame} className="btn-play-again">
                  <RefreshCw size={20} /> Jogar Novamente
                </button>
              </div>
            ) : (
              <button
                onClick={startGame}
                className="btn-battle-large"
                disabled={myTeam.length !== 3}
              >
                <Swords size={32} />
                <span>INICIAR BATALHA</span>
              </button>
            )}
          </div>

          {/* Enemy Team Section */}
          <div className="team-section enemy-team">
            <div className="team-header">
              <h2>Inimigos</h2>
              {gameResult && (
                <span className="force-badge enemy">
                  {gameResult.enemyForce} XP
                </span>
              )}
            </div>
            <div className="team-slots">
              {[0, 1, 2].map((i) => (
                <div key={i} className="slot enemy-slot">
                  {enemyTeam[i] ? (
                    <div className="champion-display filled enemy">
                      <img
                        src={getImageUrl(enemyTeam[i])}
                        alt={champions[enemyTeam[i]].name}
                      />
                      <div className="champion-info">
                        <span className="name">
                          {champions[enemyTeam[i]].name}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="champion-display empty-enemy">
                      <span>?</span>
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
