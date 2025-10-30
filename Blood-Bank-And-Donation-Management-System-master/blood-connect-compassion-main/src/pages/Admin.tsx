
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, Phone, Mail, Download, Search, Filter } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Donor {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: string;
  bloodGroup: string;
  weight: string;
  address: string;
  medicalHistory: string;
  emergencyContact: string;
  emergencyPhone: string;
  registrationDate: string;
}

const Admin = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const ADMIN_PASSWORD = 'admin123'; // In a real app, this would be properly secured

  useEffect(() => {
    if (isAuthenticated) {
      // Load donors from localStorage
      const savedDonors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
      setDonors(savedDonors);
      setFilteredDonors(savedDonors);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Filter donors based on search term and blood group
    let filtered = donors;

    if (searchTerm) {
      filtered = filtered.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone.includes(searchTerm) ||
        donor.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === selectedBloodGroup);
    }

    setFilteredDonors(filtered);
  }, [searchTerm, selectedBloodGroup, donors]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password!');
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Age', 'Blood Group', 'Weight', 'Address', 'Emergency Contact', 'Emergency Phone', 'Registration Date'],
      ...filteredDonors.map(donor => [
        donor.name,
        donor.email,
        donor.phone,
        donor.age,
        donor.bloodGroup,
        donor.weight,
        donor.address,
        donor.emergencyContact,
        donor.emergencyPhone,
        new Date(donor.registrationDate).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blood_donors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getBloodGroupStats = () => {
    const stats: { [key: string]: number } = {};
    bloodGroups.forEach(group => stats[group] = 0);
    
    donors.forEach(donor => {
      if (stats[donor.bloodGroup] !== undefined) {
        stats[donor.bloodGroup]++;
      }
    });
    
    return stats;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <Navigation />
        
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <Card className="w-full max-w-md border-blood-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blood-600 to-blood-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <Shield className="mr-3 h-6 w-6" />
                Admin Access
              </CardTitle>
              <CardDescription className="text-blood-100">
                Enter admin password to access donor management.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Admin Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="mt-1 border-blood-200 focus:border-blood-500"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full blood-gradient text-white hover:shadow-lg transition-all"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Access Admin Panel
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Demo password: admin123
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const bloodGroupStats = getBloodGroupStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Manage blood donors and view registration statistics.
              </p>
            </div>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="border-blood-300 text-blood-700 hover:bg-blood-50"
            >
              Logout
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-blood-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 font-medium">
                  Total Donors
                </CardTitle>
                <div className="text-3xl font-bold text-blood-600">
                  {donors.length}
                </div>
              </CardHeader>
            </Card>

            <Card className="border-blood-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 font-medium">
                  This Month
                </CardTitle>
                <div className="text-3xl font-bold text-blood-600">
                  {donors.filter(donor => {
                    const donorDate = new Date(donor.registrationDate);
                    const now = new Date();
                    return donorDate.getMonth() === now.getMonth() && 
                           donorDate.getFullYear() === now.getFullYear();
                  }).length}
                </div>
              </CardHeader>
            </Card>

            <Card className="border-blood-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 font-medium">
                  Most Common
                </CardTitle>
                <div className="text-2xl font-bold text-blood-600">
                  {Object.entries(bloodGroupStats).reduce((a, b) => 
                    bloodGroupStats[a[0]] > bloodGroupStats[b[0]] ? a : b
                  )[0] || 'N/A'}
                </div>
              </CardHeader>
            </Card>

            <Card className="border-blood-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 font-medium">
                  Rare Types (AB-, O-)
                </CardTitle>
                <div className="text-3xl font-bold text-blood-600">
                  {(bloodGroupStats['AB-'] || 0) + (bloodGroupStats['O-'] || 0)}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Blood Group Distribution */}
          <Card className="mb-8 border-blood-200">
            <CardHeader>
              <CardTitle>Blood Group Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {bloodGroups.map(group => (
                  <div key={group} className="text-center">
                    <Badge className="blood-gradient text-white text-lg px-3 py-2 mb-2 w-full">
                      {group}
                    </Badge>
                    <div className="text-2xl font-bold text-gray-900">
                      {bloodGroupStats[group] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="mb-8 border-blood-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Search and Filter Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search" className="text-gray-700 font-medium">
                    Search Donors
                  </Label>
                  <Input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1 border-blood-200 focus:border-blood-500"
                    placeholder="Search by name, email, phone, or address"
                  />
                </div>

                <div>
                  <Label htmlFor="bloodGroupFilter" className="text-gray-700 font-medium">
                    Filter by Blood Group
                  </Label>
                  <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                    <SelectTrigger className="mt-1 border-blood-200 focus:border-blood-500">
                      <SelectValue placeholder="All blood groups" />
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

                <div className="flex items-end">
                  <Button 
                    onClick={downloadCSV}
                    className="w-full blood-gradient text-white hover:shadow-lg transition-all"
                    disabled={filteredDonors.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donors Table */}
          <Card className="border-blood-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Registered Donors ({filteredDonors.length})
                </span>
                {(searchTerm || selectedBloodGroup) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBloodGroup('');
                    }}
                    className="border-blood-300 text-blood-700 hover:bg-blood-50"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDonors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Donors Found
                  </h3>
                  <p className="text-gray-600">
                    {donors.length === 0 
                      ? "No donors have registered yet."
                      : "No donors match your search criteria."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Emergency Contact</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonors.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{donor.name}</div>
                              {donor.age && (
                                <div className="text-sm text-gray-500">Age: {donor.age}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="blood-gradient text-white">
                              {donor.bloodGroup}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{donor.phone}</div>
                              <div className="text-sm text-gray-500">{donor.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-xs truncate">
                              {donor.address || 'Not provided'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {donor.emergencyContact && (
                                <div className="text-sm">{donor.emergencyContact}</div>
                              )}
                              {donor.emergencyPhone && (
                                <div className="text-sm text-gray-500">{donor.emergencyPhone}</div>
                              )}
                              {!donor.emergencyContact && !donor.emergencyPhone && (
                                <div className="text-sm text-gray-400">Not provided</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(donor.registrationDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`tel:${donor.phone}`)}
                                className="border-blood-300 text-blood-700 hover:bg-blood-50"
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`mailto:${donor.email}`)}
                                className="border-blood-300 text-blood-700 hover:bg-blood-50"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
