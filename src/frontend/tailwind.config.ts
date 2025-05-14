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
        'brand-dark': '#0A0F1A', // A very dark blue/black, adjust as needed
        'brand-blue': '#0052CC', // Main blue for buttons and highlights
        'brand-blue-light': '#0066FF', // Lighter blue for hover or secondary elements
        'brand-nav': '#161D2B', // Navbar background color
        'brand-text-light': '#E0E0E0', // Light text for dark backgrounds
        'brand-text-dim': '#A0A0A0', // Dimmer text
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
