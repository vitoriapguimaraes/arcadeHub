import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 text-center text-sm text-gray-500/60 mt-auto">
      <p>
        Desenvolvido por{" "}
        <a
          href="https://github.com/vitoriapguimaraes"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          github.com/vitoriapguimaraes
        </a>
      </p>
    </footer>
  );
};

export default Footer;
