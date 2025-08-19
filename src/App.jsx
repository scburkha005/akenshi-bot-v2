import './App.css'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Home } from './components';

function App () {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App;