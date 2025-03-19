import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY); // Use GEMINI_API_KEY


const aiCache = new Map();

export const getAiResponse = async (title,description) => {

    const query = `${title}-${description}`;
//  if there is any previous conversation

 
  if(aiCache.has(query)){
    console.log("Ai response cache..");
    return aiCache.get(query);
  }  


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [], // Add previous conversation history if needed
        generationConfig: {
          maxOutputTokens: 4096, // Increased maxOutputTokens
        },
      });

    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();
    

    // cache response for 10 mintues

    aiCache.set(query,response);
    setTimeout(()=>{aiCache.delete(query),10*60*1000})

    return text;


  } catch (error) {
    console.error("Error in getAiResponse:", error);
    // Handle errors gracefully.  Return a default message, or throw the error
    // to be caught by the calling function.
    throw new Error(`Failed to get AI response: ${error.message}`);
    // Or: return "Sorry, I couldn't process your request.";
  }
};