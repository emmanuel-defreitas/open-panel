import { useEffect, useState } from "react";
import { App } from "./App";
import { Docs } from "./Docs";

export function Site() {
  const [playground, setPlayground] = useState(location.hash === "#playground");
  useEffect(() => {
    const change = () => setPlayground(location.hash === "#playground");
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playground]);
  return playground ? <App /> : <Docs />;
}
