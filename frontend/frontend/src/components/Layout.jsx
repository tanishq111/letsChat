import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../context/authContext.jsx";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-svh w-full overflow-hidden bg-canvas">
      <Sidebar user={user} onLogout={logout} />
      <main className="hidden h-svh min-w-0 flex-1 md:flex">{children}</main>
    </div>
  );
};

export default Layout;