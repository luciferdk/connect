/** @type {import('tailwindcss').Config} */

// module.exports = {
  // content: [
   // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
   // "./components/**/*.{js,ts,jsx,tsx,mdx}",
   // "./app/**/*.{js,ts,jsx,tsx,mdx}",
 // ],
 // theme: {
   // extend: {},
 // },
  // plugins: [require('daisyui')],
// };


/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
