// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'care-light': '#F6F6F6',      // Main background
        'care-accent': '#D6E4F0',     // Light blue accent
        'care-primary': '#1E56A0',    // Primary blue button
        'care-dark': '#163172',       // Dark blue text
      },
    },
  },
  plugins: [],
}