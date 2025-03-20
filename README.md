# 🎫 Ticket Management System  

A web-based **Ticket Management System** built with **React.js**, **Node.js**, and **Recharts** for data visualization. This system allows admins to monitor ticket status, agent performance, and other key insights through interactive charts.

## 🚀 Features  
- **Admin Dashboard** for ticket insights  
- **Pie Chart** for ticket status distribution  
- **Stacked Bar Chart** for agent-wise ticket summary  
- **Real-time Data Fetching** using API  
- **Responsive UI** for a seamless experience  

## 🛠️ Tech Stack  
- **Frontend**: React.js, Recharts, CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **API**: RESTful API with Express  

## 🚨 create your own .env file  in Backend folder 
-.env 
and put your own Database value and API keys And passwords


## 📥 Installation  

### 1️⃣ Clone the Repository

```bash


git clone https://github.com/yourusername/ticket-management-system.git
cd ticket-management-system
```

###2️⃣ Install Dependencies
Frontend
Backend
```bash


cd client
npm install

cd server
npm install

```
### 3️⃣ Configure Environment Variables
Create a .env file inside the server/ directory:
```ini
PORT=5000
MONGO_URI=mongodb+srv://your-mongo-db-uri
JWT_SECRET=your_secret_key

```
4️⃣ Start the Application
Backend
Frontend
```bash
cd server
nodemon server.js

cd client
npm run dev







