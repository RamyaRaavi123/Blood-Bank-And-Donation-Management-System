export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  location: string;
  lastDonationDate: string | null;
  registrationDate: string;
}

export interface Receiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  location: string;
  reason: string;
  registrationDate: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: string;
  location: string;
  donationDate: string;
  recordedAt: string;
}

export interface Stats {
  totalDonors: number;
  totalReceivers: number;
  totalDonations: number;
  bloodGroupStats: Record<string, number>;
}

// Storage keys
const DONORS_KEY = 'bloodcare_donors';
const RECEIVERS_KEY = 'bloodcare_receivers';
const DONATIONS_KEY = 'bloodcare_donations';

// Helper functions
export const getDonors = (): Donor[] => {
  const data = localStorage.getItem(DONORS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getReceivers = (): Receiver[] => {
  const data = localStorage.getItem(RECEIVERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getDonations = (): Donation[] => {
  const data = localStorage.getItem(DONATIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDonors = (donors: Donor[]): void => {
  localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
};

export const saveReceivers = (receivers: Receiver[]): void => {
  localStorage.setItem(RECEIVERS_KEY, JSON.stringify(receivers));
};

export const saveDonations = (donations: Donation[]): void => {
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
};

// API-like functions
export const registerDonor = (donorData: Omit<Donor, 'id' | 'registrationDate'>): { success: boolean; message: string; donor?: Donor } => {
  const donors = getDonors();
  
  // Check if donor already exists
  const existingDonor = donors.find(donor => 
    donor.email.toLowerCase() === donorData.email.toLowerCase() || 
    donor.phone === donorData.phone
  );
  
  if (existingDonor) {
    return { success: false, message: 'You already have an account.' };
  }

  const newDonor: Donor = {
    ...donorData,
    id: Date.now().toString(),
    email: donorData.email.toLowerCase(),
    registrationDate: new Date().toISOString()
  };

  donors.push(newDonor);
  saveDonors(donors);

  return { success: true, message: 'Donor registered successfully', donor: newDonor };
};

export const registerReceiver = (receiverData: Omit<Receiver, 'id' | 'registrationDate'>): { success: boolean; message: string; receiver?: Receiver } => {
  const receivers = getReceivers();
  
  // Check if receiver already exists
  const existingReceiver = receivers.find(receiver => 
    receiver.email.toLowerCase() === receiverData.email.toLowerCase() || 
    receiver.phone === receiverData.phone
  );
  
  if (existingReceiver) {
    return { success: false, message: 'You already have an account.' };
  }

  const newReceiver: Receiver = {
    ...receiverData,
    id: Date.now().toString(),
    email: receiverData.email.toLowerCase(),
    registrationDate: new Date().toISOString()
  };

  receivers.push(newReceiver);
  saveReceivers(receivers);

  return { success: true, message: 'Receiver registered successfully', receiver: newReceiver };
};

export const recordDonation = (emailOrPhone: string, donationDate: string): { success: boolean; message: string; donation?: Donation } => {
  const donors = getDonors();
  
  // Find donor
  const donorIndex = donors.findIndex(donor => 
    donor.email.toLowerCase() === emailOrPhone.toLowerCase() || 
    donor.phone === emailOrPhone
  );
  
  if (donorIndex === -1) {
    return { success: false, message: 'Please register as a donor first.' };
  }

  // Update donor's last donation date
  donors[donorIndex].lastDonationDate = donationDate;
  saveDonors(donors);

  // Record donation
  const donations = getDonations();
  const newDonation: Donation = {
    id: Date.now().toString(),
    donorId: donors[donorIndex].id,
    donorName: donors[donorIndex].name,
    bloodGroup: donors[donorIndex].bloodGroup,
    location: donors[donorIndex].location,
    donationDate,
    recordedAt: new Date().toISOString()
  };

  donations.push(newDonation);
  saveDonations(donations);

  return { success: true, message: 'Blood donation recorded successfully', donation: newDonation };
};

export const getStats = (): Stats => {
  const donors = getDonors();
  const receivers = getReceivers();
  const donations = getDonations();

  const bloodGroupStats = donors.reduce((acc, donor) => {
    acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalDonors: donors.length,
    totalReceivers: receivers.length,
    totalDonations: donations.length,
    bloodGroupStats
  };
};