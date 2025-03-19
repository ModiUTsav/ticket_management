import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../pages/styles/TicketDetails.css"; // ✅ Import CSS

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("");
    const [newComment, setNewComment] = useState(""); // ✅ For new comment
    const [comments, setComments] = useState([]); // ✅ Ensuring it's always an array
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id || "";

    useEffect(() => {
        fetchTicketDetail();
        fetchComments();
    }, [id]);

    const fetchTicketDetail = async () => {
        try {
            console.log("Fetching ticket details for ID:", id);
            const response = await API.get(`/api/tickets/${id}`);
            setTicket(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching ticket:", error);
            setError("Failed to fetch ticket details");
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await API.get(`/api/comments/${id}`);
            setComments(response.data || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setError("Failed to fetch comments");
            setComments([]); // Ensuring empty array if error
        }
    };

    const handleUpdateStatus = async () => {
        try {

            await API.put(`/api/tickets/${id}`, { "status":status });
            fetchTicketDetail();
        } catch (error) {
            console.error("Error updating status:", error);
            setError("Failed to update status.");
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return; // ✅ Prevent empty comments
        try {
            await API.post('/api/comments', {
                ticket_id: id,
                user_id: userId,
                comment: newComment,
            });
            setNewComment(""); // ✅ Clear input field
            fetchComments(); // ✅ Refresh comments list
        } catch (error) {
            console.error("Error adding comment:", error);
            setError("Failed to add comment");
        }
    };

    if (loading) return <p>Loading ticket details...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="ticket-details-container">
            <h1>Ticket Details</h1>
            <button className="back-button" onClick={() => navigate("/dashboard")}>Back To Dashboard</button>

            {ticket && (
                <div className="ticket-info">
                    <p><strong>Title:</strong> {ticket.title}</p>
                    <p><strong>Description:</strong> {ticket.description}</p>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Priority:</strong> {ticket.priority}</p>
                    <p><strong>Created By:</strong> {`user id: ${ticket.ticket_id}, Name: ${ticket.user_name} `}</p>
                    <p><strong>Assigned Agent:</strong> {`Agent id: ${ticket.agentId}, Agent Name:${ticket.agent_name}`}</p>

                    <div className="status-section">
                        <label><strong>Update Status:</strong></label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <button className="update-button" onClick={handleUpdateStatus}>Update Status</button>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div className="comments-section">
                <h2>Comments</h2>
                <div className="comments-container">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.comment_id} className="comment">
                                <p><strong>{comment.name}:</strong> {comment.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>

                <div className="comment-input">
                    <textarea
                        placeholder="Write your comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Add Comment</button>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
