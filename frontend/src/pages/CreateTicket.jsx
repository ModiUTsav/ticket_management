import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";
import "../pages/styles/create_ticket.css"; // ✅ Import the CSS file

const CreateTicket = () => {
  const navigate = useNavigate();
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setUserId(user?.user_id);
  }, [user]);

  const handleSubmit = async (e, proceedWithTicket = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/api/tickets", {
        title,
        description,
        priority,
        status: "open",
        createdBy: userId,
        email: user?.email,
        proceedWithTicket,
      });

      if (response.data.aiResponse && !proceedWithTicket) {
        setAiResponse(response.data.aiResponse);
      } else if (response.status === 201) {
        const { ticketId, createdAt } = response.data;
        console.log(`Ticket Created: ID=${ticketId}, Created At=${createdAt}`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Ticket creation failed:", error.response);
      setError(`Ticket creation failed. Please try again. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <h2>Create a New Ticket</h2>
      <button className="btn dashboard-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {error && <p className="error-message">{error}</p>}

      {aiResponse ? (
        <div className="ai-response">
          <p>
            <strong>AI Suggestion:</strong> {aiResponse}
          </p>
          <button
            className="btn confirm-btn"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : "Proceed with Ticket"}
          </button>
          <button className="btn cancel-btn" onClick={() => setAiResponse(null)} disabled={loading}>
            Cancel
          </button>
        </div>
      ) : (
        <form className="ticket-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter ticket details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="40"
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button className="btn submit-btn" type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : "Submit Ticket"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateTicket;
