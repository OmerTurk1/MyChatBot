function submitForm() {
    if (input.value.trim() === "") return;
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user");
    userMessage.textContent = input.value;
    chat.appendChild(userMessage);
    input.value = "";
    input.focus();
    chat.appendChild(aiAnswer());
}
function aiAnswer(){
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("message", "ai");
    aiMessage.textContent = "You nailed it!";
    return aiMessage;
}
const input = document.getElementById("userInput");
const chat = document.getElementById("chat-messages");
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitForm();
    }
});