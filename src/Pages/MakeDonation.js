import React from 'react'
import '../MakeDonation.css'
import { useState } from 'react';

/*export default function MakeDonation() { 
    const [toyType, setToyType] = useState(''); 
    const [description, setDescription] = useState('');
    return (

            /*<div> 
                <h1>Make a Donation</h1>
                
                <button className = "button">Submit</button>
            </div> 

            
            <div>
                <label htmlFor="toyType">Type of Toy:</label>
                <input
                type="text"
                id="toyType"
                value={toyType}
                onChange={(e) => setToyType(e.target.value)}
                placeholder="Enter toy type"
                />
            </div>
            

    )
}*/

export default function MakeDonation() {
  const [toyType, setToyType] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Puzzle'); // Default category
  const [expirationDate, setExpirationDate] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('Delivery'); // Default method

  const handleSubmit = (event) => {
    event.preventDefault();

    // Handle form submission here
    console.log({
      toyType,
      description,
      category,
      expirationDate,
      distributionMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="donation-form">
        <div> 
            <h2>Make a Donation!</h2>
            <p>Help Match-a-Wish's mission by donating a toy today! </p>
        </div>
      <div>
        <label htmlFor="toyType">Type of Toy:</label>
        <input
          type="text"
          id="toyType"
          value={toyType}
          onChange={(e) => setToyType(e.target.value)}
          placeholder="Enter toy type"
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={100}
          placeholder="Enter toy description"
        />
      </div>

      <div>
        <label htmlFor="category">Category of Donation:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Puzzle">Puzzle</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <div>
        <label htmlFor="expirationDate">Expiration Date:</label>
        <input
          type="date"
          id="expirationDate"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="distributionMethod">Method of Distribution:</label>
        <div> 
          <select
            id="delivery"
            name="distributionMethod"
            value={distributionMethod}
            onChange={(e) => setDistributionMethod(e.target.value)}
          >
            <option value="Delivery">Delivery</option>
            <option value="Pickup">Pickup</option> 
            <option value="No Preference">No Preference</option>  
          </select>
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
