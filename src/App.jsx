import './App.css'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Home } from './components';
import reactLogo from './assets/react.svg'

function App () {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App;