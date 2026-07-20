import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as authService from '../../api/authService';

// "Roles & Permissions" nav section (master-admin only): assign a role + module
// permission to each member.
export default function RolesPermissionsTab({ members }) {
  const [draft, setDraft] = useState({ role: '', module: '', permission_level: 'view' });

  return (
    <div className="profile-content" key="roles-permissions">
      <section className="profile-section">
        <h2 className="profile-section-heading">Roles & Permissions</h2>
        <p className="profile-section-desc">
          Assign role and module-level permission to tenant members.
        </p>
        {members.map((m) => (
          <div
            key={m.id}
            style={{ border: '1px solid #ececec', borderRadius: 8, padding: 12, marginBottom: 10 }}
          >
            <div style={{ marginBottom: 8 }}>
              <strong>{m.full_name || m.name || m.email}</strong> - {m.email}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Input
                placeholder="Role (e.g. manager)"
                value={draft.role}
                onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))}
              />
              <Input
                placeholder="Module (e.g. user_management)"
                value={draft.module}
                onChange={(e) => setDraft((p) => ({ ...p, module: e.target.value }))}
              />
              <Input
                placeholder="Permission (view/edit/full...)"
                value={draft.permission_level}
                onChange={(e) => setDraft((p) => ({ ...p, permission_level: e.target.value }))}
              />
              <Button
                onClick={async () => {
                  await authService.updateMemberRolePermissions(m.id, {
                    role: draft.role,
                    module_permissions: [
                      { module: draft.module, permission_level: draft.permission_level },
                    ],
                  });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
