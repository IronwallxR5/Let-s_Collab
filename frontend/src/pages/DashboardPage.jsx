import React from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Whiteboards</h1>
          <button className="btn-new-whiteboard">+ New Whiteboard</button>
        </div>
        
        <div className="whiteboards-grid">
          <div className="whiteboard-card">
            <div className="whiteboard-thumbnail"></div>
            <h3 className="whiteboard-name">Project Planning</h3>
            <p className="whiteboard-meta">Last edited 2 hours ago</p>
          </div>
          
          <div className="whiteboard-card">
            <div className="whiteboard-thumbnail"></div>
            <h3 className="whiteboard-name">Design Brainstorm</h3>
            <p className="whiteboard-meta">Last edited yesterday</p>
          </div>
          
          <div className="create-card">
            <div className="create-content">
              <div className="create-icon">+</div>
              <p className="create-text">Create New Whiteboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
