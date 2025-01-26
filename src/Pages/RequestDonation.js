import React, {useState} from 'react';
import '../RequestDonation.css';

export default function RequestDonation({addRequest}) {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('No Preference');
  const [hospitalID, setHospitalID] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      item_name: itemName,
      item_description: itemDescription,
      quantity: quantity,
      hospitalID: hospitalID,
      deliveryMethod: deliveryMethod,
      status: 'requesting',
    };

    fetch('http://localhost:5000/api/donations', {  // Modify
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRequest),
    })
      .then((response) => response.json())
      .then((data) => {
        addRequest(data);
        alert('Request submitted successfully!');
        setItemName('');
        setItemDescription('');
        setQuantity('');
        setDeliveryMethod('Delivery');
        setHospitalID('');
      })
      .catch((error) => {
        console.error('Error submitting request:', error);
        alert('There was an error submitting your request.');
      });
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
    <div className="request-donation-container">
      <form className = "request-form"onSubmit={handleSubmit}> 
        <h2 class="center-text">Request a Donation!</h2>
        <label>Type of Item</label>
        <input
          type="text"
          placeholder="Enter Item Here"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <label>Description of Item</label>
        <textarea
          placeholder="Enter Description Here"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required 
          maxLength={100}
        /> 
         <label>Total Quantity</label>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="0"
        />  
        <label> </label>
        <label>Method of Delivery</label> 
        <select
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          required
        > 
        `<option value="No Preference">No Preference</option>
          <option value="Pick up">Pick up</option>
          <option value="Delivery">Delivery</option>
        </select>
        <label>Hospital ID</label>
        <input
          type="text"
          placeholder="Enter ID here"
          value={hospitalID}
          onChange={(e) => setHospitalID(e.target.value)}
          required
        />
        <button class = "request-donation-button" type="submit">Request Donation</button>
      </form>
    </div> 
    </div>
  );
}
