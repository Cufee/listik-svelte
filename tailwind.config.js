/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,svelte}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["emerald"],
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
}

