import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";
import API from "../api/api.jsx";
import "../pages/styles/register.css"; // ✅ Import the CSS file

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/api/user/register", { name, email, password,role });
            console.log("checking",response.data);
            if (response.data) {
                // login(response.data); // Save user in context
                navigate("/"); // Redirect to dashboard
            }
        } catch (error) {
            console.log('---errr-',error)
            setError(error.response?.data?.message || "Registration failed. Try again.");
        }
    };

    return (
        <div className="register-container">
            <h1>Register Here</h1>

            {error && <p className="error-message">{error}</p>}

            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter a strong password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        
                    </select>
                </div>

                <button className="btn register-btn" type="submit">Register</button>
            </form>

            <p className="login-link">
                Already have an account? <Link to="/">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
