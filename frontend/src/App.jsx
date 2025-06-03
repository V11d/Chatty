import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Setting from './pages/Setting.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { Toaster } from 'react-hot-toast'
import { use_auth_store } from './store/use_auth_store.js'
import { use_theme_store } from './store/use_theme_store.js'
import {Loader} from 'lucide-react'

const App = () => {
  const {auth_user, check_auth, is_checking_auth, online_users} = use_auth_store()
  const {theme} = use_theme_store()
  useEffect(() => {
    check_auth()
  }, [check_auth])
  console.log({auth_user})
  console.log({online_users})
  if (is_checking_auth && !auth_user) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className='size-10 animate-spin'/>
    </div>
  )
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={auth_user ? <Home/>: <Navigate to='/login' /> }/>
        <Route path='/signup' element={!auth_user ? <Signup/>: <Navigate to='/' />}/>
        <Route path='/login' element={!auth_user ? <Login/> : <Navigate to='/' />}/>
        <Route path='/settings' element={<Setting/>}/>
        <Route path='/profile' element={auth_user ? <Profile/> : <Navigate to='/login'/>}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
