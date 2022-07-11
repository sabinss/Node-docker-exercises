const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hi there !!', env: process.env.NODE_ENV });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('listening to port' + port));
