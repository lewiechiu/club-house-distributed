module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    // screens: {
    //   sm: "576px",
    //   md: "768px",
    //   lg: "992px",
    //   xl: "1200px",
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
