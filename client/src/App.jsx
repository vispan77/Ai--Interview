import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import useGetCurrentUser from './hooks/useGetCurrentUser'



function App() {

  useGetCurrentUser();

  return (
    <div >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
      </Routes>

    </div>
  )
}

export default App
