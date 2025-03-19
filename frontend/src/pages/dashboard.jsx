import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";
import AuthContext from "../context/AuthProvider.jsx";
import "../pages/styles/dashboard.css";  // ✅ Import the CSS file
import AgentPanel from "./AgentPanel.jsx";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ open: 0, in_progress: 0, closed: 0 });

    const fetchTickets = useCallback(async () => {
        try {
            if (!user || !user.user_id) {
                console.error("User not found, redirecting to login.");
                navigate("/");
                return;
            }
            console.log("Fetching tickets for user:", user.user_id);
            const response = await API.get(`/api/tickets?user_id=${user.user_id}`);
            setTickets(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        const {role,agentId} = user;

        console.log("User Role:", user.role); 

        if (role === "admin") {
            navigate("/dashboard");  
        } else if (role === "agent") {
            navigate(`/agent/${agentId}`);  
        } else if (role === "user"){
            navigate("/dashboard");  
        }
        else{
            navigate("/not-authorized")
        }

        fetchTickets();
    }, [user, fetchTickets]);

    const calculateStats = (tickets) => {
        const open = tickets.filter(ticket => ticket.status === "open").length;
        const inProgress = tickets.filter(ticket => ticket.status === "in_progress").length;
        const closed = tickets.filter(ticket => ticket.status === "closed").length;
        setStats({ open, inProgress, closed });
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        setTickets([]);
        setStats({ open: 0, in_progress: 0, closed: 0 });
    };
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                {user.role === "admin" ? (
                <div>
                    <h2>🔹 Admin Dashboard</h2>
                    <button onClick={() => navigate("/admin")}>Go to Admin Panel</button>
                </div>
            ) : (
                <div>
                    <h2>🟢 User Dashboard</h2>
                </div>
            )}
                <div className="dashboard-actions">
                    <button className="btn create-ticket" onClick={() => navigate("/createTicket")}>+ New Ticket</button>
                    <button className="btn logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="stats-container">
                <h2>Ticket Statistics</h2>
                <div className="stats">
                    <p className="stat open">Open: {stats.open}</p>
                    <p className="stat in-progress">In Progress: {stats.inProgress}</p>
                    <p className="stat closed">Closed: {stats.closed}</p>
                </div>
            </div>

            <div className="tickets-container">
                <h2>All Tickets</h2>
                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map(ticket => (
                                <tr key={ticket.ticket_id}>
                                    <td>{ticket.title}</td>
                                    <td className={`status ${ticket.status}`}>{ticket.status}</td>
                                    <td>{ticket.priority}</td>
                                    <td>
                                        <button className="btn view-ticket" onClick={() => navigate(`/ticket/${ticket.ticket_id}`)}>View</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No tickets available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
