function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function toggleModal() {
    const modal = document.getElementById('plan-modal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

async function handleShorten() {
    const urlInput = document.getElementById('short-url-input');
    const btn = document.getElementById('btn-encurtar');
    if(!urlInput.value) return alert("Insira um link");
    btn.innerText = "GERANDO...";
    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urlOriginal: urlInput.value })
        });
        const data = await response.json();
        const list = document.getElementById('links-list');
        const div = document.createElement('div');
        div.className = "glass p-6 rounded-2xl flex justify-between items-center border-l-4 border-[#bc13fe] mt-4";
        div.innerHTML = `<div><p class="text-[#bc13fe] font-bold">${data.shortUrl}</p><p class="text-[10px] text-gray-500">Salvo no Banco de Dados</p></div><button onclick="navigator.clipboard.writeText('${data.shortUrl}'); alert('Copiado!')" class="bg-white/10 px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#bc13fe]">COPIAR</button>`;
        list.prepend(div);
        urlInput.value = "";
    } catch (e) { alert("Erro ao conectar."); }
    btn.innerText = "ENCURTAR";
}

function handleQR() {
    const val = document.getElementById('qr-input').value;
    if(!val) return alert("Insira um link");
    document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(val)}`;
    document.getElementById('qr-result').classList.remove('hidden');
}

function handleYT() {
    const url = document.getElementById('yt-url').value;
    const format = document.getElementById('yt-format').value;
    if(!url.includes('youtu')) return alert("Link inválido");
    // Link direto para o nosso servidor
    window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
}

// Abre e fecha o modal de planos
function toggleModal() {
    const modal = document.getElementById('plan-modal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

// Abre a área de pagamento (Pix/Cartão)
function openCheckout(planoNome) {
    alert("Você escolheu o plano: " + planoNome + "\nRedirecionando para o Checkout de Pagamento...");
    // Aqui no futuro colocaremos o link do Mercado Pago ou Stripe
    window.open("https://www.mercadopago.com.br", "_blank"); 
}