import React, {useState} from 'react';
import '../RequestDonation.css';

export default function RequestDonation({addRequest}) {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery');
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
    <div className="request-donation-container">
      <h2>Request a Donation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <textarea
          placeholder="Item Description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="0"
        />
        <select
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          required
        >
          <option value="Pick up">Pick up</option>
          <option value="Delivery">Delivery</option>
        </select>
        <input
          type="text"
          placeholder="Hospital ID"
          value={hospitalID}
          onChange={(e) => setHospitalID(e.target.value)}
          required
        />
        <button type="submit">Request Donation</button>
      </form>
    </div>
  );
}
