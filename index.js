require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const dns = require('dns')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

let nextId = 1
let db = {}
app.post('/api/shorturl', function(req, res) {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Extract hostname from the URL
  const hostname = new URL(url).hostname;

  dns.lookup(hostname, (err, addr) => {
    if (err) { 
      res.json({ error: 'invalid url' });
    } else {
      uniqueId = nextId++;
      db[uniqueId] = url;
      console.log(db);
      res.json({ "original_url": url, "short_url": uniqueId});
    }
  });
  
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const { short_url } = req.params;
  if (!short_url) {
    res.json({"error": "No short URL found for the given input"})
  }

  if (!(short_url in db)) {
    res.json({"error": "No short URL found for the given input"})
  }

  const originalUrl = db[short_url]


  
  res.redirect(originalUrl);

});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
