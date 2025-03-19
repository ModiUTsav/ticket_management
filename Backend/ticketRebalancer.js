import db from "./db.js";
import cron from "node-cron";

const reAssignTickets = async () => {
    console.log("🔄 Running ticket rebalancer at:", new Date().toLocaleString()); 

  // to get all open tickets with no Assign agent

  try {
    const [unAssignedTickets] = await db.query(
      `SELECT ticket_id FROM tickets WHERE status = 'in_progress' AND assigned_agent is NULL`
    );
    if (unAssignedTickets.length === 0) {
      console.log("No tickets need reassignment.");
      return;
    }

    //   get available agents sorted by least assigned tickets
    const [availableAgents] = await db.query(
      `SElECT agent_id FROM agents WHERE availability= 'available' ORDER BY assigned_tickets ASC`
    );

    if (availableAgents.length === 0) {
      console.log("no available agents right Now.");
      return;
    }

    // assign each unassigned tickets to the an available agent using round robin

    for (let i = 0; i < unAssignedTickets.length; i++) {
      const Tickets = unAssignedTickets[i];
      const agent = availableAgents[i % availableAgents.length];
      // round robin logic/////////
      //  i % availableAgents.length: This is the modulo operator (%). It calculates the remainder when i (the ticket index) is divided by the number of available agents. This ensures that the agent selection wraps around.

      // Example: If you have 3 available agents (IDs 1, 2, 3) and 5 unassigned tickets:

      // Ticket 0: 0 % 3 = 0 (Agent 1)

      // Ticket 1: 1 % 3 = 1 (Agent 2)

      // Ticket 2: 2 % 3 = 2 (Agent 3)

      // Ticket 3: 3 % 3 = 0 (Agent 1 - wraps around)

      // Ticket 4: 4 % 3 = 1 (Agent 2 - wraps around)

      // assign ticket to agent
      await db.query(
        `UPDATE tickets SET assigned_agent = ${agent.agent_id} WHERE ticket_id = ${Tickets.ticket_id}`
      );

      // Increment assigned tickets in agents table
      await db.query(
        `UPDATE agents SET assigned_tickets = assigned_tickets + 1 WHERE agent_id = ${agent.agent_id}`
      );

      console.log(
        `ticket ${Tickets.ticket_id} is assigned to agent ${agent.agent_id}`
      );
    }
  } catch (error) {
    console.error("Error during reAssignTickets", error);
  }


};
 // schedule reassignagent to every 5 min using cron
cron.schedule("*/5 * * * *", reAssignTickets);
  console.log("Ticket rebalancing cron job scheduled.");
  reAssignTickets();
