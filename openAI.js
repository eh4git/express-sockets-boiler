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
      text: `${name}! Your content was blocked by OpenAI's GPT-3 for the following reason(s): `,
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

module.exports = { moderateText };
