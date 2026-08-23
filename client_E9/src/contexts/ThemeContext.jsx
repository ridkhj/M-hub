import { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem("mhub-tema") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("mhub-tema", tema);
  }, [tema]);
  const toggleTema = () => setTema(t => (t === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ tema, toggleTema }}>{children}</ThemeContext.Provider>;
}
export const useTema = () => useContext(ThemeContext);
