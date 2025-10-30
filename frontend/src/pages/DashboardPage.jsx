import React from 'react';
import './DashboardPage.css';

function DashboardPage() {
  
  // TODO: fetch whiteboards from backend
  const whiteboards = [
    { id: 1, name: 'Project Planning', lastEdited: '2 hours ago' },
    { id: 2, name: 'Design Brainstorm', lastEdited: 'yesterday' }
  ];

  const createNewWhiteboard = () => {
    // will implement later
    console.log('create new whiteboard');
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>My Whiteboards</h1>
        <button onClick={createNewWhiteboard}>+ New Whiteboard</button>
        
        <div className="whiteboards-grid">
          {whiteboards.map(board => (
            <div key={board.id} className="whiteboard-card">
              <div className="thumbnail"></div>
              <h3>{board.name}</h3>
              <p>Last edited {board.lastEdited}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
