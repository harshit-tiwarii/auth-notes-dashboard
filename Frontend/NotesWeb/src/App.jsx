import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
    </Routes>
  );
}
