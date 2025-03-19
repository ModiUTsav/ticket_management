import express from 'express';
import db from '../db.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// to get all agents
router.get('/',verifyToken,verifyAdmin,async (req,res)=>{   

    try{
        const [agents] = await db.query("SELECT agents.*, users.name as agent_name FROM agents LEFT JOIN users ON agents.user_id = users.user_id");

        return res.json(agents);
    }
    catch(error){
        console.log("-----err----",error);
        res.status(500).json({error:"agents can't be get"});
    }

})

// to get agent by id

router.get('/:id',verifyToken,verifyAdmin,async (req,res)=>{

    console.log("/////////////////baahhb",req.body);

    try{

        const agentId = req.params.id;
        const [agents] = await db.query(`SELECT agents.*, users.name as u.name FROM agents LEFT JOIN users ON agents.user_id = users.user_id WHERE agents.agent_id = ${agentId}`);

        if(agents.length === 0){
            return res.status(404).json({message:"agent not found"});

        }
        return res.json(agents[0]);

    }
    catch(error){
        console.error("Database error:", error); // Log the full error for debugging
        res.status(500).json({ error: "An error occurred while fetching agent data." });
    }
});

// Update agent availability (e.g., when an agent is free)
router.put("/availability/:id", async (req, res) => {
    const agentId = req.params.id;
    const { available } = req.body;
    
    // 1 = available, 0 = busy
     console.log("available",available);
    // if (available !== "available" && available !== "busy") {
    //     return res.status(400).json({ error: "Invalid availability value" });
    // }

    try {
        await db.query(`UPDATE agents SET availability = ? WHERE agent_id = ?`, [available, agentId]);

        res.json({ message: "Agent availability updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:agentId/tickets", async (req, res) => {
    const agentId  = req.params.agentId;


    console.log("agent Id ............:",agentId)
    console.log("mmznjcjnc",req.body);
  
    try {
      const [tickets] = await db.query(
        `SELECT t.*, u.name AS user_name 
         FROM tickets t
         LEFT JOIN users u ON t.user_id = u.user_id
         WHERE t.assigned_agent = ${agentId}`,
        
      );
  
      if (tickets.length === 0) {
        return res.status(404).json({ message: "No tickets found for this agent" });
      }
  
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



export default router;