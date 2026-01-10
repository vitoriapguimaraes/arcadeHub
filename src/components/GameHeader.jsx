import React from "react";
import { Trophy, XCircle, RefreshCw } from "lucide-react";

const GameHeader = ({ title, subtitle, score, onResetSession }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full p-4 bg-black/20 rounded-xl gap-4 shrink-0 border border-white/5 shadow-sm">
      {/* Left: Title */}
      <h1 className="text-primary font-bold text-2xl drop-shadow-[0_0_10px_rgba(255,137,6,0.3)] m-0 text-center md:text-left whitespace-nowrap">
        {title}
      </h1>

      {/* Center: Subtitle / Instructions */}
      <p className="text-text-secondary text-sm md:text-base font-medium m-0 text-center flex-1 px-4 opacity-90">
        {subtitle}
      </p>

      {/* Right: Session Score */}
      {score && (
        <div className="flex gap-4 text-sm md:text-base text-text-secondary items-center bg-black/30 px-4 py-2 rounded-full whitespace-nowrap border border-white/5 shadow-inner">
          <span className="hidden md:inline font-semibold opacity-70">
            Sessão:
          </span>
          <span
            className="flex items-center gap-2 text-[#2cb67d] font-bold"
            title="Vitórias"
          >
            <Trophy size={16} /> {score.wins}
          </span>
          <span
            className="flex items-center gap-2 text-tertiary font-bold"
            title="Derrotas"
          >
            <XCircle size={16} /> {score.losses}
          </span>
          {onResetSession && (
            <button
              onClick={onResetSession}
              className="ml-2 bg-transparent border-none text-text-secondary cursor-pointer transition-all hover:text-primary hover:rotate-180 p-1 rounded-full hover:bg-white/10"
              title="Resetar Sessão"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHeader;
