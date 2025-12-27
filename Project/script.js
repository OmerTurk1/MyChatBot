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

  // ai text message filler
  const aitexting = document.createElement("div");
  aitexting.classList.add("message","ai");
  const filler = document.createElement("i");
  filler.textContent = "...";
  aitexting.appendChild(filler);
  chat.appendChild(aitexting);

  // updates before ai message
  input.value = "";
  input.focus();
  chat.scrollTop = chat.scrollHeight;

  // taking ai message
  try{
    const data = await send(userMessage.textContent);
    chat.lastElementChild?.remove();
    chat.appendChild(aiAnswer(data));
  }
  catch{
    console.log("Error!!!");
  }

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
  pres.forEach(pre => {

    //hr is created
    const line = document.createElement("hr");
    pre.appendChild(line);

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
    console.log(data);
    return data;
  }
  catch(err){
    if (err.name === "TypeError") {
      console.error("Could not access to Server");
    }
    else if (err.message === "SERVER_ERROR") {
      console.error("Server returned an Error");
    } 
    else {
      console.error("Unknown Error:", err);
    }
  }
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