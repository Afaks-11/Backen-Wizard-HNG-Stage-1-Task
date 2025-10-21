const express = require("express");

const analyzeString = require("../utility/analyzeString");
const interpretQueryWithNatural = require("../utility/nlp");

const router = express.Router();
const store = new Map();

function filterString(filters) {
  let data = Array.from(store.values());

  if (filters.is_palindrome !== undefined) {
    data = data.filter(
      (s) => s.properties.is_palindrome === filters.is_palindrome
    );
  }

  if (filters.word_count !== undefined) {
    data = data.filter((s) => s.properties.word_count === filters.word_count);
  }

  if (filters.min_length !== undefined) {
    data = data.filter((s) => s.properties.length >= filters.min_length);
  }

  if (filters.max_length !== undefined) {
    data = data.filter((s) => s.properties.length <= filters.max_length);
  }

  if (filters.contains_character !== undefined) {
    data = data.filter((s) => s.value.includes(filters.contains_character));
  }

  return data;
}

router.get("/strings/filter-by-natural-language", (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Missing query parameter" });
  }

  const filter = interpretQueryWithNatural(query);
  console.log("Parsed filters:", filter);

  if (!filter) {
    return res.status(400).json({
      message: "Unable to parse natural language query",
    });
  }

  if (
    filter.min_length &&
    filter.max_length &&
    filter.min_length > filter.max_length
  ) {
    return res.status(422).json({
      message: "Query parsed but resulted in conflicting filters",
    });
  }

  const data = filterString(filter);

  return res.status(200).json({
    data: data,
    count: data.length,
    interpreted_query: {
      original: query,
      parsed_filters: filter,
    },
  });
});

router.post("/strings", (req, res) => {
  try {
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({
        message: 'Invalid request body or missing "value" field',
      });
    }
    if (typeof value !== "string") {
      return res.status(422).json({
        message: 'Invalid data type for "value" (must be string)',
      });
    }
    const userId = analyzeString(value).sha256_hash;

    if (store.has(userId)) {
      return res
        .status(409)
        .json({ message: "String already exists in the system" });
    }

    const data = {
      id: userId,
      value: value,
      properties: analyzeString(value),
      created_at: new Date().toISOString(),
    };

    store.set(userId, data);
    return res.status(201).json(data);
  } catch (err) {
    console.log("Error creating string: ", err.message);
    return res.status(500).json({
      message: "Internal Server Error" || err.message,
    });
  }
});

router.get("/strings/:value", (req, res) => {
  const { value } = req.params;

  console.log(store);

  const allData = Array.from(store.values());
  const allValues = allData.map((item) => item.value);
  const foundValue = allValues.find(
    (item) => item.toLowerCase() === value.toLowerCase()
  );
  const foundItem = allData.find(
    (item) => item.value.toLowerCase() === value.toLowerCase()
  );

  if (!foundValue) {
    return res.status(404).json({
      message: "String does not exits",
    });
  }

  return res.status(200).json(foundItem);
});

router.get("/strings", (req, res) => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  let data = Array.from(store.values());
  const filterValue = {};

  try {
    if (is_palindrome !== undefined) {
      const val = is_palindrome === "true";
      data = data.filter((s) => s.properties.is_palindrome === val);
      filterValue.is_palindrome = val;
    }

    if (min_length) {
      data = data.filter((s) => s.properties.length >= parseInt(min_length));
      filterValue.min_length = parseInt(min_length);
    }

    if (max_length) {
      data = data.filter((s) => s.properties.length <= parseInt(max_length));
      filterValue.max_length = parseInt(max_length);
    }

    if (word_count) {
      data = data.filter(
        (s) => s.properties.word_count === parseInt(word_count)
      );
      filterValue.word_count = parseInt(word_count);
    }
    if (contains_character) {
      data = data.filter((s) => s.value.includes(contains_character));
      filterValue.contains_character = contains_character;
    }

    res
      .status(200)
      .json({ data: data, count: data.length, filters_applied: filterValue });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete("/strings/:value", (req, res) => {
  const { value } = req.params;

  const allValues = Array.from(store.values()).map((item) => item.value);
  console.log(
    "ALLdata in store:  -----------------------------------------",
    Array.from(store.values())
  );
  console.log(
    "AllValuescdcd in store:  -----------------------------------------",
    allValues
  );
  const exstingString = allValues.find(
    (val) => val.toLowerCase() === value.toLocaleLowerCase()
  );

  if (!exstingString) {
    return res.status(404).send();
  }

  store.delete(exstingString.id);
  return res.status(204).json({ message: "Empty response body" });
});

module.exports = router;
