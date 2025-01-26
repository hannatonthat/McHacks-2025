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
                    <a href='/login'>Login</a>
                    <a href='/register'>Register</a>
                </div>
            </nav>
            <div className='home'>
                <div class='text'>
                    <h1>Match-A-Wish</h1>
                    <h2>Turning anxious waits into joyful memories, one wish at a time.</h2>
                    <p>We use AI smart matching to connect toy donors with children’s hospitals, ensuring that every child is entertained during hospital stays.</p>
                    <div className="buttons">
                        <button><span class='button_top' onClick={handleLoginClick}>Login</span></button>
                        <button><span class='button_top' onClick={handleRegisterClick}>Register</span></button>
                    </div>
                </div>
                <div className='img'>
                    <img src='/images/toys1.png' alt='toys'/>
                </div>
            </div>
        </div>
        </>
    )
}
