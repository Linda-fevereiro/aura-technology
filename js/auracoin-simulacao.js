document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
    const priceDisplay = document.getElementById('price-display');
    const priceChangeDisplay = document.getElementById('price-change-display');
    const balanceDisplay = document.getElementById('balance-display');
    const buyAmountInput = document.getElementById('buy-amount');
    const buyButton = document.getElementById('buy-button');
    const sellAmountInput = document.getElementById('sell-amount');
    const sellButton = document.getElementById('sell-button');
    const blockchainCanvas = document.getElementById('blockchain-canvas');
    const transactionsList = document.getElementById('transactions-list');
    const ctxBlockchain = blockchainCanvas.getContext('2d');
    const priceChartCanvas = document.getElementById('price-chart');

    // Elementos do novo conversor
    const converterBRLInput = document.getElementById('converter-brl');
    const converterAuraInput = document.getElementById('converter-aura');
    const convertButton = document.getElementById('convert-button');

    // Estado da simulação
    let balance = 1000.00;
    let price = 0.87;
    let blocks = [];
    let transactions = [];
    let blockIdCounter = 1;
    let priceHistory = [];

    // Configurações do Gráfico
    const chartConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Preço (USD)',
                data: [],
                borderColor: '#00BFFF',
                backgroundColor: 'rgba(0, 191, 255, 0.2)',
                tension: 0.3,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: {
                    title: { display: true, text: 'Preço (USD)', color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'white' },
                    beginAtZero: false,
                }
            },
            layout: { padding: { top: 10, bottom: 10 } },
            plugins: { legend: { display: false } }
        }
    };

    const priceChart = new Chart(priceChartCanvas, chartConfig);

    // --- Funções de Simulação ---
    function updateDisplay() {
        priceDisplay.textContent = `$ ${price.toFixed(2)}`;
        balanceDisplay.textContent = `${balance.toFixed(2)} AURA`;
    }

    function simulatePriceChange() {
        const fluctuation = (Math.random() - 0.5) * 0.1;
        const oldPrice = price;
        price = Math.max(0.01, price + fluctuation);
        
        const change = price - oldPrice;
        if (change > 0) {
            priceChangeDisplay.textContent = `+${change.toFixed(2)} (Subindo)`;
            priceChangeDisplay.className = 'small-text text-green-400';
        } else if (change < 0) {
            priceChangeDisplay.textContent = `${change.toFixed(2)} (Descendo)`;
            priceChangeDisplay.className = 'small-text text-red-400';
        } else {
            priceChangeDisplay.textContent = `0.00 (Estável)`;
            priceChangeDisplay.className = 'small-text text-gray-400';
        }

        updateDisplay();
        
        priceHistory.push(price);
        if (priceHistory.length > 20) {
            priceHistory.shift();
        }
        priceChart.data.labels = priceHistory.map((_, i) => i);
        priceChart.data.datasets[0].data = priceHistory;
        priceChart.update();
    }

    function addSimulatedTransaction() {
        const sender = `AuraWallet-${Math.floor(Math.random() * 1000)}`;
        const receiver = `AuraWallet-${Math.floor(Math.random() * 1000)}`;
        const amount = parseFloat((Math.random() * 50 + 10).toFixed(2));
        const newTransaction = { id: Date.now(), type: 'simulated', from: sender, to: receiver, amount: amount, time: new Date() };
        transactions = [newTransaction, ...transactions];
        renderTransactions();
    }

    function addUserTransaction(type, amount) {
        const transactionType = type === 'buy' ? 'user-buy' : 'user-sell';
        const newTransaction = {
            id: Date.now(),
            type: transactionType,
            from: type === 'buy' ? "BRL" : "Você",
            to: type === 'buy' ? "Você" : "BRL",
            amount: amount,
            time: new Date()
        };
        transactions = [newTransaction, ...transactions];
        renderTransactions();
    }

    function renderTransactions() {
        transactionsList.innerHTML = '';
        transactions.slice(0, 5).forEach(tx => {
            const li = document.createElement('li');
            let amountText = '';
            let fromToText = '';
            
            if (tx.type === 'user-buy') {
                amountText = `<p class="font-bold text-white"><span class="text-green-400">+ ${tx.amount.toFixed(2)} AURA</span></p>`;
                fromToText = `<p class="text-sm text-gray-400">De: BRL</p><p class="text-sm text-gray-400">Para: Você</p>`;
            } else if (tx.type === 'user-sell') {
                amountText = `<p class="font-bold text-white"><span class="text-red-400">- ${tx.amount.toFixed(2)} AURA</span></p>`;
                fromToText = `<p class="text-sm text-gray-400">De: Você</p><p class="text-sm text-gray-400">Para: BRL</p>`;
            } else {
                amountText = `<p class="font-bold text-white"><span class="text-yellow-400">${tx.amount.toFixed(2)} AURA</span></p>`;
                fromToText = `<p class="text-sm text-gray-400">De: ${tx.from}</p><p class="text-sm text-gray-400">Para: ${tx.to}</p>`;
            }
            
            li.className = `bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center`;
            
            li.innerHTML = `
                <div class="flex-grow">
                    ${amountText}
                    ${fromToText}
                </div>
                <div class="text-sm text-gray-500 mt-2 md:mt-0">
                    ${tx.time.toLocaleTimeString()}
                </div>
            `;
            transactionsList.appendChild(li);
        });
    }

    function drawBlockchain() {
        blockchainCanvas.width = blockchainCanvas.offsetWidth;
        blockchainCanvas.height = 150;
        ctxBlockchain.fillStyle = 'transparent';
        ctxBlockchain.fillRect(0, 0, blockchainCanvas.width, blockchainCanvas.height);
        
        const blockSize = 60;
        const blockGap = 10;
        let currentX = blockchainCanvas.width - blockSize - 20;

        blocks.forEach((block, index) => {
            ctxBlockchain.fillStyle = 'rgba(76, 29, 149, 0.8)';
            ctxBlockchain.strokeStyle = '#00BFFF';
            ctxBlockchain.lineWidth = 2;
            ctxBlockchain.fillRect(currentX, blockchainCanvas.height / 2 - blockSize / 2, blockSize, blockSize);
            ctxBlockchain.strokeRect(currentX, blockchainCanvas.height / 2 - blockSize / 2, blockSize, blockSize);
            
            ctxBlockchain.fillStyle = '#FFFFFF';
            ctxBlockchain.font = '12px Montserrat';
            ctxBlockchain.textAlign = 'center';
            ctxBlockchain.fillText(`ID: ${block.id}`, currentX + blockSize / 2, blockchainCanvas.height / 2);
            
            if (index < blocks.length - 1) {
                ctxBlockchain.beginPath();
                ctxBlockchain.strokeStyle = '#00BFFF';
                ctxBlockchain.lineWidth = 1;
                ctxBlockchain.moveTo(currentX - blockGap / 2, blockchainCanvas.height / 2);
                ctxBlockchain.lineTo(currentX + blockGap / 2, blockchainCanvas.height / 2);
                ctxBlockchain.stroke();
            }
            
            currentX -= (blockSize + blockGap);
        });
    }

    setInterval(() => {
        const newBlock = {
            id: blockIdCounter++,
            hash: `0x${Math.random().toString(16).substr(2, 6)}...`,
            transactions: Math.floor(Math.random() * 10) + 1,
            minedBy: `AuraMiner-${Math.floor(Math.random() * 100)}`,
            time: new Date()
        };
        blocks = [newBlock, ...blocks].slice(0, 5);
        drawBlockchain();
    }, 15000);


    // --- Event Listeners e Início da Simulação ---
    buyButton.addEventListener('click', () => {
        const brlAmount = parseFloat(buyAmountInput.value);
        if (brlAmount > 0) {
            const auraAmount = brlAmount / price;
            balance += auraAmount;
            addUserTransaction('buy', auraAmount);
            updateDisplay();
            buyAmountInput.value = '';
        }
    });

    sellButton.addEventListener('click', () => {
        const auraAmount = parseFloat(sellAmountInput.value);
        if (auraAmount > 0 && auraAmount <= balance) {
            balance -= auraAmount;
            addUserTransaction('sell', auraAmount);
            updateDisplay();
            sellAmountInput.value = '';
        } else {
            alert('Saldo insuficiente para a venda.');
        }
    });

    // NOVO: Event listener para o conversor
    convertButton.addEventListener('click', () => {
        const brlValue = parseFloat(converterBRLInput.value);
        if (brlValue > 0) {
            const resultInAura = brlValue / price;
            converterAuraInput.value = resultInAura.toFixed(2);
        } else {
            converterAuraInput.value = '0.00';
        }
    });

    // Inicia os intervalos de simulação
    setInterval(simulatePriceChange, 5000);
    setInterval(addSimulatedTransaction, 10000);

    // Chamada inicial para renderizar o estado inicial
    updateDisplay();
    drawBlockchain();
    renderTransactions();
    simulatePriceChange();

    window.addEventListener('resize', drawBlockchain);
});