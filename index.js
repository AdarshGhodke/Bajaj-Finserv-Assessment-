const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const USER_CONFIG = {
  full_name: "adarsh_ghodke",
  dob: "12052005",
  email: "adarshtukaramghodke2022@vitbhopal.ac.in",
  roll_number: "22BCE10630",
};

const isNumber = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const isAlphabet = (str) => {
  return str.length === 1 && /^[a-zA-Z]$/.test(str);
};

const isSpecialChar = (str) => {
  return str.length === 1 && /[^a-zA-Z0-9]/.test(str);
};

const createAlternatingCaps = (str) => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (i % 2 === 0) {
      result += str[i].toLowerCase();
    } else {
      result += str[i].toUpperCase();
    }
  }
  return result;
};

const processData = (data) => {
  const oddNumbers = [];
  const evenNumbers = [];
  const alphabets = [];
  const specialCharacters = [];
  let sumOfNumbers = 0;
  let alphabeticalChars = "";

  data.forEach((item) => {
    const str = String(item).trim();

    if (isNumber(str)) {
      const num = parseInt(str);
      sumOfNumbers += num;

      if (num % 2 === 0) {
        evenNumbers.push(str);
      } else {
        oddNumbers.push(str);
      }
    } else if (isAlphabet(str)) {
      alphabets.push(str.toUpperCase());
      alphabeticalChars += str;
    } else if (isSpecialChar(str)) {
      specialCharacters.push(str);
    }
  });

  const reversedAlphabets = alphabeticalChars.split("").reverse().join("");
  const concatString = createAlternatingCaps(reversedAlphabets);

  return {
    oddNumbers,
    evenNumbers,
    alphabets,
    specialCharacters,
    sum: String(sumOfNumbers),
    concatString,
  };
};

app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

app.post("/bfhl", (req, res) => {
  try {
    if (!req.body || !req.body.data) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid request. 'data' field is required.",
      });
    }

    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid request. 'data' must be an array.",
      });
    }

    const result = processData(data);

    const response = {
      is_success: true,
      user_id: `${USER_CONFIG.full_name}_${USER_CONFIG.dob}`,
      email: USER_CONFIG.email,
      roll_number: USER_CONFIG.roll_number,
      odd_numbers: result.oddNumbers,
      even_numbers: result.evenNumbers,
      alphabets: result.alphabets,
      special_characters: result.specialCharacters,
      sum: result.sum,
      concat_string: result.concatString,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "BFHL API is running",
    endpoints: {
      POST: "/bfhl",
      GET: "/bfhl",
    },
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    is_success: false,
    error: "Something went wrong!",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
