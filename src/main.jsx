import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import Admin from "./pages/Admin.jsx";
import { AuthProvider } from "./app/context/AuthContext";
import "./styles/index.css";

const isAdminRoute = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdminRoute ? (
      <Admin />
    ) : (
      <AuthProvider>
        <App />
      </AuthProvider>
    )}
  </React.StrictMode>
);
