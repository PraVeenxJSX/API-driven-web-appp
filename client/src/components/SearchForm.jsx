import React, { useState } from 'react';

const SearchForm = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch(keyword);
    setKeyword('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter keyword (e.g., react, node)"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search & Save'}
      </button>
    </form>
  );
};

export default SearchForm;