const express = require('express');
const http = require('http'); // Potřebujeme nativní http modul
const cors = require('cors');
const { startWs } = require('./wsController'); // Předpokládám, že takhle importuješ

const app = express();
app.use(cors());

// Jednoduchý endpoint, aby Render věděl, že žijeme (Health Check)
app.get('/', (req, res) => {
  res.send('Server běží OK');
});

// Vytvoříme HTTP server, který obalí Express
const server = http.createServer(app);

// Předáme tento server WebSocketům (aby běžely na stejném portu)
startWs(server);

// Až tady posloucháme na portu!
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});