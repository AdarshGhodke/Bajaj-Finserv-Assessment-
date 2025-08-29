const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration - Replace these with your actual details
const USER_CONFIG = {
  full_name: "adarsh_ghodke", // Replace with your name in lowercase
  dob: "12052005", // Replace with your DOB in ddmmyyyy format
  email: "adarshtukaramghodke2022@vitbhopal.ac.in", // Replace with your email
  roll_number: "22BCE10630", // Replace with your roll number
};

// Helper function to check if a string is a number
const isNumber = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str));
};

// Helper function to check if a character is alphabetic
const isAlphabet = (str) => {
  return str.length === 1 && /^[a-zA-Z]$/.test(str);
};

// Helper function to check if a character is a special character
const isSpecialChar = (str) => {
  return str.length === 1 && /[^a-zA-Z0-9]/.test(str);
};

// Helper function to create alternating caps string
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

// Main processing function
const processData = (data) => {
  const oddNumbers = [];
  const evenNumbers = [];
  const alphabets = [];
  const specialCharacters = [];
  let sumOfNumbers = 0;
  let alphabeticalChars = "";

  // Process each element in the data array
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

  // Create concatenated string (reverse order with alternating caps)
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

// GET endpoint (optional - for testing)
app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// POST endpoint - Main API
app.post("/bfhl", (req, res) => {
  try {
    // Validate request body
    if (!req.body || !req.body.data) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid request. 'data' field is required.",
      });
    }

    const { data } = req.body;

    // Validate data is an array
    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid request. 'data' must be an array.",
      });
    }

    // Process the data
    const result = processData(data);

    // Construct response
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

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "BFHL API is running",
    endpoints: {
      POST: "/bfhl",
      GET: "/bfhl",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    is_success: false,
    error: "Something went wrong!",
  });
});

// Start server (for local development)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
