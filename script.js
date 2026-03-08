document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const installmentsContainer = document.getElementById('installments-container');
    const summaryProduct = document.getElementById('summary-product');
    const summaryTotal = document.getElementById('summary-total');
    const brandRadios = document.querySelectorAll('input[name="card_brand"]');
    
    // Configurações
    const MAX_INSTALLMENTS = 18;
    
    const ratesVisaMaster = {
        1: 3.65, 2: 5.09, 3: 5.78, 4: 6.59, 5: 7.10, 6: 7.91,
        7: 8.69, 8: 9.56, 9: 9.98, 10: 10.63, 11: 11.36, 12: 11.90,
        13: 13.52, 14: 13.95, 15: 14.76, 16: 15.29, 17: 15.89, 18: 16.49
    };

    const ratesOther = {
        1: 4.49, 2: 5.89, 3: 6.99, 4: 7.67, 5: 7.99, 6: 8.54,
        7: 10.27, 8: 10.99, 9: 11.48, 10: 12.22, 11: 12.99, 12: 13.29,
        13: 14.19, 14: 14.74, 15: 15.36, 16: 16.09, 17: 16.58, 18: 17.17
    };
    
    let currentAmount = parseFloat(amountInput.value) || 0;
    let selectedInstallment = 1;
    let selectedBrand = 'visa_master';

    // Formatador de Moeda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Calcula o valor total com taxa (Repasse)
    const calculateTotalValue = (amount, installments, brand) => {
        if (amount <= 0) return 0;
        
        const rates = brand === 'visa_master' ? ratesVisaMaster : ratesOther;
        const rate = rates[installments] || 0;
        
        // Repasse da taxa: Valor = Montante / (1 - Taxa/100)
        return amount / (1 - rate / 100);
    };

    // Calcula o valor da parcela
    const calculateInstallmentValue = (totalValue, installments) => {
        if (totalValue <= 0) return 0;
        return totalValue / installments;
    };

    // Renderiza a lista de parcelas
    const renderInstallments = () => {
        installmentsContainer.innerHTML = '';
        
        if (currentAmount <= 0) {
            installmentsContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary);">Insira um valor válido para simular as parcelas.</div>';
            return;
        }

        for (let i = 1; i <= MAX_INSTALLMENTS; i++) {
            const rates = selectedBrand === 'visa_master' ? ratesVisaMaster : ratesOther;
            const rate = rates[i] || 0;
            
            const totalValue = calculateTotalValue(currentAmount, i, selectedBrand);
            const installmentValue = calculateInstallmentValue(totalValue, i);
            const hasInterest = rate > 0;
            
            const item = document.createElement('div');
            item.className = `installment-item ${i === selectedInstallment ? 'active' : ''}`;
            
            // Labels
            const interestLabel = hasInterest 
                ? `<div class="installment-interest">Taxa ${rate.toFixed(2).replace('.', ',')}%</div>` 
                : `<div class="installment-interest text-success">Sem juros</div>`;
                
            item.innerHTML = `
                <label class="installment-label">
                    <div class="radio-container">
                        <input type="radio" name="installment" class="radio-input" value="${i}" ${i === selectedInstallment ? 'checked' : ''}>
                        <div class="radio-custom"></div>
                        
                        <div class="installment-details">
                            <span class="installment-title">${i}x ${formatCurrency(installmentValue)}</span>
                            ${interestLabel}
                        </div>
                    </div>
                    
                    <div class="installment-total">
                        Total: ${formatCurrency(totalValue)}
                    </div>
                </label>
            `;
            
            // Adicionar evento de clique para atualizar a seleção
            const radioInput = item.querySelector('.radio-input');
            radioInput.addEventListener('change', (e) => {
                selectedInstallment = parseInt(e.target.value);
                updateSelection();
            });

            installmentsContainer.appendChild(item);
        }
    };

    // Atualiza a interface da seleção atual (Resumo e Active State)
    const updateSelection = () => {
        // Atualiza as classes ativas
        document.querySelectorAll('.installment-item').forEach((item, index) => {
            const input = item.querySelector('.radio-input');
            if (input.checked) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Atualiza o Resumo
        const totalValue = calculateTotalValue(currentAmount, selectedInstallment, selectedBrand);

        summaryProduct.textContent = formatCurrency(currentAmount);
        summaryTotal.textContent = formatCurrency(totalValue);
    };

    // Eventos de Bandeira
    brandRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedBrand = e.target.value;
                renderInstallments();
                updateSelection();
            }
        });
    });

    // Eventos do Input
    amountInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        currentAmount = isNaN(val) ? 0 : val;
        
        // Re-renderizar tudo
        renderInstallments();
        updateSelection();
    });

    // Inicialização Inicial
    renderInstallments();
    updateSelection();
});
