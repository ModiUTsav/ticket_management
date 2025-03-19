import axios from "axios";



const API = axios.create({
  baseURL: "http://localhost:5000/", 
  headers: { 
    "Content-Type": "application/json",
  },
});

// to change dynamically the token

API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token || "";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // Remove the header if no token exists
  }

  return config;
}, (error) => Promise.reject(error));


// to fetch all the agents
// export const getAgents = ()=>{
//   try{
//     const respnse = API.get("/api/agents");
//     return respnse.data;


//   }
//   catch(error){
//     console.error("Error fetching agents:", error);
//     return [];
//   }
// }

// to assign an agent to a ticket
export const assignAgentToTicket = async (ticketId, agentId) => {
  try {
    const response = await API.put(`/api/tickets/${ticketId}`, { assigned_agent:agentId });
    return { sucess: true, agentId};

  }
  catch(error){
    console.error("Error assigning agent:", error);
    return { success: false, error: error.message };
  }
};


// to upadte the availability of an agent

export const updateAgentAvailability = async (agentId, available) => {
  try {
    const response = await API.put(`/api/agents/availability/${agentId}`, { available }); // ✅ Fix: Send `available` in body
    return { success: true, agentId };
  } catch (error) {
    console.error("Error updating agent availability:", error);
    return { success: false, error: error.message };
  }
};


export default API;
