import React from 'react';
import './Login.css'
import {useState} from 'react'


export default function Register({onFormSwitch}) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    return(
    <div className='Login'>
        <div className="auth-form-container">
            <label className='form-label2'>REGISTER</label>
        <form className='register-form'>
            <label className='form-label' >username</label>
            <input className='form-input' type="text" placeholder='username' onChange={e => setUserName(e.target.value)} />
            <label className='form-label' >password</label>
            <input className='form-input' type="password" placeholder='password' onChange={e => setPassword(e.target.value)}/>
            <button className='submit-button' type="submit">Register</button>
        </form>
        <button className='link-button' onClick={() => onFormSwitch("login")} >Login Here</button>
        </div>
    </div>
    )

}