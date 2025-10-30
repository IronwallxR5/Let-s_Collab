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
          { collaborators: { some: { userId: userId } } }, // Boards  collaborated
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
        _count: {
          select: { collaborators: true },
        },
      },
    });

    // Transform response to include helpful metadata
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
        collaboratorCount: board._count.collaborators, //for frontend display
      };
    });

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Failed to fetch boards",
    });
  }
};

module.exports = {
  getAllBoards,
};
