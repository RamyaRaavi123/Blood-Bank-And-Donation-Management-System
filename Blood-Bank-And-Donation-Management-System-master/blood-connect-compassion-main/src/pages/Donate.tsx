
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Heart, UserPlus } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Donate = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    bloodGroup: '',
    weight: '',
    address: '',
    medicalHistory: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.bloodGroup) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage (in a real app, this would be sent to a backend)
    const existingDonors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
    const newDonor = {
      id: Date.now(),
      ...formData,
      registrationDate: new Date().toISOString()
    };
    
    existingDonors.push(newDonor);
    localStorage.setItem('bloodDonors', JSON.stringify(existingDonors));

    toast({
      title: "Registration Successful! 🎉",
      description: "Thank you for registering as a blood donor. You're now part of our life-saving community!",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      bloodGroup: '',
      weight: '',
      address: '',
      medicalHistory: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="blood-drop w-16 h-16 mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become a Blood Donor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community of heroes. Your registration helps us connect you with those in need 
              and could save up to 3 lives with each donation.
            </p>
          </div>

          <Card className="border-blood-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blood-600 to-blood-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <UserPlus className="mr-3 h-6 w-6" />
                Donor Registration Form
              </CardTitle>
              <CardDescription className="text-blood-100">
                Please provide accurate information to help us serve you better.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="age" className="text-gray-700 font-medium">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                      placeholder="Enter your age"
                      min="18"
                      max="65"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bloodGroup" className="text-gray-700 font-medium">
                      Blood Group *
                    </Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                      <SelectTrigger className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500">
                        <SelectValue placeholder="Select your blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weight" className="text-gray-700 font-medium">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                      placeholder="Enter your weight"
                      min="50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-700 font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="emergencyContact" className="text-gray-700 font-medium">
                      Emergency Contact Name
                    </Label>
                    <Input
                      id="emergencyContact"
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                      placeholder="Emergency contact person"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyPhone" className="text-gray-700 font-medium">
                      Emergency Contact Phone
                    </Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="medicalHistory" className="text-gray-700 font-medium">
                    Medical History (Optional)
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    className="mt-1 border-blood-200 focus:border-blood-500 focus:ring-blood-500"
                    placeholder="Any relevant medical history, medications, or conditions"
                    rows={3}
                  />
                </div>

                <div className="bg-blood-50 p-4 rounded-lg border border-blood-200">
                  <p className="text-sm text-blood-800 mb-2">
                    <strong>Important:</strong> By registering, you agree to:
                  </p>
                  <ul className="text-sm text-blood-700 list-disc list-inside space-y-1">
                    <li>Be contacted for blood donation requests</li>
                    <li>Undergo necessary medical screening before donation</li>
                    <li>Provide accurate health information</li>
                    <li>Follow all safety protocols during donation</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full blood-gradient text-white py-3 text-lg hover:shadow-lg transition-all"
                >
                  <Heart className="mr-2 h-5 w-5" fill="white" />
                  Register as Blood Donor
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Donate;
