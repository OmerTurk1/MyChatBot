const input = document.querySelector('input[type="text"]');
const chatContainer = document.querySelector('section.flex-1');
const sendBtn = document.querySelector('button.bg-blue-600');
const newChatButton = document.querySelector('button.bg-slate-800');
const chatList = document.getElementById('chat-list');
let curr_chat_id = null;

async function submitForm() {
    const messageText = input.value.trim();
    if (messageText === "") return;

    appendMessage('user', messageText);
    
    input.value = "";
    input.focus();

    // Hata kontrolü + cevap döndürme
    const [aiResponse, state] = await send(messageText, curr_chat_id);
    console.log(aiResponse);
    if(state){
        // Başarılı durum
        appendMessage('ai', aiResponse.answer);
    }
    else{
        // Hata durumu: Kırmızı arka plan ve özel mesaj
        appendMessage('ai', aiResponse.answer, true);
    }
}

function appendMessage(sender, text, isError = false) {
  if(!text){
    console.error("Metin boş ağabey");
    return;
  }
    const messageDiv = document.createElement("div");
    
    if (sender === 'ai') {
        const bgColor = isError ? "bg-red-600" : "bg-blue-600"; // Error ? red : blue

        messageDiv.className = "flex gap-4";
        messageDiv.innerHTML = `
            <div class="w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0">
                <i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-robot'} text-xs text-white"></i>
            </div>
            <div class="max-w-[80%] glass p-4 rounded-2xl rounded-tl-none text-slate-200 leading-relaxed">
                ${isError ? text : marked.parse(text)}
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
async function send(message, chat_id) {
  try{
    // send request
    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: message,
        chat_id: chat_id
      })
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

function newChat() {
  const chatTitle = "Yeni Sohbet " + (chatList.querySelectorAll('.sidebar-item').length + 1);

  // 2. Yeni sohbet elemanını oluşturalım
  const newChatItem = document.createElement('div');
  newChatItem.className = "sidebar-item p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center gap-3 cursor-pointer transition";
  
  // İçerik yapısını ekleyelim
  newChatItem.innerHTML = `
    <i class="far fa-comment-alt text-blue-400 text-sm"></i>
    <span class="text-sm truncate">${chatTitle}</span>
  `;

  newChatItem.id = chatTitle.replaceAll(" ", "-");

  // 3. Tıklanınca seçili olma özelliğini tanımlayalım
  newChatItem.onclick = function() {
    selectChat(this);
  };

  // 4. Listeye ekleyelim (Başlığın hemen altına gelsin)
  chatList.appendChild(newChatItem);
  selectChat(newChatItem);
}

function selectChat(element) {
  //frontend tarafı
  const allChats = document.querySelectorAll('.sidebar-item');
  allChats.forEach(chat => {
    chat.classList.remove('bg-blue-600/20', 'border', 'border-blue-500/30');
    chat.querySelector('i').classList.replace('text-blue-400', 'text-slate-400');
  });

  element.classList.add('bg-blue-600/20', 'border', 'border-blue-500/30');
  element.querySelector('i').classList.replace('text-slate-400', 'text-blue-400');

  curr_chat_id = element.id;

  //backend tarafı
  refreshChats();
}

async function refreshChats(){
  try {
    chatContainer.replaceChildren();
    const prevChats = await pullChats(curr_chat_id);
    prevChats.forEach(qa => {
      appendMessage("user", qa["user"]);
      appendMessage("ai", qa["ai"]);
    });
  } catch (error) {
    console.error("Mesajlar yüklenirken hata oluştu:", error);
  }
}

async function pullChats(chat_id) {
  const res = await fetch("http://localhost:5000/pastchats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat: chat_id }) 
  });

  const relatedHist = await res.json();
  return relatedHist;
}

sendBtn.addEventListener("click", submitForm);
newChatButton.addEventListener("click",newChat);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitForm();
    }
});