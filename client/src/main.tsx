import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[Main] Starting React mount...");
createRoot(document.getElementById("root")!).render(<App />);
console.log("[Main] Render called.");
