/*
  main.jsx
  Main entry point for the application. Manages routing and rendering of components.
*/

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login/Login.jsx'
import SignUp from './SignUp/SignUp.jsx'
import Profile from './Profile/Profile.jsx'
import Users from './Users/Users.jsx'
import UsersInfo from './UsersInfo/UsersInfo.jsx'
import Chatroom from './Chatroom/Chatroom.jsx'
import CreateGroup from './Groups/CreateGroup.jsx'
import './Login/Login.css'
import './SignUp/SignUp.css'
import './Profile/Profile.css'
import './Users/Users.css'
import './UsersInfo/UsersInfo.css'
import './Chatroom/Chatroom.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/usersinfo/:contactId" element={<UsersInfo />} />
        <Route path="/chat-room" element={<Chatroom />} />
        <Route path="/create-group" element={<CreateGroup />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)