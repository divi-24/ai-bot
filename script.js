document.getElementById('send-btn').addEventListener('click', function() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
      const chatDisplay = document.querySelector('.chat-display');
      const userMessage = document.createElement('div');
      userMessage.className = 'message user';
      userMessage.textContent = message;
  
      chatDisplay.appendChild(userMessage);
      input.value = '';
      
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
  });