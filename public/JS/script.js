let billingType = 'monthly';

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

function toggleBilling() {
    const dot = document.getElementById('toggle-dot');
    const labelM = document.getElementById('label-mensal');
    const labelA = document.getElementById('label-anual');
    const prices = document.querySelectorAll('.price-val');

    if (billingType === 'monthly') {
        billingType = 'annual';
        dot.style.transform = 'translateX(28px)';
        labelM.classList.replace('text-white', 'text-gray-500');
        labelA.classList.replace('text-gray-500', 'text-white');
        prices.forEach(p => p.innerText = '$' + p.dataset.annual);
    } else {
        billingType = 'monthly';
        dot.style.transform = 'translateX(0)';
        labelA.classList.replace('text-white', 'text-gray-500');
        labelM.classList.replace('text-gray-500', 'text-white');
        prices.forEach(p => p.innerText = '$' + p.dataset.monthly);
    }
}

function openCheckout(plan) {
    document.getElementById('checkout-plan').innerText = `Plano ${plan} (${billingType === 'monthly' ? 'Mensal' : 'Anual'})`;
    document.getElementById('plan-modal').classList.add('hidden');
    document.getElementById('checkout-modal').classList.replace('hidden', 'flex');
}

function toggleCheckout() {
    document.getElementById('checkout-modal').classList.replace('flex', 'hidden');
}

// RESTANTE DAS FUNÇÕES (Shorten, QR, YT)
async function handleShorten() {
    const input = document.getElementById('short-url-input');
    const btn = document.getElementById('btn-encurtar');
    if(!input.value) return;
    btn.innerText = "GERANDO...";
    try {
        const res = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urlOriginal: input.value })
        });
        const data = await res.json();
        if (res.status === 403) return toggleModal();
        const list = document.getElementById('links-list');
        const div = document.createElement('div');
        div.className = "glass p-6 rounded-2xl flex justify-between items-center border-l-4 border-[#bc13fe] mt-4";
        div.innerHTML = `<div><p class="text-[#bc13fe] font-bold text-sm">${data.shortUrl}</p></div><button onclick="navigator.clipboard.writeText('${data.shortUrl}'); alert('Copiado!')" class="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold">COPIAR</button>`;
        list.prepend(div);
        input.value = "";
    } catch (e) { alert("Erro."); }
    btn.innerText = "ENCURTAR";
}

function handleQR() {
    const val = document.getElementById('qr-input').value;
    if(!val) return;
    document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(val)}`;
    document.getElementById('qr-result').classList.remove('hidden');
}

function handleYT() {
    const url = document.getElementById('yt-url').value;
    const format = document.getElementById('yt-format').value;
    if(!url.includes('youtu')) return alert("Link inválido");
    window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
}