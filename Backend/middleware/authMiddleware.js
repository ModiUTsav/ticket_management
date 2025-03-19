import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// authentication
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Access is denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.role) {
            return res.status(403).json({ error: "Invalid token. Role not found." });
        }

        console.log("decoded is...........",decoded);
        req.user = decoded;  // Ensure req.user contains role
        next();

    } catch (error) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

//  authorization
export const verifyAdmin = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Access is denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.role) {
        return res.status(403).json({ error: "Invalid token. Role not found." });
    }

    const role= decoded.role;

    console.log("role is...........=========",role);
    if(role !== "admin" && role !== "agent") {
        console.log("Access denied. Only admin and agent allowed");
        return res.status(401).json({error:"Access denied. Only admin and agent allowed"});
    }
    next();

};