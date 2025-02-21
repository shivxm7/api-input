import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    document.title = "ABCD123";
  }, []);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setResponseData(null);
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!Array.isArray(parsedJson.data)) {
        setError("Invalid JSON structure. 'data' should be array.");
        return;
      }

      const response = await axios.post(
        "https://api-input-backendd.onrender.com/bfhl",
        parsedJson
      );
      setResponseData(response.data);
      setShowDropdown(true);
    } catch (err) {
      setError("Invalid JSON input or server error.");
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(value)
        ? prevFilters.filter((filter) => filter !== value)
        : [...prevFilters, value]
    );
  };

  const renderFilteredData = () => {
    if (!responseData) return null;
    const filteredData = {};
    selectedFilters.forEach((filter) => {
      filteredData[filter] = responseData[filter];
    });
    return (
      <pre className="bg-gray-100 p-4 rounded mt-4">
        {JSON.stringify(filteredData, null, 2)}
      </pre>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">API</h1>

      <textarea
        value={jsonInput}
        onChange={handleJsonInputChange}
        placeholder='Enter JSON (e.g. { "data": ["A","C","z"] })'
        className="border p-2 w-full max-w-md rounded"
        rows="4"
      ></textarea>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* {responseData && (
        <div className="mt-4 w-full max-w-md">
          <h2 className="text-xl font-semibold">Response Data:</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )} */}

      {showDropdown && (
        <div className="mt-4">
          <label className="font-semibold">Filter Response By:</label>
          <div className="flex flex-wrap mt-2">
            <label className="mr-4">
              <input
                type="checkbox"
                value="alphabets"
                onChange={handleFilterChange}
                className="mr-1"
              />
              Alphabets
            </label>
            <label className="mr-4">
              <input
                type="checkbox"
                value="numbers"
                onChange={handleFilterChange}
                className="mr-1"
              />
              Numbers
            </label>
            <label className="mr-4">
              <input
                type="checkbox"
                value="highest_alphabet"
                onChange={handleFilterChange}
                className="mr-1"
              />
              Highest Alphabet
            </label>
          </div>
          {renderFilteredData()}
        </div>
      )}
    </div>
  );
};

export default App;
