import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0a0a0a",
          secondary: "#111111",
          tertiary: "#1a1a1a",
        },
        foreground: {
          DEFAULT: "#f5f5f5",
          muted: "#a3a3a3",
        },
        accent: {
          cyan: "#06b6d4",
          "cyan-dark": "#0891b2",
          violet: "#8b5cf6",
          "violet-dark": "#7c3aed",
        },
        border: {
          DEFAULT: "#1f1f1f",
          hover: "#2a2a2a",
        },
      },
    },
  },
  plugins: [],
};
export default config;



