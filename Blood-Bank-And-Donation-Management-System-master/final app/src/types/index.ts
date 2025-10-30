export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  age: number;
  address: string;
  medicalHistory?: string;
  role: 'donor' | 'receiver' | 'admin';
  registrationDate: string;
  lastDonation?: string;
  emergencyContact: string;
  status: 'active' | 'inactive';
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  age: number;
  address: string;
  medicalHistory: string;
  emergencyContact: string;
}