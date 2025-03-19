// AgentPanel.jsx
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../api/api.jsx";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";
import "./styles/agentPanel.css"; // Import the CSS

const socket = io("http://localhost:5000/");

const AgentPanel = () => {
  const { agentId } = useParams();
  const { user } = useContext(AuthContext);

  const [notification, setNotification] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // Use null for consistency
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // Consistent naming
  const [error, setError] = useState(null); // Use null for consistency

  const fetchTickets = async (agentId) => {
    if (!agentId) {
      console.error("Error: agentId is undefined in fetchTickets");
      return;
    }

    try {
      const response = await API.get(`/api/agents/${agentId}/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      setError("Failed to fetch tickets. Please try again later.");
    }
  };

    const updateStatus = async (ticketId, newStatus) => {
    try {
        await API.put(`/api/tickets/${ticketId}`, { status: newStatus });
         // Optimistically update the local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
       setError("Failed to update ticket status. Please try again later.");
    }
  };


  const fetchTicketComments = async (ticketId) => {
    setSelectedTicket(ticketId);
    setCommentLoading(true);
    try {
      const response = await API.get(`/api/comments?ticket_id=${ticketId}`, {
        headers: { Authorization: `Bearer ${user.token}` }, // Good practice
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments. Please try again later.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return; // Prevent empty comments
    }
    try {
      await API.post("/api/comments", {
        ticket_id: selectedTicket,
        user_id: user.user_id,
        comment: newComment,
      }, {
        headers: { Authorization: `Bearer ${user.token}` }, //Consistent Header Use
      });
      setNewComment("");
      fetchTicketComments(selectedTicket); // Re-fetch comments
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again later.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm(`Are you sure you want to delete comment ${commentId}?`)) {
      try {
        await API.delete(`/api/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
         // Optimistically update the local state
         setComments(prevComments => prevComments.filter(comment => comment.comment_id !== commentId));
      } catch (error) {
        console.error("Error deleting comment:", error);
        setError("Failed to delete comment. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (!agentId) {
      console.error("Error: agentId is undefined in useEffect");
      return;
    }

    socket.emit("agent connected", agentId); // Correct event name

    // Listen for new ticket assignments
    socket.on("newAssignment", (data) => {
      setNotification((prev) => [...prev, data]);
      fetchTickets(agentId); // Re-fetch tickets
    });

    // Fetch tickets when the component mounts or agentId changes
    fetchTickets(agentId);

    return () => {
      socket.off("newAssignment"); // Clean up listener
    };
  }, [agentId, user?.token]); // Add user.token as a dependency

    if (error) {
    return <div className="agent-panel error-message">{error}</div>;
  }


  return (
    <div className="agent-panel">
      <h1 className="agent-panel-title">Agent Panel</h1>

      {/* Notification section */}
      <div className="notification-section">
        <h3 className="notification-title">Notifications 🤖</h3>
        {notification.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          <ul className="notification-list">
            {notification.map((notify, index) => (
              <li key={index} className="notification-item">
                <strong>{notify.message}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Assigned Ticket section */}
      <div className="tickets-section">
        <h3 className="tickets-title">Assigned Tickets</h3>
        {tickets.length === 0 ? (
          <p className="no-tickets">No tickets assigned</p>
        ) : (
          <table className="tickets-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header">Ticket ID</th>
                <th className="table-header">User ID</th>
                <th className="table-header">User Name</th>
                <th className="table-header">Title</th>
                <th className="table-header">Description</th>
                <th className="table-header">Created At</th>
                <th className="table-header">Updated At</th>
                <th className="table-header">Status</th>
                <th className="table-header">Action</th>
                <th className="table-header">Comments</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticket_id} className="table-row">
                  <td className="table-cell">{ticket.ticket_id}</td>
                  <td className="table-cell">{ticket.user_id}</td>
                  <td className="table-cell">{ticket.user_name}</td>
                  <td className="table-cell">{ticket.title}</td>
                  <td className="table-cell">{ticket.description}</td>
                  <td className="table-cell">
                    {new Date(ticket.created_at).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    {new Date(ticket.updated_at).toLocaleString()}
                  </td>
                  <td className="table-cell">{ticket.status}</td>
                  <td className="table-cell">
                    {ticket.status !== "Closed" && (
                      <button
                        className="mark-closed-button"
                        onClick={() => updateStatus(ticket.ticket_id, "Closed")}
                      >
                        Mark As Closed
                      </button>
                    )}
                  </td>
                  <td className="table-cell">
                    <button
                      className="view-comments-button"
                      onClick={() => fetchTicketComments(ticket.ticket_id)}
                    >
                      View/Add Comments
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Comment Section */}
        {selectedTicket && (
          <div className="comment-section">
            <h2 className="comment-section-title">
              Comments for Ticket {selectedTicket}
            </h2>
            {commentLoading && <p className="loading-comments">Loading comments...</p>}
            <ul className="comment-list">
              {comments.length === 0 ? (
                <li className="no-comments">No comments yet.</li>
              ) : (
                comments.map((comment) => (
                  <li key={comment.comment_id} className="comment-item">
                    <strong className="comment-author">{comment.name}:</strong>{" "}
                    <span className="comment-text">{comment.comment}</span>
                    <button
                      className="delete-comment-button"
                      onClick={() => handleDeleteComment(comment.comment_id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Add Comment Form */}
            <div className="add-comment-form">
              <input
                type="text"
                value={newComment}
                placeholder="Add a comment"
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button className="add-comment-button" onClick={handleAddComment}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPanel;