import { Link } from "react-router-dom";
import {
  Skull,
  Swords,
  LayoutTemplate,
  HelpCircle,
  Scissors,
} from "lucide-react";

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
    <div className="text-center h-full flex flex-col justify-center">
      <div className="flex-none pt-4 md:pt-0">
        <h1 className="text-4xl font-bold mb-4">ArcadeHub</h1>
        <p className="text-text-secondary mb-6 text-lg max-w-2xl mx-auto px-4">
          Explore nossa coleção de jogos clássicos recriados com tecnologia
          moderna. Selecione um jogo abaixo para começar.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 max-w-[1600px] w-full items-stretch justify-items-center">
          {games.map((game) => (
            <Link
              to={game.path}
              key={game.id}
              className="group bg-card rounded-2xl p-4 flex flex-col items-center justify-center gap-3 no-underline text-text-main transition-all duration-300 relative overflow-hidden shadow-md border border-white/5 hover:-translate-y-2 hover:shadow-xl w-full max-w-xs h-56 lg:h-64"
              style={{ "--hover-color": game.color }}
            >
              <div
                className="z-10 bg-white/5 p-5 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{ color: game.color }}
              >
                {game.icon}
              </div>
              <div className="z-10">
                <h3 className="text-xl mb-1 font-bold">{game.title}</h3>
                <p className="text-text-secondary text-sm hidden xl:block">
                  {game.description}
                </p>
                <p className="text-text-secondary text-xs xl:hidden line-clamp-2">
                  {game.description}
                </p>
              </div>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 z-0 mix-blend-overlay group-hover:opacity-10"
                style={{ backgroundColor: game.color }}
              ></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
