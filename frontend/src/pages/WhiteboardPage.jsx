import React, { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  FileDownload as FileDownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  SaveAlt as SaveAltIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { whiteboardService } from "../services/index";

function WhiteboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [boardTitle, setBoardTitle] = useState("Untitled Board");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    const loadBoard = async () => {
      try {
        const boardData = await whiteboardService.getBoard(id, savedUser.id);

        setBoardTitle(boardData.title);
        setTempTitle(boardData.title);

        if (
          boardData.elements &&
          Array.isArray(boardData.elements) &&
          excalidrawAPI
        ) {
          excalidrawAPI.updateScene({
            elements: boardData.elements,
          });
        }
      } catch (error) {
        console.error("Error loading board:", error);
        toast.error("Failed to load whiteboard");
        navigate("/dashboard");
      }
    };

    loadBoard();
  }, [id, excalidrawAPI, navigate]);

  useEffect(() => {
    if (!excalidrawAPI) return;

    const saveToBackend = async () => {
      try {
        setIsSaving(true);
        const elements = excalidrawAPI.getSceneElements();

        const savedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (!savedUser) {
          console.error("User not found");
          return;
        }

        await whiteboardService.updateBoard(id, savedUser.id, {
          elements: elements,
        });

        setTimeout(() => setIsSaving(false), 500);
      } catch (error) {
        console.error("Error auto-saving:", error);
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(saveToBackend, 2000);

    return () => clearTimeout(timeoutId);
  }, [excalidrawAPI, id]);

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
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();

    try {
      if (type === "png") {
        const blob = await excalidrawAPI.exportToBlob({
          elements,
          appState,
          mimeType: "image/png",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${boardTitle}.png`;
        a.click();
        toast.success("Exported as PNG");
      } else if (type === "svg") {
        const svg = await excalidrawAPI.exportToSvg({
          elements,
          appState,
        });
        const svgString = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${boardTitle}.svg`;
        a.click();
        toast.success("Exported as SVG");
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed");
    }

    setExportMenuAnchor(null);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <AppBar position="static" color="default" elevation={2}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate("/dashboard")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Title Section */}
          {isEditingTitle ? (
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <TextField
                size="small"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") handleTitleCancel();
                }}
                autoFocus
                sx={{ mr: 1, maxWidth: 400 }}
              />
              <IconButton
                size="small"
                color="primary"
                onClick={handleTitleSave}
              >
                <CheckIcon />
              </IconButton>
              <IconButton size="small" onClick={handleTitleCancel}>
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                cursor: "pointer",
              }}
              onClick={handleTitleEdit}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                {boardTitle}
              </Typography>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Auto-save indicator */}
          {isSaving && (
            <Chip
              label="Saving..."
              size="small"
              color="primary"
              sx={{ mr: 2 }}
              icon={<SaveAltIcon />}
            />
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={(e) => setExportMenuAnchor(e.currentTarget)}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={() => setShareDialogOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              }}
            >
              Share
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleExport("png")}>Export as PNG</MenuItem>
        <MenuItem onClick={() => handleExport("svg")}>Export as SVG</MenuItem>
      </Menu>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Whiteboard</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Collaboration features are coming soon! You'll be able to:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              ✓ Invite collaborators by email
            </Typography>
            <Typography variant="body2">
              ✓ Set permissions (Viewer, Editor, Owner)
            </Typography>
            <Typography variant="body2">✓ Generate shareable links</Typography>
            <Typography variant="body2">
              ✓ See live cursors and presence
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Whiteboard Canvas */}
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{
            elements: [],
            appState: { viewBackgroundColor: "#ffffff" },
          }}
        />
      </Box>
    </Box>
  );
}

export default WhiteboardPage;
