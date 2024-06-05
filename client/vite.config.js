import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // specify the IP address here
    port: 5173 // specify the port number here
  },
})

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: 'localhost', // specify the IP address here
//     port: 5173 // specify the port number here
//   },
// })

