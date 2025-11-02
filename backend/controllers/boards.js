const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get boards of a user(created and collaborated) userid passed as query parameter
const getAllBoards = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId }, // user boards
          { collaborators: { some: { userId: userId } } }, // boards  collaborated on
        ],
      },
      include: {
        owner: {
          select: {
            name: true,
          },
        },
        collaborators: {
          where: { userId: userId },
          select: { role: true },
        },
      },
    });

    // data needed for frontend enhancement
    const response = boards.map((board) => {
      const isOwner = board.ownerId === userId;
      const myRole = isOwner ? "OWNER" : board.collaborators[0]?.role;
      const sharedBy = isOwner ? null : board.owner.name;

      return {
        id: board.id,
        title: board.title,
        thumbnail: board.thumbnail,
        createdAt: board.createdAt, //for sort functionality on frontend
        updatedAt: board.updatedAt, //for sort functionality on frontend
        isOwner: isOwner, //for frontend display
        myRole: myRole, //for frontend display
        sharedBy: sharedBy, //for frontend display
      };
    });

    return res.status(200).json({ response });
  } catch (error) {
    console.error("error :", error);
    return res.status(500).json({
      error: "Failed to fetch boards",
    });
  }
};

// get specific board by board-id with all details
const getBoardById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const board = await prisma.board.findUnique({
      where: { id: id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // checking if requested user has access to the board
    const isOwner = board.ownerId === userId;
    const isCollaborator = board.collaborators.some(
      (collab) => collab.userId === userId
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ error: "Access denied" });
    }

    // role of user who requested
    const myRole = isOwner
      ? "OWNER"
      : board.collaborators.find((collab) => collab.userId === userId)?.role;

    const response = {
      id: board.id,
      title: board.title,
      thumbnail: board.thumbnail,
      elements: board.elements,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      isOwner: isOwner,
      owner: board.owner,
      myRole: myRole,
      collaborators: board.collaborators.map((collab) => ({
        userId: collab.user.id,
        name: collab.user.name,
        email: collab.user.email,
        avatar: collab.user.avatar,
        role: collab.role,
        addedAt: collab.addedAt,
      })),
    };

    return res.status(200).json({ response });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({
      error: "Failed to fetch board",
    });
  }
};

// delete a specific board by id(only owner can delete a board)
const deleteBoard = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const board = await prisma.board.findUnique({
      where: { id: id },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.ownerId !== userId) {
      return res
        .status(403)
        .json({ error: "Only the board owner can delete this board" });
    }

    await prisma.board.delete({
      where: { id: id },
    });

    return res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({
      error: "Failed to delete board",
    });
  }
};

// creating a new board
const createBoard = async (req, res) => {
  try {
    const { title, thumbnail, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: "Title and userId are required" });
    }

    const newBoard = await prisma.board.create({
      data: {
        title,
        thumbnail,
        owner: {
          connect: { id: userId },
        },
      },
    });

    return res.status(201).json({ message: "Board created successfully", newBoard });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({
      error: "Failed to create board",
    });
  }
};

module.exports = {
  getAllBoards,
  getBoardById,
  deleteBoard,
  createBoard,
};
