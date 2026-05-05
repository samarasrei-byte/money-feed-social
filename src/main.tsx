import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Dark mode is default (TikTok-style). Users can opt-out via Settings.
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
