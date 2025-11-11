import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  FolderOpen as FolderOpenIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { whiteboardService } from "../services/index";

function DashboardPage() {
  const navigate = useNavigate();
  const [whiteboards, setWhiteboards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    // Load boards from backend
    const loadBoards = async () => {
      try {
        const data = await whiteboardService.getAllBoards(savedUser.id);

        // Backend returns { response: [...boards] }
        if (data?.response) {
          setWhiteboards(data.response);
          setFilteredBoards(data.response);
        }
      } catch (error) {
        console.error("Error loading boards:", error);
        toast.error("Failed to load whiteboards");
        // Fallback to empty array
        setWhiteboards([]);
        setFilteredBoards([]);
      }
    };

    loadBoards();
  }, [navigate]);

  // Filter boards based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBoards(whiteboards);
    } else {
      const filtered = whiteboards.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBoards(filtered);
    }
  }, [searchQuery, whiteboards]);

  const createNewWhiteboard = async () => {
    try {
      if (!user?.id) {
        toast.error("User not found. Please login again.");
        return;
      }

      const title = `Untitled Board ${whiteboards.length + 1}`;

      // Call backend API to create board
      const response = await whiteboardService.createWhiteboard(title, user.id);

      if (response?.newBoard) {
        // Add to local state
        const updatedBoards = [...whiteboards, response.newBoard];
        setWhiteboards(updatedBoards);

        toast.success("New whiteboard created!");
        navigate(`/whiteboard/${response.newBoard.id}`);
      }
    } catch (error) {
      console.error("Error creating whiteboard:", error);
      toast.error(error.message || "Failed to create whiteboard");
    }
  };

  const deleteWhiteboard = () => {
    if (!selectedBoard) return;

    const updatedBoards = whiteboards.filter(
      (board) => board.id !== selectedBoard.id
    );
    localStorage.setItem("whiteboards", JSON.stringify(updatedBoards));
    setWhiteboards(updatedBoards);

    toast.success("Whiteboard deleted");
    setDeleteDialogOpen(false);
    setSelectedBoard(null);
  };

  const openWhiteboard = (id) => {
    navigate(`/whiteboard/${id}`);
  };

  const handleMenuOpen = (event, board) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedBoard(board);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      {/* AppBar */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            Let's Collab - Dashboard
          </Typography>

          <IconButton
            color="inherit"
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
          >
            <MenuItem disabled>
              <AccountCircleIcon sx={{ mr: 1 }} />
              {user?.name || "User"}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                My Whiteboards
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {whiteboards.length}{" "}
                {whiteboards.length === 1 ? "whiteboard" : "whiteboards"}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={createNewWhiteboard}
              sx={{
                py: 1.5,
                px: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              }}
            >
              New Whiteboard
            </Button>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search whiteboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        {/* Whiteboards Grid */}
        {filteredBoards.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
            }}
          >
            <FolderOpenIcon
              sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {searchQuery ? "No whiteboards found" : "No whiteboards yet"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "Try adjusting your search"
                : "Create your first whiteboard to get started"}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={createNewWhiteboard}
                sx={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                }}
              >
                Create Your First Whiteboard
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredBoards.map((board) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardActionArea onClick={() => openWhiteboard(board.id)}>
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        height: 180,
                        bgcolor: "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        style={{ width: "60%", height: "60%" }}
                      >
                        <rect
                          x="10"
                          y="10"
                          width="80"
                          height="60"
                          fill="#e0e0e0"
                          rx="4"
                        />
                        <line
                          x1="20"
                          y1="25"
                          x2="60"
                          y2="25"
                          stroke="#999"
                          strokeWidth="2"
                        />
                        <line
                          x1="20"
                          y1="35"
                          x2="75"
                          y2="35"
                          stroke="#999"
                          strokeWidth="2"
                        />
                        <circle cx="25" cy="55" r="8" fill="#999" />
                        <rect
                          x="40"
                          y="48"
                          width="25"
                          height="15"
                          fill="#999"
                          rx="2"
                        />
                      </svg>
                    </Box>

                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            noWrap
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {board.title}
                          </Typography>
                          <Chip
                            label={`Edited ${formatDate(board.updatedAt)}`}
                            size="small"
                            sx={{ fontSize: "0.75rem" }}
                          />
                        </Box>

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, board)}
                          sx={{ ml: 1 }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon sx={{ mr: 1 }} color="error" />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Whiteboard?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedBoard?.title}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteWhiteboard} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardPage;
