import express from "express";
import db from "../db.js";
import { sendEmail } from "../services/EmailServices.js";
import { getAiResponse } from "../services/aiServices.js";


const router = express.Router();

// Define routes here

// create a function for assign a agent to ticket

const assignedAgent = async () => {
  try {
    const [agents] = await db.query(
      `SELECT agent_id FROM agents WHERE availability= 'available' ORDER BY assigned_tickets ASC LIMIT 1`
    );
    if (agents.length === 0) {
      return null;
    }

    const assignedAgentId = agents[0].agent_id;

    // upadate the assignedTicketsId in agents table

    await db.query(
      `UPDATE agents SET assigned_tickets = assigned_tickets + 1 WHERE agent_id = ${assignedAgentId}`,
      [assignedAgentId]
    );

    console.log("assigned agent id", assignedAgentId);
    return assignedAgentId;
  } catch (error) {
    console.log("Error assigning agent", error);
    return null;
  }
};

// ticket created

const createTicket = (io) => { // 🔥 Accept io
  router.post("/", async (req, res) => {
   
    const { title, description, priority, createdBy ,email,proceedWithTicket} = req.body;
    console.log("---------njcj-------", req.body);
      
    // default message
    let aiResponse = "ai services can't be get";
    try {
      aiResponse = await getAiResponse(title, description);
    } catch (error) {
      console.error("AI services error:", error.message);
    }

    // AI gives a suggestion, ask the user if they still want to proceed
    if (!proceedWithTicket && !aiResponse.includes("I am not sure") && !aiResponse.includes("I cannot")) {
      return res.json({
        message: "🚨 AI Suggestion",
        aiResponse,
        action: "User needs to confirm ticket creation",
      });
    }

    // If user confirms, proceed with ticket creation
    try {
      const assignedAgents = await assignedAgent();
      if (!assignedAgents) {
        return res.status(500).json({ message: "No available agents right now" });
      }

      console.log("Assigned agent:", assignedAgents);
      const [results] = await db.query (`INSERT INTO tickets (user_id,title,description,priority,assigned_agent) VALUES ('${parseInt(
        createdBy
      )}','${title}','${description}','${priority}','${assignedAgents}')`)
      // const [results] = await db.query(sql);

      // to send email to user
      const ticketId = results.insertId;
      const [ticket] = await db.query("SELECT created_at FROM tickets WHERE ticket_id = ?", [ticketId]);
        const createdAt = ticket[0]?.created_at;

      await sendEmail(
         email,
        "🎫 Ticket Created Successfully",
        `your ticket  "${title}" has been created at ${createdAt} sucessfully and assigned to an agent.... Your ticket Id is:${ticketId}`
      );

      // Return ticket details to frontend
      
      // Send WebSocket event to the agent
      io.emit("newAssignment", { 
        message: `You are assigned the ticket "${title}" by user ${createdBy}`,
        ticketId: ticketId,
      });

      res.status(201).json({ ticketId, createdAt, message: "Ticket created successfully!" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
  


// Get all tickets
router.get("/", async (req, res) => {
  const user_id = req.query.user_id;
  try {
    const [tickets] = await db.query(` SELECT t.*, 
          u.name AS agent_name, 
          u.email AS agent_email, 
          a.user_id AS agent_user_id
      FROM tickets t
      LEFT JOIN agents a ON t.assigned_agent = a.agent_id
      LEFT JOIN users u ON a.user_id = u.user_id
      WHERE t.user_id = ${user_id};`);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get ticket by ID
router.get("/:id", async (req, res) => {
  const ticket_id = req.params.id; // ✅ Store ticket ID from request
  console.log("Fetching ticket with ID:", ticket_id);

  try {
    const [tickets] = await db.query(
      `SELECT t.*, 
              a.user_id AS agent_user_id, 
              u.name AS user_name, 
              a.agent_id AS agentId 
       FROM tickets t 
       LEFT JOIN agents a ON t.assigned_agent = a.agent_id
       LEFT JOIN users u ON t.user_id = u.user_id
       WHERE t.ticket_id = ?`, 
      [ticket_id]
    );
    // ✅ Ensure the ticket exists before fetching agent details
    if (tickets.length > 0) {
      const [agentDetails] = await db.query(
        `SELECT name AS agent_name FROM users WHERE user_id = ?`, 
        [tickets[0].agent_user_id] // ✅ Use agent_user_id correctly
      );
      // ✅ Add agent's name to the ticket object
      tickets[0].agent_name = agentDetails.length > 0 ? agentDetails[0].agent_name : "Not Assigned";
    }
    
    console.log("Fetched Ticket Data:", tickets[0]);
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(tickets[0]); // ✅ Return the first ticket
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:ticket_id", async (req, res) => {
  const ticket_id = req.params.ticket_id;

  try {
    const result = await db.query(
      `DELETE FROM tickets WHERE ticket_id = ${ticket_id}`
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.log("error deleting ticket", error);
    return res.status(500).json({ error: error.message });
  }
});

// update ticket status
router.put("/:id", async (req, res) => {
  const ticket_id = req.params.id;
  const { status } = req.body;
  // if(assigned_agent){

  // }
  // 1. Get the authenticated user (IMPORTANT!)
  //    This assumes you have authentication middleware that sets req.user
  //   if (!verifyToken) {
  //     return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  // }

  // 2. Check user role (CORRECT comparison)
  // if (!verifyAdmin()) {
  //     return res.status(403).json({ message: "Forbidden: You are not authorized to update ticket status" });
  // }
  console.log("status////", req.body);
  try {
    const [result] = await db.query(
      `UPDATE tickets SET status = '${status}' WHERE ticket_id = '${ticket_id}'`,
      [status, ticket_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default createTicket;
