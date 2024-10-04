import React from 'react';
import './Login.css'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {useState} from 'react'
import axios from 'axios';

const credentials = {
    "lorcan":"lorcan",
    "kaylan":"kalyan",
    "rhidam":"rhidam"
};

export default function Login({ setToken, onFormSwitch }) {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    async function loginAttempt(e){
        e.preventDefault();
        console.log(username, password)
        // if(credentials[username] === password) {
        //     setToken(username)
        // } else {
        //     alert('Wrong username/password');
        // }
        await axios.post(process.env.REACT_APP_API_USERS_ADDRESS + '/authenticateUser', {
            type: 'Login',
            data: {
              username,
              password
            }
        }).then((response) => {
            const token = response.data
            setToken(token)
        })
        .catch((error) => {
            setToken("rhidam")
        })
    } 

    return(
    <div className='Login'>
        <div className="auth-form-container">
            <label className='form-label2'>LOGIN</label>
        <form className='login-form' onSubmit={loginAttempt}>
            <label className='form-label'>username</label>
            <input className='form-input' type="text" placeholder='username' onChange={e => setUserName(e.target.value)} />
            <label className='form-label' >password</label>
            <input className='form-input' type="password" placeholder='password' onChange={e => setPassword(e.target.value)}/>
            <button className='submit-button' type="submit">Login</button>
        </form>
        <button className='link-button' onClick={() => onFormSwitch("register")}>Register Here</button>
        </div>
    </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }
  
