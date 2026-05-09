require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ENCURTADOR COM LIMITE DE 5 LINKS
app.post('/shorten', async (req, res) => {
    const { urlOriginal } = req.body;
    const ipUser = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Conta no Supabase quantos links esse IP já criou
    const { count } = await supabase.from('links').select('*', { count: 'exact', head: true }).eq('criado_em_ip', ipUser);

    if (count >= 5) {
        return res.status(403).json({ error: "Limite de 5 links atingido!" });
    }

    const code = Math.random().toString(36).substring(2, 7);
    await supabase.from('links').insert([{ url_original: urlOriginal, codigo_curto: code, criado_em_ip: ipUser }]);
    
    res.json({ shortUrl: `${BASE_URL}/${code}` });
});

// REDIRECIONAMENTO
app.get('/:code', async (req, res, next) => {
    const { data } = await supabase.from('links').select('url_original, cliques').eq('codigo_curto', req.params.code).single();
    if (data) {
        await supabase.from('links').update({ cliques: data.cliques + 1 }).eq('codigo_curto', req.params.code);
        return res.redirect(data.url_original);
    }
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ SmallLink SaaS rodando na porta ${PORT}`));