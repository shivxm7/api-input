const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Example user details (Replace with actual user data source)
const user = {
  full_name: "John Doe",
  dob: "17091999",
  email: "john@xyz.com",
  roll_number: "ABCD123",
};

// GET route for operation_code
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// POST route to process data
app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ is_success: false, message: "Invalid input format" });
    }

    // Extract numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => /^[A-Za-z]$/.test(item));

    // Find highest alphabet (case insensitive)
    const highestAlphabet =
      alphabets.length > 0
        ? [
            alphabets.sort((a, b) =>
              b.toLowerCase().localeCompare(a.toLowerCase())
            )[0],
          ]
        : [];

    // Response structure with actual user details
    const response = {
      is_success: true,
      user_id: `${user.full_name.toLowerCase().replace(/\s+/g, "_")}_${
        user.dob
      }`,
      email: user.email,
      roll_number: user.roll_number,
      numbers,
      alphabets,
      highest_alphabet: highestAlphabet,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ is_success: false, message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
