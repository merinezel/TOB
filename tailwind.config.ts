import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tobs: "#C4070D",
        ink: "#111111",
        cream: "#F5F1EA",
        ivory: "#FAF9F6",
        grey: "#D8D5CF",
        "dark-grey": "#363636",
      },
      fontFamily: {
        poster: ["var(--font-poster)", "Arial Black", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        ui: ["var(--font-ui)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
