// AdminAgentPanel.jsx (or .js)
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import API, { updateAgentAvailability } from "../api/api.jsx";
import './adminAgent.css'; // Import the CSS file
import { Navigate, useNavigate } from "react-router-dom";

const AdminAgentPanel = () => {
  const [agent, setAgent] = useState([]);
  const navigate = useNavigate();

  const fetchAgents = async () => {
    try {
      const response = await API.get("/api/agents");
      console.log("response------", response.data);
      setAgent(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);


  const toggleAvailable = async (agentId, available) => {
    const updatedStatus = available === "available" ? "busy" : "available";
    const response = await updateAgentAvailability(agentId, updatedStatus);
    if (response.success) {
      fetchAgents();
    }
  };

  const goToTicketsPage = (agentId)=>{
    navigate(`/agent/${agentId}`);
  }
  return (
    <div className="admin-agent-panel">
      <h1>Admin Agent Panel</h1>
      <div className="agent-table-container">
        <h2>Agent List</h2>
        <table className="agent-table">
          <thead>
            <tr>
              <th>Agent Id</th>
              <th>Agent Name</th>
              <th>User_id</th>
              <th>Assigned Tickets</th>
              <th>Created at</th>
              <th>Availability</th>
              <th>Action</th>
              <th>Go-To-Agent</th>
            </tr>
          </thead>
          <tbody>
            {agent.map((agents) => (
              <tr key={agents.agent_id}>
                <td>{agents.agent_id}</td>
                <td>{agents.agent_name}</td>
                <td>{agents.user_id}</td>
                <td>{agents.assigned_tickets}</td>
                <td>{new Date(agents.created_at).toLocaleString()}</td>
                <td className={`availability-status ${agents.availability === 'available' ? 'available' : 'busy'}`}>
                    {agents.availability === 'available' ? "Available👍" : "Busy 😵"}
                </td>

                <td>
                  <button
                    className="toggle-button"
                    onClick={() =>
                      toggleAvailable(agents.agent_id, agents.availability)
                    }
                  >
                    Toggle
                  </button>
                </td>
                <td>
                <button className="btn btn-view" onClick={() => goToTicketsPage(agents.agent_id)}>
                                        View agent
                                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAgentPanel;