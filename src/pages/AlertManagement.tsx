import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, MapPin, Droplets, Bell, MessageSquare } from 'lucide-react';
import { getDonors, getReceivers } from '../utils/storage';
import NoAPIAlertSystem from '../components/NoAPIAlertSystem';

const AlertManagement: React.FC = () => {
  const donors = getDonors();
  const receivers = getReceivers();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            WhatsApp Emergency Alert System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Send urgent notifications to donors and receivers instantly via WhatsApp - no API keys required!
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{donors.length}</div>
                <div className="text-gray-600">Available Donors</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{receivers.length}</div>
                <div className="text-gray-600">Active Requests</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-gray-600">Delivery Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">FREE</div>
                <div className="text-gray-600">No API Costs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Banner */}
        <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">✨ WhatsApp Alert System Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Instant Delivery</h3>
                <p className="text-sm opacity-90">Messages sent immediately</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Universal Access</h3>
                <p className="text-sm opacity-90">Everyone has WhatsApp</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Read Receipts</h3>
                <p className="text-sm opacity-90">See who read messages</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Two-Way Chat</h3>
                <p className="text-sm opacity-90">Recipients can reply</p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Alert System */}
        <NoAPIAlertSystem />

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How WhatsApp Alerts Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Write Emergency Alert</h4>
              <p className="text-gray-600">Type your urgent message and select recipients from your donor/receiver database.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Generate WhatsApp Links</h4>
              <p className="text-gray-600">System creates clickable WhatsApp links with pre-filled emergency messages and contact details.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Send Messages</h4>
              <p className="text-gray-600">Click each WhatsApp link to open the app and send formatted emergency messages instantly.</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact Info */}
        <div className="mt-8 bg-red-50 rounded-2xl p-8 border border-red-200">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Emergency Contact Information</h3>
            <p className="text-red-700 mb-4">This information will be included in all WhatsApp alert messages</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-semibold text-red-800">Emergency Hotline: 9550953464</span>
              </div>
              <div className="flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-semibold text-red-800">Email: raaviramya46@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Advantages */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Why WhatsApp for Emergency Alerts?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Highest Delivery Rate</h4>
                  <p className="text-sm text-gray-600">99.9% message delivery success rate globally</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Instant Read Receipts</h4>
                  <p className="text-sm text-gray-600">See exactly who received and read your emergency alerts</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Rich Formatting</h4>
                  <p className="text-sm text-gray-600">Bold text, emojis, and proper formatting for clear emergency messages</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Two-Way Communication</h4>
                  <p className="text-sm text-gray-600">Recipients can reply immediately for real-time coordination</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Universal Access</h4>
                  <p className="text-sm text-gray-600">Works on all smartphones and WhatsApp Web browsers</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">No Additional Costs</h4>
                  <p className="text-sm text-gray-600">Uses existing WhatsApp - no API fees or setup costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertManagement;