import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import jwt from "jsonwebtoken";
const router = express.Router();

// Define routes here

// register

router.post("/register", async (req, res) => {
  let { name, email, password, role } = req.body;
  role = role && role.trim() !== "" ? role : "user";  // ✅ Ensures a default role

  console.log("Registration request received:", { name, email, password, role });

  try {
    const hashedpassword = await bcrypt.hash(password, 10);

    // ✅ Correct SQL syntax
    const sql = `INSERT INTO users (name, email, password, role) VALUES ('${name}', '${email}', '${hashedpassword}', '${role}')`;
    await db.query(sql);
    

    return res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});



// Login user
router.post("/login", async (req, res) => {
  const { email, password ,agentId} = req.body;
  

  try {
    const [users] = await db.query(
      `SELECT u.*, a.agent_id AS agentId FROM users u LEFT JOIN agents a ON u.user_id = a.user_id where email = '${email}'`
    );
    if (users.length === 0)
      return res.status(401).json({ error: "User not found" });

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { email: user.email, user_id:user.user_id , role:user.role, agentId: user.agentId || null},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // const user_id= user.user_id
    return res.json({
      token,
      user_id: user.user_id, // ✅ Now included
      email: user.email,
      role: user.role,
      agentId: user.agentId || null
      
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
