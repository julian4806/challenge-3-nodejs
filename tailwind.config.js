/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    colors: {
      // dark theme
      white: "#fff",
      black: "#000",
      transparent: "#00000000",
      "header-footer-dark": "#1F1F1F",
      "background-light": "#E3E3E3",
      "background-dark": "#292929",
      "background-sidebar-dark": "#3E3E3E",
      "background-message-dark": "#2B2B2B",
      "text-dark": "#606060",
      "rooms-button-dark": "#606060",
      "nickname-button": "#007EF4",
      "error-text": "#FF6464",
      "error-border": "#DD1E1E",


      "button-rooms": "#CCCCCC",
      "button-rooms-text": "#0A0A0A",
      "button-users/quit": "#1A78D1",


      "hover-group": "#515151",
      "selected-group": "#007EF4",
      "nickname-navbar": "#707070",
      // light theme
    },
  },
  plugins: [],
}

