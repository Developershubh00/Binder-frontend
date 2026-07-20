import { Button } from '@/components/ui/button';

// "Account" nav section: read-only user details + a (disabled) password form.
export default function AccountTab({ displayName, user }) {
  return (
    <div className="profile-content" key="account">
      {/* Account section */}
      <section className="profile-section">
        <h2 className="profile-section-heading">Account</h2>
        <div className="profile-form-grid">
          <div className="profile-field">
            <label className="profile-label">Name</label>
            <div className="profile-input-static">{displayName}</div>
          </div>
          <div className="profile-field">
            <label className="profile-label">Email</label>
            <div className="profile-input-static">{user?.email || '—'}</div>
          </div>
          <div className="profile-field">
            <label className="profile-label">Role</label>
            <div className="profile-input-static">{user?.highest_role || user?.role || '—'}</div>
          </div>
          {user?.designation && (
            <div className="profile-field">
              <label className="profile-label">Designation</label>
              <div className="profile-input-static">{user.designation}</div>
            </div>
          )}
        </div>
      </section>

      <div className="profile-divider" />

      {/* Change Password section */}
      <section className="profile-section">
        <h2 className="profile-section-heading">Your Password</h2>
        <p className="profile-section-desc">
          To change your password, contact your administrator or use the forgot password flow on
          the login screen.
        </p>
        <div className="profile-form-grid">
          <div className="profile-field">
            <label className="profile-label">New Password</label>
            <input type="password" className="profile-input" placeholder="••••••••••" disabled />
          </div>
          <div className="profile-field">
            <label className="profile-label">Repeat New Password</label>
            <input type="password" className="profile-input" placeholder="••••••••••" disabled />
          </div>
        </div>
        <Button disabled className="profile-btn profile-btn--disabled">
          Update Password
        </Button>
      </section>
    </div>
  );
}
