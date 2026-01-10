import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex flex-row min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-x-hidden relative h-screen overflow-y-auto scrollbar-thin">
        <div className="w-full h-full m-0 p-8 flex flex-col max-w-full md:p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
