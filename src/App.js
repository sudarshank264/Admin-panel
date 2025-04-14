import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Soiltests from "./scenes/soiltest";
import Reports from "./scenes/Reports";
import Agents from "./scenes/agents";
import Products from "./scenes/product";
import Orders from "./scenes/orders";
import Login from "./scenes/login";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("authToken"));
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  // Update auth state if localStorage changes from another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuth(false);
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login"; // ✅ Check current page

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Show Sidebar only when authenticated AND not on login page */}
          {isAuth && !isLoginPage && <Sidebar isSidebar={isSidebar} />}

          <main className="content">
            {/* Show Topbar only when not on login page */}
            {!isLoginPage && <Topbar handleLogout={handleLogout} />}
            
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/soiltests" element={<ProtectedRoute element={<Soiltests />} />} />
              <Route path="/products" element={<ProtectedRoute element={<Products />} />} />
              <Route path="/agents" element={<ProtectedRoute element={<Agents />} />} />
              <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
              <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
