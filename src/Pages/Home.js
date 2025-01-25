import React from 'react'
import '../Home.css'

export default function Home() {

    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    const handleRegisterClick = () => {
        window.location.href = '/register';
    };

    return (
        <>
        <div className='background'>
            <nav>
                <div className='logo'>
                    <a href='/'>Match-A-Wish</a>
                </div>
                <div className='links'>
                    <li><a href='login'>Login</a></li>
                    <li><a href='register'>Register</a></li>
                </div>
            </nav>
            <div className='section'>
                <h1>Match-A-Wish</h1>
                <h2>Turning anxious waits into joyful memories, one wish at a time.</h2>
                <div className='buttons'>
                    <li><button onClick={handleLoginClick}>Login</button></li>
                    <li><button onClick={handleRegisterClick}>Register</button></li>
                </div>
            </div>
        </div>
        </>
    )
}
