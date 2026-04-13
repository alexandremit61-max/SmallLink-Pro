function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

async function handleShorten() {
    const urlInput = document.getElementById('short-url-input');
    const btn = document.getElementById('btn-encurtar');
    const urlOriginal = urlInput.value;

    if(!urlOriginal) return alert("Insira um link");
    btn.innerText = "GERANDO...";

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urlOriginal })
        });

        const data = await response.json();
        const list = document.getElementById('links-list');
        const div = document.createElement('div');
        div.className = "glass p-6 rounded-2xl flex justify-between items-center border-l-4 border-[#bc13fe] animate-pulse";
        div.innerHTML = `
            <div class="flex flex-col">
                <p class="text-[#bc13fe] font-bold text-lg">${data.shortUrl}</p>
                <p class="text-[10px] text-gray-500">${urlOriginal.substring(0,40)}...</p>
            </div>
            <button onclick="copyTo('${data.shortUrl}')" class="bg-white/10 px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#bc13fe]">COPIAR</button>
        `;
        list.prepend(div);
        urlInput.value = "";
    } catch (e) { alert("Erro ao conectar ao servidor."); }
    btn.innerText = "ENCURTAR";
}

function handleQR() {
    const data = document.getElementById('qr-input').value;
    if(!data) return alert("Insira um link");
    document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
    document.getElementById('qr-result').classList.remove('hidden');
}

function handleYT() {
    const url = document.getElementById('yt-url').value;
    const format = document.getElementById('yt-format').value;
    if(!url.includes('youtu')) return alert("Link inválido");
    window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
}

function copyTo(text) {
    navigator.clipboard.writeText(text);
    alert("Copiado com sucesso!");
}