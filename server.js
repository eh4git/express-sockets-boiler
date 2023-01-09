const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

// Open API chat gpt configuration
const configuration = new Configuration({
  organization: process.env.OPENAPI_ORG_ID,
  apiKey: process.env.OPENAPI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function moderateText(name, text) {
  const {
    data: {
      results: [results],
    },
  } = await openai.createModeration({ input: text });
  console.log(text);

  const { flagged, categories, category_scores } = results;

  // console.log("FLAGGED: ", flagged);
  // console.log("CATEGORIES: ", categories);
  // console.log("CATEGORY_SCORES: ", category_scores);

  if (flagged) {
    const flaggedResponse = {
      moderated: true,
      text: `${name}'s content was blocked by OpenAI's GPT-3 for the following reason(s): `,
    };
    const reasons = Object.entries(categories)
      .map(([key, isFlagged]) => (isFlagged ? key : false))
      .filter(a => (a ? true : false))
      .join(", ");
    flaggedResponse.text += reasons;
    return flaggedResponse;
  }
  return { moderated: false, text };
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

// Server side socket event handling
io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("new-user", function (...args) {
    socket.broadcast.emit("new-user", args[0]);
  });

  socket.on("new-message", async function (name, text) {
    const filteredText = await moderateText(name, text);
    if (filteredText.moderated) socket.emit("message-blocked", filteredText);
    socket.broadcast.emit("new-message", name, filteredText);
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

httpServer.listen(PORT, () =>
  console.log("Now listening on http://localhost:" + PORT)
);
