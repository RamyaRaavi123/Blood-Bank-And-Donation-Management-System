
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Donor {
  id: number;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  address: string;
  registrationDate: string;
  age: string;
}

const FindDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    // Load donors from localStorage
    const savedDonors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
    setDonors(savedDonors);
    setFilteredDonors(savedDonors);
  }, []);

  useEffect(() => {
    // Filter donors based on blood group and location
    let filtered = donors;

    if (selectedBloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === selectedBloodGroup);
    }

    if (searchLocation) {
      filtered = filtered.filter(donor => 
        donor.address.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredDonors(filtered);
  }, [selectedBloodGroup, searchLocation, donors]);

  const handleSearch = () => {
    // The filtering is already handled in useEffect
    console.log('Searching for donors...');
  };

  const getCompatibleBloodGroups = (bloodGroup: string) => {
    const compatibility: { [key: string]: string[] } = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };
    return compatibility[bloodGroup] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="blood-drop w-16 h-16 mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Blood Donors
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search for compatible blood donors in your area. Connect with heroes ready to save lives.
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8 border-blood-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blood-600 to-blood-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <Search className="mr-3 h-5 w-5" />
                Search for Donors
              </CardTitle>
              <CardDescription className="text-blood-100">
                Filter donors by blood group and location to find the best matches.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bloodGroup" className="text-gray-700 font-medium">
                    Required Blood Group
                  </Label>
                  <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                    <SelectTrigger className="mt-1 border-blood-200 focus:border-blood-500">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Blood Groups</SelectItem>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700 font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="mt-1 border-blood-200 focus:border-blood-500"
                    placeholder="Enter city, area, or pincode"
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch}
                    className="w-full blood-gradient text-white hover:shadow-lg transition-all"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search Donors
                  </Button>
                </div>
              </div>

              {selectedBloodGroup && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Compatible Donors:</strong> Showing donors with blood groups compatible with {selectedBloodGroup}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getCompatibleBloodGroups(selectedBloodGroup).map((group) => (
                      <Badge key={group} variant="secondary" className="bg-blue-100 text-blue-800">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Donors ({filteredDonors.length})
              </h2>
              {selectedBloodGroup || searchLocation ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedBloodGroup('');
                    setSearchLocation('');
                  }}
                  className="border-blood-300 text-blood-700 hover:bg-blood-50"
                >
                  Clear Filters
                </Button>
              ) : null}
            </div>

            {filteredDonors.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Donors Found
                  </h3>
                  <p className="text-gray-600">
                    {donors.length === 0 
                      ? "No donors have registered yet. Encourage people to join our community!"
                      : "No donors match your search criteria. Try adjusting your filters."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonors.map((donor) => (
                  <Card key={donor.id} className="border-blood-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          {donor.name}
                        </CardTitle>
                        <Badge className="blood-gradient text-white text-sm px-3 py-1">
                          {donor.bloodGroup}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-3 text-blood-500" />
                        <span className="text-sm">{donor.phone}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-3 text-blood-500" />
                        <span className="text-sm truncate">{donor.email}</span>
                      </div>
                      
                      {donor.address && (
                        <div className="flex items-start text-gray-600">
                          <MapPin className="h-4 w-4 mr-3 text-blood-500 mt-0.5" />
                          <span className="text-sm">{donor.address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-3 text-blood-500" />
                        <span className="text-sm">
                          Registered: {new Date(donor.registrationDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Button 
                          className="w-full blood-gradient text-white hover:shadow-md transition-all"
                          onClick={() => window.open(`tel:${donor.phone}`)}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call Donor
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-blood-300 text-blood-700 hover:bg-blood-50"
                          onClick={() => window.open(`mailto:${donor.email}`)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Notice */}
          <Card className="mt-12 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="blood-drop w-12 h-12 flex items-center justify-center bg-orange-500">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    Emergency Blood Request?
                  </h3>
                  <p className="text-orange-800 mb-4">
                    For urgent blood requirements, call our 24/7 emergency helpline. 
                    Our team will immediately contact nearby compatible donors.
                  </p>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => window.open('tel:1-800-BLOOD')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Emergency Helpline: 1-800-BLOOD
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FindDonors;
