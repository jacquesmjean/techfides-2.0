import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TechFides "Sovereign Tech" palette
        slate: {
          950: "#0a0f1a",
        },
        navy: {
          900: "#0d1b2a",
          800: "#1b2838",
          700: "#243447",
        },
        electric: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        accent: {
          green: "#22c55e",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
