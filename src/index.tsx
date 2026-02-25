import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client"; // Use the 'client' sub-module
import { App } from "./App";

// 1. Get the root element from your HTML
const container = document.getElementById("root");

// 2. Initialize the root with a null check (TypeScript safety)
if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);

// 3. Render your app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);