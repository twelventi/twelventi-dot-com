const colors = require("tailwindcss/colors");

const backgroundSize = {
  auto: "auto",
  cover: "cover",
  contain: "contain",
  10: "10",
  16: "4rem",
};

const config = {
  content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
  plugins: [require("daisyui")],
  theme: {
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
      "10%": "10%",
      16: "4rem",
    },
  },
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "twelventidark",
    themes: [
      {
        twelventi: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#1e40af",
          secondary: "#f59e0b",
          accent: "#6f7a90",
        },
      },
      {
        twelventidark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#1e40af",
          secondary: "#f59e0b",
          accent: "#6f7a90",
           
        },
      },
    ],
  },
};

module.exports = config;
