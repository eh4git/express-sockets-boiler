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
    socket.emit("new-user", name);
    return name;
  }
};
