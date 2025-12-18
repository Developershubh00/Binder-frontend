import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import HomeContent from '../components/HomeContent';
import TasksContent from '../components/TasksContent';
import DepartmentContent from '../components/DepartmentContent';
import ProfileContent from '../components/ProfileContent';
import IMSContent from '../components/IMSContent';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    return [
      { id: 'home', label: 'Home' },
      { id: 'tasks', label: 'Tasks' },
      { id: 'department', label: 'Departments' },
      { id: 'ims', label: 'IMS' },
      { id: 'community', label: 'Community' },
      { id: 'profile', label: 'Profile' },
    ];
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeContent user={user} />;
      case 'tasks':
        return <TasksContent />;
      case 'department':
        return <DepartmentContent />;
      case 'ims':
        return <IMSContent />;
      case 'profile':
        return <ProfileContent user={user} />;
      case 'community':
        navigate('/community');
        return null;
      default:
        return <HomeContent user={user} />;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <div className="logo-icon-dash">B</div>
            <span className="logo-text-dash">Binder</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {getMenuItems().map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'community') {
                  navigate('/community');
                } else {
                  setActivePage(item.id);
                }
              }}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h2 className="page-title">Binder Dashboard</h2>
          </div>
          <div className="top-bar-right">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </div>
              <div className="user-details">
                <p className="user-name">{user?.name || user?.email || 'User'}</p>
                <p className="user-role">
                  {user?.role === 'master-admin' && 'Master Admin'}
                  {user?.role === 'manager' && 'Manager'}
                  {user?.role === 'tenant' && 'Tenant'}
                </p>
              </div>
            </div>
          </div>
        </header>
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;