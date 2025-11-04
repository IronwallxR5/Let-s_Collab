const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// send an invite to collaborate on a board
const sendInvite = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { userId, receiverEmail, role } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!receiverEmail) {
      return res.status(400).json({ error: "receiverEmail is required" });
    }

    // check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // only owner can send invites
    if (board.ownerId !== userId) {
      return res.status(403).json({ 
        error: "Only board owner can send invites" 
      });
    }

    // check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    // can't invite yourself
    if (receiver && receiver.id === userId) {
      return res.status(400).json({ 
        error: "Cannot send invite to yourself" 
      });
    }

    // check if already a collaborator
    if (receiver) {
      const existingCollaborator = await prisma.boardCollaborator.findUnique({
        where: {
          boardId_userId: {
            boardId: boardId,
            userId: receiver.id,
          },
        },
      });

      if (existingCollaborator) {
        return res.status(400).json({ 
          error: "User is already a collaborator on this board" 
        });
      }
    }

    // check if there's already a pending invite
    const existingInvite = await prisma.invite.findFirst({
      where: {
        boardId: boardId,
        receiverEmail: receiverEmail,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return res.status(400).json({ 
        error: "An invite is already pending for this email" 
      });
    }

    // create invite
    const invite = await prisma.invite.create({
      data: {
        boardId: boardId,
        senderId: userId,
        receiverEmail: receiverEmail,
        receiverId: receiver?.id,
        role: role || "EDITOR",
        status: "PENDING",
      },
      include: {
        board: {
          select: {
            title: true,
          },
        },
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const response = {
      id: invite.id,
      boardId: invite.boardId,
      boardTitle: invite.board.title,
      senderName: invite.sender.name,
      senderEmail: invite.sender.email,
      receiverEmail: invite.receiverEmail,
      role: invite.role,
      status: invite.status,
      createdAt: invite.createdAt,
    };

    return res.status(201).json({ 
      message: "Invite sent successfully", 
      invite: response 
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ error: "Failed to send invite" });
  }
};

// get all pending invites for the logged-in user
const getPendingInvites = async (req, res) => {
  try {
    const userId = req.query.userId;
    const userEmail = req.query.userEmail;

    if (!userId || !userEmail) {
      return res.status(400).json({ 
        error: "userId and userEmail are required" 
      });
    }

    // get invites by receiverId or receiverEmail
    const invites = await prisma.invite.findMany({
      where: {
        OR: [
          { receiverId: userId },
          { receiverEmail: userEmail },
        ],
        status: "PENDING",
      },
      include: {
        board: {
          select: {
            title: true,
            thumbnail: true,
          },
        },
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const response = invites.map((invite) => ({
      id: invite.id,
      boardId: invite.boardId,
      boardTitle: invite.board.title,
      boardThumbnail: invite.board.thumbnail,
      senderName: invite.sender.name,
      senderEmail: invite.sender.email,
      role: invite.role,
      status: invite.status,
      createdAt: invite.createdAt,
    }));

    return res.status(200).json({ invites: response });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ error: "Failed to fetch invites" });
  }
};

module.exports = {
  sendInvite,
  getPendingInvites,
};
