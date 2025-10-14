import './App.css'
import { useState, useEffect } from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Navbar, Home, Login, Register, TwitchAuth, AdminPage, AccountPage } from './components';
import { getUser } from './api/user.js';
import { linkAccount, linkBotAccount } from './api/twitch.js';

function App () {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ token, setToken ] = useState('');
  const [ user, setUser ] = useState({});

  async function handleUser (token) {
    try {
      const user = await getUser(token);
      setUser(user);
    } catch ({ response: { data }}) {
      if (data.message === 'jwt expired') {
        localStorage.removeItem('token');
      }
      console.log(data)
      throw data;
    }
  }

  async function handleLink (code, state, token, isBotUser) {
    try {
      if (isBotUser) {
        const user = await linkBotAccount(code, state, token)
        console.log(user)
      } else {
        const user = await linkAccount(code, state, token)
        setUser(user);
      }
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
  }, [token]);

  // grab token and user on app load
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
    if (searchParams.size > 0) {
      let permissions = searchParams.get('scope');
      let isBotUser = permissions.includes('user:bot');
      let code = searchParams.get('code');
      let state = searchParams.get('state');
      handleLink(code, state, token, isBotUser);
    }
  }, []);

  // Create all base-level subscriptions if a user is missing them
  useEffect(() => {
    if (user) {
      
    }
  }, [user]);


  return (
    <div className='app'>
      <Navbar user={user} token={token} setToken={setToken} setUser={setUser} />
      <Routes>
        {
          (Object.keys(user).length !== 0 && user?.userAccessToken === '') ?
            <Route path='/' element={<TwitchAuth />}/> :
            <Route path='/' element={<Home />}/>
        }
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login setToken={setToken} />}/>
        <Route path='/register' element={<Register setToken={setToken} />}/>
        <Route path='/account' element={<AccountPage token={token} />}/>
        { user?.isAdmin && <Route path='/admin' element={<AdminPage />}/>}
      </Routes>
    </div>
  )
}

export default App;