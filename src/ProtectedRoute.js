import { Navigate } from "react-router-dom";

// Check for token in localStorage
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // returns true if token exists
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;


// import { Navigate } from "react-router-dom";

// // Dummy authentication function
// const isAuthenticated = () => {
//   return localStorage.getItem("auth") !== null; 
// };

// const ProtectedRoute = ({ element }) => {
//   return isAuthenticated() ? element : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
