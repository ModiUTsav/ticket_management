import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/Register.jsx";
import DashBoard from "./pages/dashboard.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import CreateTicket from "./pages/CreateTicket.jsx";
import ProtectedRoute from "./componets/ProtectedRoute.jsx";
import NotAuthorized from "./pages/notAuthorized.jsx";
import AdminTicketDetails from "./pages/adminTicketDetails.jsx";
import AdminAgentPanel from "./componets/AdminAgentPanel.jsx";
// import Navbar from "./componets/navbar.jsx";
import Layout from "./componets/layout.jsx";
import Knowledge from "./pages/KnowledgeBase.jsx";
import AgentPanel from "./pages/AgentPanel.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {path :"/not-authorized", element:<NotAuthorized/>},
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/",
    element: <Layout />, // 🔹 Wrap all routes with Navbar
    children: [
  { path: "/dashboard", element: <DashBoard /> },
  { path: "/ticket/:id", element: <TicketDetails /> },
  { 
    path: "/admin", 
    element: <ProtectedRoute element={<AdminPanel />} allowedRoles={["admin", "agent"]} /> 
  },
  { 
    path: "/createTicket", 
    element: <ProtectedRoute element={<CreateTicket />} allowedRoles={["user", "admin"]} /> 
  },
  {
    path: "/admin/tickets/:userId",
    element: <AdminTicketDetails/>
  },
  {
    path:"/admin/adminAgentPanel",
    element:<ProtectedRoute element={<AdminAgentPanel/>} allowedRoles={['admin','agent']}/>
  }
  ,{
    path:"/knowledge",
    element:<Knowledge/>
  },
  {
    path:"/agent/:agentId",
    element:<ProtectedRoute element={<AgentPanel/>} allowedRoles={['admin','agent']}/>
  }

  // {path : "/navbar", element:<Navbar/>}
  
]}]);


const App = () => {
  return <RouterProvider router={router} />;
};

export default App; // ✅ Corrected export
