import React from 'react';
import './WhiteboardPage.css';

const WhiteboardPage = () => {
  return (
    <div className="whiteboard-page">
      <div className="whiteboard-toolbar">
        <div className="toolbar-left">
          <button className="btn-back">← Back</button>
          <h2 className="whiteboard-name">Untitled Whiteboard</h2>
        </div>
        <div className="toolbar-right">
          <button className="btn-share">Share</button>
          <div className="collaborators">
            <div className="avatar">You</div>
          </div>
        </div>
      </div>

      <div className="whiteboard-content">
        <div className="placeholder">
          <div className="placeholder-icon">🎨</div>
          <p className="placeholder-title">Excalidraw Whiteboard Component</p>
          <p className="placeholder-text">Will be integrated with real-time collaboration</p>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPage;
