const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
//const fetch = require('node-fetch'); // node-fetch modülünü ekleyin
const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);


const app = express();
const port = 3001;

let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();




app.use(cors()); // CORS middleware'ini ekleyin
app.use(express.json());

//const { spawn } = require('child_process');

app.post('/search', (req, res, next) => {
  const { query } = req.body;
  const pythonProcess = spawn('python', ['./scholardeneme.py', query]);

  let dataString = '';

  pythonProcess.stdout.on('data', function(data) {
    dataString += data.toString();
  });

  pythonProcess.stdout.on('end', function() {
    try {
      const data = JSON.parse(dataString);
      res.json(data); // İstemciye veriyi gönder
      req.searchResults = data; // Veriyi sonraki middleware'e ilet
      next(); // Sonraki middleware'i çağır
    } catch (error) {
      res.status(500).json({ error: 'Error parsing Python script output' });
    }
  });

  pythonProcess.stderr.on('data', function(data) {
    console.error(`stderr: ${data}`);
    res.status(500).json({ error: data.toString() });
  });
});

app.post('/download', async (req, res) => {
  const { url } = req.body; // Frontend'den gelen PDF URL'si

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('PDF indirilemedi.');

    // Dosya adını URL'den çıkarın veya varsayılan bir ad kullanın
    const filename = url.split('/').pop() || 'document.pdf';

    // Yanıtı dosyaya yaz
    const filePath = './downloads/' + filename;
    await pipeline(response.body, fs.createWriteStream(filePath));

    // Dosyayı HTTP yanıtı olarak gönder
    res.download(filePath, filename, (err) => {
      if (err) console.error('Dosya gönderme hatası:', err);

      // İşlem bittikten sonra dosyayı sil
      fs.unlink(filePath, (err) => {
        if (err) console.error('Dosya silme hatası:', err);
      });
    });
  } catch (error) {
    console.error('PDF indirme hatası:', error);
    res.status(500).json({ error: 'PDF indirilemedi' });
  }
});


const bodyParser = require('body-parser');



app.use(bodyParser.json());

// Örnek bir endpoint
app.post('/search-results', (req, res) => {
  // Elasticsearch'ten gelen sonuçları almak için burada kullanabilirsiniz
  const searchResults = req.body;

  // Gelen sonuçları işleyebilir ve istemciye geri gönderebilirsiniz
  res.json(searchResults);
});

app.get('/get-data', (req, res) => {
  const pythonProcess = spawn('python', ['./firststart.py']);

  let dataString = '';

  pythonProcess.stdout.on('data', function(data) {
    dataString += data.toString();
  });

  pythonProcess.stdout.on('end', function() {
    try {
      const data = JSON.parse(dataString);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error parsing Python script output' });
    }
  });

  pythonProcess.stderr.on('data', function(data) {
    console.error(`stderr: ${data}`);
    res.status(500).json({ error: data.toString() });
    return; // Bu hatayı ekleyin
  });

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

