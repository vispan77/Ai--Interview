import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import InterviewPage from './pages/InterviewPage'



function App() {

  useGetCurrentUser();

  return (
    <div >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>

    </div>
  )
}

export default App
