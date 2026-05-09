function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('btn-' + tabId).classList.add('active');
}

function toggleModal() {
    const modal = document.getElementById('plan-modal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

async function handleShorten() {
    const input = document.getElementById('short-url-input');
    const btn = document.getElementById('btn-encurtar');
    if(!input.value) return alert("Insira um link");
    btn.innerText = "GERANDO...";

    try {
        const res = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urlOriginal: input.value })
        });
        
        const data = await res.json();

        if (res.status === 403) {
            alert("Limite de 5 links gratuitos atingido!");
            return toggleModal();
        }

        const list = document.getElementById('links-list');
        const div = document.createElement('div');
        div.className = "glass p-6 rounded-2xl flex justify-between items-center border-l-4 border-[#bc13fe] mt-4 animate-bounce";
        div.innerHTML = `<div><p class="text-[#bc13fe] font-bold text-sm">${data.shortUrl}</p></div><button onclick="navigator.clipboard.writeText('${data.shortUrl}'); alert('Copiado!')" class="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-[#bc13fe]">COPIAR</button>`;
        list.prepend(div);
        input.value = "";
        setTimeout(()=> div.classList.remove('animate-bounce'), 1000);

    } catch (e) { alert("Erro de conexão."); }
    btn.innerText = "ENCURTAR";
}

function handleQR() {
    const val = document.getElementById('qr-input').value;
    if(!val) return alert("Insira um link");
    document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(val)}`;
    document.getElementById('qr-result').classList.remove('hidden');
}

// MENSAGEM COM OS NOVOS PREÇOS (R$10 e R$50)
function openWhatsAppCheckout(plano, preco) {
    const msg = `Olá Alexandre! Desejo assinar o Plano Profissional ${plano} no valor especial de R$ ${preco},00. Quais são as chaves para pagamento?`;
    window.open(`https://wa.me/88996317399?text=${encodeURIComponent(msg)}`, '_blank');
}