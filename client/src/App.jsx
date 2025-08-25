import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import the new components
import SearchForm from './components/SearchForm';
import Dashboard from './components/Dashboard';
import PaginationControls from './components/PaginationControls';

// Define the backend API URL
const API_URL = 'https://api-driven-web-app.onrender.com/api';

function App() {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Function to fetch repos for a specific page
  const fetchDashboardData = async (page) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/dashboard?page=${page}`);
      setRepos(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch data from the dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchDashboardData(1); // Fetch the first page initially
  }, []);

  // Function to handle search
  const handleSearch = async (keyword) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await axios.post(`${API_URL}/search`, { keyword });
      setMessage(`${response.data.count} new repositories were successfully saved!`);
      fetchDashboardData(1); // Refresh dashboard to page 1 to see new results
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during search.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>GitHub Repo Finder</h1>
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      
      {error && <p className="message error">{error}</p>}
      {message && <p className="message success">{message}</p>}

      <h2>Saved Repositories Dashboard</h2>
      <Dashboard repos={repos} />
      
      {totalPages > 1 && (
         <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchDashboardData}
         />
      )}
    </>
  );
}

export default App;