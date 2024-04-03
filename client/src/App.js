import './App.css';
import './normal.css'
import React from 'react'
import Dashboard from './components/Dashboard/Dashboard.js';
import Login from './components/Login/Login';
import Register from './components/Login/Register'
import useToken from './useToken';
import {useState, useEffect} from 'react'

function App() {
  const [currentForm, setCurrentForm] = useState("login")
  const { token, setToken } = useToken();

  // const [token, setToken] = useState();

  const toggleForm = (formName) => {
    setCurrentForm(formName)
  }
  if(!token) {
    return (currentForm === "login" || !currentForm)? <Login setToken={setToken} onFormSwitch = {toggleForm} /> : <Register onFormSwitch = {toggleForm}/>
  }

  return (
    <Dashboard userName = {token}/>
  );
}

export default App;
