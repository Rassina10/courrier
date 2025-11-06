
import './App.css'
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import Login from './pages/login'
import Tester from './pages/test'
import User from './pages/RecupererUser'
import Register from './pages/register'
import Dashboard from './components/dashboard/dashboard'

export default function App() {


  return (
    <Router> 
   <Routes>
      <Route path = "/" element = {<div>Bonjour ça va?</div>}/>
    <Route path = "/login" element = {<Login />}/>
    <Route path ="/test" element= {<Tester/>}/>
    <Route path ="/user" element ={<User/>}/>
    <Route path ="/register" element ={<Register/>}/>
    <Route path ="/dashboard" element ={<Dashboard/>}/>
   </Routes>
    </Router>
  )
  }
      
