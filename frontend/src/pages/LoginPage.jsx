import { useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx"; 
import API from "../api/api.jsx";
import "../pages/styles/login.css"; // Ensure correct import

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
   

    try {
      const response = await API.post("/api/user/login", { email, password }); 
      console.log("Login Response:", response.data);
      const { token ,role} = response.data;
      login(response.data);  

      if(role === 'admin'){
        navigate('/dashboard')
      } 
      else if(role === 'agent' && response.data.agentId){
        navigate(`/agent/${response.data.agentId}`);

    } 
    
      else {
        navigate("/dashboard");  
    }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button className="login-btn" type="submit">Login</button>

        <p className="login-link">
                Need to make an account? <Link to="/register">Register</Link>
            </p>
      </form>
    </div>
  );
};

export default LoginPage;
