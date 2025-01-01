
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#2414d0d0',
          'primary-light': '#6366f1',
          'primary-dark': '#3730a3',
          'gradient-start': '#0ED2F7',
          'gradient-end': '#B224EF',
        },
        animation: {
          'bounce-slow': 'bounce 3s linear infinite',
          'fadeIn': 'fadeIn 1s ease-out',
          'slideUp': 'slideUp 1s ease-out',
          'marquee': 'marquee 5s linear infinite alternate',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          marquee: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(100%)' },
          },
        },
      },
    },
    plugins: [],
  }