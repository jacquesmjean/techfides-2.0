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
        // TechFides Official Brand Palette
        brand: {
          primary: "#00AEEF",    // Primary Blue — buttons, links, accents
          dark: "#003F6B",       // Dark Blue — headings, nav
          light: "#F5F7FA",      // Light Gray — backgrounds
          black: "#000000",      // Body text
        },
        // TechFides "Sovereign Tech" palette (dark theme)
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
        heading: ["var(--font-montserrat)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
