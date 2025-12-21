async function submitForm() {
    if (input.value.trim() === "") return;
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user");
    const user_p = document.createElement("p");
    user_p.textContent = input.value;
    userMessage.appendChild(user_p);
    chat.appendChild(userMessage);
    input.value = "";
    input.focus();
    try{
        const data = await send(userMessage.textContent);
        chat.appendChild(aiAnswer(data));
    }
    catch{
        console.log("Error!!!");
    } 
}
function aiAnswer(data){
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("message", "ai");
    aiMessage.innerHTML = marked.parse(data.answer);
    const pres = aiMessage.querySelectorAll('pre');
    const codes = aiMessage.qu
    console.log(pres);
    pres.forEach(pre => {
      pre.classList.add('canvas');
      const codes = pre.querySelectorAll('code');
      codes.forEach(code => {
        code.classList.forEach(cls => {
          code.classList.remove(cls);
        });
        code.classList.add('language');
      });
    });

    return aiMessage;
}
async function send(message) {
  const res = await fetch("http://localhost:5000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  console.log(data);
  return data;
}
const input = document.getElementById("userInput");
const chat = document.getElementById("chat-messages");
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitForm();
    }
});