import { handler } from './build/handler.js';
import express from 'express';
 
const app = express();
 
// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
  res.end('ok');
});
 
// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);
 
app.listen(3000, '0.0.0.0', () => {
  console.log('listening on port 0.0.0.0:3000');
});