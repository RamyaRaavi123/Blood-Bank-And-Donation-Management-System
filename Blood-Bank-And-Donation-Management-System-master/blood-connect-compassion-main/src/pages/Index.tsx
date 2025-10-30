
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Shield, Clock, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: 'Save Lives',
      description: 'Your donation can save up to 3 lives. Be a hero in someone\'s story.',
    },
    {
      icon: Users,
      title: 'Connect Donors',
      description: 'Find compatible blood donors in your area quickly and efficiently.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All donations are processed through certified medical facilities.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Emergency blood requests are handled round the clock.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Lives Saved' },
    { number: '5,000+', label: 'Active Donors' },
    { number: '50+', label: 'Partner Hospitals' },
    { number: '24/7', label: 'Emergency Support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="blood-drop w-20 h-20 mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Heart className="h-10 w-10 text-white" fill="white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Give Blood,
              <span className="bg-gradient-to-r from-blood-600 to-blood-800 bg-clip-text text-transparent">
                {" "}Give Life
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Join our community of heroes. Your blood donation can save lives, bring hope to families, 
              and make a real difference in emergency situations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/donate">
              <Button size="lg" className="blood-gradient text-white px-8 py-3 text-lg hover:shadow-lg transition-all">
                Donate Blood
                <Heart className="ml-2 h-5 w-5" fill="white" />
              </Button>
            </Link>
            <Link to="/find-donors">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-blood-300 text-blood-700 hover:bg-blood-50">
                Find Donors
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blood-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BloodConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make blood donation simple, safe, and impactful. Join thousands of donors 
              making a difference every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-blood-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="blood-drop w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 px-4 blood-gradient">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Emergency Blood Request?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            In case of medical emergencies, contact our 24/7 helpline for immediate assistance.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-blood-600 hover:bg-gray-100 px-8 py-3"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Emergency: 1-800-BLOOD
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="blood-drop w-8 h-8 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold">BloodConnect</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting lives through the gift of blood donation.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 BloodConnect. All rights reserved. Saving lives, one donation at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
