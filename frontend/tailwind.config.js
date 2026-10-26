/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Grayscale palette (Neutral / Slate inspired by Linear & GitHub)
        surface: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
        // Single Accent Color (Forest Green / Botanical for Plantify)
        accent: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Store & Brand Palette (K&B Plants identity)
        brand: {
          DEFAULT: "#285a45",
          dark: "#1c382a",
          ink: "#204b38",
          hover: "#1e4635",
          light: "#f2f4f2",
          sage: "#eff3ec",
          line: "#e5e9e1",
          overlay: "#143224",
          facebook: "#1877f2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "'Be Vietnam Pro'", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "'Lora'", "'Times New Roman'", "Times", "serif"],
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "8px",
        lg: "8px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        none: "none",
      },
    },
  },
  plugins: [],
};
