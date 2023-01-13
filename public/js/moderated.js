const userNameEl = byId("name");
const nameInputEl = byId("name-input");
const checkNameEl = byId("check-name-input");
const chatContainerEl = byId("chat-container");
const userFeedBackFormEl = byId("user-feedback");
const chatDialogEl = byId("chat-dialog");
const chatInputEl = byId("chat-input");
const submitChatEl = byId("submit-chat-input");

// Gets a name for the user since there are no authenticated users in this application
// Once set they will not be able to change their name unless they know about local storage
// If you have your own users there is no need for getName()... just replace all references with equivalents from your user.
const userName = getName(); // See ./utils.js for details

socket.emit("join-moderated", userName);

// emit the new-message event to be broadcast to other users by the server
userFeedBackFormEl.addEventListener("submit", e => {
  e.preventDefault();
  const chatInput = chatInputEl.value.trim();
  if (chatInput) {
    updateHTML(userName, { moderated: false, text: chatInput }, true);
    socket.emit("new-moderated-message", userName, chatInput);
    chatInputEl.value = "";
  }
});

// When a new-user event is broadcast to the frontend(here) by the server
socket.on(
  "join-moderated",
  arg =>
    (chatDialogEl.innerHTML += `<p>New User ${arg}, has joined the chat!</p>`)
);

// When a new message is received from the server(another user)
socket.on("new-moderated-message", (name, text) => updateHTML(name, text));

// Display a message from the Room Moderator if a message contains flagged content
socket.on("message-blocked", text => updateHTML("Room Moderator", text));
