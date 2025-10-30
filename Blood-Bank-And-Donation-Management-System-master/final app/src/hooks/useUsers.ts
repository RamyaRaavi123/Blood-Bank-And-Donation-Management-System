import { useState, useEffect } from 'react';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('bloodDonationUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    // Check for admin user
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('bloodDonationUsers', JSON.stringify(newUsers));
  };

  const addUser = (userData: Omit<User, 'id' | 'registrationDate' | 'status'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString(),
      status: 'active'
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
  };

  const loginAsAdmin = () => {
    const adminUser: User = {
      id: 'admin',
      name: 'Administrator',
      email: 'admin@lifeblood.com',
      phone: '',
      bloodType: 'O+',
      age: 30,
      address: '',
      role: 'admin',
      registrationDate: new Date().toISOString(),
      emergencyContact: '',
      status: 'active'
    };
    setCurrentUser(adminUser);
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const getDonors = () => users.filter(user => user.role === 'donor');
  const getReceivers = () => users.filter(user => user.role === 'receiver');

  return {
    users,
    currentUser,
    addUser,
    loginAsAdmin,
    logout,
    getDonors,
    getReceivers
  };
};