import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Hospital.css';

export default function Hospital() {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/hospital/1'); // Updated API endpoint
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
                    <img src='/images/user.png' alt='hospital'></img>
                </div>
                <div className='box two'>
                    <h2>Profile</h2>
                    {loading ? (
                        <p>Loading profile...</p>
                    ) : (
                        <div>
                            <p><strong>Hospital Name:</strong></p>
                            <p>{profile.name}</p>

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
                    <button>
                            <span 
                                className="button_top" 
                                onClick={() => window.location.href = '/inventory'}
                            >
                                Check Inventory
                            </span>
                        </button>
                        <button>
                            <span 
                                className="button_top" 
                                onClick={() => window.location.href = '/requestdonation'}
                            >
                                Request Donation
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
