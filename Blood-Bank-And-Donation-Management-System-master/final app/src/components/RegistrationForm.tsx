import React, { useState } from 'react';
import { User, BloodType, RegistrationFormData } from '../types';
import { Heart, UserPlus } from 'lucide-react';

interface RegistrationFormProps {
  type: 'donor' | 'receiver';
  onSubmit: (data: Omit<User, 'id' | 'registrationDate' | 'status'>) => void;
  onSuccess: () => void;
}

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const RegistrationForm: React.FC<RegistrationFormProps> = ({ type, onSubmit, onSuccess }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    bloodType: 'O+',
    age: 18,
    address: '',
    medicalHistory: '',
    emergencyContact: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData: Omit<User, 'id' | 'registrationDate' | 'status'> = {
      ...formData,
      role: type
    };

    onSubmit(userData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for registering as a {type}. You will be contacted when there's a match.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {type === 'donor' ? (
                <Heart className="h-8 w-8 text-red-600" />
              ) : (
                <UserPlus className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {type === 'donor' ? 'Become a Blood Donor' : 'Register for Blood Assistance'}
            </h1>
            <p className="text-gray-600 mt-2">
              {type === 'donor' 
                ? 'Join our community of life-savers and help those in need'
                : 'Get connected with compatible donors in your area'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bloodType" className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Type *
              </label>
              <select
                id="bloodType"
                name="bloodType"
                required
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter your full address"
              />
            </div>

            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Contact *
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                required
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Emergency contact name and phone"
              />
            </div>

            <div>
              <label htmlFor="medicalHistory" className="block text-sm font-semibold text-gray-700 mb-2">
                Medical History {type === 'receiver' ? '*' : '(Optional)'}
              </label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                required={type === 'receiver'}
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder={type === 'receiver' 
                  ? "Please describe your medical condition and blood need urgency"
                  : "Any relevant medical conditions or medications (optional)"
                }
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> All information provided will be kept confidential and used only for 
                blood donation matching purposes. You will be contacted by medical professionals when needed.
              </p>
            </div>

            <button
              type="submit"
              className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-105 ${
                type === 'donor' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {type === 'donor' ? 'Register as Donor' : 'Register for Blood Assistance'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;