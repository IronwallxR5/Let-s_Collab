import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [whiteboards, setWhiteboards] = useState([]);

  // Load whiteboards from localStorage on mount
  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem('whiteboards') || '[]');
    setWhiteboards(savedBoards);
  }, []);

  const createNewWhiteboard = () => {
    const newBoard = {
      id: Date.now().toString(), // Simple ID generation
      title: `Untitled Board ${whiteboards.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      excalidrawData: null
    };

    const updatedBoards = [...whiteboards, newBoard];
    localStorage.setItem('whiteboards', JSON.stringify(updatedBoards));
    setWhiteboards(updatedBoards);
    
    // Navigate to the new whiteboard
    navigate(`/whiteboard/${newBoard.id}`);
  };

  const deleteWhiteboard = (id, e) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm('Are you sure you want to delete this whiteboard?')) {
      const updatedBoards = whiteboards.filter(board => board.id !== id);
      localStorage.setItem('whiteboards', JSON.stringify(updatedBoards));
      setWhiteboards(updatedBoards);
    }
  };

  const openWhiteboard = (id) => {
    navigate(`/whiteboard/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="header">
          <h1>My Whiteboards</h1>
          <button onClick={createNewWhiteboard} className="create-btn">
            + New Whiteboard
          </button>
        </div>
        
        {whiteboards.length === 0 ? (
          <div className="empty-state">
            <p>No whiteboards yet. Create your first one!</p>
            <button onClick={createNewWhiteboard} className="create-btn-large">
              + Create Your First Whiteboard
            </button>
          </div>
        ) : (
          <div className="whiteboards-grid">
            {whiteboards.map(board => (
              <div 
                key={board.id} 
                className="whiteboard-card"
                onClick={() => openWhiteboard(board.id)}
              >
                <div className="thumbnail">
                  <svg viewBox="0 0 100 100" className="placeholder-icon">
                    <rect x="10" y="10" width="80" height="60" fill="#e0e0e0" rx="4"/>
                    <line x1="20" y1="25" x2="60" y2="25" stroke="#999" strokeWidth="2"/>
                    <line x1="20" y1="35" x2="75" y2="35" stroke="#999" strokeWidth="2"/>
                    <circle cx="25" cy="55" r="8" fill="#999"/>
                    <rect x="40" y="48" width="25" height="15" fill="#999" rx="2"/>
                  </svg>
                </div>
                <div className="card-content">
                  <h3>{board.title}</h3>
                  <p className="last-edited">Last edited {formatDate(board.updatedAt)}</p>
                  <button 
                    className="delete-btn"
                    onClick={(e) => deleteWhiteboard(board.id, e)}
                    title="Delete whiteboard"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
