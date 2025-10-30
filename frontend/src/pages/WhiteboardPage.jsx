import React from 'react';
import './WhiteboardPage.css';

function WhiteboardPage() {
  return (
    <div className="whiteboard-page">
      <div className="toolbar">
        <button>← Back</button>
        <h2>My Whiteboard</h2>
        <button>Share</button>
      </div>

      <div className="whiteboard-content">
        <p>Excalidraw will be integrated here</p>
      </div>
    </div>
  );
}

export default WhiteboardPage;
