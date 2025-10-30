import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DonorRegistration from './pages/DonorRegistration';
import ReceiverRegistration from './pages/ReceiverRegistration';
import BloodDonation from './pages/BloodDonation';
import DonationHistory from './pages/DonationHistory';
import Admin from './pages/Admin';
import AlertManagement from './pages/AlertManagement';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor-registration" element={<DonorRegistration />} />
          <Route path="/receiver-registration" element={<ReceiverRegistration />} />
          <Route path="/blood-donation" element={<BloodDonation />} />
          <Route path="/donation-history" element={<DonationHistory />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/alerts" element={<AlertManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;