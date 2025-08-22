// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [ react() ],
//   server: {
//     host: 'localhost',  // ensure it matches what you're using
//     port: 5173,         // or whatever your dev server runs on
//     hmr: {
//       protocol: 'ws',     // use 'wss' if serving via https
//       host: 'localhost',
//       port: 5173,        // same as server port
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwind(), react()],
});
