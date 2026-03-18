# Binder: New User Journey — From Start to Dashboard

This document describes the **phases a new user goes through** when using Binder, and how frontend and backend stay **aligned** from first visit to the dashboard.

---

## Overview

| Phase | Where | What happens |
|-------|--------|----------------|
| **0** | Outside app | User is created (invite or admin) and receives login details |
| **1** | Entry | App loads → unauthenticated users go to **Login** |
| **2** | Login | User signs in → backend returns user + role → **role-based redirect** |
| **3** | First landing | User hits **Dashboard** → if onboarding not complete → **redirect to Onboarding** |
| **4** | Onboarding | 4-step company setup → on Step 4 save → **onboarding_completed = true** → **Dashboard** |
| **5** | Dashboard | User sees company dashboard and can use the app |

---

## Phase 0: User Creation (Before First Login)

- **Invite flow (typical):** An admin (or master admin) creates the user (Django admin or API), then sends an **invite email** (Profile → “Send invite email” or API `POST /api/auth/send-invite/`) with a **temporary password** and login link.
- **Backend:** User is linked to a **Tenant**. Tenant has `onboarding_completed = False` until onboarding is finished.
- **Result:** New user has email + (temp) password and knows the app URL (e.g. production frontend). There is no public self-signup route in the app; the Login page has a “Sign Up” link that currently does not map to a dedicated register route.

**Alignment:** User record and Tenant exist before first login; `onboarding_completed` drives whether they see Onboarding or Dashboard after login.

---

## Phase 1: Entry (First Visit)

| Step | Frontend | Backend |
|------|----------|---------|
| User opens app | `App.jsx`: `/` → `<Navigate to="/login" />` | — |
| Protected routes | `ProtectedRoute`: if not `isAuthenticated` → redirect to `/login` | — |
| Auth state | `AuthContext`: on load, reads stored token/user; if valid, calls `api.getCurrentUser()` and sets `user` | `GET /api/auth/me/` returns user + `tenant_details` (includes `onboarding_completed`) |

**Alignment:** Default entry is always Login unless the user already has a valid session (token + successful `/me`).

---

## Phase 2: Login and Role-Based Redirect

| Step | Frontend | Backend |
|------|----------|---------|
| User submits email/password | `Login.jsx`: `login(credentials)` → `api.login(credentials)` | `POST /api/auth/login/` validates credentials, returns JWT + **user** (including `highest_role`, `tenant_details`) |
| Success | `AuthContext` sets `user`, `isAuthenticated`; Login shows success and redirects by **role** | — |
| Redirect by role | `Login.jsx`: `master-admin` / `master_admin` → `/admin/dashboard`; `manager` → `/manager/dashboard`; `tenant` → `/tenant/dashboard`; else → `/dashboard` | Backend does not redirect; it only returns user and role. Frontend owns the mapping. |

**Alignment:** Backend exposes `user.highest_role` and `user.tenant_details`; frontend uses them to send the user to the correct dashboard path. All dashboard paths render the same **Dashboard** component.

---

## Phase 3: First Landing — Onboarding vs Dashboard

| Step | Frontend | Backend |
|------|----------|---------|
| User lands on Dashboard | `Dashboard.jsx` mounts with current `user` from AuthContext | — |
| Onboarding check | `useEffect`: if `user?.tenant_details?.onboarding_completed === false` → `navigate('/onboarding', { replace: true })` | `tenant_details` comes from `/api/auth/me/` and includes `onboarding_completed` from Tenant model |
| No tenant | If user has no tenant, onboarding API returns `tenant: null`; Onboarding page shows “You are not assigned to a company” and a link back to Dashboard | `GET /api/auth/me/onboarding/`: if `user.tenant` is None, returns `tenant: null`, `onboarding_completed: false` |

**Alignment:** Single source of truth is **Tenant.onboarding_completed**; backend sends it in `user.tenant_details` and in onboarding GET; frontend uses it to decide Dashboard → Onboarding redirect.

---

## Phase 4: Onboarding (4 Steps)

Onboarding is **protected** (`ProtectedRoute`); only authenticated users can access `/onboarding`.

