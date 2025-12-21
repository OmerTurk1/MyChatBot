async function submitForm() {
  // return if message is blank
  if (input.value.trim() === "") return;

  // create user message
  const userMessage = document.createElement("div");
  userMessage.classList.add("message", "user");
  const user_p = document.createElement("p");
  user_p.textContent = input.value;
  userMessage.appendChild(user_p);
  chat.appendChild(userMessage);

  // updates before ai message
  input.value = "";
  input.focus();
  chat.scrollTop = chat.scrollHeight;

  // taking ai message
  try{
    const data = await send(userMessage.textContent);
    chat.appendChild(aiAnswer(data));
  }
  catch{
    console.log("Error!!!");
  }

  // save chat
  // json dosyasına şunlar yazılacak:
  // "user":user message, "ai":ai message

  // scroll to end
  chat.scrollTop = chat.scrollHeight;
}
function aiAnswer(data){
  // create div
  const aiMessage = document.createElement("div");
  aiMessage.classList.add("message", "ai");
  aiMessage.innerHTML = marked.parse(data.answer);

  // select pres and codes for assigning classes
  const pres = aiMessage.querySelectorAll('pre');
  const codes = aiMessage.qu
  console.log(pres);
  pres.forEach(pre => {

    // button is created
    const copyBtn = document.createElement("button");
    copyBtn.innerText = "Copy";
    copyBtn.classList.add("copyBtn");
    copyBtn.onclick = function() {
      navigator.clipboard.writeText(pre.querySelector('code').innerText);
    };
    pre.appendChild(copyBtn);

    // canvas is assigned and codes are determined
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
  console.log(data);
  return data;
}
const input = document.getElementById("userInput");
const chat = document.getElementById("chat-messages");

// with this, enter will submit the question also
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitForm();
  }
});