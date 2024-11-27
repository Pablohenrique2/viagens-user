import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Routes from "./routes/Routes";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  );
}
