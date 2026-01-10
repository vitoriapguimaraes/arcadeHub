import { Link, useLocation } from "react-router-dom";
import {
  Gamepad2,
  Skull,
  Swords,
  LayoutTemplate,
  HelpCircle,
  Scissors,
  Home,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: "/",
      icon: <Home size={20} />,
      label: "Início",
      color: "var(--text-main)", // Tailwind config: text-text-main
      activeClass: "shadow-[inset_4px_0_0_#fffffe]",
    },
    {
      path: "/hangman",
      icon: <Skull size={20} />,
      label: "Jogo da Forca",
      color: "#f25f4c", // Secondary
      activeClass: "shadow-[inset_4px_0_0_#f25f4c]",
    },
    {
      path: "/tug-of-war",
      icon: <Swords size={20} />,
      label: "Cabo de Guerra",
      color: "#3da9fc", // Highlight
      activeClass: "shadow-[inset_4px_0_0_#3da9fc]",
    },
    {
      path: "/bridge",
      icon: <LayoutTemplate size={20} />,
      label: "Jogo da Ponte",
      color: "#ff8906", // Primary
      activeClass: "shadow-[inset_4px_0_0_#ff8906]",
    },
    {
      path: "/guessing",
      icon: <HelpCircle size={20} />,
      label: "Adivinhação",
      color: "#e53170", // Tertiary
      activeClass: "shadow-[inset_4px_0_0_#e53170]",
    },
    {
      path: "/rps",
      icon: <Scissors size={20} />,
      label: "Jokenpô",
      color: "#2cb67d",
      activeClass: "shadow-[inset_4px_0_0_#2cb67d]",
    },
  ];

  return (
    <aside className="w-[260px] h-screen bg-card flex flex-col border-r border-white/5 sticky top-0 shrink-0 md:w-20 md:items-center transition-all duration-300 z-50">
      <div className="p-8 flex items-center md:justify-center md:p-6">
        <Link
          to="/"
          className="flex items-center gap-3 no-underline text-2xl font-extrabold text-text-main group"
        >
          <Gamepad2
            size={28}
            className="text-primary transition-transform group-hover:rotate-12"
          />
          <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent md:hidden">
            ArcadeHub
          </span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center gap-4 p-3 rounded-xl text-text-secondary font-medium transition-all hover:bg-white/5 hover:text-text-main hover:translate-x-1 md:justify-center md:p-4 md:hover:translate-x-0 ${
              isActive(item.path)
                ? `bg-white/10 text-text-main font-semibold ${item.activeClass}`
                : ""
            }`}
          >
            <span
              className="flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                color: isActive(item.path) ? "currentColor" : item.color,
              }}
            >
              {item.icon}
            </span>
            <span className="md:hidden">{item.label}</span>
          </Link>
        ))}
      </nav>

      <footer className="p-6 border-t border-white/5 text-center text-text-secondary text-xs opacity-70 md:hidden">
        <p>&copy; 2026 ArcadeHub.</p>
        <p>github.com/vitoriapguimaraes</p>
      </footer>
    </aside>
  );
};

export default Sidebar;
