import { BloodType } from '../types';

export const bloodCompatibility: Record<BloodType, BloodType[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

export const canReceiveFrom = (receiverBloodType: BloodType, donorBloodType: BloodType): boolean => {
  return bloodCompatibility[receiverBloodType].includes(donorBloodType);
};

export const canDonateTo = (donorBloodType: BloodType): BloodType[] => {
  return Object.keys(bloodCompatibility).filter(bloodType => 
    bloodCompatibility[bloodType as BloodType].includes(donorBloodType)
  ) as BloodType[];
};