import React, { useState, useEffect } from 'react';
import { Shield, Users, Heart, Droplets, Calendar, Mail, Phone, MapPin, FileText, Search, Filter, Download, AlertTriangle, Key, Settings } from 'lucide-react';
import { getDonors, getReceivers, getDonations, type Donor, type Receiver, type Donation } from '../utils/storage';
import { getActiveAlerts } from '../utils/notifications';
import { Link } from 'react-router-dom';
import APIKeyManager from '../components/APIKeyManager';

const Admin: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [activeTab, setActiveTab] = useState<'donors' | 'receivers' | 'donations' | 'api-keys'>('donors');
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const activeAlerts = getActiveAlerts();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    try {
      setDonors(getDonors());
      setReceivers(getReceivers());
      setDonations(getDonations());
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeSinceLastDonation = (lastDonationDate: string | null) => {
    if (!lastDonationDate) return 'Never donated';
    
    const lastDonation = new Date(lastDonationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const getEligibilityStatus = (lastDonationDate: string | null) => {
    if (!lastDonationDate) return { status: 'eligible', text: 'Eligible to donate' };
    
    const lastDonation = new Date(lastDonationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 56) { // 8 weeks = 56 days
      return { status: 'eligible', text: 'Eligible to donate' };
    } else {
      const remainingDays = 56 - diffDays;
      return { status: 'not-eligible', text: `Eligible in ${remainingDays} days` };
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.phone.includes(searchTerm);
    const matchesBloodGroup = !bloodGroupFilter || donor.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesBloodGroup;
  });

  const filteredReceivers = receivers.filter(receiver => {
    const matchesSearch = receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receiver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receiver.phone.includes(searchTerm);
    const matchesBloodGroup = !bloodGroupFilter || receiver.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesBloodGroup;
  });

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !bloodGroupFilter || donation.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesBloodGroup;
  });

  const exportData = (type: 'donors' | 'receivers' | 'donations') => {
    let data: any[] = [];
    let filename = '';
    
    switch (type) {
      case 'donors':
        data = donors;
        filename = 'donors_data.json';
        break;
      case 'receivers':
        data = receivers;
        filename = 'receivers_data.json';
        break;
      case 'donations':
        data = donations;
        filename = 'donations_data.json';
        break;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = filename;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-lg text-gray-600">Loading admin data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and monitor all blood donation activities, registrations, and system configuration
          </p>
        </div>

        {/* Active Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">
                    {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}
                  </h3>
                  <p className="text-orange-700">
                    You have urgent notifications that need attention
                  </p>
                </div>
              </div>
              <Link
                to="/alerts"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Manage Alerts
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/alerts"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Send Emergency Alert
            </Link>
            <button
              onClick={() => setActiveTab('api-keys')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Key className="w-5 h-5 mr-2" />
              Configure API Keys
            </button>
            <button
              onClick={() => exportData(activeTab as 'donors' | 'receivers' | 'donations')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              disabled={activeTab === 'api-keys'}
            >
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{donors.length}</div>
                <div className="text-gray-600">Total Donors</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{receivers.length}</div>
                <div className="text-gray-600">Blood Requests</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{donations.length}</div>
                <div className="text-gray-600">Total Donations</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{activeAlerts.length}</div>
                <div className="text-gray-600">Active Alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('donors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'donors'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Donors ({donors.length})
              </button>
              <button
                onClick={() => setActiveTab('receivers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'receivers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Receivers ({receivers.length})
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'donations'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Donations ({donations.length})
              </button>
              <button
                onClick={() => setActiveTab('api-keys')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'api-keys'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Key className="w-4 h-4 inline mr-1" />
                API Configuration
              </button>
            </nav>
          </div>

          {/* API Keys Tab */}
          {activeTab === 'api-keys' && (
            <div className="p-6">
              <APIKeyManager />
            </div>
          )}

          {/* Other tabs content */}
          {activeTab !== 'api-keys' && (
            <>
              {/* Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={bloodGroupFilter}
                      onChange={(e) => setBloodGroupFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Blood Groups</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => exportData(activeTab)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'donors' && (
                  <div className="space-y-4">
                    {filteredDonors.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No donors found matching your criteria</p>
                      </div>
                    ) : (
                      filteredDonors.map((donor) => {
                        const eligibility = getEligibilityStatus(donor.lastDonationDate);
                        return (
                          <div key={donor.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-4">
                                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                    <Users className="w-6 h-6 text-red-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                      <span className="flex items-center">
                                        <Mail className="w-4 h-4 mr-1" />
                                        {donor.email}
                                      </span>
                                      <span className="flex items-center">
                                        <Phone className="w-4 h-4 mr-1" />
                                        {donor.phone}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                  <div className="flex items-center">
                                    <Droplets className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="font-medium">Blood Group:</span>
                                    <span className="ml-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                      {donor.bloodGroup}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="font-medium">Location:</span>
                                    <span className="ml-1">{donor.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="font-medium">Registered:</span>
                                    <span className="ml-1">{formatDate(donor.registrationDate)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="font-medium">Last Donation:</span>
                                    <span className="ml-1">
                                      {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'Never'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  eligibility.status === 'eligible' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {eligibility.text}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {getTimeSinceLastDonation(donor.lastDonationDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {activeTab === 'receivers' && (
                  <div className="space-y-4">
                    {filteredReceivers.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No receivers found matching your criteria</p>
                      </div>
                    ) : (
                      filteredReceivers.map((receiver) => (
                        <div key={receiver.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <Heart className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{receiver.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {receiver.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {receiver.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                            <div className="flex items-center">
                              <Droplets className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="font-medium">Required Blood:</span>
                              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                                {receiver.bloodGroup}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="font-medium">Location:</span>
                              <span className="ml-1">{receiver.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="font-medium">Registered:</span>
                              <span className="ml-1">{formatDate(receiver.registrationDate)}</span>
                            </div>
                          </div>
                          
                          {receiver.reason && (
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                              <div>
                                <span className="font-medium text-sm">Reason:</span>
                                <p className="text-sm text-gray-600 mt-1">{receiver.reason}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'donations' && (
                  <div className="space-y-4">
                    {filteredDonations.length === 0 ? (
                      <div className="text-center py-8">
                        <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No donations found matching your criteria</p>
                      </div>
                    ) : (
                      filteredDonations.map((donation) => (
                        <div key={donation.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                              <Droplets className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{donation.donorName}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {donation.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center">
                              <Droplets className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="font-medium">Blood Group:</span>
                              <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                {donation.bloodGroup}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="font-medium">Donation Date:</span>
                              <span className="ml-1">{formatDate(donation.donationDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="font-medium">Recorded:</span>
                              <span className="ml-1">{formatDate(donation.recordedAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;