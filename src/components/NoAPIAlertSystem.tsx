import React, { useState } from 'react';
import { Copy, Download, MessageSquare, Users, AlertTriangle, CheckCircle, Filter, Search } from 'lucide-react';
import { getDonors, getReceivers } from '../utils/storage';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  location: string;
  type: 'donor' | 'receiver';
}

const NoAPIAlertSystem: React.FC = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [contactTypeFilter, setContactTypeFilter] = useState<'all' | 'donors' | 'receivers'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get all contacts from storage
  const getAllContacts = (): Contact[] => {
    const donors = getDonors().map(donor => ({
      id: donor.id,
      name: donor.name,
      phone: donor.phone,
      email: donor.email,
      bloodGroup: donor.bloodGroup,
      location: donor.location,
      type: 'donor' as const
    }));

    const receivers = getReceivers().map(receiver => ({
      id: receiver.id,
      name: receiver.name,
      phone: receiver.phone,
      email: receiver.email,
      bloodGroup: receiver.bloodGroup,
      location: receiver.location,
      type: 'receiver' as const
    }));

    return [...donors, ...receivers];
  };

  const contacts = getAllContacts();
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const locations = [...new Set(contacts.map(c => c.location))];

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !bloodGroupFilter || contact.bloodGroup === bloodGroupFilter;
    const matchesLocation = !locationFilter || contact.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = contactTypeFilter === 'all' || contact.type === contactTypeFilter.slice(0, -1);
    
    return matchesSearch && matchesBloodGroup && matchesLocation && matchesType;
  });

  const generateWhatsAppLinks = () => {
    return selectedContacts.map(contact => {
      const message = encodeURIComponent(`🚨 *BloodCare Emergency Alert*

${alertMessage}

📞 *Emergency Hotline:* 9550953464
📧 *Email:* raaviramya46@gmail.com

_Your quick response can save lives!_

_Reply STOP to unsubscribe from alerts_`);
      return {
        name: contact.name,
        phone: contact.phone,
        bloodGroup: contact.bloodGroup,
        link: `https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=${message}`
      };
    });
  };

  const copyAllPhoneNumbers = () => {
    const phoneNumbers = selectedContacts.map(c => c.phone).join(', ');
    navigator.clipboard.writeText(phoneNumbers);
  };

  const downloadContactList = () => {
    const csvContent = [
      'Name,Phone,Email,Blood Group,Location,Type',
      ...selectedContacts.map(c => `${c.name},${c.phone},${c.email},${c.bloodGroup},${c.location},${c.type}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emergency_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendAlerts = () => {
    if (!alertMessage.trim() || selectedContacts.length === 0) return;
    setShowResults(true);
  };

  const resetForm = () => {
    setShowResults(false);
    setAlertMessage('');
    setSelectedContacts([]);
    setSearchTerm('');
    setBloodGroupFilter('');
    setLocationFilter('');
    setContactTypeFilter('all');
  };

  const alertTemplates = [
    {
      title: "Urgent Surgery",
      message: "URGENT: We need blood for an emergency surgery happening now. Patient's life depends on immediate blood donation. Please contact us ASAP if you can donate."
    },
    {
      title: "Critical Shortage",
      message: "CRITICAL BLOOD SHORTAGE: Our blood bank is running dangerously low. Multiple patients are waiting for blood. Your donation can save multiple lives today."
    },
    {
      title: "Mass Casualty",
      message: "MASS CASUALTY EVENT: Multiple victims need immediate blood transfusions. All available donors please respond immediately. This is a life-or-death emergency."
    },
    {
      title: "Specific Blood Type",
      message: "URGENT: We desperately need your specific blood type for a critical patient. No other blood type will work. Please contact us immediately if available."
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center mb-6">
        <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">WhatsApp Emergency Alert System</h2>
        <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          ✨ No API Required
        </span>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {/* Quick Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Alert Templates
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {alertTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setAlertMessage(template.message)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">{template.title}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{template.message.substring(0, 80)}...</div>
                </button>
              ))}
            </div>
          </div>

          {/* Alert Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Alert Message *
            </label>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Enter your emergency alert message... Be specific about the urgency and what type of help is needed."
            />
            <p className="text-sm text-gray-500 mt-1">
              Character count: {alertMessage.length} (WhatsApp supports long messages)
            </p>
          </div>

          {/* WhatsApp Info Banner */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center mb-2">
              <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-800">WhatsApp Alert System</h4>
            </div>
            <p className="text-sm text-green-700">
              Send emergency alerts directly through WhatsApp - the most reliable and widely used messaging platform. 
              Messages include formatting, emergency contact details, and are delivered instantly.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Find Recipients</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Name, phone, email..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroupFilter}
                  onChange={(e) => setBloodGroupFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={contactTypeFilter}
                  onChange={(e) => setContactTypeFilter(e.target.value as 'all' | 'donors' | 'receivers')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Contacts</option>
                  <option value="donors">Donors Only</option>
                  <option value="receivers">Receivers Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Recipients ({selectedContacts.length} of {filteredContacts.length} selected)
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedContacts(filteredContacts)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  Select All Filtered
                </button>
                <button
                  onClick={() => setSelectedContacts([])}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No contacts found matching your criteria</p>
                </div>
              ) : (
                filteredContacts.map((contact, index) => (
                  <label key={contact.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedContacts.some(c => c.id === contact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts([...selectedContacts, contact]);
                        } else {
                          setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
                        }
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{contact.name}</span>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                            {contact.bloodGroup}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            contact.type === 'donor' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {contact.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        📱 {contact.phone} • 📧 {contact.email} • 📍 {contact.location}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadContactList}
              disabled={selectedContacts.length === 0}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Download Selected ({selectedContacts.length})
            </button>
            <button
              onClick={copyAllPhoneNumbers}
              disabled={selectedContacts.length === 0}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4 inline mr-1" />
              Copy Phone Numbers
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendAlerts}
            disabled={!alertMessage.trim() || selectedContacts.length === 0}
            className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            Generate WhatsApp Links for {selectedContacts.length} Recipients
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Header */}
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800">WhatsApp Alert Links Generated Successfully!</h3>
            <p className="text-green-700">Click the WhatsApp links below to send emergency messages instantly</p>
            <div className="mt-3 text-sm text-green-600">
              📱 {selectedContacts.length} recipients • 🕒 Generated at {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Alert Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">WhatsApp Message Preview:</h4>
            <div className="bg-white p-4 rounded border text-sm text-gray-700 font-mono">
              <div className="text-red-600 font-bold">🚨 *BloodCare Emergency Alert*</div>
              <div className="mt-2">{alertMessage}</div>
              <div className="mt-3 text-blue-600">
                📞 *Emergency Hotline:* 9550953464<br/>
                📧 *Email:* raaviramya46@gmail.com
              </div>
              <div className="mt-2 text-gray-500 italic">
                _Your quick response can save lives!_<br/>
                _Reply STOP to unsubscribe from alerts_
              </div>
            </div>
          </div>

          {/* WhatsApp Links */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                WhatsApp Emergency Messages ({generateWhatsAppLinks().length})
              </h4>
              <button
                onClick={copyAllPhoneNumbers}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                <Copy className="w-4 h-4 inline mr-1" />
                Copy All Numbers
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {generateWhatsAppLinks().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        {item.bloodGroup}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm">{item.phone}</span>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm hover:shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Send WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={resetForm}
              className="flex-1 py-3 px-6 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Create New Alert
            </button>
            <button
              onClick={downloadContactList}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5 inline mr-2" />
              Download Contacts
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          📱 How WhatsApp Alerts Work:
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Instant Delivery:</strong> Messages are delivered immediately through WhatsApp</li>
          <li>• <strong>Rich Formatting:</strong> Supports bold text, emojis, and proper formatting</li>
          <li>• <strong>Read Receipts:</strong> You can see when recipients read your emergency messages</li>
          <li>• <strong>No Costs:</strong> Uses your existing WhatsApp - no additional charges</li>
          <li>• <strong>Universal Access:</strong> Works on all smartphones and WhatsApp Web</li>
          <li>• <strong>Reliable:</strong> WhatsApp has the highest message delivery rate globally</li>
          <li>• <strong>Two-Way Communication:</strong> Recipients can reply directly for immediate coordination</li>
        </ul>
      </div>
    </div>
  );
};

export default NoAPIAlertSystem;