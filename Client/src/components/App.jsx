import { useState, createContext, useMemo } from 'react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie'

import Navigation from './Navigation'
import LogIn from './LogIn'
import Register from './Register'
import Home from './Home'
import Info from './Info'
import Volunteers from './Volunteers'
import Contacts from './Contacts'
import ErrorPage from './ErrorPage'
import '../style/App.css'

export const CurrentUser = createContext([]);

function App() {
  const initialCurrentUser = useMemo(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [isShowInfo, setIsShowInfo] = useState(0);

  return (
    <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
      <Navigation currentUser={currentUser} setIsShowInfo={setIsShowInfo} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/volunteer/:id" element={<Volunteers />} />
        <Route path="/volunteer/:id/tasks" element={<Volunteers />} />
        <Route path="/volunteer/:id/shifts" element={<Volunteers />} />
        <Route path="/volunteer/:id/requests" element={<Volunteers />} />
        <Route path="/volunteer/:id/certificate" element={<Volunteers />} />
        <Route path="/volunteer/:id/profile" element={<Volunteers />} />
        <Route path="/contact/:id" element={<Contacts />} />
        <Route path="/contact/:id/patient-info" element={<Contacts />} />
        <Route path="/contact/:id/referrals" element={<Contacts />} />
        <Route path="/contact/:id/new-request" element={<Contacts />} />
        <Route path="/contact/:id/add-patient" element={<Contacts />} />
        <Route path="/contact/:id/thanks" element={<Contacts />} />
        <Route path="/contact/:id/profile" element={<Contacts />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {isShowInfo == 1 && <Info setIsShowInfo={setIsShowInfo} />}
    </CurrentUser.Provider>
  )
}

export default App