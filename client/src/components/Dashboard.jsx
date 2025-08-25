import React from 'react';

const Dashboard = ({ repos }) => {
  if (repos.length === 0) {
    return <p>No repositories saved yet. Use the search bar to find and save some!</p>;
  }

  return (
    <div className="dashboard">
      {repos.map((repo) => (
        <div key={repo.githubId} className="repo-card">
          <h3>
            <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
              {repo.fullName}
            </a>
          </h3>
          <p>{repo.description}</p>
          <div className="repo-meta">
            <span className="repo-owner">
              <img src={repo.avatarUrl} alt={repo.ownerLogin} className="avatar"/>
              {repo.ownerLogin}
            </span>
            <span>⭐ {repo.stars.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;