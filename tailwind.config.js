// const { default: scrollbarSize } = require('scrollbar-size');

module.exports = {
  content: ["./index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'md' : [
        {'max' : '780px' }
      ]
    },
    extend: {
      fontFamily: {
      Sans:  ["Noto Sans KR", "sans-serif"]
      },
      dropShadow: {
        'sm':'0 0 4px(0, 0, 0, 0.5)'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
