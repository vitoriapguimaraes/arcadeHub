import { Link } from "react-router-dom";
import {
  Skull,
  Swords,
  LayoutTemplate,
  HelpCircle,
  Scissors,
} from "lucide-react";
import "./Dashboard.css";

const games = [
  {
    id: "hangman",
    title: "Jogo da Forca",
    description: "Adivinhe a palavra antes que seja tarde demais!",
    icon: <Skull size={48} />,
    path: "/hangman",
    color: "var(--secondary)",
  },
  {
    id: "tug-of-war",
    title: "Cabo de Guerra",
    description: "Teste sua força e rapidez neste clássico.",
    icon: <Swords size={48} />,
    path: "/tug-of-war",
    color: "var(--highlight)",
  },
  {
    id: "bridge",
    title: "Jogo da Ponte",
    description: "Atravesse a ponte com segurança.",
    icon: <LayoutTemplate size={48} />,
    path: "/bridge",
    color: "var(--primary)",
  },
  {
    id: "guessing",
    title: "Adivinhação",
    description: "Tente adivinhar os números e segredos.",
    icon: <HelpCircle size={48} />,
    path: "/guessing",
    color: "var(--tertiary)",
  },
  {
    id: "rps",
    title: "Jokenpo",
    description: "Pedra, Papel e Tesoura. Quem vence?",
    icon: <Scissors size={48} />,
    path: "/rps",
    color: "#2cb67d",
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Bem-vindo ao ArcadeHub</h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "2rem",
          fontSize: "1.1rem",
        }}
      >
        Explore nossa coleção de jogos clássicos recriados com tecnologia
        moderna. Selecione um jogo na barra lateral ou nos cards abaixo para
        começar.
      </p>
      <div className="games-grid">
        {games.map((game) => (
          <Link
            to={game.path}
            key={game.id}
            className="game-card"
            style={{ "--hover-color": game.color }}
          >
            <div className="card-icon" style={{ color: game.color }}>
              {game.icon}
            </div>
            <div className="card-content">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
            </div>
            <div
              className="card-overlay"
              style={{ backgroundColor: game.color }}
            ></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
