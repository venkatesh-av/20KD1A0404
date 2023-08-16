const express = require("express");
const axios = require("axios");
const app = express();
const serverPort = 8008;

app.use(express.json());

async function fetchNumbersFromUrl(url) {
  try {
    const response = await axios.get(url, { timeout: 500 });
    if (response.status === 200) {
      return response.data.numbers || [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

app.get("/numbers", async (req, res) => {
  const targetUrls = req.query.urls || [];
  const fetchTasks = targetUrls.map(fetchNumbersFromUrl);

  let mergedNumberSet = new Set();
  try {
    const fetchResults = await Promise.all(fetchTasks);
    fetchResults.forEach((numbers) => {
      numbers.forEach((number) => mergedNumberSet.add(number));
    });
  } catch (error) {
    // Handle any error here
  }

  const sortedNumbers = Array.from(mergedNumberSet).sort((a, b) => a - b);
  res.json({ numbers: sortedNumbers });
});

const givenUrls = [
  "http://20.244.56.144/numbers/primes",
  "http://20.244.56.144/numbers/fibo",
  "http://20.244.56.144/numbers/odd",
  "http://20.244.56.144/numbers/rand",
];

(async () => {
  try {
    const fetchResults = await Promise.all(
      givenUrls.map(fetchNumbersFromUrl)
    );
    const mergedNumberSet = new Set();

    fetchResults.forEach((numbers) => {
      numbers.forEach((number) => mergedNumberSet.add(number));
    });

    const sortedNumbers = Array.from(mergedNumberSet).sort((a, b) => a - b);
    console.log("Merged Numbers:", sortedNumbers);
  } catch (error) {
    console.error("Error fetching numbers:", error);
  }
})();

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
