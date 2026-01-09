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
        <p>Escolha 3 campeões e veja se seu time é mais forte!</p>
      </header>

      <div className="game-area">
        <div className="team-section my-team">
          <h2>
            Seu Time{" "}
            {gameResult && (
              <span className="force-badge">{gameResult.myForce} XP</span>
            )}
          </h2>
          <div className="team-slots">
            {[0, 1, 2].map((i) => (
              <div key={i} className="slot">
                {myTeam[i] ? (
                  <div className="champion-slot filled">
                    <img
                      src={getImageUrl(myTeam[i])}
                      alt={champions[myTeam[i]].name}
                    />
                    <span>{champions[myTeam[i]].name}</span>
                  </div>
                ) : (
                  <div className="champion-slot empty">?</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="battle-controls">
          {isBattling ? (
            <div className="battling-overlay">
              <Swords size={48} className="swords-clash" />
              <h3>BATALHANDO...</h3>
            </div>
          ) : gameResult ? (
            <div className={`result-display ${gameResult.outcome}`}>
              {gameResult.outcome === "win" && (
                <>
                  <Trophy size={48} />
                  <h3>VITÓRIA!</h3>
                </>
              )}
              {gameResult.outcome === "loss" && (
                <>
                  <Skull size={48} />
                  <h3>DERROTA</h3>
                </>
              )}
              {gameResult.outcome === "draw" && <h3>EMPATE</h3>}
              <button onClick={resetGame} className="btn-reset">
                <RefreshCw size={20} /> Jogar Novamente
              </button>
            </div>
          ) : (
            <button
              onClick={startGame}
              className="btn-battle"
              disabled={myTeam.length !== 3}
            >
              <Swords size={32} />
              <span>BATALHAR</span>
            </button>
          )}
        </div>

        <div className="team-section enemy-team">
          <h2>
            Inimigos{" "}
            {gameResult && (
              <span className="force-badge">{gameResult.enemyForce} XP</span>
            )}
          </h2>
          <div className="team-slots">
            {[0, 1, 2].map((i) => (
              <div key={i} className="slot">
                {enemyTeam[i] ? (
                  <div className="champion-slot filled enemy">
                    <img
                      src={getImageUrl(enemyTeam[i])}
                      alt={champions[enemyTeam[i]].name}
                    />
                    <span>{champions[enemyTeam[i]].name}</span>
                  </div>
                ) : (
                  <div className="champion-slot empty">?</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!gameResult && (
        <div className="selection-area">
          <input
            type="text"
            placeholder="Buscar campeão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="champions-grid">
            {filteredChampions.map(([id, champ]) => {
              const isSelected = myTeam.includes(id);
              return (
                <div
                  key={id}
                  className={`champion-card-select ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleChampionSelect(id)}
                >
                  <img src={getImageUrl(id)} alt={champ.name} loading="lazy" />
                  <span className="caption">{champ.name}</span>
                  <div className="stats-tooltip">
                    <div className="stat-row">
                      <span>Ataque:</span>{" "}
                      <span className="stat-val">{champ.info.attack}</span>
                    </div>
                    <div className="stat-row">
                      <span>Defesa:</span>{" "}
                      <span className="stat-val">{champ.info.defense}</span>
                    </div>
                    <div className="stat-row">
                      <span>Magia:</span>{" "}
                      <span className="stat-val">{champ.info.magic}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TugOfWar;
