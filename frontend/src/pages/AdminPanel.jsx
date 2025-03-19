import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider.jsx";
import API from "../api/api.jsx";
import "../pages/styles/adminpanel.css"; // ✅ Import the updated CSS
import {  useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await API.get("/api/admin/users", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setUsers(response.data);
        } catch (err) {
            setError("Failed to fetch users.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user.token]); // ✅ Refetch if user token changes

    const handleRoleChange = async (userId, newRole) => {
        try {
            console.log("Updating role for user:", userId, newRole);
            await API.put(`/api/admin/users/role/${userId}`, { role: newRole });

            // ✅ Update state directly instead of waiting for fetchUsers()
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.user_id === userId ? { ...user, role: newRole } : user
                )
            );
            fetchUsers();
        } catch (err) {
            console.error("Error updating role:", err);
        }
    };
     
    const goToTicketsPage = (userId)=>{
         navigate(`/admin/tickets/${userId}`);
    }
    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p>
            <button className="btn btn-user" onClick={() => navigate("/admin/adminAgentPanel")}>Go to Admin-Agent-Panel</button>
            </p>
            {error && <p className="error">{error}</p>}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                            <th>More</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        className="role-dropdown"
                                        value={user.role}
                                        onChange={(e) =>
                                            handleRoleChange(user.user_id, e.target.value)
                                        }
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value ="agent">agent</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-user"
                                        onClick={() => handleRoleChange(user.user_id, "user")}
                                    >
                                        Make User
                                    </button>
                                    <button
                                        className="btn btn-admin"
                                        onClick={() => handleRoleChange(user.user_id, "admin")}
                                    >
                                        Make Admin
                                    </button>
                                </td>

                                <td>
                                <button className="btn btn-view" onClick={() => goToTicketsPage(user.user_id)}>
                                        View Tickets
                                    </button> {/* ✅ Redirects to new page */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