| Step | Frontend | Backend |
|------|----------|---------|
| Load | `Onboarding.jsx`: `getOnboarding()` → `GET /api/auth/me/onboarding/` | Returns `onboarding_step`, `tenant`, `company`, `units`, `document_config` |
| Already completed | If `data.onboarding_completed` → `refreshUser()` then `navigate('/dashboard')` | `onboarding_completed` is true after Step 4 is saved |
| **Step 1** | Informational: “Set password in Profile if needed” → Continue to Step 2 | No API save for step 1 |
| **Step 2** | Company identity & legal (legal name, trade name, GST, PAN, address, etc.) → Save | `PUT /api/auth/me/onboarding/update/` with `step: 2`; backend updates Tenant (legal_name, trade_name, gst_number, etc.) and sets `onboarding_step = 2` |
| **Step 3** | Units (and sheds) → Save | Same endpoint, `step: 3`; creates/updates FactoryUnit and Sheds; sets `onboarding_step = 3` |
| **Step 4** | Document config (challan/invoice/PO formats, footer, signatory, etc.) → Save | Same endpoint, `step: 4`; creates/updates DocumentConfig; sets **onboarding_completed = True**, `onboarding_step = 4`; if user has no role, creates `master_admin`; logs audit and tenant activity |
| After Step 4 | `refreshUser()` then `navigate('/dashboard')` | Next `GET /api/auth/me/` returns `tenant_details.onboarding_completed === true` |

**Alignment:** Frontend sends step and payload; backend updates Tenant/FactoryUnit/DocumentConfig and flips `onboarding_completed` only on step 4. Frontend refreshes user after Step 4 so Dashboard no longer redirects to Onboarding.

---

## Phase 5: Dashboard (Ongoing Use)

| Step | Frontend | Backend |
|------|----------|---------|
| User on Dashboard | No redirect to Onboarding because `tenant_details.onboarding_completed === true` | `GET /api/auth/me/` continues to return updated user and tenant_details |
| Title | Dashboard shows “{Company} Dashboard”; company name derived from tenant (e.g. trade name or domain) | Tenant fields (e.g. `company_name`, `trade_name`) used for display |
| Later logins | Same as Phase 2 → role-based URL → Dashboard → no onboarding redirect | Same behaviour |

**Alignment:** Dashboard only shows after onboarding is complete; backend keeps `onboarding_completed` and role data in sync for all subsequent requests.

---

## Flow Diagram (High Level)

```
[User has email + password]
         │
         ▼
    Open app (/)
         │
         ├── Not authenticated ──► /login
         │                              │
         │                              ▼
         │                         Submit credentials
         │                              │
         │                              ▼
         │                         Backend: JWT + user (role, tenant_details)
         │                              │
         │                              ▼
         │                         Redirect by role → /dashboard (or /admin/dashboard, etc.)
         │                              │
         └── Authenticated ─────────────┤
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                           │
                    ▼                                           ▼
         tenant_details.onboarding_completed === false    onboarding_completed === true
                    │                                           │
                    ▼                                           ▼
              /onboarding                              Stay on Dashboard
                    │
                    ▼
         Step 1 → Step 2 → Step 3 → Step 4 (save)
                    │
                    ▼
         refreshUser() → navigate('/dashboard')
                    │
                    ▼
              Dashboard (ongoing use)
```

---

## Alignment Checklist

- **Entry:** Frontend sends unauthenticated users to `/login`; default route `/` redirects to `/login`.
- **Auth:** Backend returns `user` with `highest_role` and `tenant_details` (including `onboarding_completed`); frontend stores and uses them.
- **Redirect after login:** Frontend only; backend only returns data. Role → path mapping is in `Login.jsx`.
- **Onboarding gate:** Frontend checks `tenant_details.onboarding_completed` on Dashboard; backend sets it to `True` only when Step 4 is saved in onboarding PUT.
- **Post-onboarding:** Frontend calls `refreshUser()` after Step 4 save so `user.tenant_details.onboarding_completed` is true and Dashboard does not redirect back to Onboarding.
- **No tenant:** Backend returns `tenant: null` in onboarding GET; frontend shows “not assigned to a company” and does not allow completing onboarding.

---

## Key Frontend Files

| File | Responsibility |
|------|----------------|
| `App.jsx` | Routes, ProtectedRoute, default redirect to /login |
| `context/AuthContext.jsx` | login, user state, refreshUser |
| `pages/Login.jsx` | Login form, role-based redirect after success |
| `pages/Dashboard.jsx` | Onboarding redirect when `onboarding_completed === false`, company title |
| `pages/Onboarding.jsx` | 4-step flow, getOnboarding, updateOnboarding(2|3|4), refreshUser + navigate after Step 4 |
| `api/authService.js` | getOnboarding, updateOnboarding, getAccessToken, getUser, clearTokens |

---

## Key Backend Files

| File | Responsibility |
|------|----------------|
| `auth_service/views.py` | login, get current user (me), onboarding_get, onboarding_put (step 2–4, sets onboarding_completed on step 4) |
| `auth_service/models.py` | User, Tenant (onboarding_completed, onboarding_step), UserRole |
| `auth_service/serializers.py` | User serialization including tenant_details / onboarding_completed |

---

## Optional: Public Links

- **`/essentials/view/:token`** — Public (unauthenticated) view of a company essential by share token. Not part of the “new user → dashboard” flow; it is for external viewers with a link.

This document covers the path **from first visit to dashboard** and how frontend and backend stay aligned across login, onboarding, and dashboard.
