import React, {useState, useEffect} from 'react';
import '../Requests.css';

export default function Requests({fulfillRequest}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/requests') // Modify
      .then((response) => response.json())
      .then((data) => {
        const filteredRequests = data.filter((request) => request.status === 'requesting');
        setRequests(filteredRequests);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching requests:', err);
        setError('Failed to load requests');
        setLoading(false);
      });
  }, []);

  const handleFulfillRequest = (index) => {
    fulfillRequest(index);
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="requests-container">
      <h2>Requested Donations</h2>
      {requests.length === 0 ? (
        <p>No requests found with 'requesting' status.</p>
      ) : (
        requests.map((request, index) => (
          <div key={index} className="request-item">
            <p><strong>Item name:</strong> {request.itemName}</p>
            <p><strong>Item description:</strong> {request.itemDescription}</p>
            <p><strong>Quantity:</strong> {request.quantity}</p>
            <p><strong>Hospital:</strong> {request.hospitalID}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <button onClick={() => handleFulfillRequest(index)}>Fulfill Request</button>
          </div>
        ))
      )}
    </div>
  );
}
