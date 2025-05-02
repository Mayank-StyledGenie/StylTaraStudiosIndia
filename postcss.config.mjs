const config = {
  plugins: [
    '@tailwindcss/postcss',
    process.env.NODE_ENV === 'production' ? 'cssnano' : null,
  ].filter(Boolean),
};

export default config;