let billingType = 'monthly';
let selectedPlanPrice = 0;
let selectedPlanName = "";

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('btn-' + tabId).classList.add('active');
}

function toggleModal() {
    document.getElementById('plan-modal').classList.toggle('hidden');
    document.getElementById('plan-modal').classList.toggle('flex');
}

function toggleBilling() {
    const dot = document.getElementById('toggle-dot');
    const prices = document.querySelectorAll('.price-val');
    if (billingType === 'monthly') {
        billingType = 'annual';
        dot.style.transform = 'translateX(28px)';
        prices.forEach(p => p.innerText = 'R$' + p.dataset.annual);
    } else {
        billingType = 'monthly';
        dot.style.transform = 'translateX(0)';
        prices.forEach(p => p.innerText = 'R$' + p.dataset.monthly);
    }
}

function openCheckout(plan, price) {
    selectedPlanName = plan;
    selectedPlanPrice = billingType === 'monthly' ? price : price * 10;
    
    document.getElementById('checkout-plan').innerText = `Plano ${plan} (${billingType === 'monthly' ? 'Mensal' : 'Anual'}) - R$ ${selectedPlanPrice}`;
    
    // Lógica de Parcelas
    const parcelasDiv = document.getElementById('parcelas-text');
    if (selectedPlanPrice >= 100) {
        parcelasDiv.innerText = `💳 Disponível em até 2x de R$ ${(selectedPlanPrice/2).toFixed(2)} sem juros`;
    } else {
        parcelasDiv.innerText = "";
    }

    document.getElementById('plan-modal').classList.add('hidden');
    document.getElementById('checkout-modal').classList.replace('hidden', 'flex');
}

function setPayMode(mode) {
    const isPix = mode === 'pix';
    document.getElementById('area-pix').classList.toggle('hidden', !isPix);
    document.getElementById('area-card').classList.toggle('hidden', isPix);
    document.getElementById('btn-pay-pix').className = isPix ? 'flex-1 py-3 border-b-2 border-[#bc13fe] font-bold' : 'flex-1 py-3 border-b-2 border-transparent text-gray-500';
    document.getElementById('btn-pay-card').className = !isPix ? 'flex-1 py-3 border-b-2 border-[#bc13fe] font-bold' : 'flex-1 py-3 border-b-2 border-transparent text-gray-500';
}

function confirmarPagamento(metodo) {
    const nome = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;

    if(!nome || !email) return alert("Preencha seu nome e e-mail para continuar.");

    const msg = `Olá Alexandre! Acabei de realizar o pagamento do *Plano ${selectedPlanName}* via *${metodo}*.\n\n` +
                `👤 *Nome:* ${nome}\n` +
                `📧 *E-mail:* ${email}\n` +
                `💰 *Valor:* R$ ${selectedPlanPrice}\n` +
                `📅 *Ciclo:* ${billingType === 'monthly' ? 'Mensal' : 'Anual'}`;

    const whatsappUrl = `https://wa.me/88996317399?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
}

function toggleCheckout() {
    document.getElementById('checkout-modal').classList.replace('flex', 'hidden');
}

// Funções do Encurtador (Centralizadas)
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
        if (res.status === 403) return toggleModal();
        
        const list = document.getElementById('links-list');
        const div = document.createElement('div');
        div.className = "glass p-6 rounded-2xl flex justify-between items-center border-l-4 border-[#bc13fe] mt-4 animate-bounce";
        div.innerHTML = `<div><p class="text-[#bc13fe] font-bold text-sm">${data.shortUrl}</p></div><button onclick="navigator.clipboard.writeText('${data.shortUrl}'); alert('Link Copiado!')" class="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold">COPIAR</button>`;
        list.prepend(div);
        input.value = "";
        setTimeout(()=> div.classList.remove('animate-bounce'), 1000);
    } catch (e) { alert("Erro de conexão."); }
    btn.innerText = "ENCURTAR";
}

function handleQR() {
    const val = document.getElementById('qr-input').value;
    if(!val) return;
    document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(val)}`;
    document.getElementById('qr-result').classList.remove('hidden');
}

function handleYT() {
    const url = document.getElementById('yt-url').value;
    const format = document.getElementById('yt-format').value;
    if(!url.includes('youtu')) return alert("Link inválido");
    window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
}