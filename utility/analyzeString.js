const crypto = require("crypto");

const is_palindrome = (str) => {
  //converts str to lowecase and remove non-aplhabetic char
  const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");

  //reversed string
  const reverseStr = cleanedStr.split("").reverse().join("");

  return cleanedStr === reverseStr;
};

const analyzeString = (str) => {
  const length = str.length;
  const unique_characters = new Set(str.replace(/\s+/g, "")).size;
  const word_count = str.trim().split(/\s+/).length;
  const character_frequency_map = {};
  for (const char of str) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }
  const sha256_hash = crypto.createHash("sha256").update(str).digest("hex");

  return {
    length,
    unique_characters,
    word_count,
    character_frequency_map,
    sha256_hash,
    is_palindrome: is_palindrome(str),
  };
};

module.exports = analyzeString;
