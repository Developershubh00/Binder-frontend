// Shared helpers for the Profile screen.

export const getInitials = (name, email) => {
  if (name) return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return '?';
};

export const getDisplayName = (user) =>
  user?.name ||
  [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
  user?.email ||
  'User';
