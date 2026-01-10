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
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">ArcadeHub</h1>
      <p className="text-text-secondary mb-8 text-lg">
        Explore nossa coleção de jogos clássicos recriados com tecnologia
        moderna. Selecione um jogo na barra lateral ou nos cards abaixo para
        começar.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,2fr))] gap-8 p-4">
        {games.map((game) => (
          <Link
            to={game.path}
            key={game.id}
            className="group bg-card rounded-2xl p-8 flex flex-col items-center gap-6 no-underline text-text-main transition-transform duration-300 relative overflow-hidden shadow-md border border-white/5 hover:-translate-y-2 hover:shadow-xl"
            style={{ "--hover-color": game.color }} // Keeping if needed, but not used in Tailwind unless arbitrary
          >
            <div
              className="z-10 bg-white/5 p-6 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{ color: game.color }}
            >
              {game.icon}
            </div>
            <div className="z-10">
              <h3 className="text-2xl mb-2 font-bold">{game.title}</h3>
              <p className="text-text-secondary text-sm">{game.description}</p>
            </div>
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 z-0 mix-blend-overlay group-hover:opacity-10"
              style={{ backgroundColor: game.color }}
            ></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
