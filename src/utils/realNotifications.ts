// Real SMS and Email Integration Service
// This file shows how to integrate with actual SMS and email services

export interface SMSProvider {
  sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface EmailProvider {
  sendEmail(email: string, subject: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Twilio SMS Integration
export class TwilioSMSProvider implements SMSProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  async sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In a real implementation, you would use the Twilio SDK
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: phoneNumber,
          Body: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, messageId: data.sid };
      } else {
        const error = await response.text();
        return { success: false, error };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// SendGrid Email Integration
export class SendGridEmailProvider implements EmailProvider {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async sendEmail(email: string, subject: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email }],
            subject,
          }],
          from: { email: this.fromEmail },
          content: [{
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
                  <h1>🚨 BloodCare Emergency Alert</h1>
                </div>
                <div style="padding: 20px; background: #f9f9f9;">
                  <h2>${subject}</h2>
                  <p style="font-size: 16px; line-height: 1.6;">${message}</p>
                  <div style="margin-top: 30px; padding: 15px; background: #fee2e2; border-left: 4px solid #dc2626;">
                    <p><strong>🚨 This is an urgent blood donation request</strong></p>
                    <p>Please contact us immediately if you can help:</p>
                    <p>📞 Emergency Hotline: 9550953464</p>
                    <p>📧 Email: raaviramya46@gmail.com</p>
                  </div>
                </div>
                <div style="background: #374151; color: white; padding: 15px; text-align: center;">
                  <p>BloodCare - Saving Lives, One Donation at a Time</p>
                </div>
              </div>
            `
          }]
        }),
      });

      if (response.ok) {
        return { success: true, messageId: response.headers.get('X-Message-Id') || 'sent' };
      } else {
        const error = await response.text();
        return { success: false, error };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Configuration for real services
export const SMS_CONFIG = {
  // Twilio Configuration
  TWILIO_ACCOUNT_SID: process.env.VITE_TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.VITE_TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.VITE_TWILIO_PHONE_NUMBER || '',
  
  // Alternative SMS Services
  TEXTBELT_API_KEY: process.env.VITE_TEXTBELT_API_KEY || '',
};

export const EMAIL_CONFIG = {
  // SendGrid Configuration
  SENDGRID_API_KEY: process.env.VITE_SENDGRID_API_KEY || '',
  FROM_EMAIL: process.env.VITE_FROM_EMAIL || 'raaviramya46@gmail.com',
  
  // Alternative: EmailJS Configuration
  EMAILJS_SERVICE_ID: process.env.VITE_EMAILJS_SERVICE_ID || '',
  EMAILJS_TEMPLATE_ID: process.env.VITE_EMAILJS_TEMPLATE_ID || '',
  EMAILJS_PUBLIC_KEY: process.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

// Real notification sender
export const sendRealNotifications = async (
  recipients: Array<{ phone: string; email: string; name: string }>,
  alert: { title: string; message: string; priority: string }
): Promise<{ smsResults: any; emailResults: any }> => {
  
  // Initialize providers
  const smsProvider = new TwilioSMSProvider(
    SMS_CONFIG.TWILIO_ACCOUNT_SID,
    SMS_CONFIG.TWILIO_AUTH_TOKEN,
    SMS_CONFIG.TWILIO_PHONE_NUMBER
  );
  
  const emailProvider = new SendGridEmailProvider(
    EMAIL_CONFIG.SENDGRID_API_KEY,
    EMAIL_CONFIG.FROM_EMAIL
  );

  // Send SMS messages
  const smsPromises = recipients.map(async (recipient) => {
    const smsMessage = `🚨 ${alert.title}\n\nHi ${recipient.name}, ${alert.message}\n\nCall: 9550953464\n\nBloodCare Emergency`;
    return await smsProvider.sendSMS(recipient.phone, smsMessage);
  });

  // Send emails
  const emailPromises = recipients.map(async (recipient) => {
    return await emailProvider.sendEmail(
      recipient.email,
      `🚨 ${alert.title}`,
      alert.message
    );
  });

  // Wait for all to complete
  const smsResults = await Promise.allSettled(smsPromises);
  const emailResults = await Promise.allSettled(emailPromises);

  return { smsResults, emailResults };
};

// Alternative: Simple SMS using TextBelt (for testing)
export const sendTestSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
  try {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        key: SMS_CONFIG.TEXTBELT_API_KEY || 'textbelt', // 'textbelt' for 1 free message per day
      }),
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};

// Alternative: Email using EmailJS (client-side)
export const sendTestEmail = async (email: string, subject: string, message: string): Promise<boolean> => {
  try {
    // This would require EmailJS library: npm install @emailjs/browser
    // import emailjs from '@emailjs/browser';
    
    // const result = await emailjs.send(
    //   EMAIL_CONFIG.EMAILJS_SERVICE_ID,
    //   EMAIL_CONFIG.EMAILJS_TEMPLATE_ID,
    //   {
    //     to_email: email,
    //     subject: subject,
    //     message: message,
    //   },
    //   EMAIL_CONFIG.EMAILJS_PUBLIC_KEY
    // );
    
    // return result.status === 200;
    
    console.log('Email would be sent to:', email, 'Subject:', subject);
    return true; // Simulated for now
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};