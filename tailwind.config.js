/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-public-sans)"],
        archivoblack: ["var(--font-archivo-black)"],
      },
      colors: {
        "theme-blue": "#007DFB",
        "theme-blue-darker": "#0D46D5",
      },
    },
  },
  plugins: [],
};
