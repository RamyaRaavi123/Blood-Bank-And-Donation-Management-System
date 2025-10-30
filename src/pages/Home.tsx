import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Droplets, Calendar, ArrowRight, Shield, Clock, MapPin } from 'lucide-react';
import { getStats, type Stats } from '../utils/storage';

const Home: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white fill-current animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Save Lives,<br />
              <span className="text-red-200">Donate Blood</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Join our community of heroes. Every donation can save up to three lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donor-registration"
                className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 group"
              >
                Become a Donor
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/receiver-registration"
                className="inline-flex items-center px-8 py-4 bg-red-800 text-white font-semibold rounded-lg shadow-lg hover:bg-red-900 transition-all duration-200 transform hover:scale-105 border-2 border-red-700"
              >
                Need Blood
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {stats && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Together, we're making a difference in our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center bg-red-50 rounded-2xl p-8 transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.totalDonors}</div>
                <div className="text-gray-700 font-medium">Registered Donors</div>
              </div>
              
              <div className="text-center bg-blue-50 rounded-2xl p-8 transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalDonations}</div>
                <div className="text-gray-700 font-medium">Blood Donations</div>
              </div>
              
              <div className="text-center bg-green-50 rounded-2xl p-8 transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalReceivers}</div>
                <div className="text-gray-700 font-medium">Lives Helped</div>
              </div>
            </div>

            {/* Blood Group Distribution */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Blood Group Availability
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodGroups.map((group) => (
                  <div key={group} className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-red-600 mb-1">{group}</div>
                    <div className="text-lg font-semibold text-gray-700">
                      {stats.bloodGroupStats[group] || 0}
                    </div>
                    <div className="text-sm text-gray-500">donors</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BloodCare?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make blood donation simple, safe, and meaningful
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safe & Secure</h3>
              <p className="text-gray-600">
                All donations follow strict medical guidelines and safety protocols to ensure donor and recipient safety.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Process</h3>
              <p className="text-gray-600">
                Simple registration and donation process that respects your time while making maximum impact.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Impact</h3>
              <p className="text-gray-600">
                Connect with your local community and make a direct impact on lives in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of heroes who are making a difference in their community through blood donation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor-registration"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              Start Donating Today
            </Link>
            <Link
              to="/donation-history"
              className="inline-flex items-center px-8 py-4 bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-all duration-200 border-2 border-red-500"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Recent Donations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;