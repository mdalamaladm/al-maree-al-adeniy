import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{svelte,html,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        maree: {
          main: '#8BE3E1',
          secondary: '#97935C',
          'accent': '#D3F7AD',
          'dark-accent': '#95BB76',
          'darker-accent': '#72905A',
          error: '#E23645',
          warning: '#EDC25E',
          success: '#84D959',
          black: '#1F242E',
          info: '#3B3486',
          'dark-gray': '#414958',
          'dark-gray-thin': '#414958af',
          gray: '#C8CBD0',
          'light-gray': '#F2F2F3',
        }
      }
    },
  },
  plugins: [],
}

export default config
