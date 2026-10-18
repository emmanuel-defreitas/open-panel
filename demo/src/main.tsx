import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "open-panel-react/style.css";
import "./styles.css";
import { Site } from "./Site";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Site />
  </StrictMode>,
);
