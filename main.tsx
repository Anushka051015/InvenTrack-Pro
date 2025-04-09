import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createContext } from "react";

// Set the document title
document.title = "ProductHub - Product Management System";

// Create responsive viewport meta tag
const meta = document.createElement("meta");
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
document.head.appendChild(meta);

// Add Inter font from Google Fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

createRoot(document.getElementById("root")!).render(<App />);
