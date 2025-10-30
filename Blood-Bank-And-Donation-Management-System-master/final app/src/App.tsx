import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import { useUsers } from './hooks/useUsers';

type View = 'home' | 'register-donor' | 'register-receiver' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { users, currentUser, addUser, loginAsAdmin, logout } = useUsers();

  const handleRegistrationSuccess = () => {
    setTimeout(() => {
      setCurrentView('home');
    }, 2000);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onViewChange={setCurrentView} />;
      case 'register-donor':
        return (
          <RegistrationForm
            type="donor"
            onSubmit={addUser}
            onSuccess={handleRegistrationSuccess}
          />
        );
      case 'register-receiver':
        return (
          <RegistrationForm
            type="receiver"
            onSubmit={addUser}
            onSuccess={handleRegistrationSuccess}
          />
        );
      case 'admin':
        return <AdminDashboard users={users} />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onLogin={loginAsAdmin}
        onLogout={logout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;