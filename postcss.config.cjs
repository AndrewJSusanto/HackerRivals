module.exports = {
  // Only run Tailwind + Autoprefixer here. Avoid adding postcss-import
  // so PostCSS won't try to parse tailwindcss's JS entry as CSS.
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
