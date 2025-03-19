import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // ✅ Make sure this is correct
import { router } from "./App.jsx"; // ✅ Ensure `router` is correctly imported
import { AuthProvider } from "./context/AuthProvider.jsx";
// import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RouterProvider router={router} /> {/* ✅ Ensure this is a valid router */}
  </AuthProvider>
);
