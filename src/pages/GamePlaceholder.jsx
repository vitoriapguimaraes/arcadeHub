import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

const GamePlaceholder = ({ title }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        textAlign: "center",
        color: "var(--text-secondary)",
      }}
    >
      <Construction
        size={64}
        style={{ marginBottom: "1rem", color: "var(--highlight)" }}
      />
      <h1>{title}</h1>
      <p>Este jogo ainda está em desenvolvimento.</p>
      <Link
        to="/"
        style={{
          marginTop: "2rem",
          color: "var(--primary)",
          textDecoration: "underline",
        }}
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
};

export default GamePlaceholder;
