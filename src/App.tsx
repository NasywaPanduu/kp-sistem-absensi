import React, { useState, useEffect } from 'react';
import { User } from './types';
import { storage } from './utils/storage';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      {currentUser.role === 'admin' ? (
        <AdminDashboard user={currentUser} />
      ) : (
        <TeacherDashboard user={currentUser} />
      )}
    </Layout>
  );
}

export default App;