/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.vue",
      "./pages/**/*.{vue,js}",
      "./components/**/*.{vue,js}",
      "./layouts/**/*.vue",
      "./assets/**/*.{vue,js}",
    ],
    theme: {
      extend: {
        colors: {
          'green-neon': '#76FF03', // Verde neón
          'orange-bright': '#FF6F00', // Naranja brillante
          'gray-dark': '#1A1A1A', // Gris oscuro
          'gray-light': '#B0B0B0', // Gris claro
          'gray-medium': '#2A2A2A', // Gris medio
          'red-dark': '#FF0033', // Rojo oscuro
        },
        transitionProperty: {
          'colors': 'color, background-color, border-color',
          'transform': 'transform'
        },
        fontFamily: {
          sans: ['Arial', 'sans-serif'],
        },
        spacing: {
          128: '32rem', // Para el tamaño de elementos más grandes, si es necesario
        },
      },
    },
    plugins: [],
  }
  