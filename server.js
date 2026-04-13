const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const linksDB = {};

app.post('/shorten', (req, res) => {
    const { urlOriginal } = req.body;
    if (!urlOriginal) return res.status(400).json({ error: "URL vazia" });

    const code = Math.random().toString(36).substring(2, 7);
    linksDB[code] = urlOriginal;
    
    // Agora usando a porta 5000 para não dar erro
    const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;
    res.json({ shortUrl, code });
});

app.get('/:code', (req, res, next) => {
    const urlOriginal = linksDB[req.params.code];
    if (urlOriginal) return res.redirect(urlOriginal);
    next();
});

app.get('/api/download', async (req, res) => {
    const { url, format } = req.query;
    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            ytdl(url, { filter: 'audioonly' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(url).pipe(res);
        }
    } catch (e) {
        res.status(500).send("Erro no download.");
    }
});

// USANDO A PORTA 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n✅ SISTEMA LIGADO COM SUCESSO!`);
    console.log(`🌍 ACESSE AQUI: http://localhost:${PORT}/dashboard.html\n`);
});