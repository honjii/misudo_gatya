// tailwind.config.js
module.exports = {
  mode: "jit",
  content: ["./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        deku: {
          DEFAULT: "#228b22",
        },
        kamui: {
          DEFAULT: "#d2691e",
        },
        koda: {
          DEFAULT: "#ffe4e1",
        },
        amamiyagord: {
          DEFAULT: "#8b4513",
        },
      },
    },
  },
  plugins: [],
};
