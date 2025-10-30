import React, { useState, useEffect } from 'react';
import { Calendar, Droplets, MapPin, User, RefreshCw } from 'lucide-react';
import { getDonations, type Donation } from '../utils/storage';

const DonationHistory: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = () => {
    setIsLoading(true);
    try {
      const donationData = getDonations();
      setDonations(donationData.reverse()); // Most recent first
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-200 text-red-900',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-200 text-blue-900',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-200 text-purple-900',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-green-200 text-green-900'
    };
    return colors[bloodGroup as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
            <span className="ml-2 text-lg text-gray-600">Loading donation history...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Donation History
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View all recent blood donations and celebrate the heroes in our community
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={fetchDonations}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Donations List */}
        {donations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Donations Yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to make a difference! Record your blood donation to get started.
            </p>
            <a
              href="/blood-donation"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Record Donation
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">{donations.length}</div>
                  <div className="text-gray-600">Total Donations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {new Set(donations.map(d => d.donorName)).size}
                  </div>
                  <div className="text-gray-600">Unique Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {Math.floor(donations.length * 3)}
                  </div>
                  <div className="text-gray-600">Lives Potentially Saved</div>
                </div>
              </div>
            </div>

            {/* Donation Cards */}
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {donation.donorName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {donation.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          Donated on {formatDate(donation.donationDate)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Droplets className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-500 text-sm">
                          Recorded {formatDate(donation.recordedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getBloodGroupColor(donation.bloodGroup)}`}>
                      <Droplets className="w-4 h-4 mr-1 fill-current" />
                      {donation.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;