import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("auth"));
  const navigate = useNavigate();

  // Update auth state if localStorage changes from another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem("auth"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuth && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} handleLogout={handleLogout} />
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
