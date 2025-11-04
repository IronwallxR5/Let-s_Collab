const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// get all collaborators for a specific board
const getCollaborators = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // check if user has access to this board
    const isOwner = board.ownerId === userId;
    const isCollaborator = await prisma.boardCollaborator.findUnique({
      where: {
        boardId_userId: {
          boardId: boardId,
          userId: userId,
        },
      },
    });

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ error: "Access denied" });
    }

    // get all collaborators
    const collaborators = await prisma.boardCollaborator.findMany({
      where: { boardId: boardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    const response = collaborators.map((collab) => ({
      id: `${collab.boardId}_${collab.userId}`,
      userId: collab.user.id,
      name: collab.user.name,
      email: collab.user.email,
      role: collab.role,
      addedAt: collab.addedAt,
    }));

    return res.status(200).json({ collaborators: response });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ error: "Failed to fetch collaborators" });
  }
};

// add a collaborator to a board (owner only)
const addCollaborator = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { userId, collaboratorEmail, role } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!collaboratorEmail) {
      return res.status(400).json({ error: "collaboratorEmail is required" });
    }

    // check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // only owner can add collaborators
    if (board.ownerId !== userId) {
      return res.status(403).json({ 
        error: "Only board owner can add collaborators" 
      });
    }

    // find user by email
    const collaboratorUser = await prisma.user.findUnique({
      where: { email: collaboratorEmail },
    });

    if (!collaboratorUser) {
      return res.status(404).json({ 
        error: "User with this email not found" 
      });
    }

    // check if user is already a collaborator
    const existingCollaborator = await prisma.boardCollaborator.findUnique({
      where: {
        boardId_userId: {
          boardId: boardId,
          userId: collaboratorUser.id,
        },
      },
    });

    if (existingCollaborator) {
      return res.status(400).json({ 
        error: "User is already a collaborator on this board" 
      });
    }

    // can't add owner as collaborator
    if (collaboratorUser.id === board.ownerId) {
      return res.status(400).json({ 
        error: "Cannot add board owner as collaborator" 
      });
    }

    // add collaborator
    const newCollaborator = await prisma.boardCollaborator.create({
      data: {
        boardId: boardId,
        userId: collaboratorUser.id,
        role: role || "EDITOR",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const response = {
      id: `${newCollaborator.boardId}_${newCollaborator.userId}`,
      userId: newCollaborator.user.id,
      name: newCollaborator.user.name,
      email: newCollaborator.user.email,
      role: newCollaborator.role,
      addedAt: newCollaborator.addedAt,
    };

    return res.status(201).json({ 
      message: "Collaborator added successfully", 
      collaborator: response 
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ error: "Failed to add collaborator" });
  }
};

// remove a collaborator from board (owner only)
const removeCollaborator = async (req, res) => {
  try {
    const collaboratorId = req.params.collaboratorId;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // parse collaboratorId (format: boardId_userId)
    const [boardId, collaboratorUserId] = collaboratorId.split("_");

    if (!boardId || !collaboratorUserId) {
      return res.status(400).json({ error: "Invalid collaborator ID format" });
    }

    // check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // only owner can remove collaborators
    if (board.ownerId !== userId) {
      return res.status(403).json({ 
        error: "Only board owner can remove collaborators" 
      });
    }

    // check if collaborator exists
    const collaborator = await prisma.boardCollaborator.findUnique({
      where: {
        boardId_userId: {
          boardId: boardId,
          userId: collaboratorUserId,
        },
      },
    });

    if (!collaborator) {
      return res.status(404).json({ error: "Collaborator not found" });
    }

    // remove collaborator
    await prisma.boardCollaborator.delete({
      where: {
        boardId_userId: {
          boardId: boardId,
          userId: collaboratorUserId,
        },
      },
    });

    return res.status(200).json({ 
      message: "Collaborator removed successfully" 
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ error: "Failed to remove collaborator" });
  }
};

module.exports = {
  getCollaborators,
  addCollaborator,
  removeCollaborator,
};
