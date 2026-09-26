import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1F3B2E",
          deep: "#142A20"
        },
        olive: "#51603C",
        ivory: "#F7F3E9",
        sand: "#E4D5AF",
        sage: {
          DEFAULT: "#B9C7A6",
          light: "#CBD6B8",
          pale: "#DEE5CD"
        },
        charcoal: {
          DEFAULT: "#22241F",
          soft: "#4A4C43"
        },
        signal: "#C6E24B"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        manrope: ["var(--font-manrope)", "system-ui", "sans-serif"],
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"]
      },
      maxWidth: {
        content: "1280px"
      }
    }
  },
  plugins: []
};
export default config;
