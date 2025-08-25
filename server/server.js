// Import required packages
require('dotenv').config(); // Loads environment variables from a .env file
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable the express app to parse JSON formatted request bodies

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process with an error code
});

// --- Mongoose Schema and Model for GitHub Repos ---
const RepoSchema = new mongoose.Schema({
  githubId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  ownerLogin: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  htmlUrl: { type: String, required: true },
  description: { type: String },
  stars: { type: Number, default: 0 },
});

const Repo = mongoose.model('Repo', RepoSchema);

// --- API Routes ---

/**
 * @route   POST /api/search
 * @desc    Fetch repos from GitHub API based on a keyword and store them.
 */
app.post('/api/search', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required.' });
  }

  try {
    // 1. Fetch data from the GitHub API
    // The GitHub API requires a User-Agent header for all requests.
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${keyword}&per_page=10`, 
      {
        headers: {
          'User-Agent': 'Your-App-Name', // Replace with your app name or GitHub username
        },
      }
    );
    
    const apiData = response.data.items;

    if (!apiData || apiData.length === 0) {
      return res.status(404).json({ message: 'No repositories found for the given keyword.' });
    }

    // 2. Prepare the data for our database
    const reposToStore = apiData.map(repo => ({
      githubId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      ownerLogin: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
      htmlUrl: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
    }));

    // 3. Store the results in the database, handling potential duplicates
    const storedRepos = [];
    for (const repo of reposToStore) {
      try {
        const newRepo = new Repo(repo);
        await newRepo.save();
        storedRepos.push(newRepo);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Skipping duplicate repo: ${repo.fullName}`);
        } else {
          throw error;
        }
      }
    }

    res.status(201).json({ 
        message: 'Repositories fetched and stored successfully.',
        count: storedRepos.length,
        data: storedRepos 
    });

  } catch (error) {
    console.error('Error in /api/search:', error.message);
    // Handle GitHub API rate limit error specifically
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ message: 'GitHub API rate limit exceeded. Please try again later.' });
    }
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});


/**
 * @route   GET /api/dashboard
 * @desc    Retrieve all stored repos from our database.
 */
app.get('/api/dashboard', async (req, res) => {
  // 1. Get page number and limit from query params, with default values
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9; // Let's show 9 repos per page

  // 2. Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  try {
    // 3. Get the total count of documents for calculating total pages
    const totalRepos = await Repo.countDocuments();
    const totalPages = Math.ceil(totalRepos / limit);

    // 4. Fetch the specific slice of repos for the current page
    const repos = await Repo.find({})
      .sort({ stars: -1 }) // Keep the sorting
      .skip(skip)
      .limit(limit);

    // 5. Send a structured response with data and pagination info
    res.status(200).json({
      data: repos,
      currentPage: page,
      totalPages: totalPages,
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ message: 'Failed to retrieve data from the database.' });
  }
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});