import React from 'react'
import '../Home.css'

export default function Home() {
    return (
        <>
        <div class='background'>
            <nav>
                <div class='logo'><a href='/'>Match-A-Wish</a></div>
                <div class='links'>
                    <li><a href='Login' onclick='toggleMenu()'>Login</a></li>
                    <li><a href='Register' onclick='toggleMenu()'>Register</a></li>
                </div>
            </nav>
        </div>
        </>
    )
}