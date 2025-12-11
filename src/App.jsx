import { useState, useEffect, createContext  } from 'react'
import { Route, Routes, useSearchParams, useNavigate } from 'react-router'
import { Navbar, Home, Login, Register, TwitchAuth, AdminPage, AccountPage, TestingArea } from './components';
import { getUser } from './api/user.js';
import { linkAccount, linkBotAccount } from './api/twitch.js';
import { Box, Container } from '@mui/material';

export const AuthContext = createContext({});

export function App () {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ token, setToken ] = useState('');
  const [ user, setUser ] = useState({});
  const navigate = useNavigate();

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
      } else {
        const user = await linkAccount(code, state, token)
        setUser(user);
        navigate('/');
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

  return (
    <Container sx={{
      maxWidth: { desktop: 'calc(100vw - 16rem)', mobile: '100vw'},
      ml: { desktop: '16rem', mobile: '0rem'},
      pt: '2rem',
    }}>
      <AuthContext value={{user, token, setUser, setToken}}>
        <div className='app'>
          <Navbar />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            m: 4
          }}>
            <Routes>
              {
                (Object.keys(user).length !== 0 && user?.userAccessToken?.token === '') ?
                  <Route path='/' element={<TwitchAuth />}/> :
                  <Route path='/' element={<Home />}/>
              }
              <Route path='/' element={<Home />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/account' element={<AccountPage />}/>
              <Route path='/testing' element={<TestingArea />}/>
              { user?.isAdmin && <Route path='/admin' element={<AdminPage/>}/>}
            </Routes>
          </Box>
        </div>
      </AuthContext>
    </Container>
  )
}