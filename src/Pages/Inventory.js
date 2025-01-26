import React, {useState, useEffect} from 'react';
import '../Inventory.css';

export default function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch('http://localhost:5000/backend/inventory') // Modify
            .then((response) => response.json())
            .then((data) => {
                setInventory(data);
                setFilteredInventory(data);
            })
            .catch((error) => console.error('Error fetching inventory:', error));
    }, []);

    const handleFilterChange = (filterValue) => {
        setFilter(filterValue);
    
        if (filterValue === 'all') {
            setFilteredInventory(inventory);
        } else {
            setFilteredInventory(inventory.filter(donation => donation.status === filterValue));
        }
    };

    return (
        <>
        <nav>
                <div className='logo'>
                    <a href='/'>Match-A-Wish</a>
                </div>
                <div className='links'>
                    <a href='/'>Logout</a>
                </div>
            </nav>
        <div className="inventory-container">
            <h1>Inventory</h1>
            <div className="filter-bar">
                <button>
                    <span className="button_top" onClick={() => handleFilterChange('all')}>All</span>
                </button>
                <button>
                    <span className="button_top" onClick={() => handleFilterChange('arrived')}>Arrived</span>
                </button>
                <button>
                    <span className="button_top" onClick={() => handleFilterChange('arriving')}>Arriving</span>
                </button>
                <button>
                    <span className="button_top" onClick={() => handleFilterChange('requesting')}>Requesting</span>
                </button>
            </div>
            {filteredInventory.length === 0 ? (
                <p>Loading inventory...</p>
            ) : (
                filteredInventory.map((donation, index) => (
                    <div key={index} className="inventory-item">
                        <p><strong>Item name:</strong> {donation.item_name}</p>
                        <p><strong>Item description:</strong> {donation.item_description}</p>
                        <p><strong>Quantity:</strong> {donation.quantity}</p>
                        <p><strong>Hospital donated to:</strong> {donation.hospital}</p>
                        <p><strong>Received or not:</strong> {donation.received}</p>
                        <p><strong>Expiry date:</strong> {donation.expiry_date}</p>
                        <p><strong>Pick up or delivery:</strong> {donation.delivery_method}</p>
                        <p><strong>Donor ID:</strong> {donation.donor_id}</p>
                    </div>
                ))
            )}
        </div>
        </>
    );
}
