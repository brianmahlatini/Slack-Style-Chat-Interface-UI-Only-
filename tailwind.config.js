module.exports = {
  content: ["./src/**/*.{html,ts}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Newsreader", "serif"],
        ui: ["Space Grotesk", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          900: "#0d0f12",
          800: "#151922",
          700: "#1f2531",
          600: "#2b3342",
          500: "#3a4458",
          400: "#57627a",
          300: "#7a879f",
          200: "#aab3c3"
        },
        lime: {
          500: "#a8ff60",
          600: "#8be44a"
        },
        coral: {
          500: "#ff7a7a"
        }
      },
      boxShadow: {
        soft: "0 20px 50px -30px rgba(0,0,0,0.45)",
        card: "0 18px 35px -25px rgba(15,19,26,0.7)"
      }
    }
  },
  plugins: []
};
