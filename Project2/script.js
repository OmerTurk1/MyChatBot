const input = document.querySelector('input[type="text"]');
const chatContainer = document.querySelector('section.flex-1');
const sendBtn = document.querySelector('button.bg-blue-600');

async function submitForm() {
    const messageText = input.value.trim();
    if (messageText === "") return;

    appendMessage('user', messageText);
    
    input.value = "";
    input.focus();

    // Hata kontrolü + cevap döndürme
    const [aiResponse, state] = await send(messageText);
    console.log(aiResponse);
    if(state){
        // Başarılı durum
        appendMessage('ai', aiResponse);
        console.log("çalıştı");
    }
    else{
        // Hata durumu: Kırmızı arka plan ve özel mesaj
        appendMessage('ai', aiResponse, true);
    }
}

function appendMessage(sender, text, isError = false) {
    const messageDiv = document.createElement("div");
    
    if (sender === 'ai') {
        const bgColor = isError ? "bg-red-600" : "bg-blue-600"; // Error ? red : blue

        messageDiv.className = "flex gap-4";
        messageDiv.innerHTML = `
            <div class="w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0">
                <i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-robot'} text-xs text-white"></i>
            </div>
            <div class="max-w-[80%] glass p-4 rounded-2xl rounded-tl-none text-slate-200 leading-relaxed">
                ${isError ? text : marked.parse(text.answer)}
            </div>
        `;
    } else {
        messageDiv.className = "flex gap-4 justify-end";
        messageDiv.innerHTML = `
            <div class="max-w-[80%] bg-blue-600 p-4 rounded-2xl rounded-tr-none text-white leading-relaxed">
                ${text}
            </div>
        `;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
async function send(message) {
  try{
    // send request
    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    // pull answer
    const data = await res.json();
    return [data, true];
  }
  catch(err){
    if (err.name === "TypeError") {
      return ["Could not access to Server",false];
    }
    else if (err.message === "SERVER_ERROR") {
      return ["Server returned an Error",false];
    } 
    else {
      console.error("Unknown Error:", err);
      return ["Unknown Error:",false];
    }
  }
}

sendBtn.addEventListener("click", submitForm);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitForm();
    }
});