import React from 'react';
import { Heart, Users, UserPlus, Shield, Activity, Phone } from 'lucide-react';

interface HomePageProps {
  onViewChange: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Save Lives Through
              <span className="text-red-600 block">Blood Donation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our community of life-savers. Connect donors with those in need 
              and make a difference in someone's life today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onViewChange('register-donor')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Heart className="inline-block mr-2 h-5 w-5" />
                Become a Donor
              </button>
              <button
                onClick={() => onViewChange('register-receiver')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <UserPlus className="inline-block mr-2 h-5 w-5" />
                Need Blood
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose LifeBlood?
            </h2>
            <p className="text-xl text-gray-600">
              Our platform makes blood donation simple, safe, and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
              <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Safe & Secure</h3>
              <p className="text-gray-600">
                All donors are screened and verified. Your medical information is kept confidential and secure.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Connect with a network of caring individuals committed to saving lives in your community.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <Activity className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time Matching</h3>
              <p className="text-gray-600">
                Advanced blood type compatibility matching ensures the right donor reaches the right person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">50K+</div>
              <div className="text-gray-300">Lives Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">25K+</div>
              <div className="text-gray-300">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">100+</div>
              <div className="text-gray-300">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">24/7</div>
              <div className="text-gray-300">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Emergency Blood Need?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our 24/7 emergency hotline connects you immediately with available donors
          </p>
          <div className="flex justify-center">
            <a
              href="tel:+1-800-BLOOD-NOW"
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition-colors inline-flex items-center"
            >
              <Phone className="mr-3 h-6 w-6" />
              1-800-BLOOD-NOW
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;