import './App.css'
import { useState, useEffect } from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Navbar, Home, Login, Register, TwitchAuth, AdminPage } from './components';
import { getUser } from './api/user.js';
import { linkAccount } from './api/twitch.js';

function App () {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ token, setToken ] = useState('');
  const [ user, setUser ] = useState({});

  async function handleUser (token) {
    try {
      const user = await getUser(token);
      setUser(user);
    } catch (err) {
      console.log(err)
      throw err;
    }
  }

  async function handleLink (code, state, token) {
    try {
      const user = await linkAccount(code, state, token)
      setUser(user);
    } catch (err) {
      throw err;
    }
  }
  // store token in local storage if it exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      handleUser(token);
    }
  }, [token])

  // grab token and user on app load
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
    if (searchParams.size > 0) {
      let code = searchParams.get('code')
      let state = searchParams.get('state')
      handleLink(code, state, token);
    }
  }, [])


  return (
    <div className='app'>
      <Navbar user={user}/>
      <Routes>
        {
          (Object.keys(user).length !== 0 && user?.userAccessToken === '') ?
            <Route path='/' element={<TwitchAuth />}/> :
            <Route path='/' element={<Home />}/>
        }
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login setToken={setToken} />}/>
        <Route path='/register' element={<Register setToken={setToken} />}/>
        { user?.isAdmin && <Route path='/admin' element={<AdminPage />}/>}
      </Routes>
    </div>
  )
}

export default App;