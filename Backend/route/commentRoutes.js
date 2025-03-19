import express from "express";
import db from "../db.js";
const router = express.Router();

// Define routes here

// create a comment in ticket
router.post("/",async (req,res)=>{
    const {ticket_id,user_id,comment} = req.body;
    console.log("commentsssss",req.body);
    try{
      

        const sql = `INSERT INTO comments (ticket_id,user_id,comment) VALUES ('${ticket_id}','${user_id}','${comment}')`;

        await db.query(sql);

    res.json({ message: "Comment added successfully" });


    }
    catch(error){
        res.status(500).json({error:error.message});


    }
});

// this is for AdminTicketDeatils

router.get("/", async (req, res) => { // ✅  NO :id in the path!
  const ticket_id = req.query.ticket_id; // ✅  Use req.query
  console.log("ticket_id=====", ticket_id);

  if (!ticket_id) {
    return res.status(400).json({ error: "ticket_id is required" });
  }

  try {
    // ✅ Use parameterized query for security!
    const [comments] = await db.query(`SELECT c.*,u.name FROM comments as c Left join users as u ON  c.user_id=u.user_id WHERE ticket_id = ${ticket_id}`, [ticket_id]);
    res.json(comments);
  } catch (err) {
    console.error(err); // Log the full error object for debugging
    res.status(500).json({ error: err.message });
  }
});

// this is for ticketDetails

  router.get("/:id", async (req, res) => {
    const ticket_id = req.params.id;
    console.log("Fetching comments for ticket ID:", ticket_id);
      try {
        const [comments] = await db.query(`SELECT c.*,u.name FROM comments as c Left join users as u ON  c.user_id=u.user_id WHERE ticket_id = ${ticket_id}`, [ticket_id]);
        res.json(comments);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    
    // delete comment in adminTicketDeatils
    router.delete("/:commentId", async (req,res)=>{
      const commentId = req.params.commentId;
      console.log("commentId",commentId);
      try{
        const result = await db.query(`DELETE FROM comments WHERE comment_id = ${commentId}`);
        res.json({message:"Comment deleted successfully"});
      }
      catch(error){
        res.status(500).json({error:error.message});
      }


    })


export default router;
