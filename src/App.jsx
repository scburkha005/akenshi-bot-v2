import './App.css'
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Home, Login, Register } from './components';

function App () {
  const [ token, setToken ] = useState('');

  // store token in local storage if it exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token])

  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login setToken={setToken} />}/>
        <Route path='/register' element={<Register setToken={setToken} />}/>
      </Routes>
    </div>
  )
}

export default App;