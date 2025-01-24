document.getElementById('minimize-btn').addEventListener('click', function() {
    var chatContainer = document.getElementById('chat-container');
    chatContainer.classList.toggle('minimized');
});

// document.getElementById('send-btn').addEventListener('click', function() {
//     var userInput = document.getElementById('user-input').value;
//     if (userInput.trim() !== '') {
//         var chatBody = document.getElementById('chat-body');
//         var userMessage = document.createElement('div');
//         userMessage.classList.add('chat-message', 'user-message');
//         userMessage.innerHTML = `<p>${userInput}</p>`;
//         chatBody.appendChild(userMessage);

//         // Simulate bot response
//         var botMessage = document.createElement('div');
//         botMessage.classList.add('chat-message', 'bot-message');
//         botMessage.innerHTML = `<p>I'm here to help!</p>`;
//         chatBody.appendChild(botMessage);

//         // Clear the input field
//         document.getElementById('user-input').value = '';
        
//         // Scroll to the bottom to show the latest messages
//         chatBody.scrollTop = chatBody.scrollHeight;
//     }
// });

// // Optional: Allow user to press 'Enter' to send message
// document.getElementById('user-input').addEventListener('keydown', function(event) {
//     if (event.key === 'Enter') {
//         document.getElementById('send-btn').click();
//     }
// });
document.getElementById("send-btn").addEventListener("click", () => { const userInput = document.getElementById("user-input").value;
      displayMessage(userInput, "user");
      document.getElementById("user-input").value = "";
      sendToServer(userInput);
  });

  function displayMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const message2 = document.createElement("div");
    message2.classList.add(sender); 
    message2.textContent = message; 
    chatBox.appendChild(message2);
    chatBox.scrollTop = chatBox.scrollHeight; 
  }
  
  async function sendToServer(message) {
    const response = await fetch("https://ai-bot-deepak-guptas-projects-1a8eb72c.vercel.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    displayMessage(data.reply, "bot");
  }
  