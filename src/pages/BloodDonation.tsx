import React, { useState } from 'react';
import { Droplets, Calendar, User, Phone, Mail } from 'lucide-react';
import { recordDonation } from '../utils/storage';

interface FormData {
  emailOrPhone: string;
  donationDate: string;
}

const BloodDonation: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    emailOrPhone: '',
    donationDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = recordDonation(formData.emailOrPhone, formData.donationDate);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setFormData({
          emailOrPhone: '',
          donationDate: ''
        });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to record donation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-red-600 fill-current" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Record Blood Donation
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Update your donation history and help us keep track of your generous contributions
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Phone */}
            <div>
              <label htmlFor="emailOrPhone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center mr-2">
                  <Mail className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-gray-400">or</span>
                  <Phone className="w-4 h-4 text-gray-500 ml-1" />
                </div>
                Email Address or Phone Number *
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter your registered email or phone number"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use the same email or phone number you used during donor registration
              </p>
            </div>

            {/* Donation Date */}
            <div>
              <label htmlFor="donationDate" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                Donation Date *
              </label>
              <input
                type="date"
                id="donationDate"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleInputChange}
                max={today}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select the date when you donated blood
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? 'Recording Donation...' : 'Record Donation'}
            </button>
          </form>

          {/* Info Boxes */}
          <div className="mt-8 space-y-4">
            {/* Success Info */}
            <div className="p-6 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thank You for Donating!
              </h3>
              <p className="text-sm text-green-700">
                Your donation can save up to 3 lives. We appreciate your contribution to the community and will update your donation history automatically.
              </p>
            </div>

            {/* Reminder Info */}
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-100">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Reminders:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Wait at least 8 weeks (56 days) before your next donation</li>
                <li>• Stay hydrated and eat well after donation</li>
                <li>• Rest for at least 15 minutes after donating</li>
                <li>• Contact medical staff immediately if you feel unwell</li>
              </ul>
            </div>

            {/* Not Registered Info */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Not Registered Yet?</h3>
              <p className="text-sm text-blue-700 mb-3">
                If you haven't registered as a donor, please complete your registration first.
              </p>
              <a
                href="/donor-registration"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register as Donor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonation;