import { Link } from "react-router-dom";


const NotAuthorized = () => {
    
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>🚫 403 - Not Authorized</h1>
            <p>You do not have permission to access this page.</p>
            <p >
                back to dashboard? <Link to="/dashboard">dashboard</Link>
            </p>
        </div>
    );
};

export default NotAuthorized;
