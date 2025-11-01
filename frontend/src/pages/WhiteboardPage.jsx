import React, { useState, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { useParams, useNavigate } from 'react-router-dom';
import './WhiteboardPage.css';

function WhiteboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [boardTitle, setBoardTitle] = useState('Untitled Board');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Load board data from localStorage on mount
  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem('whiteboards') || '[]');
    const currentBoard = savedBoards.find(board => board.id === id);
    
    if (currentBoard) {
      setBoardTitle(currentBoard.title);
      
      // Load Excalidraw data if it exists
      if (currentBoard.excalidrawData && excalidrawAPI) {
        excalidrawAPI.updateScene(currentBoard.excalidrawData);
      }
    }
  }, [id, excalidrawAPI]);

  // Auto-save function with debouncing
  useEffect(() => {
    if (!excalidrawAPI) return;

    const saveToLocalStorage = () => {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      
      const savedBoards = JSON.parse(localStorage.getItem('whiteboards') || '[]');
      const boardIndex = savedBoards.findIndex(board => board.id === id);
      
      if (boardIndex !== -1) {
        savedBoards[boardIndex] = {
          ...savedBoards[boardIndex],
          excalidrawData: {
            elements,
            appState: {
              viewBackgroundColor: appState.viewBackgroundColor,
              currentItemFontFamily: appState.currentItemFontFamily,
            }
          },
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('whiteboards', JSON.stringify(savedBoards));
      }
    };

    // Debounce auto-save (save after 2 seconds of inactivity)
    const timeoutId = setTimeout(saveToLocalStorage, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [excalidrawAPI, id]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setBoardTitle(newTitle);
    
    // Update title in localStorage
    const savedBoards = JSON.parse(localStorage.getItem('whiteboards') || '[]');
    const boardIndex = savedBoards.findIndex(board => board.id === id);
    
    if (boardIndex !== -1) {
      savedBoards[boardIndex].title = newTitle;
      localStorage.setItem('whiteboards', JSON.stringify(savedBoards));
    }
  };

  const handleExport = async (type) => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();

    if (type === 'png') {
      const blob = await excalidrawAPI.exportToBlob({
        elements,
        appState,
        mimeType: 'image/png',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardTitle}.png`;
      a.click();
    } else if (type === 'svg') {
      const svg = await excalidrawAPI.exportToSvg({
        elements,
        appState,
      });
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardTitle}.svg`;
      a.click();
    }
  };

  return (
    <div className="whiteboard-page">
      <div className="toolbar">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        
        <div className="title-section">
          {isEditingTitle ? (
            <input
              type="text"
              value={boardTitle}
              onChange={handleTitleChange}
              onBlur={() => setIsEditingTitle(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="title-input"
            />
          ) : (
            <h2 onClick={() => setIsEditingTitle(true)} className="board-title">
              {boardTitle}
            </h2>
          )}
        </div>

        <div className="toolbar-actions">
          <button onClick={() => handleExport('png')} className="export-btn">
            Export PNG
          </button>
          <button onClick={() => handleExport('svg')} className="export-btn">
            Export SVG
          </button>
          <button className="share-btn" title="Coming soon!">
            Share (Soon)
          </button>
        </div>
      </div>

      <div className="whiteboard-canvas">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{
            elements: [],
            appState: { viewBackgroundColor: '#ffffff' }
          }}
        />
      </div>
    </div>
  );
}

export default WhiteboardPage;
