import React from 'react'
import '../MakeDonation.css'
import { useState } from 'react';

export default function MakeDonation() {
  const [toyType, setToyType] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Select'); // Default category
  const [expirationDate, setExpirationDate] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('No Preference'); // Default method
  const [image, setImage] = useState(null); 

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('toyType', toyType);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('expirationDate', expirationDate);
    formData.append('distributionMethod', distributionMethod);
    formData.append('image', setImage);

    // Handle form submission here
    console.log(formData); 
    
  };
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImage(selectedFile); 
    }
};

  return (
    <div class="background">
      <nav>
                <div className='logo'>
                    <a href='/'>Match-A-Wish</a>
                </div>
                <div className='links'>
                    <a href='/'>Logout</a>
                </div>
            </nav>
    <form onSubmit={handleSubmit} className="donation-form">
        <div> 
            <h2 class="center-text">Make a Donation!</h2>
            <p class="center-text">Help a young patient's experience by donating a toy today. </p>
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
        <label htmlFor="image">Image of Toy:</label>
        <input 
          type="file" 
          id="image" 
          onChange={handleImageChange} 
        />
      </div>

      <div>
        <label htmlFor="category">Category of Donation:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
        <option value="Other">Other</option>
          <option value="Arts and Crafts">Arts and Crafts</option> 
          <option value="Music">Music</option>
          <option value="Dolls/Action Figures">Dolls/Action Figures</option>
          <option value="Books">Books</option>
          <option value="Games">Games</option>
          <option value="Sports">Sports</option>
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
            <option value="No Preference">No Preference</option>
            <option value="Delivery">Delivery</option>
            <option value="Pickup">Pickup</option> 
              
          </select>
        </div>
      </div>
      <button class='make-donation-button' type="submit">Submit</button>
    </form>
    </div>
  );
}
