import './App.css'
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Home, Login, Register } from './components';
import { getUser } from './api/user.js';

function App () {
  const [ token, setToken ] = useState('');
  const [ user, setUser ] = useState({});

  async function handleUser (token) {
    try {
      const user = await getUser(token);
      console.log(user)
      setUser(user);
    } catch (err) {
      throw err;
    }
  }

  // grab token and user on app load
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      handleUser(token);
    }
  }, [])

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