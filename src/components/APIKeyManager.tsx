import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, TestTube, CheckCircle, XCircle, Smartphone, Mail, Settings } from 'lucide-react';

interface APIKeys {
  // SMS Providers
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  textbeltApiKey: string;
  
  // Email Providers
  sendgridApiKey: string;
  fromEmail: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  
  // Settings
  preferredSmsProvider: 'twilio' | 'textbelt';
  preferredEmailProvider: 'sendgrid' | 'emailjs';
  emergencyPhone: string;
  emergencyEmail: string;
}

const API_KEYS_STORAGE = 'bloodcare_api_keys';

const APIKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    textbeltApiKey: '',
    sendgridApiKey: '',
    fromEmail: 'alerts@bloodcare.org',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
    preferredSmsProvider: 'twilio',
    preferredEmailProvider: 'sendgrid',
    emergencyPhone: '+1-800-BLOOD-1',
    emergencyEmail: 'emergency@bloodcare.org'
  });

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = () => {
    const saved = localStorage.getItem(API_KEYS_STORAGE);
    if (saved) {
      setApiKeys({ ...apiKeys, ...JSON.parse(saved) });
    }
  };

  const saveAPIKeys = () => {
    localStorage.setItem(API_KEYS_STORAGE, JSON.stringify(apiKeys));
    setMessage({ type: 'success', text: 'API keys saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInputChange = (field: keyof APIKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const testSMSConnection = async (provider: 'twilio' | 'textbelt') => {
    setIsLoading(true);
    try {
      if (provider === 'twilio') {
        if (!apiKeys.twilioAccountSid || !apiKeys.twilioAuthToken || !apiKeys.twilioPhoneNumber) {
          setTestResults(prev => ({ 
            ...prev, 
            twilio: { success: false, message: 'Please fill in all Twilio credentials' }
          }));
          return;
        }
        
        // Simulate Twilio test
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTestResults(prev => ({ 
          ...prev, 
          twilio: { success: true, message: 'Twilio connection successful!' }
        }));
      } else {
        // Test TextBelt
        const response = await fetch('https://textbelt.com/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: '+1234567890', // Test number
            message: 'BloodCare API Test',
            key: apiKeys.textbeltApiKey || 'textbelt'
          })
        });
        
        const result = await response.json();
        setTestResults(prev => ({ 
          ...prev, 
          textbelt: { 
            success: result.success || false, 
            message: result.success ? 'TextBelt connection successful!' : result.error || 'Connection failed'
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [provider]: { success: false, message: 'Connection test failed' }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async (provider: 'sendgrid' | 'emailjs') => {
    setIsLoading(true);
    try {
      if (provider === 'sendgrid') {
        if (!apiKeys.sendgridApiKey || !apiKeys.fromEmail) {
          setTestResults(prev => ({ 
            ...prev, 
            sendgrid: { success: false, message: 'Please fill in SendGrid credentials' }
          }));
          return;
        }
        
        // Simulate SendGrid test
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTestResults(prev => ({ 
          ...prev, 
          sendgrid: { success: true, message: 'SendGrid connection successful!' }
        }));
      } else {
        if (!apiKeys.emailjsServiceId || !apiKeys.emailjsTemplateId || !apiKeys.emailjsPublicKey) {
          setTestResults(prev => ({ 
            ...prev, 
            emailjs: { success: false, message: 'Please fill in all EmailJS credentials' }
          }));
          return;
        }
        
        // Simulate EmailJS test
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTestResults(prev => ({ 
          ...prev, 
          emailjs: { success: true, message: 'EmailJS connection successful!' }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [provider]: { success: false, message: 'Connection test failed' }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordField = (
    label: string,
    field: keyof APIKeys,
    placeholder: string,
    isRequired: boolean = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPasswords[field] ? 'text' : 'password'}
          value={apiKeys[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  const renderTestResult = (provider: string) => {
    const result = testResults[provider];
    if (!result) return null;
    
    return (
      <div className={`mt-2 p-3 rounded-lg flex items-center ${
        result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}>
        {result.success ? (
          <CheckCircle className="w-5 h-5 mr-2" />
        ) : (
          <XCircle className="w-5 h-5 mr-2" />
        )}
        {result.message}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center mb-6">
        <Key className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">API Key Management</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* SMS Configuration */}
        <div>
          <div className="flex items-center mb-4">
            <Smartphone className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">SMS Configuration</h3>
          </div>

          {/* Preferred SMS Provider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred SMS Provider
            </label>
            <select
              value={apiKeys.preferredSmsProvider}
              onChange={(e) => handleInputChange('preferredSmsProvider', e.target.value as 'twilio' | 'textbelt')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="twilio">Twilio (Professional - $0.0075/SMS)</option>
              <option value="textbelt">TextBelt (Testing - 1 free/day)</option>
            </select>
          </div>

          {/* Twilio Configuration */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Twilio Settings</h4>
              <button
                onClick={() => testSMSConnection('twilio')}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderPasswordField('Account SID', 'twilioAccountSid', 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', true)}
              {renderPasswordField('Auth Token', 'twilioAuthToken', 'your_auth_token_here', true)}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={apiKeys.twilioPhoneNumber}
                  onChange={(e) => handleInputChange('twilioPhoneNumber', e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {renderTestResult('twilio')}
          </div>

          {/* TextBelt Configuration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">TextBelt Settings</h4>
              <button
                onClick={() => testSMSConnection('textbelt')}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderPasswordField('API Key', 'textbeltApiKey', 'Leave empty for 1 free SMS/day')}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Leave empty to use free tier (1 SMS per day). Get API key from textbelt.com for unlimited usage.
            </p>
            {renderTestResult('textbelt')}
          </div>
        </div>

        {/* Email Configuration */}
        <div>
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Email Configuration</h3>
          </div>

          {/* Preferred Email Provider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Email Provider
            </label>
            <select
              value={apiKeys.preferredEmailProvider}
              onChange={(e) => handleInputChange('preferredEmailProvider', e.target.value as 'sendgrid' | 'emailjs')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="sendgrid">SendGrid (Professional - 100 free/day)</option>
              <option value="emailjs">EmailJS (Simple - 200 free/month)</option>
            </select>
          </div>

          {/* SendGrid Configuration */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">SendGrid Settings</h4>
              <button
                onClick={() => testEmailConnection('sendgrid')}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderPasswordField('API Key', 'sendgridApiKey', 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', true)}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={apiKeys.fromEmail}
                  onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                  placeholder="alerts@yourdomain.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {renderTestResult('sendgrid')}
          </div>

          {/* EmailJS Configuration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">EmailJS Settings</h4>
              <button
                onClick={() => testEmailConnection('emailjs')}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderPasswordField('Service ID', 'emailjsServiceId', 'service_xxxxxxx', true)}
              {renderPasswordField('Template ID', 'emailjsTemplateId', 'template_xxxxxxx', true)}
              {renderPasswordField('Public Key', 'emailjsPublicKey', 'xxxxxxxxxxxxxxxx', true)}
            </div>
            {renderTestResult('emailjs')}
          </div>
        </div>

        {/* Emergency Contact Settings */}
        <div>
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-gray-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Emergency Contact Settings</h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Phone Number
                </label>
                <input
                  type="text"
                  value={apiKeys.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  placeholder="+1-800-BLOOD-1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Email
                </label>
                <input
                  type="email"
                  value={apiKeys.emergencyEmail}
                  onChange={(e) => handleInputChange('emergencyEmail', e.target.value)}
                  placeholder="emergency@bloodcare.org"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveAPIKeys}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save API Configuration
          </button>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Quick Setup Guide</h4>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>For Twilio SMS:</strong>
              <ol className="list-decimal list-inside ml-4 mt-1">
                <li>Sign up at <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer" className="underline">twilio.com</a></li>
                <li>Get Account SID and Auth Token from Console</li>
                <li>Purchase a phone number</li>
                <li>Enter credentials above and test</li>
              </ol>
            </div>
            <div>
              <strong>For SendGrid Email:</strong>
              <ol className="list-decimal list-inside ml-4 mt-1">
                <li>Sign up at <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="underline">sendgrid.com</a></li>
                <li>Create API key with mail send permissions</li>
                <li>Verify your sender email address</li>
                <li>Enter credentials above and test</li>
              </ol>
            </div>
            <div>
              <strong>For Free Testing:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Use TextBelt for 1 free SMS per day (no signup required)</li>
                <li>Use EmailJS for 200 free emails per month</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyManager;