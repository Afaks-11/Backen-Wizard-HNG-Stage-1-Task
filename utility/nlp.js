const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

function interpretQueryWithNatural(query) {
  const tokens = tokenizer.tokenize(query.toLowerCase());
  const stems = tokens.map((token) => natural.PorterStemmer.stem(token));

  const filters = {};

  // Word count detection
  if (stems.includes("singl") || stems.includes("one")) {
    filters.word_count = 1;
  }

  // Palindrome detection
  if (stems.includes("palindrom")) {
    filters.is_palindrome = true;
  }

  // Length detection: longer than -> min_length
  const longerIndex = tokens.indexOf("longer");
  if (longerIndex !== -1 && tokens[longerIndex + 1] === "than") {
    filters.min_length = parseInt(tokens[longerIndex + 2]) + 1;
  }

  // shorter than -> max_length
  const shorterIndex = tokens.indexOf("shorter");
  if (shorterIndex !== -1 && tokens[shorterIndex + 1] === "than") {
    filters.max_length = parseInt(tokens[shorterIndex + 2]) - 1;
  }

  // Character containment
  const containIndex = stems.indexOf("contain");
  if (containIndex !== -1) {
    let nextChar = tokens[containIndex + 1];

    if (nextChar === "the" || nextChar === "letter") {
      nextChar = tokens[containIndex + 2];
    }

    if (nextChar && nextChar.length === 1) {
      filters.contains_character = nextChar;
    }
  }

  return Object.keys(filters).length > 0 ? filters : null;
}

module.exports = interpretQueryWithNatural;
