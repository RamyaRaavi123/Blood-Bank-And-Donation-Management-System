import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDonors() {
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/donors', {
            headers: { Authorization: 'Bearer admin123' }
        }).then(res => setDonors(res.data));
    }, []);

    return (
        <div>
            <h2>Donor List (Admin Only)</h2>
            <ul>
                {donors.map((d, i) => (
                    <li key={i}>{d.name} - {d.email} - {d.phone} - ₹{d.amount}</li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDonors;
