async function submitForm() {
    if (input.value.trim() === "") return;
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user");
    userMessage.textContent = input.value;
    chat.appendChild(userMessage);
    input.value = "";
    input.focus();
    try{
        const answer = await send(userMessage.textContent);
        chat.appendChild(aiAnswer(answer));
    }
    catch{
        console.log("Error!!!");
    } 
}
function aiAnswer(answer){
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("message", "ai");
    aiMessage.textContent = answer;
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
  console.log(data.answer);
  return data.answer;
}
const input = document.getElementById("userInput");
const chat = document.getElementById("chat-messages");
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitForm();
    }
});