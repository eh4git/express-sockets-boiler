const { moderateText } = require("./openAI");
const { filterObscenities, hasObscenities } = require("./purgoMalum");

// Server side socket event handling
function socketsController(socket) {
  console.log("A user connected");

  socket.on("join-chat", function (...args) {
    socket.join("chat");
    socket.to("chat").emit("join-chat", args[0]);
  });

  socket.on("new-chat-message", async function (name, text) {
    const textObj = { moderated: false, text };
    socket.to("chat").emit("new-chat-message", name, textObj);
  });

  socket.on("join-moderated", function (...args) {
    socket.join("moderated");
    socket.to("moderated").emit("join-moderated", args[0]);
  });

  socket.on("new-moderated-message", async function (name, text) {
    console.log("Moderated message received", await filterObscenities(text));
    const filteredText = await moderateText(
      name,
      await filterObscenities(text)
    );
    if (filteredText.moderated) socket.emit("message-blocked", filteredText);

    socket.to("moderated").emit("new-moderated-message", name, filteredText);
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
}
module.exports = socketsController;
