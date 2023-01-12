function byId(id) {
  return document.getElementById(id);
}

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
    return name;
  }
};

const updateHTML = (name, chat, sent) => {
  chatDialogEl.innerHTML += `
  <div class="message ${sent ? "sent" : ""}">
    <h4>${name}:</h4>
    <p>${chat.text}</p>
  </div>`;

  // Keeps chat scrolling down as new messages created/received.
  chatDialogEl.scrollTop = chatDialogEl.scrollHeight;
};
