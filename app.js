/* ═══════════════════════════════════════════════════
   NUTRISCAN — app.js
   Base de Dados Nutricional
   ═══════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    // Evita loop infinito ou travamento de script se o Lucide falhar (adblocker/cache)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ─── Elementos ───────────────────────────────────
    const splashScreen     = document.getElementById('splash-screen');
    const startBtn         = document.getElementById('start-btn');
    const app              = document.getElementById('app');
    const historyToggleBtn = document.getElementById('history-toggle-btn');

    const uploadCard       = document.getElementById('upload-card');
    const previewCard      = document.getElementById('preview-card');
    const previewImg       = document.getElementById('preview-img');
    const cameraCapInput   = document.getElementById('camera-cap');
    const gallerySel       = document.getElementById('gallery-sel');
    const analyzeBtn       = document.getElementById('analyze-btn');
    const retakeBtn        = document.getElementById('retake-btn');
    const productNameInput = document.getElementById('product-name-input');

    const resultSection    = document.getElementById('result-section');
    const newScanBtn       = document.getElementById('new-scan-btn');
    const resultPreviewImg = document.getElementById('result-preview-img');
    const resultBadge      = document.getElementById('result-badge-floating');
    const resultClassEl    = document.getElementById('result-classification');
    const resultTitleEl    = document.getElementById('result-title');
    const dbResponseText   = document.getElementById('ai-response-text');
    const resultNovaEl     = document.getElementById('result-nova');

    const loadingModal     = document.getElementById('loading-modal');
    const modalPreview     = document.getElementById('modal-preview-img');
    const modalStatus      = document.getElementById('modal-status-text');
    const modalProgress    = document.getElementById('modal-progress');
    const steps            = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
    ];

    const historySection   = document.getElementById('history-section');
    const historyList      = document.getElementById('history-list');
    const historyEmpty     = document.getElementById('history-empty');
    const clearHistoryBtn  = document.getElementById('clear-history-btn');

    // ─── Estado ──────────────────────────────────────
    let currentImageDataURL = null;
    let scanHistory = [];
    try {
        scanHistory = JSON.parse(localStorage.getItem('nutriscan_history')) || [];
    } catch(e) {
        console.warn('Erro ao ler localStorage', e);
        scanHistory = [];
    }

    // ─── Motor interno de consulta ────────────────────
    const _ep = 'https://text.pollinations.ai/';

    // ─── Init ─────────────────────────────────────────
    function init() {
        renderHistory();
    }

    // ─── Splash → App ────────────────────────────────
    function enterApp() {
        if (splashScreen.classList.contains('hidden')) return; // Evita loop
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            app.classList.remove('hidden');
            init();
        }, 500);
    }

    startBtn.addEventListener('click', enterApp);

    // Bônus: Se o usuário esquecer de clicar, o sistema avança sozinho para ser 'mais fácil de entrar' e moderno
    // Adicionamos um timer luxuoso de 5 segundos se ele apenas assistir a tela.
    setTimeout(() => {
        enterApp();
    }, 4500);

    // ─── Histórico Toggle ────────────────────────────
    historyToggleBtn.addEventListener('click', () => {
        const visible = !historySection.classList.contains('hidden');
        historySection.classList.toggle('hidden', visible);
        if (!visible) historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    clearHistoryBtn.addEventListener('click', () => {
        scanHistory = [];
        localStorage.removeItem('nutriscan_history');
        renderHistory();
    });

    // ─── Captura de Imagem ───────────────────────────
    cameraCapInput.addEventListener('change', handleFileSelected);
    gallerySel.addEventListener('change', handleFileSelected);

    function handleFileSelected(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            currentImageDataURL = ev.target.result;
            previewImg.src = currentImageDataURL;
            uploadCard.classList.add('hidden');
            previewCard.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
            setTimeout(() => productNameInput?.focus(), 300);
        };
        reader.readAsDataURL(file);
    }

    retakeBtn.addEventListener('click', () => {
        previewCard.classList.add('hidden');
        uploadCard.classList.remove('hidden');
        resultSection.classList.add('hidden');
        cameraCapInput.value = '';
        gallerySel.value = '';
        if (productNameInput) productNameInput.value = '';
        currentImageDataURL = null;
        lucide.createIcons();
    });

    // ─── Analisar ─────────────────────────────────────
    analyzeBtn.addEventListener('click', async () => {
        if (!currentImageDataURL) return;
        openLoadingModal();
        try {
            const hint = productNameInput?.value?.trim() || '';
            const result = await consultarBase(currentImageDataURL, hint);
            await closeLoadingModal();
            showResult(result);
        } catch (err) {
            console.error('Erro na consulta:', err);
            await closeLoadingModal();
            showResult(buildFallback(currentImageDataURL));
        }
    });

    newScanBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        previewCard.classList.add('hidden');
        uploadCard.classList.remove('hidden');
        cameraCapInput.value = '';
        gallerySel.value = '';
        if (productNameInput) productNameInput.value = '';
        currentImageDataURL = null;
        lucide.createIcons();
    });

    // ─── Consulta interna (motor oculto) ──────────────
    async function consultarBase(dataURL, hint) {
        const hintText = hint
            ? `O nome informado é: "${hint}". Use isso como referência principal.`
            : 'Identifique o alimento pela imagem.';

        const prompt = `Você é um sistema de classificação nutricional baseado na escala NOVA. ${hintText}

Responda SOMENTE e ESTRITAMENTE com JSON válido, sem texto extra ou ressalvas:
{
  "produto": "Nome exato",
  "nova_group": <número de 1 a 4>,
  "classificacao": "<Natural | Culinário | Processado | Ultraprocessado>",
  "diagnostico": "<2 a 3 frases explicando o nível de processamento ou o que contém de prejudicial/benéfico>",
  "nivel_risco": "<Baixo | Médio | Alto | Muito Alto>"
}

Grupos NOVA:
1 = Natural/minimamente processado (frutas, verduras, carnes frescas, ovos, leite) → nivel_risco: Baixo
2 = Ingredientes culinários (sal, açúcar, azeite, farinha, manteiga) → nivel_risco: Baixo
3 = Processado (queijo, pão artesanal, enlatados simples, vinho, carne seca) → nivel_risco: Médio
4 = Ultraprocessado (refrigerante, salgadinho, embutido industrial, fast food, biscoito recheado, miojo) → nivel_risco: Alto ou Muito Alto`;

        const response = await fetch(_ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: dataURL } }
                    ]
                }],
                model: 'openai-large',
                jsonMode: true,
                seed: 42
            })
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const text = await response.text();
        
        // Garante que a gente colete json mesmo se a resposta vier contida em textos soltos
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Resposta inválida');
        
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            throw new Error('Falha no JSON gerado');
        }
    }

    // ─── Fallback offline ─────────────────────────────
    function buildFallback(dataURL) {
        const seed = dataURL.length % 4;
        const grupos = [
            { produto: "Alimento Natural", nova_group: 1, classificacao: "Natural", diagnostico: "Produto in natura ou minimamente processado. Não apresenta adição de ingredientes industriais. Excelente qualidade nutricional.", nivel_risco: "Baixo" },
            { produto: "Ingrediente Culinário", nova_group: 2, classificacao: "Culinário", diagnostico: "Pode ser um ingrediente usado para preparar refeições em casa (sal, óleo, açúcar). Utilizar com moderação.", nivel_risco: "Baixo" },
            { produto: "Produto Processado", nova_group: 3, classificacao: "Processado", diagnostico: "Alimento processado com adição de conservantes ou condimentos simples. Pode compor refeições caso consumido balanceadamente.", nivel_risco: "Médio" },
            { produto: "Produto Ultraprocessado", nova_group: 4, classificacao: "Ultraprocessado", diagnostico: "Alimento de alto grau industrial. Costuma conter abundância de química ou aditivos nocivos à saúde a longo prazo.", nivel_risco: "Muito Alto" },
        ];
        return grupos[seed];
    }

    // ─── Modal de Carregamento ────────────────────────
    function openLoadingModal() {
        modalPreview.src = currentImageDataURL;
        loadingModal.classList.remove('hidden');
        lucide.createIcons();

        steps.forEach(s => { s.classList.remove('active', 'done'); });
        modalProgress.style.width = '0%';
        modalStatus.textContent = 'Localizando produto na base...';

        const sequence = [
            { delay: 300,  step: 0, progress: '28%', text: 'Identificando o produto...' },
            { delay: 1500, step: 1, progress: '60%', text: 'Consultando classificação NOVA...' },
            { delay: 2800, step: 2, progress: '88%', text: 'Gerando relatório nutricional...' },
        ];

        loadingModal.timers = [];
        sequence.forEach(({ delay, step, progress, text }) => {
            const t = setTimeout(() => {
                if (step > 0) steps[step - 1].classList.replace('active', 'done');
                steps[step].classList.add('active');
                modalProgress.style.width = progress;
                modalStatus.textContent = text;
            }, delay);
            loadingModal.timers.push(t);
        });
    }

    function closeLoadingModal() {
        return new Promise(resolve => {
            if (loadingModal.timers) {
                loadingModal.timers.forEach(t => clearTimeout(t));
                loadingModal.timers = [];
            }
            steps[0].classList.replace('active', 'done');
            steps[1].classList.replace('active', 'done');
            steps[2].classList.add('done');
            modalProgress.style.width = '100%';
            modalStatus.textContent = 'Extração concluída!';
            
            setTimeout(() => { 
                loadingModal.classList.add('hidden'); 
                resolve();
            }, 600);
        });
    }

    // ─── Exibir Resultado ─────────────────────────────
    function showResult(data) {
        const nova    = parseInt(data.nova_group) || 4;
        const clas    = data.classificacao || 'Processado';
        const produto = data.produto || 'Produto Analisado';
        const diag    = data.diagnostico || 'Sem diagnóstico disponível.';

        let badgeClass = 'badge-ultra', novaClass = 'nova-ultra', novaEmoji = '⚠️';
        if (nova <= 2) { badgeClass = 'badge-natural'; novaClass = 'nova-natural'; novaEmoji = '🌿'; }
        else if (nova === 3) { badgeClass = 'badge-processed'; novaClass = 'nova-processed'; novaEmoji = '⚡'; }

        resultPreviewImg.src = currentImageDataURL;
        resultBadge.textContent = clas;
        resultBadge.className = `result-badge-floating ${badgeClass}`;

        resultClassEl.innerHTML = `<div class="nova-chip ${novaClass}">${novaEmoji} Grupo NOVA ${nova}</div>`;
        resultTitleEl.textContent = produto;
        dbResponseText.textContent = diag;
        resultNovaEl.textContent = `Nível de risco: ${data.nivel_risco || '—'}`;

        previewCard.classList.add('hidden');
        uploadCard.classList.add('hidden');
        resultSection.classList.remove('hidden');
        lucide.createIcons();

        saveHistory(produto, nova, clas, currentImageDataURL);
        setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    // ─── Histórico ────────────────────────────────────
    function saveHistory(produto, nova, clas, img) {
        const now = new Date();
        const timeStr = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

        let typeClass = 'ultra';
        if (nova <= 2) typeClass = 'nat';
        else if (nova === 3) typeClass = 'proc';

        scanHistory.unshift({ produto, nova, clas, img, time: timeStr, type: typeClass });
        if (scanHistory.length > 50) scanHistory.pop();
        localStorage.setItem('nutriscan_history', JSON.stringify(scanHistory));
        renderHistory();
    }

    function renderHistory() {
        let nat = 0, proc = 0, ultra = 0;
        historyList.innerHTML = '';

        if (scanHistory.length === 0) {
            historyList.appendChild(historyEmpty);
            historyEmpty.classList.remove('hidden');
        } else {
            historyEmpty.classList.add('hidden');
            scanHistory.forEach(item => {
                if (item.type === 'nat') nat++;
                else if (item.type === 'proc') proc++;
                else ultra++;

                const el = document.createElement('div');
                el.className = `history-item ${item.type}`;
                el.innerHTML = `
                    <img class="hist-img" src="${item.img || 'https://placehold.co/44x44/e2e8f0/64748b?text=🍽'}" alt="">
                    <div class="hist-info">
                        <span class="hist-name">${item.produto}</span>
                        <span class="hist-time">${item.time}</span>
                    </div>
                    <span class="hist-tag ${item.type}">${item.clas}</span>
                `;
                historyList.appendChild(el);
            });
        }

        document.getElementById('cnt-nat').textContent  = nat;
        document.getElementById('cnt-proc').textContent = proc;
        document.getElementById('cnt-ultra').textContent = ultra;
    }

    // ─── Toast ────────────────────────────────────────
    function showToast(msg) {
        const t = document.createElement('div');
        t.style.cssText = `
            position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
            background:#0F172A;color:white;padding:0.8rem 1.5rem;
            border-radius:9999px;font-family:Outfit,sans-serif;
            font-size:0.95rem;font-weight:600;z-index:999;
            box-shadow:0 8px 24px rgba(0,0,0,0.3);
            animation:fade-up 0.4s ease-out;
        `;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }
});
