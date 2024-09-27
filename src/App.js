import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import {useState} from "react";
import UserContext from "./context/UserContext.js";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard  from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import ViewProfile from "./components/ViewProfile";

import './App.css';

function App() {
  const [name, setName]=useState("");
  const [userId, setUserId]=useState("");
  const navigate=useNavigate();

  return (
    <UserContext.Provider values={{name, userId, setUserId, setName}}>
      {
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard name={name} userId={userId} navigate={navigate}/></ProtectedRoute>}/>
          <Route path="/viewprofile" element={<ProtectedRoute><ViewProfile/></ProtectedRoute>}/>
          <Route path="/login" element={<Login navigate={navigate}/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/not-found" element={<NotFound/>}/>
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      }
    </UserContext.Provider>
  )
}

export default App;
