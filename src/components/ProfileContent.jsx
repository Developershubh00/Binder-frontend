import React from 'react';

const ProfileContent = ({ user }) => {
  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Profile</h1>
      <p className="dashboard-subtitle">
        Manage your profile settings and personal information.
      </p>
      <div className="profile-info">
        <div className="profile-card">
          <div className="user-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-details">
            <h3>{user?.name || user?.email}</h3>
            <p className="role-badge">
              {user?.role === 'master-admin' && 'Master Admin'}
              {user?.role === 'manager' && 'Manager'}
              {user?.role === 'tenant' && 'Tenant'}
            </p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;