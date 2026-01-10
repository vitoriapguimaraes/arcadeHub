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
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: "/",
      icon: <Home size={20} />,
      label: "Início",
      color: "var(--text-main)",
    },
    {
      path: "/hangman",
      icon: <Skull size={20} />,
      label: "Jogo da Forca",
      color: "var(--secondary)",
    },
    {
      path: "/tug-of-war",
      icon: <Swords size={20} />,
      label: "Cabo de Guerra",
      color: "var(--highlight)",
    },
    {
      path: "/bridge",
      icon: <LayoutTemplate size={20} />,
      label: "Jogo da Ponte",
      color: "var(--primary)",
    },
    {
      path: "/guessing",
      icon: <HelpCircle size={20} />,
      label: "Adivinhação",
      color: "var(--tertiary)",
    },
    {
      path: "/rps",
      icon: <Scissors size={20} />,
      label: "Jokenpô",
      color: "#2cb67d",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand">
          <Gamepad2 size={28} color="var(--primary)" />
          <span className="brand-name">ArcadeHub</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            style={{ "--item-color": item.color }}
          >
            <span className="icon-box" style={{ color: item.color }}>
              {item.icon}
            </span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <footer className="sidebar-footer">
        <p>&copy; 2026 ArcadeHub.</p>
        <p>github.com/vitoriapguimaraes</p>
      </footer>
    </aside>
  );
};

export default Sidebar;
