import express from 'express';
import http from 'http';
import cors from 'cors';
import startWs from './ws/wsController.js';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server běží OK');
});

const server = http.createServer(app);

// Předáme server WebSocketům
startWs(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});