import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import API from "../api/api.jsx";
import "../pages/styles/adminTicketDeati.css"; // Import the CSS file

const AdminTicketDetails = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext); //Get user from context
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComments, setNewComments] = useState(""); // Singular
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchTickets = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/api/tickets?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to fetch tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketComments = async (ticketId) => {
    setSelectedTicket(ticketId); // Set selected ticket *before* fetching comments
    setCommentLoading(true);
    try {
      const response = await API.get(`/api/comments?ticket_id=${ticketId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
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
    if (!newComments.trim()) {
      return; // Prevent empty comments
    }
    try {
      await API.post("/api/comments", {
        ticket_id: selectedTicket,
        user_id: user.user_id,
        comment: newComments,
      });
      setNewComments("");
      fetchTicketComments(selectedTicket);
    } catch (error) {
      console.log("error adding comments", error);
      setError("failed to add comment", error);
    }
  };
  // delete Ticket 
  const handleDeleteTicket= async (ticketId)=>{
    if(window.confirm(`are you sure you want to delete ticket ${ticketId}`))

      try{

        await API.delete(`/api/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTickets(tickets.filter((ticket)=>(ticket.ticket_id !== ticketId)));

      }
     
      catch(error){
        console.log("error delteing ticket", error);
      }
  }

  const handleDeleteComment= async (commentId)=>{
    if(window.confirm(`are you sure you want to delete  ${commentId}`))

      try{

        await API.delete(`/api/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComments(comments.filter((comment)=>(comment.comment_id !== commentId)));

      }
     
      catch(error){
        console.log("error delteing commenting", error);
      }
  }

  useEffect(() => {
    fetchTickets(userId);
  }, [userId]);

  return (
    <div className="admin-ticket-details-container">
      {" "}
      {/* Added a container */}
      {loading && <p>Loading tickets...</p>}
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Added error class */}
      <h1>Admin Ticket Details</h1>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ticket Id</th>
            <th>User Id</th>
            <th>Title</th>
            <th>Status</th>
            <th>Assigned_agent</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticket_id}>
              <td>{ticket.ticket_id}</td>
              <td>{ticket.user_id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>{ticket.agent_name || "UnAssigned"}</td>

              <td>{new Date(ticket.created_at).toLocaleString()}</td>
              <td>{new Date(ticket.updated_at).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-view"
                  onClick={() => fetchTicketComments(ticket.ticket_id)}
                >
                  View Comments
                </button>
                <button className="btn btn-delete" onClick={()=>{
                  handleDeleteTicket(ticket.ticket_id);
                }}>
                  Delete Ticket
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Comment Section - Outside the table */}
      {selectedTicket && (
        <div className="comment-section">
          <h2>Comments for Ticket {selectedTicket}</h2>
          {commentLoading && <p>Loading comments...</p>}
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.comment_id}>
                <strong>{comment.user_id}:</strong> {comment.comment}

                <button className="btn btn-delete" onClick={()=>{
                  handleDeleteComment(comment.comment_id);
                }}>
                  Delete Comment
                </button>
              </li>

              
            ))}
          </ul>

          {/* Add Comment Form */}
          <div className="add-comment-form">
            <input
              type="text"
              value={newComments}
              placeholder="Add a comment"
              onChange={(e) => setNewComments(e.target.value)}
            />
            <button className="btn btn-add" onClick={handleAddComment}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketDetails;
