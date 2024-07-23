import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'main-card': '0 6px 15px rgba(0, 128, 255, 0.4), 0 6px 15px rgba(0, 128, 255, 0.4)', // Blueish shadow
        'rewards-card': '0 4px 12px rgba(0, 0, 0, 1)', // Light black shadow for floating effect
      },
      colors: {
        'custom-blue': '#0099ff', // Optional: for consistency with the shadow color
      },
    },
  },
  plugins: [],
};

export default config;