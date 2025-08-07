document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'from-user' : 'from-ai');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para o final
        return messageDiv;
    }

    // Função que processa a entrada do usuário para identificar palavras-chave
    function processPrompt(prompt) {
        // Remove pontuações e converte para minúsculas
        let processedPrompt = prompt.toLowerCase().replace(/[?,.!'";:]/g, '');
        
        // Mantém apenas as palavras-chave mais importantes
        const stopWords = ["olá", "oi", "por favor", "me diga", "explique", "o que é", "qual", "a", "é", "me", "ajude", "e"];
        let keywords = processedPrompt.split(' ').filter(word => !stopWords.includes(word));
        
        // Monta a string de volta para um prompt mais direto
        return keywords.join(' ');
    }

    async function getAIResponse(prompt) {
        const thinkingMessage = addMessage('...', 'ai');
        
        try {
            // URL da sua API de simulação
            const apiUrl = 'http://127.0.0.1:8000/generate';
            
            // Processa a entrada do usuário para extrair a intenção
            const processedPrompt = processPrompt(prompt);
            
            // Verifica se o prompt não está vazio após o processamento
            if (!processedPrompt) {
                chatMessages.removeChild(thinkingMessage);
                addMessage("Por favor, digite uma pergunta válida.", 'ai');
                return;
            }
            
            // Dados que serão enviados na requisição POST
            const payload = {
                prompt: processedPrompt,
                language: "pt"
            };
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();
            
            chatMessages.removeChild(thinkingMessage);
            
            if (data.status === 'success' && data.response) {
                addMessage(data.response, 'ai');
            } else {
                addMessage("Desculpe, ocorreu um erro ao processar sua solicitação ou a resposta está vazia.", 'ai');
            }

        } catch (error) {
            console.error('Erro ao conectar à API:', error);
            if (chatMessages.contains(thinkingMessage)) {
                chatMessages.removeChild(thinkingMessage);
            }
            addMessage("Não foi possível conectar à Aurora AI. Por favor, verifique se a API está rodando no terminal.", 'ai');
        }
    }

    function sendMessage() {
        const userText = userInput.value.trim();
        if (userText) {
            addMessage(userText, 'user');
            userInput.value = '';
            getAIResponse(userText);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
