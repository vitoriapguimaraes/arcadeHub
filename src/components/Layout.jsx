import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const BACKGROUNDS = {
  "/": "bg-background",
  "/hangman": "bg-gradient-to-br from-[#0f0e17] via-[#2e1f2e] to-[#0f0e17]", // Dark Purple/Black
  "/tug-of-war": "bg-gradient-to-br from-[#0f0e17] via-[#2e1a15] to-[#0f0e17]", // Dark Orange/Red/Black
  "/bridge": "bg-gradient-to-br from-[#0f0e17] via-[#102a20] to-[#0f0e17]", // Dark Green/Black
  "/guessing": "bg-gradient-to-br from-[#0f0e17] via-[#151a30] to-[#0f0e17]", // Dark Blue/Black
  "/rps": "bg-gradient-to-br from-[#0f0e17] via-[#2e2a15] to-[#0f0e17]", // Dark Yellow/Black
};

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  // Fallback to default background if path not found (e.g. sub-routes), or exact match
  const bgClass = BACKGROUNDS[currentPath] || BACKGROUNDS["/"];

  return (
    <div className="flex flex-row min-h-screen bg-background relative overflow-hidden transition-colors duration-700">
      {/* Dynamic Background Layer */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-700 ${bgClass}`}
      />

      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative h-screen z-10">
        <div className="w-full h-full m-0 p-8 flex flex-col max-w-full md:p-4 perspective-[1000px]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Layout;
