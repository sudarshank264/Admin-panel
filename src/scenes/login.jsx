import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import api from "../api";
import { BASE_URL } from "../data/constants.js";

const Login = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request to:", `${BASE_URL}/auth/admin/login`);

      const response = await api.post(`${BASE_URL}/auth/admin/login`, {
        email,
        password,
      });

      console.log("Full login response:", response);

      // Adjust this depending on your backend response shape
      const token =
        response?.data?.accessToken ||
        response?.data?.token ||
        response?.data?.data?.accessToken ||
        response?.data?.data?.token;

      if (token) {
        localStorage.setItem("authToken", token); // Store token in localStorage
        setIsAuth(true); // Update auth state
        navigate("/"); // Redirect to dashboard/home
      } else {
        alert("Login failed: Token not received.");
      }
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Paper elevation={5} sx={{ padding: 4, width: 350, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
