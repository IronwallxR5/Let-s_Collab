import React, { useState, useEffect, useCallback } from "react";
import { User, Send, Users, Clock, X, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { inviteService } from "../../services/inviteService";
import { whiteboardService } from "../../services/index";

function ShareScreen({ open, onClose, boardId, boardTitle }) {
    const [tabValue, setTabValue] = useState(0);
    const [inviteIdentifier, setInviteIdentifier] = useState("");
    const [inviteRole, setInviteRole] = useState("EDITOR");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [collaborators, setCollaborators] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [boardData, setBoardData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadBoardData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setDataLoading(true);
            }
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) return;

            const boardResponse = await whiteboardService.getBoard(boardId, user.id);
            const board = boardResponse.response || boardResponse;
            setBoardData(board);
            
            // Filter out any collaborators that might be duplicates
            const uniqueCollaborators = [];
            const seenUserIds = new Set();
            (board.collaborators || []).forEach(collab => {
                if (!seenUserIds.has(collab.userId)) {
                    seenUserIds.add(collab.userId);
                    uniqueCollaborators.push(collab);
                }
            });
            setCollaborators(uniqueCollaborators);

            try {
                const invitesResponse = await inviteService.getBoardInvites(
                    boardId,
                    user.id
                );
                setPendingInvites(invitesResponse.invites || []);
            } catch {
                setPendingInvites([]);
            }
        } catch (error) {
            console.error("Error loading board data:", error);
        } finally {
            if (isRefresh) {
                setRefreshing(false);
            } else {
                setDataLoading(false);
            }
        }
    }, [boardId]);

    useEffect(() => {
        if (open) {
            loadBoardData();
        }
    }, [open, boardId, loadBoardData]);

    const handleSendInvite = async () => {
        if (!inviteIdentifier.trim()) {
            setError("Please enter an email address or username");
            return;
        }

        const isEmail = inviteIdentifier.includes("@");

        if (isEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(inviteIdentifier)) {
                setError("Please enter a valid email address");
                return;
            }
        } else {
            const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
            if (!usernameRegex.test(inviteIdentifier)) {
                setError("Username must be 3-30 characters (letters, numbers, _, -)");
                return;
            }
        }

        setLoading(true);
        setError("");

        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) {
                toast.error("Please login again");
                return;
            }

            await inviteService.sendInvite(
                boardId,
                user.id,
                inviteIdentifier.trim(),
                inviteRole
            );

            toast.success(`Invite sent to ${inviteIdentifier}`);
            setInviteIdentifier("");
            setInviteRole("EDITOR");

            await loadBoardData();
        } catch (err) {
            console.error("Error sending invite:", err);
            setError(err.message || "Failed to send invite");
            toast.error(err.message || "Failed to send invite");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelInvite = async (inviteId) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) return;

            await inviteService.cancelInvite(inviteId, user.id);
            toast.success("Invite cancelled");

            await loadBoardData();
        } catch (error) {
            console.error("Error cancelling invite:", error);
            toast.error("Failed to cancel invite");
        }
    };

    const handleClose = () => {
        setInviteIdentifier("");
        setInviteRole("EDITOR");
        setError("");
        setTabValue(0);
        onClose();
    };

    const totalPeople = (boardData ? 1 : 0) + collaborators.length;

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="border-b border-border p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="text-primary" size={24} />
                            <h2 className="text-xl font-semibold">
                                Manage Access - "{boardTitle}"
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                {totalPeople} {totalPeople === 1 ? "person" : "people"}
                            </span>
                            <button
                                onClick={() => loadBoardData(true)}
                                disabled={refreshing || dataLoading}
                                className="hover:bg-accent rounded-lg p-2 disabled:opacity-50 transition-all"
                                title="Refresh collaborators and invites"
                            >
                                <RefreshCw
                                    size={18}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                            </button>
                            <button onClick={handleClose} className="hover:bg-accent rounded-lg p-1">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border flex px-6">
                    <button
                        onClick={() => setTabValue(0)}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${tabValue === 0
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Invite
                    </button>
                    <button
                        onClick={() => setTabValue(1)}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${tabValue === 1
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Collaborators ({totalPeople})
                    </button>
                    <button
                        onClick={() => setTabValue(2)}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${tabValue === 2
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Pending ({pendingInvites.length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ minHeight: "300px", maxHeight: "50vh" }}>
                    {tabValue === 0 && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Invite collaborators to work on this whiteboard together in real-time.
                            </p>

                            {error && (
                                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center justify-between">
                                    <span className="text-sm">{error}</span>
                                    <button onClick={() => setError("")}>
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">Email or Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        placeholder="colleague@example.com or username"
                                        value={inviteIdentifier}
                                        onChange={(e) => setInviteIdentifier(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSendInvite()}
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                >
                                    <option value="VIEWER">Viewer - Can view the whiteboard (read-only)</option>
                                    <option value="EDITOR">Editor - Can view, edit, and invite others</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSendInvite}
                                disabled={loading || !inviteIdentifier.trim()}
                                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Invite
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {tabValue === 1 && (
                        <div>
                            {dataLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {boardData?.owner && (
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                                {boardData.owner.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{boardData.owner.name}</p>
                                                <p className="text-sm text-muted-foreground">{boardData.owner.email}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                                                Owner
                                            </span>
                                        </div>
                                    )}

                                    {collaborators.map((collab) => (
                                        <div key={collab.userId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30">
                                            <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold">
                                                {collab.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{collab.name}</p>
                                                <p className="text-sm text-muted-foreground">{collab.email}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${collab.role === "EDITOR"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                    : "bg-muted text-muted-foreground"
                                                }`}>
                                                {collab.role}
                                            </span>
                                        </div>
                                    ))}

                                    {collaborators.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-muted-foreground">
                                                No collaborators yet. Invite someone to get started!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {tabValue === 2 && (
                        <div>
                            {dataLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : pendingInvites.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="mx-auto text-muted-foreground mb-2" size={48} />
                                    <p className="text-sm text-muted-foreground">No pending invites</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingInvites.map((invite) => (
                                        <div key={invite.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                                                <Clock className="text-amber-600 dark:text-amber-400" size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{invite.receiverEmail}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Role: {invite.role} • Sent {new Date(invite.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full text-xs font-medium mr-2">
                                                Pending
                                            </span>
                                            <button
                                                onClick={() => handleCancelInvite(invite.id)}
                                                className="text-destructive hover:bg-destructive/10 rounded-lg p-2"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-border p-4 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 rounded-lg hover:bg-accent font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShareScreen;
