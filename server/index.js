const express = require('express');
const path = require('path');

const server = express();
const PORT = 1227;

server.use(express.static(path.join(__dirname, '../client/public')));

server.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../client/public/index.html'))
);

server.listen(PORT, () =>
  console.log(`static file server now is opening on port ${PORT}`)
);
