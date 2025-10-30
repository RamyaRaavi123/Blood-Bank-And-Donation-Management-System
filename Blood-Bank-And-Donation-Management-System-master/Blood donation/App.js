import React, { useState } from "react";
import axios from "axios";

function App() {
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [donorForm, setDonorForm] = useState({ bloodGroup: "", contact: "" });
  const [token, setToken] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const register = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/register", registerForm);
    alert("Registered!");
  };

  const login = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/login", loginForm);
    setToken(res.data.token);
    alert("Logged in!");
  };

  const submitDonor = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/donor", donorForm, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Donor details submitted");
  };

  const search = async () => {
    const res = await axios.get(`http://localhost:5000/donors/search/${searchGroup}`);
    setSearchResults(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={register}>
        <input placeholder="Name" onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} /><br />
        <input placeholder="Email" onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} /><br />
        <input type="password" placeholder="Password" onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} /><br />
        <button type="submit">Register</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={login}>
        <input placeholder="Email" onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /><br />
        <input type="password" placeholder="Password" onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /><br />
        <button type="submit">Login</button>
      </form>

      {token && (
        <>
          <h2>Add Donor Details</h2>
          <form onSubmit={submitDonor}>
            <input placeholder="Blood Group" onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })} /><br />
            <input placeholder="Contact" onChange={(e) => setDonorForm({ ...donorForm, contact: e.target.value })} /><br />
            <button type="submit">Submit Donor Info</button>
          </form>
        </>
      )}

      <h2>Search Donors by Blood Group</h2>
      <input placeholder="e.g. A+, O-" value={searchGroup} onChange={(e) => setSearchGroup(e.target.value)} />
      <button onClick={search}>Search</button>
      <ul>
        {searchResults.map((d, i) => (
          <li key={i}>{d.userId.name} ({d.bloodGroup}) - {d.contact}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
