import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Donor.css';

export default function Donor() {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/donor/1');
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className='donor-background'>
            <nav>
                <div className='logo'>
                    <a href='/'>Match-A-Wish</a>
                </div>
                <div className='links'>
                    <a href='/'>Logout</a>
                </div>
            </nav>
            <div className='container'>
                <div className='box one'>
                    <img src='/images/user2.png' alt='toys'></img>
                </div>
                <div className='box two'>
                    <h2>Profile</h2>
                    {loading ? (
                        <p>Loading profile...</p>
                        ) : (
                        <div>
                            <p><strong>Organization Name:</strong></p>
    <p>{profile.org_name}</p>

    <p><strong>Location:</strong></p>
    <p>{profile.location}</p>
      
    <p><strong>Email:</strong></p>
    <p>{profile.email}</p>
    
    <p><strong>Phone Number:</strong></p>
    <p>{profile.phone}</p>
                        </div>
                    )}
                    <h2>Functions</h2>
                    <div className="buttons">
                        <button><span class='button_top' onClick={() => window.location.href = '/requests'}>View Requests</span></button>
                        <button><span class='button_top' onClick={() => window.location.href = '/makedonation'}>Make Donation</span></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
