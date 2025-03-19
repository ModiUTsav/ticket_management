import express from "express";
import db from "../db.js";
import { verifyToken,verifyAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

// get all user (admins only)

router.get("/users",verifyToken,verifyAdmin,async(req,res)=>{
    try{

        const [users] = await db.query("SELECT user_id,name,email,role FROM users");

        return res.json(users);

    }
    catch(error){
        res.status(500).json({error:"user can't be get"});

    }

});
// to update user role (admins only)

router.put("/users/role/:user_id",verifyAdmin,verifyToken,async(req,res)=>{
    const {role} = req.body;
    const {user_id} = req.params;
    console.log("roleeeeee",role, "userid: ",user_id);
   
    // if(role=='agent'){
    //     const sql = `INSERT INTO agents (user_id,assigned_tickets) VALUES ('${user_id}',0)`;
    //     await db.query(sql);
    //   }

    try{

        // check the cuurent role of user
        const [user] = await db.query(`SELECT role FROM users WHERE user_id = ${user_id}`); 

        if(!user || user.length === 0){
            return res.status(404).json({error:"user not found"});

        }

        const previousRole = user[0].role;

        // If the new role is 'agent' and the user wasn't already an agent, add to agents table
        if (role === 'agent' && previousRole !== 'agent') {
            const insertAgentSQL = `INSERT INTO agents (user_id, assigned_tickets) VALUES ('${user_id}', 0)`;
            await db.query(insertAgentSQL);}

            // if changing from agnet to another role, delete from agents table

            
            if(previousRole ==='agent' && role !== 'agent'){
                const deleteAgentSql = `DELETE FROM agents WHERE user_id = ${user_id}`
                await db.query(deleteAgentSql);
            } 
        // Update the user's role in the users table


        await db.query(`UPDATE users SET role = '${role}' WHERE user_id = ${user_id}`);
        res.json({message:"user role updated sucessfully"});

    }
    catch(error){
        res.status(500).json({error:"user can't be updated"});
    }

});

export default router;