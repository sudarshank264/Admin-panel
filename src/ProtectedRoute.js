import { Navigate } from "react-router-dom";

// Dummy authentication function
const isAuthenticated = () => {
  return localStorage.getItem("auth") !== null; 
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
