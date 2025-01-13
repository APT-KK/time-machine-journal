
module.exports = {
    content: [
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        
        backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #FFA8A8 10%, #FCFF00 100%)',
        },
      
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
          'l3': 'l3 1s infinite linear',
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
          l3: {
            '20%': { 'background-position': '0% 0%, 50% 50%, 100% 50%' },
            '40%': { 'background-position': '0% 100%, 50% 0%, 100% 50%' },
            '60%': { 'background-position': '0% 50%, 50% 100%, 100% 0%' },
            '80%': { 'background-position': '0% 50%, 50% 50%, 100% 100%' },
          },
        },
        backgroundSize: {
          '1/3': 'calc(100% / 3) 50%',
        },
        backgroundImage: {
          'custom-gradient': 'radial-gradient(circle closest-side, #000 90%, #0000)',
        },
      },
    },
    plugins: [require('@tailwindcss/typography'),
      function({ addUtilities }) {
        addUtilities({
          '.scrollbar-hide': {
            /* For IE and Edge */
            '-ms-overflow-style': 'none',
            /* For Firefox */
            'scrollbar-width': 'none',
            /* For Chrome, Safari, and Opera */
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }
        })
      }
    ],
  }