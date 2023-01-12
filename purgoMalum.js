// PurgoMalum is a simple, free, RESTful web service for filtering and removing content of profanity, obscenity and other unwanted text. PurgoMalum’s interface accepts several parameters for customization and can return results in plain text, XML and JSON.

// PurgoMalum is designed to remove words from input text, based on an internal profanity list (you may optionally add your own words to the profanity list through a request parameter (see Request Parameters below). It is designed to recognize character alternates often used in place of standard alphabetic characters, e.g. “@” will be recognized as an “a”, “$” will be recognized as an “s”, and so forth.

// PurgoMalum also utilizes a list of “safe words”, i.e. innocuous words which contain words from the profanity list (“class” for example). These safe words are excluded from the filter.

// https://rapidapi.com/community/api/purgomalum-1/

const axios = require("axios");

const filterObscenities = async text => {
  const options = {
    method: "GET",
    url: "https://community-purgomalum.p.rapidapi.com/json",
    params: { text },
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_API_KEY,
      "X-RapidAPI-Host": "community-purgomalum.p.rapidapi.com",
    },
  };
  try {
    const { data } = await axios.request(options);

    return data ? data.result : text;
  } catch (err) {
    console.error(err);
  }
};

const hasObscenities = async text => {
  const options = {
    method: "GET",
    url: "https://community-purgomalum.p.rapidapi.com/containsprofanity",
    params: { text },
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_API_KEY,
      "X-RapidAPI-Host": "community-purgomalum.p.rapidapi.com",
    },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { filterObscenities, hasObscenities };
