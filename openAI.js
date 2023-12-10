const OpenAI = require("openai");
require("dotenv").config();

// Open API chat gpt configuration
const openai = new OpenAI({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

async function moderateText(name, text) {
  try {
    const {
      results: [moderation],
    } = await openai.moderations.create({ input: text });

    const { flagged, categories, category_scores } = moderation;
    if (flagged) {
      const flaggedResponse = {
        moderated: true,
        text: `${name}! Your content was blocked by OpenAI's GPT-3 for the following reason(s): `,
      };
      const reasons = Object.entries(categories)
        .map(([key, isFlagged]) => (isFlagged ? key : false))
        .filter(a => (a ? true : false))
        .join(", ");
      flaggedResponse.text += reasons;
      return flaggedResponse;
    }
  } catch (err) {
    console.log("Open AI error ----- \n", err);
    return {
      moderated: false,
      text: "Text cannot be moderated at this time!\nPlease try back later!",
    };
  }
  return {
    moderated: false,
    text,
  };
}

// console.log("FLAGGED: ", flagged);
// console.log("CATEGORIES: ", categories);
// console.log("CATEGORY_SCORES: ", category_scores);

module.exports = { moderateText };
