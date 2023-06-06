import { useCallback, useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.theme ?? "");

  const switchThemeEvent = useCallback(() => {
    const newTheme = theme === "twelventi" ? "twelventidark" : "twelventi";
    localStorage.theme = newTheme;
    setTheme(newTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <div className="flex items-center">
        <FaMoon className="mx-2" />
        <input
          type="checkbox"
          className="toggle"
          checked={theme == "twelventi"}
          onClick={switchThemeEvent}
        />
        <FaSun className="mx-2" />
      </div>
    </>
  );
}
