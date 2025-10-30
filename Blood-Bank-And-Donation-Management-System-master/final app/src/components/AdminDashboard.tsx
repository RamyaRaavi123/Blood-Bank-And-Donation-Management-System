import React, { useState } from 'react';
import { Users, Heart, Search, Filter, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { User, BloodType } from '../types';
import { canReceiveFrom } from '../utils/bloodCompatibility';

interface AdminDashboardProps {
  users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'receivers' | 'matches'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState<BloodType | 'all'>('all');

  const donors = users.filter(user => user.role === 'donor');
  const receivers = users.filter(user => user.role === 'receiver');
  
  const filteredUsers = (userType: 'donor' | 'receiver') => {
    const userList = userType === 'donor' ? donors : receivers;
    return userList.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm);
      const matchesBloodType = bloodTypeFilter === 'all' || user.bloodType === bloodTypeFilter;
      return matchesSearch && matchesBloodType;
    });
  };

  const getCompatibleDonors = (receiver: User) => {
    return donors.filter(donor => canReceiveFrom(receiver.bloodType, donor.bloodType));
  };

  const bloodTypes: (BloodType | 'all')[] = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: number, color: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-3xl" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const UserCard = ({ user, showCompatibility = false }: { user: User, showCompatibility?: boolean }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Age {user.age}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.role === 'donor' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              Blood Type: {user.bloodType}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          {user.email}
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          {user.phone}
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {user.address}
        </div>
      </div>

      {showCompatibility && user.role === 'receiver' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Compatible Donors:</h4>
          <div className="text-sm text-blue-600">
            {getCompatibleDonors(user).length} available donors
          </div>
        </div>
      )}

      {user.medicalHistory && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Medical History:</h4>
          <p className="text-sm text-gray-600">{user.medicalHistory}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage blood donation system and view all registered users</p>
        </div>

        {/* Overview Stats */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users />}
              title="Total Users"
              value={users.length}
              color="#6366f1"
            />
            <StatCard
              icon={<Heart />}
              title="Active Donors"
              value={donors.filter(d => d.status === 'active').length}
              color="#dc2626"
            />
            <StatCard
              icon={<Users />}
              title="Blood Recipients"
              value={receivers.filter(r => r.status === 'active').length}
              color="#2563eb"
            />
            <StatCard
              icon={<Heart />}
              title="Potential Matches"
              value={receivers.reduce((acc, receiver) => acc + getCompatibleDonors(receiver).length, 0)}
              color="#059669"
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'donors', label: `Donors (${donors.length})` },
                { key: 'receivers', label: `Recipients (${receivers.length})` },
                { key: 'matches', label: 'Blood Matches' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter Controls */}
        {(activeTab === 'donors' || activeTab === 'receivers') && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={bloodTypeFilter}
                  onChange={(e) => setBloodTypeFilter(e.target.value as BloodType | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Blood Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donors</h3>
              <div className="space-y-4">
                {donors.slice(0, 5).map(donor => (
                  <UserCard key={donor.id} user={donor} />
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recipients</h3>
              <div className="space-y-4">
                {receivers.slice(0, 5).map(receiver => (
                  <UserCard key={receiver.id} user={receiver} showCompatibility />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donors' && (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers('donor').map(donor => (
              <UserCard key={donor.id} user={donor} />
            ))}
          </div>
        )}

        {activeTab === 'receivers' && (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers('receiver').map(receiver => (
              <UserCard key={receiver.id} user={receiver} showCompatibility />
            ))}
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            {receivers.map(receiver => {
              const compatibleDonors = getCompatibleDonors(receiver);
              return (
                <div key={receiver.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {receiver.name} (Blood Type: {receiver.bloodType})
                    </h3>
                    <p className="text-gray-600">{compatibleDonors.length} compatible donors found</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {compatibleDonors.map(donor => (
                      <div key={donor.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{donor.name}</h4>
                        <p className="text-sm text-gray-600">Blood Type: {donor.bloodType}</p>
                        <p className="text-sm text-gray-600">{donor.phone}</p>
                        <p className="text-sm text-gray-600">{donor.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;