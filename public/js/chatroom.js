const userNameEl = byId("name");
const nameInputEl = byId("name-input");
const checkNameEl = byId("check-name-input");
const chatContainerEl = byId("chat-container");
const chatDialogEl = byId("chat-dialog");
const chatInputEl = byId("chat-input");
const submitChatEl = byId("submit-chat-input");

// Gets a name for the user since there are no authenticated users in this application
// Once set they will not be able to change their name unless they know about local storage
// If you have your own users there is no need for getName()... just replace all references with equivalents from your user.
const getName = () => {
  chatContainerEl.style.display = "none";
  const name =
    localStorage.getItem("name") || prompt("What is your name?").trim();
  if (!name) {
    alert("You must enter a name to continue...");
    return getName();
  } else {
    localStorage.setItem("name", name);
    userNameEl.textContent = ", " + name;
    chatContainerEl.style.display = "block";
    socket.emit("new-user", name);
    return name;
  }
};
const userName = getName();

const updateHTML = (name, chat, sent) => {
  chatDialogEl.innerHTML += `
  <div class="message${sent ? " sent" : ""}">
    <h4>${name}:</h4>
    <p>${chat}</p>
  </div>`;
  // Keeps chat scrolling down as new messages created/received.
  chatDialogEl.scrollTop = chatDialogEl.scrollHeight;
};

// emit the new-message event to be broadcast to other users by the server
submitChatEl.addEventListener("click", () => {
  updateHTML(userName, chatInputEl.value.trim(), true);
  socket.emit("new-message", userName, chatInputEl.value.trim());
  chatInputEl.value = "";
});

// When a new-user event is sent to the frontend(here) by the server
socket.on("new-user", arg => {
  chatDialogEl.innerHTML += `<p>New User ${arg}, has joined the chat!</p>`;
});

socket.on("new-message", args => {
  updateHTML(args[0], args[1]);
});
