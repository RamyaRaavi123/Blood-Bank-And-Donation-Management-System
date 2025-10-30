import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', amount: '' });
    const [message, setMessage] = useState('');

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/donors', formData);
            setMessage('Thank you for your donation!');
        } catch {
            setMessage('Error submitting the form.');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Donation Form</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} required /><br />
                <input name="email" placeholder="Email" onChange={handleChange} required /><br />
                <input name="phone" placeholder="Phone" onChange={handleChange} required /><br />
                <input name="amount" type="number" placeholder="Amount" onChange={handleChange} required /><br />
                <button type="submit">Donate</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default App;
