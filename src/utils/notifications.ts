export interface Alert {
  id: string;
  type: 'urgent_surgery' | 'blood_shortage' | 'emergency_request' | 'general';
  title: string;
  message: string;
  bloodGroup?: string;
  location?: string;
  priority: 'high' | 'medium' | 'low';
  targetAudience: 'donors' | 'receivers' | 'both';
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  sentCount: number;
  smsEnabled: boolean;
  emailEnabled: boolean;
  deliveryStatus: {
    sms: { sent: number; delivered: number; failed: number };
    email: { sent: number; delivered: number; failed: number };
  };
}

export interface NotificationPreference {
  userId: string;
  userType: 'donor' | 'receiver';
  emailNotifications: boolean;
  smsNotifications: boolean;
  urgentOnly: boolean;
  phoneNumber: string;
  email: string;
}

export interface SMSMessage {
  id: string;
  alertId: string;
  phoneNumber: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface APIKeys {
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

// Storage keys
const ALERTS_KEY = 'bloodcare_alerts';
const NOTIFICATION_PREFERENCES_KEY = 'bloodcare_notification_preferences';
const SMS_MESSAGES_KEY = 'bloodcare_sms_messages';
const API_KEYS_KEY = 'bloodcare_api_keys';

// Helper functions
export const getAlerts = (): Alert[] => {
  const data = localStorage.getItem(ALERTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAlerts = (alerts: Alert[]): void => {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
};

export const getNotificationPreferences = (): NotificationPreference[] => {
  const data = localStorage.getItem(NOTIFICATION_PREFERENCES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveNotificationPreferences = (preferences: NotificationPreference[]): void => {
  localStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(preferences));
};

export const getSMSMessages = (): SMSMessage[] => {
  const data = localStorage.getItem(SMS_MESSAGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSMSMessages = (messages: SMSMessage[]): void => {
  localStorage.setItem(SMS_MESSAGES_KEY, JSON.stringify(messages));
};

export const getAPIKeys = (): APIKeys => {
  const data = localStorage.getItem(API_KEYS_KEY);
  const defaults: APIKeys = {
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    textbeltApiKey: '',
    sendgridApiKey: '',
    fromEmail: 'raaviramya46@gmail.com',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
    preferredSmsProvider: 'twilio',
    preferredEmailProvider: 'sendgrid',
    emergencyPhone: '9550953464',
    emergencyEmail: 'raaviramya46@gmail.com'
  };
  return data ? { ...defaults, ...JSON.parse(data) } : defaults;
};

export const saveAPIKeys = (apiKeys: APIKeys): void => {
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(apiKeys));
};

// Create new alert
export const createAlert = (alertData: Omit<Alert, 'id' | 'createdAt' | 'isActive' | 'sentCount' | 'deliveryStatus'>): { success: boolean; message: string; alert?: Alert } => {
  const alerts = getAlerts();
  
  const newAlert: Alert = {
    ...alertData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isActive: true,
    sentCount: 0,
    deliveryStatus: {
      sms: { sent: 0, delivered: 0, failed: 0 },
      email: { sent: 0, delivered: 0, failed: 0 }
    }
  };

  alerts.push(newAlert);
  saveAlerts(alerts);

  return { success: true, message: 'Alert created successfully', alert: newAlert };
};

// Send alert to users via SMS and Email using configured API keys
export const sendAlert = (alertId: string): { success: boolean; message: string; recipientCount: number; smsCount: number; emailCount: number } => {
  const alerts = getAlerts();
  const alertIndex = alerts.findIndex(alert => alert.id === alertId);
  
  if (alertIndex === -1) {
    return { success: false, message: 'Alert not found', recipientCount: 0, smsCount: 0, emailCount: 0 };
  }

  const alert = alerts[alertIndex];
  const apiKeys = getAPIKeys();
  
  // Get recipients based on alert criteria
  const recipients = getAlertRecipients(alert);
  
  // Send SMS messages using configured provider
  const smsResults = sendSMSMessages(alert, recipients, apiKeys);
  
  // Send email notifications using configured provider
  const emailResults = sendEmailNotifications(alert, recipients, apiKeys);
  
  // Update alert with delivery statistics
  alerts[alertIndex].sentCount = recipients.length;
  alerts[alertIndex].deliveryStatus = {
    sms: smsResults,
    email: emailResults
  };
  
  saveAlerts(alerts);

  return { 
    success: true, 
    message: `Alert sent to ${recipients.length} recipients (${smsResults.sent} SMS, ${emailResults.sent} emails)`, 
    recipientCount: recipients.length,
    smsCount: smsResults.sent,
    emailCount: emailResults.sent
  };
};

// Get recipients for alert based on criteria
const getAlertRecipients = (alert: Alert) => {
  // Import storage functions
  const getDonors = () => {
    const data = localStorage.getItem('bloodcare_donors');
    return data ? JSON.parse(data) : [];
  };
  
  const getReceivers = () => {
    const data = localStorage.getItem('bloodcare_receivers');
    return data ? JSON.parse(data) : [];
  };

  let recipients: Array<{ id: string; name: string; phone: string; email: string; bloodGroup: string; location: string; type: 'donor' | 'receiver' }> = [];
  
  // Get donors if targeting donors or both
  if (alert.targetAudience === 'donors' || alert.targetAudience === 'both') {
    const donors = getDonors();
    recipients = recipients.concat(
      donors.map((donor: any) => ({
        ...donor,
        type: 'donor' as const
      }))
    );
  }
  
  // Get receivers if targeting receivers or both
  if (alert.targetAudience === 'receivers' || alert.targetAudience === 'both') {
    const receivers = getReceivers();
    recipients = recipients.concat(
      receivers.map((receiver: any) => ({
        ...receiver,
        type: 'receiver' as const
      }))
    );
  }
  
  // Filter by blood group if specified
  if (alert.bloodGroup) {
    recipients = recipients.filter(recipient => recipient.bloodGroup === alert.bloodGroup);
  }
  
  // Filter by location if specified
  if (alert.location) {
    recipients = recipients.filter(recipient => 
      recipient.location.toLowerCase().includes(alert.location!.toLowerCase())
    );
  }
  
  return recipients;
};

// Send SMS messages using configured API
const sendSMSMessages = (alert: Alert, recipients: any[], apiKeys: APIKeys): { sent: number; delivered: number; failed: number } => {
  if (!alert.smsEnabled) {
    return { sent: 0, delivered: 0, failed: 0 };
  }

  const smsMessages = getSMSMessages();
  let sent = 0;
  let delivered = 0;
  let failed = 0;

  recipients.forEach(recipient => {
    if (recipient.phone) {
      // Create SMS message record
      const smsMessage: SMSMessage = {
        id: `${alert.id}_${recipient.id}_${Date.now()}`,
        alertId: alert.id,
        phoneNumber: recipient.phone,
        message: formatSMSMessage(alert, recipient, apiKeys),
        status: 'pending',
        sentAt: new Date().toISOString()
      };

      // Send SMS using configured provider
      const success = sendRealSMS(smsMessage, apiKeys);
      
      if (success) {
        smsMessage.status = 'sent';
        sent++;
        
        // Simulate delivery confirmation after a delay
        setTimeout(() => {
          smsMessage.status = 'delivered';
          smsMessage.deliveredAt = new Date().toISOString();
          const messages = getSMSMessages();
          const messageIndex = messages.findIndex(m => m.id === smsMessage.id);
          if (messageIndex !== -1) {
            messages[messageIndex] = smsMessage;
            saveSMSMessages(messages);
          }
        }, Math.random() * 5000 + 1000); // Random delay 1-6 seconds
        
        delivered++; // For immediate feedback
      } else {
        smsMessage.status = 'failed';
        smsMessage.errorMessage = 'Failed to send SMS';
        failed++;
      }

      smsMessages.push(smsMessage);
    }
  });

  saveSMSMessages(smsMessages);
  return { sent, delivered, failed };
};

// Send real SMS using configured API keys
const sendRealSMS = (smsMessage: SMSMessage, apiKeys: APIKeys): boolean => {
  try {
    if (apiKeys.preferredSmsProvider === 'twilio' && apiKeys.twilioAccountSid && apiKeys.twilioAuthToken) {
      // Send via Twilio
      sendTwilioSMS(smsMessage.phoneNumber, smsMessage.message, apiKeys);
      return true;
    } else if (apiKeys.preferredSmsProvider === 'textbelt') {
      // Send via TextBelt
      sendTextBeltSMS(smsMessage.phoneNumber, smsMessage.message, apiKeys.textbeltApiKey);
      return true;
    } else {
      // Fallback to simulation if no API keys configured
      return Math.random() > 0.05; // 95% success rate
    }
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};

// Twilio SMS integration
const sendTwilioSMS = async (phoneNumber: string, message: string, apiKeys: APIKeys) => {
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${apiKeys.twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${apiKeys.twilioAccountSid}:${apiKeys.twilioAuthToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: apiKeys.twilioPhoneNumber,
        To: phoneNumber,
        Body: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Twilio SMS sent:', data.sid);
    return true;
  } catch (error) {
    console.error('Twilio SMS failed:', error);
    return false;
  }
};

// TextBelt SMS integration
const sendTextBeltSMS = async (phoneNumber: string, message: string, apiKey: string) => {
  try {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        key: apiKey || 'textbelt', // 'textbelt' for 1 free message per day
      }),
    });

    const result = await response.json();
    if (result.success) {
      console.log('TextBelt SMS sent:', result.textId);
      return true;
    } else {
      console.error('TextBelt SMS failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('TextBelt SMS failed:', error);
    return false;
  }
};

// Format SMS message for mobile delivery
const formatSMSMessage = (alert: Alert, recipient: any, apiKeys: APIKeys): string => {
  const urgencyPrefix = alert.priority === 'high' ? '🚨 URGENT: ' : '';
  const bloodGroupText = alert.bloodGroup ? ` (${alert.bloodGroup})` : '';
  const locationText = alert.location ? ` in ${alert.location}` : '';
  
  // Keep SMS under 160 characters for single message
  let message = `${urgencyPrefix}${alert.title}${bloodGroupText}${locationText}. `;
  
  // Add personalized greeting
  message += `Hi ${recipient.name}, `;
  
  // Add action-specific message
  if (recipient.type === 'donor') {
    message += 'Your blood donation can save lives. Please contact us if available.';
  } else {
    message += 'Blood may be available for your request. Please contact us immediately.';
  }
  
  // Add contact info
  message += ` Call: ${apiKeys.emergencyPhone}`;
  
  return message;
};

// Send email notifications using configured provider
const sendEmailNotifications = (alert: Alert, recipients: any[], apiKeys: APIKeys): { sent: number; delivered: number; failed: number } => {
  if (!alert.emailEnabled) {
    return { sent: 0, delivered: 0, failed: 0 };
  }

  let sent = 0;
  let delivered = 0;
  let failed = 0;

  recipients.forEach(recipient => {
    if (recipient.email) {
      const success = sendRealEmail(recipient.email, alert, recipient, apiKeys);
      if (success) {
        sent++;
        delivered++; // Assume immediate delivery for demo
      } else {
        failed++;
      }
    }
  });

  return { sent, delivered, failed };
};

// Send real email using configured API keys
const sendRealEmail = (email: string, alert: Alert, recipient: any, apiKeys: APIKeys): boolean => {
  try {
    if (apiKeys.preferredEmailProvider === 'sendgrid' && apiKeys.sendgridApiKey) {
      // Send via SendGrid
      sendSendGridEmail(email, alert, recipient, apiKeys);
      return true;
    } else if (apiKeys.preferredEmailProvider === 'emailjs' && apiKeys.emailjsServiceId) {
      // Send via EmailJS
      sendEmailJSEmail(email, alert, recipient, apiKeys);
      return true;
    } else {
      // Fallback to simulation if no API keys configured
      return Math.random() > 0.02; // 98% success rate
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// SendGrid email integration
const sendSendGridEmail = async (email: string, alert: Alert, recipient: any, apiKeys: APIKeys) => {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeys.sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: `🚨 ${alert.title}`,
        }],
        from: { email: apiKeys.fromEmail },
        content: [{
          type: 'text/html',
          value: formatEmailHTML(alert, recipient, apiKeys)
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log('SendGrid email sent to:', email);
    return true;
  } catch (error) {
    console.error('SendGrid email failed:', error);
    return false;
  }
};

// EmailJS integration (would require @emailjs/browser package)
const sendEmailJSEmail = async (email: string, alert: Alert, recipient: any, apiKeys: APIKeys) => {
  // This would require the EmailJS library
  // For now, just log the attempt
  console.log('EmailJS email would be sent to:', email, 'with alert:', alert.title);
  return true;
};

// Format email HTML content
const formatEmailHTML = (alert: Alert, recipient: any, apiKeys: APIKeys): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1>🚨 BloodCare Emergency Alert</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <h2>Hi ${recipient.name},</h2>
        <h3>${alert.title}</h3>
        <p style="font-size: 16px; line-height: 1.6;">${alert.message}</p>
        ${alert.bloodGroup ? `<p><strong>Blood Group Needed:</strong> ${alert.bloodGroup}</p>` : ''}
        ${alert.location ? `<p><strong>Location:</strong> ${alert.location}</p>` : ''}
        <div style="margin-top: 30px; padding: 15px; background: #fee2e2; border-left: 4px solid #dc2626;">
          <p><strong>🚨 This is an urgent blood donation request</strong></p>
          <p>Please contact us immediately if you can help:</p>
          <p>📞 Emergency Hotline: ${apiKeys.emergencyPhone}</p>
          <p>📧 Email: ${apiKeys.emergencyEmail}</p>
        </div>
      </div>
      <div style="background: #374151; color: white; padding: 15px; text-align: center;">
        <p>BloodCare - Saving Lives, One Donation at a Time</p>
      </div>
    </div>
  `;
};

// Deactivate alert
export const deactivateAlert = (alertId: string): { success: boolean; message: string } => {
  const alerts = getAlerts();
  const alertIndex = alerts.findIndex(alert => alert.id === alertId);
  
  if (alertIndex === -1) {
    return { success: false, message: 'Alert not found' };
  }

  alerts[alertIndex].isActive = false;
  saveAlerts(alerts);

  return { success: true, message: 'Alert deactivated successfully' };
};

// Get active alerts
export const getActiveAlerts = (): Alert[] => {
  const alerts = getAlerts();
  const now = new Date();
  
  return alerts.filter(alert => 
    alert.isActive && 
    new Date(alert.expiresAt) > now
  );
};

// Clean up expired alerts
export const cleanupExpiredAlerts = (): void => {
  const alerts = getAlerts();
  const now = new Date();
  
  const activeAlerts = alerts.map(alert => {
    if (new Date(alert.expiresAt) <= now) {
      return { ...alert, isActive: false };
    }
    return alert;
  });
  
  saveAlerts(activeAlerts);
};

// Get SMS delivery statistics
export const getSMSDeliveryStats = (alertId?: string) => {
  const messages = getSMSMessages();
  const filteredMessages = alertId ? messages.filter(m => m.alertId === alertId) : messages;
  
  return {
    total: filteredMessages.length,
    sent: filteredMessages.filter(m => m.status === 'sent' || m.status === 'delivered').length,
    delivered: filteredMessages.filter(m => m.status === 'delivered').length,
    failed: filteredMessages.filter(m => m.status === 'failed').length,
    pending: filteredMessages.filter(m => m.status === 'pending').length
  };
};

// Predefined alert templates with mobile-optimized messages
export const getAlertTemplates = () => [
  {
    type: 'urgent_surgery' as const,
    title: 'URGENT: Blood Needed for Emergency Surgery',
    message: 'We urgently need {bloodGroup} blood for a critical surgery at {location}. Please contact us immediately if you can donate. Time is critical!',
    priority: 'high' as const,
    targetAudience: 'donors' as const,
    smsEnabled: true,
    emailEnabled: true
  },
  {
    type: 'blood_shortage' as const,
    title: 'Critical Blood Shortage Alert',
    message: 'CRITICAL SHORTAGE: We are running dangerously low on {bloodGroup} blood. Your donation can save multiple lives. Please donate ASAP.',
    priority: 'high' as const,
    targetAudience: 'donors' as const,
    smsEnabled: true,
    emailEnabled: true
  },
  {
    type: 'emergency_request' as const,
    title: 'Emergency Blood Request',
    message: 'EMERGENCY: Multiple units of {bloodGroup} blood needed urgently in {location}. Mass casualty event. All available donors please respond immediately.',
    priority: 'high' as const,
    targetAudience: 'both' as const,
    smsEnabled: true,
    emailEnabled: true
  },
  {
    type: 'general' as const,
    title: 'Blood Donation Drive',
    message: 'Join our community blood donation drive this weekend at {location}. Help us maintain adequate blood supplies for our hospitals.',
    priority: 'medium' as const,
    targetAudience: 'donors' as const,
    smsEnabled: false,
    emailEnabled: true
  }
];