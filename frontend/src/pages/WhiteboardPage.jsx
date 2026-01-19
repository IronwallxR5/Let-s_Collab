import React, { useState, useEffect, useRef } from "react";
import { Excalidraw, exportToBlob, exportToSvg } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  Check,
  X,
  Save,
  Users,
} from 'lucide-react';
import toast from "react-hot-toast";
import { whiteboardService } from "../services/index";
import { ShareScreen } from "../components";
import { ProfileDropdown } from "../components/ui/ProfileDropdown";
import { io } from "socket.io-client";

function WhiteboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const excalidrawRef = useRef(null);
  const setExcalidrawApi = React.useCallback((api) => {
    excalidrawRef.current = api;
  }, []);

  const socketRef = useRef(null);
  const applyingRemoteUpdate = useRef(false);
  const lastSerializedElementsRef = useRef("");
  const lastSavedSerializedRef = useRef("");
  const lastSocketEmitRef = useRef(Date.now());
  const socketEmitTimeoutRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const [boardTitle, setBoardTitle] = useState("Untitled Board");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [boardData, setBoardData] = useState(null);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [user, setUser] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const loadBoard = async () => {
      try {
        setIsLoading(true);
        const response = await whiteboardService.getBoard(id, savedUser.id);
        const data = response.response || response;        console.log("📖 Loaded board data:", {
          id: data.id,
          title: data.title,
          elementsCount: Array.isArray(data.elements) ? data.elements.length : 0,
          elements: data.elements
        });        setBoardTitle(data.title);
        setTempTitle(data.title);
        setBoardData(data);
        setIsLoading(false); // Remove artificial delay
      } catch (error) {
        console.error("Error loading board:", error);
        toast.error("Failed to load whiteboard");
        navigate("/dashboard");
      }
    };

    loadBoard();

    // Defer Socket.IO initialization to not block initial board rendering
    const initSocket = () => {
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      socketRef.current = io(BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
        upgrade: true,
        rememberUpgrade: true,
      });

      // Connection status handlers
      socketRef.current.on("connect", () => {
        console.log("✅ Socket.IO connected:", socketRef.current.id);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("❌ Socket.IO connection error:", error.message);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("🔌 Socket.IO disconnected:", reason);
      });

      socketRef.current.on("reconnect", (attemptNumber) => {
        console.log("🔄 Socket.IO reconnected after", attemptNumber, "attempts");
      });

      // Join the board room
      socketRef.current.emit("join-board", {
        boardId: id,
        userId: savedUser.id,
        userName: savedUser.name,
      });

      // Listen for user joined events
      socketRef.current.on("user-joined", (data) => {
        setActiveUsers(data.activeUsers || []);
        if (data.userName && data.userId !== savedUser.id) {
          toast.success(`${data.userName} joined the board`, {
            duration: 2000,
            icon: "👋",
          });
        }
      });

      // Listen for user left events
      socketRef.current.on("user-left", (data) => {
        setActiveUsers(data.activeUsers || []);
        if (data.userName && data.userId !== savedUser.id) {
          toast(`${data.userName} left the board`, {
            duration: 2000,
            icon: "👋",
          });
        }
        // Remove cursor when user leaves
        setCursors((prev) => {
          const newCursors = { ...prev };
          delete newCursors[data.socketId];
          return newCursors;
        });
      });

      // Listen for element updates from other users
      socketRef.current.on("element-update", (data) => {
        if (data.userId !== savedUser.id && excalidrawRef.current) {
          // Set flag before update
          applyingRemoteUpdate.current = true;
          
          try {
            excalidrawRef.current.updateScene({
              elements: data.elements,
            });
          } catch (error) {
            console.error("Error updating scene:", error);
          }
          
          // Clear flag after a short delay to ensure update is complete
          setTimeout(() => {
            applyingRemoteUpdate.current = false;
          }, 100);
        }
      });

      // Listen for cursor movements
      socketRef.current.on("cursor-move", (data) => {
        if (data.userId !== savedUser.id) {
          setCursors((prev) => ({
            ...prev,
            [data.socketId]: {
              x: data.x,
              y: data.y,
              userName: data.userName,
              userId: data.userId,
            },
          }));
        }
      });

      // Listen for title updates
      socketRef.current.on("title-update", (data) => {
        if (data.userId !== savedUser.id) {
          setBoardTitle(data.title);
          setTempTitle(data.title);
        }
      });

      // Handle socket errors
      socketRef.current.on("error", (error) => {
        console.error("Socket error:", error);
        toast.error(error.message || "Connection error");
      });
    };

    // Initialize socket after board data starts loading to prioritize rendering
    const socketTimeout = setTimeout(initSocket, 50);

    // Cleanup on unmount
    return () => {
      clearTimeout(socketTimeout);
      if (socketEmitTimeoutRef.current) {
        clearTimeout(socketEmitTimeoutRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.emit("leave-board");
        socketRef.current.disconnect();
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!excalidrawRef.current || !boardData) return;

    if (boardData.elements && Array.isArray(boardData.elements)) {
      console.log("🎨 Applying elements to Excalidraw:", boardData.elements.length, "elements");
      applyingRemoteUpdate.current = true;
      excalidrawRef.current.updateScene({
        elements: boardData.elements,
      });
      requestAnimationFrame(() => {
        applyingRemoteUpdate.current = false;
      });
    } else {
      console.warn("⚠️ No valid elements to apply:", boardData.elements);
    }
  }, [boardData]);

  const handleChange = (elements) => {
    if (!excalidrawRef.current) return;

    // Skip if this is a remote update being applied
    if (applyingRemoteUpdate.current) {
      return;
    }

    const now = Date.now();
    
    // Serialize current elements
    let serialized;
    try {
      serialized = JSON.stringify(elements || []);
    } catch {
      serialized = null;
    }

    // Skip if no change detected
    if (serialized && serialized === lastSerializedElementsRef.current) {
      return;
    }

    if (serialized) lastSerializedElementsRef.current = serialized;

    // Throttled socket emission (every 150ms max)
    if (socketRef.current && elements && (now - lastSocketEmitRef.current) >= 150) {
      lastSocketEmitRef.current = now;
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      socketRef.current.emit("element-update", {
        boardId: id,
        elements: elements,
        userId: savedUser?.id,
      });
    } else if (socketRef.current && elements) {
      // If throttled, schedule an emit for later
      if (socketEmitTimeoutRef.current) {
        clearTimeout(socketEmitTimeoutRef.current);
      }
      socketEmitTimeoutRef.current = setTimeout(() => {
        const savedUser = JSON.parse(localStorage.getItem("user") || "null");
        socketRef.current.emit("element-update", {
          boardId: id,
          elements: elements,
          userId: savedUser?.id,
        });
        lastSocketEmitRef.current = Date.now();
      }, 150);
    }

    // Debounce backend save (only save after 2 seconds of inactivity)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToBackend();
    }, 2000);

    setLastSaved(Date.now());
  };

  const generateThumbnail = async () => {
    if (!excalidrawRef.current) return null;

    try {
      const elements = excalidrawRef.current.getSceneElements();
      const appState = excalidrawRef.current.getAppState();
      const files = excalidrawRef.current.getFiles();

      // Only generate thumbnail if there are elements
      if (!elements || elements.length === 0) {
        return null;
      }

      const blob = await exportToBlob({
        elements,
        appState: {
          ...appState,
          exportBackground: true,
          exportWithDarkMode: false,
        },
        files,
        mimeType: "image/png",
        quality: 0.7,
        maxWidthOrHeight: 400, // Generate smaller thumbnail for performance
      });

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return null;
    }
  };

  const saveToBackend = React.useCallback(async () => {
    if (!excalidrawRef.current) return;

    try {
      setIsSaving(true);
      const elements = excalidrawRef.current.getSceneElements();
      
      console.log("💾 Attempting to save board:", id);
      console.log("📝 Number of elements:", elements?.length || 0);
      
      let serialized;
      try {
        serialized = JSON.stringify(elements || []);
      } catch {
        serialized = null;
      }

      if (serialized && serialized === lastSavedSerializedRef.current) {
        console.log("⏭️ Skipping save - no changes detected");
        setIsSaving(false);
        return;
      }

      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!savedUser) {
        console.error("❌ User not found in localStorage");
        setIsSaving(false);
        return;
      }

      console.log("🖼️ Generating thumbnail...");
      // Generate thumbnail
      const thumbnail = await generateThumbnail();
      console.log("✅ Thumbnail generated:", thumbnail ? "Yes" : "No");

      console.log("🚀 Calling API to update board...");
      const response = await whiteboardService.updateBoard(id, savedUser.id, {
        elements: elements,
        thumbnail: thumbnail,
      });
      
      console.log("✅ Board updated successfully:", response);

      if (serialized) lastSavedSerializedRef.current = serialized;

      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error("❌ Error auto-saving:", error);
      toast.error("Failed to save changes: " + error.message);
      setIsSaving(false);
    }
  }, [id]);

  useEffect(() => {
    if (!excalidrawRef.current || lastSaved === 0) return;

    const timeoutId = setTimeout(saveToBackend, 1500);

    return () => clearTimeout(timeoutId);
  }, [lastSaved, saveToBackend]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (excalidrawRef.current && lastSaved !== 0) {
        const elements = excalidrawRef.current.getSceneElements();
        const serialized = JSON.stringify(elements || []);

        if (serialized !== lastSavedSerializedRef.current) {
          e.preventDefault();
          e.returnValue = '';
          saveToBackend();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [lastSaved, saveToBackend]);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(boardTitle);
  };

  const handleTitleSave = async () => {
    if (tempTitle.trim() === "") {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!savedUser) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      await whiteboardService.updateBoard(id, savedUser.id, {
        title: tempTitle,
      });

      setBoardTitle(tempTitle);
      toast.success("Title updated");
      setIsEditingTitle(false);

      // Emit title update to other users
      if (socketRef.current) {
        socketRef.current.emit("title-update", {
          boardId: id,
          title: tempTitle,
        });
      }
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error(error.message || "Failed to update title");
    }
  };

  const handleTitleCancel = () => {
    setTempTitle(boardTitle);
    setIsEditingTitle(false);
  };

  const handleExport = async (type) => {
    if (!excalidrawRef.current) return;

    const elements = excalidrawRef.current.getSceneElements();
    const appState = excalidrawRef.current.getAppState();
    const files = excalidrawRef.current.getFiles();

    try {
      if (type === "png") {
        const blob = await exportToBlob({
          elements,
          appState: {
            ...appState,
            exportBackground: true,
            exportWithDarkMode: false,
          },
          files,
          mimeType: "image/png",
          quality: 1,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${boardTitle}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Exported as PNG");
      } else if (type === "svg") {
        const svg = await exportToSvg({
          elements,
          appState: {
            ...appState,
            exportBackground: true,
            exportWithDarkMode: false,
          },
          files,
        });
        const svgString = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${boardTitle}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Exported as SVG");
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed");
    }

    setExportMenuAnchor(null);
  };

  const handleBackToDashboard = async () => {
    // Save before navigating away
    if (excalidrawRef.current && lastSaved !== 0) {
      const elements = excalidrawRef.current.getSceneElements();
      const serialized = JSON.stringify(elements || []);

      if (serialized !== lastSavedSerializedRef.current) {
        await saveToBackend();
      }
    }
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Handle pointer move for cursor tracking
  const handlePointerUpdate = (payload) => {
    if (!socketRef.current) return;

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) return;

    const { pointer } = payload;

    if (pointer && pointer.x !== undefined && pointer.y !== undefined) {
      socketRef.current.emit("cursor-move", {
        boardId: id,
        x: pointer.x,
        y: pointer.y,
        userName: savedUser.name,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-background/95 backdrop-blur border-b border-border/50 shadow-sm z-10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={handleBackToDashboard}
              className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </button>

            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1 max-w-md animate-in fade-in duration-200">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                    if (e.key === "Escape") handleTitleCancel();
                  }}
                  autoFocus
                  className="flex-1 px-3 py-1.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1.5 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div
                onClick={handleTitleEdit}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 px-3 py-1.5 rounded-lg transition-colors group"
              >
                <h1 className="text-lg font-semibold text-foreground">{boardTitle}</h1>
                <Edit3 size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>

          {isSaving && (
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1.5 mr-4 animate-pulse">
              <Save size={14} />
              Saving...
            </div>
          )}

          {activeUsers.length > 0 && (
            <div className="px-3 py-1.5 bg-accent/50 rounded-full text-xs font-medium flex items-center gap-2 mr-4 text-muted-foreground">
              <Users size={14} />
              <span>{activeUsers.length} active</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                className="px-3 py-2 border border-input rounded-lg hover:bg-accent flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Download size={16} />
                Export
              </button>

              {Boolean(exportMenuAnchor) && (
                <div className="fixed inset-0 z-50" onClick={() => setExportMenuAnchor(null)}>
                  <div
                    className="absolute bg-card border border-border rounded-xl shadow-xl w-48 py-1 animate-in fade-in zoom-in-95 duration-100"
                    style={{
                      top: exportMenuAnchor.getBoundingClientRect().bottom + 8,
                      left: exportMenuAnchor.getBoundingClientRect().left - 100,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleExport("png")}
                      className="w-full px-4 py-2 text-left hover:bg-accent text-sm transition-colors"
                    >
                      Export as PNG
                    </button>
                    <button
                      onClick={() => handleExport("svg")}
                      className="w-full px-4 py-2 text-left hover:bg-accent text-sm transition-colors"
                    >
                      Export as SVG
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShareDialogOpen(true)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
            >
              <Share2 size={16} />
              Share
            </button>

            <div className="relative">
              <button
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                className="flex items-center justify-center w-9 h-9 bg-secondary text-secondary-foreground rounded-full font-semibold shadow-sm hover:shadow-md transition-all"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </button>

              <ProfileDropdown
                user={user}
                onLogout={handleLogout}
                onUserUpdate={handleUserUpdate}
                anchor={userMenuAnchor}
                onClose={() => setUserMenuAnchor(null)}
              />
            </div>
          </div>
        </div>
      </header>

      <ShareScreen
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        boardId={id}
        boardTitle={boardTitle}
      />

      <div className="flex-1 overflow-hidden relative bg-muted/10">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading Whiteboard</h3>
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </div>
        ) : (
          <Excalidraw
            excalidrawAPI={setExcalidrawApi}
            initialData={{
              elements: boardData?.elements || [],
              appState: { viewBackgroundColor: "#ffffff" },
            }}
            onChange={handleChange}
            onPointerUpdate={handlePointerUpdate}
          />
        )}
      </div>

      {/* Remote cursors overlay */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {Object.entries(cursors).map(([socketId, cursor]) => (
          <div
            key={socketId}
            className="absolute transition-all duration-100"
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <path
                  d="M5.65376 12.3673L8.47492 15.1885L10.8162 18.9917L13.0234 13.7806L18.2346 11.5734L14.4314 9.23208L11.6102 6.41092L10.4489 10.5032L5.65376 12.3673Z"
                  fill="#FF6B6B"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute top-5 left-5 px-2 py-1 bg-[#FF6B6B] text-white text-xs rounded-md whitespace-nowrap shadow-sm">
                {cursor.userName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhiteboardPage;
