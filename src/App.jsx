import './App.css'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Home, Login, Register } from './components';

function App () {

  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
    </div>
  )
}

export default App;