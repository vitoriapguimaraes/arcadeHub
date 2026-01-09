import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import GamePlaceholder from "./pages/GamePlaceholder";
import Hangman from "./games/Hangman";
import TugOfWar from "./games/TugOfWar";
import Bridge from "./games/Bridge";
import Guessing from "./games/Guessing";
import RPS from "./games/RPS";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="hangman" element={<Hangman />} />
          <Route path="tug-of-war" element={<TugOfWar />} />
          <Route path="bridge" element={<Bridge />} />
          <Route path="guessing" element={<Guessing />} />
          <Route path="rps" element={<RPS />} />

          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <h1>404 - Página não encontrada</h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
