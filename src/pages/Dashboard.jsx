import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HomeContent from '../components/HomeContent';
import TasksContent from '../components/TasksContent';
import GenerateBuyerCode from '../components/GenerateBuyerCode';
import GenerateVendorCode from '../components/GenerateVendorCode';
import CompanyEssentials from '../components/CompanyEssentials';
import InternalPurchaseOrder from '../components/InternalPurchaseOrder/InternalPurchaseOrder';
import GeneratePOCode from '../components/GeneratePOCode';
import {
  Menu,
  Home,
  ListChecks,
  Building2,
  Boxes,
  MessageCircle,
  UserCircle
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [codeCreationView, setCodeCreationView] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
  const [existingIPOs, setExistingIPOs] = useState([]);
  const profileMenuRef = useRef(null);
  const sidebarRef = useRef(null);
  const hoverPanelRef = useRef(null);

  const getDisplayName = () => {
    const firstLast = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();
    const firstLastAlt = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    return (
      user?.name?.trim() ||
      user?.username?.trim() ||
      firstLast ||
      firstLastAlt ||
      user?.email ||
      'User'
    );
  };

  const displayName = getDisplayName();
  const showEmailLine = Boolean(user?.email && displayName !== user?.email);

  const handleLogout = () => {
    logout();
  };

  const getMenuItems = () => {
    return [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'tasks', label: 'Tasks', icon: ListChecks },
      { id: 'code-creation', label: 'Code Creation', icon: Building2 },
      { id: 'ipo-issued', label: 'IPO Issued', icon: MessageCircle },
      { id: 'purchase', label: 'Purchase', icon: Boxes },
      { id: 'ims', label: 'IMS', icon: UserCircle },
    ];
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeContent user={user} />;
      case 'tasks':
        return <TasksContent />;
      case 'code-creation':
        if (codeCreationView === 'buyer') {
          return <GenerateBuyerCode onBack={() => { setActivePage('code-creation'); setCodeCreationView(null); setHoveredMenu('code-creation'); }} />;
        }
        if (codeCreationView === 'vendor') {
          return <GenerateVendorCode onBack={() => { setActivePage('code-creation'); setCodeCreationView(null); setHoveredMenu('code-creation'); }} />;
        }
        if (codeCreationView === 'company-essentials') {
          return <CompanyEssentials onBack={() => { setActivePage('code-creation'); setCodeCreationView(null); setHoveredMenu('code-creation'); }} />;
        }
        if (codeCreationView === 'internal-purchase-order') {
          return (
            <InternalPurchaseOrder
              onBack={() => { setActivePage('code-creation'); setCodeCreationView(null); setHoveredMenu('code-creation'); }}
              onNavigateToCodeCreation={() => setActivePage('code-creation')}
              onNavigateToIPO={() => setActivePage('code-creation')}
            />
          );
        }
        if (codeCreationView === 'generate-po') {
          return <GeneratePOCode onBack={() => { setActivePage('code-creation'); setCodeCreationView(null); setHoveredMenu('code-creation'); }} />;
        }
        return <div className="dashboard-content" />;
      default:
        return <div className="dashboard-content" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
      setExistingIPOs(stored);
    } catch (e) {
      setExistingIPOs([]);
    }
  }, [hoveredMenu]);

  useEffect(() => {
    if (!hoveredMenu) {
      setHoveredSubmenu(null);
      return;
    }
    setHoveredSubmenu(null);
  }, [hoveredMenu]);

  useEffect(() => {
    if (activePage === 'home' || activePage === 'tasks') {
      setHoveredMenu(null);
    }
  }, [activePage]);

  useEffect(() => {
    if (!hoveredMenu) return;
    const handleClickOutside = (event) => {
      const sidebarEl = sidebarRef.current;
      const panelEl = hoverPanelRef.current;
      if (sidebarEl?.contains(event.target)) return;
      if (panelEl?.contains(event.target)) return;
      setHoveredMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hoveredMenu]);

  const ipoByType = (type) =>
    existingIPOs.filter((ipo) => (ipo.orderType || '').toLowerCase() === type.toLowerCase());

  const renderHoverPanel = () => {
    if (!hoveredMenu) return null;

    if (hoveredMenu === 'code-creation') {
      return (
        <div className="hover-panel-group" ref={hoverPanelRef} onMouseLeave={() => setHoveredSubmenu(null)}>
          <div className="hover-panel">
            <div className="hover-panel-column">
              <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('buyer'); setHoveredMenu(null); }}>
                Buyer
              </button>
              <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('vendor'); setHoveredMenu(null); }}>
                Vendor
              </button>
              <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('company-essentials'); setHoveredMenu(null); }}>
                Company Essentials
              </button>
              <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('internal-purchase-order'); setHoveredMenu(null); }}>
                Internal Purchase Order
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (hoveredMenu === 'ipo-issued') {
      const categories = [
        { label: 'Production', key: 'Production' },
        { label: 'Sampling', key: 'Sampling' },
        { label: 'Company', key: 'Company' },
      ];
      const activeCategory =
        hoveredSubmenu?.menu === 'ipo-issued' ? hoveredSubmenu.category : null;
      const items = activeCategory ? ipoByType(activeCategory) : [];
      return (
        <div className="hover-panel-group" ref={hoverPanelRef} onMouseLeave={() => setHoveredSubmenu(null)}>
          <div className="hover-panel">
            <div className="hover-panel-column">
              <div className="hover-panel-title">IPO Issued</div>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`hover-panel-item ${activeCategory === cat.key ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredSubmenu({ menu: 'ipo-issued', category: cat.key })}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          {activeCategory && (
            <div className="hover-panel nested-panel">
              <div className="hover-panel-column">
                <div className="hover-panel-title">{categories.find((c) => c.key === activeCategory)?.label}</div>
                {items.map((ipo) => (
                  <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
                ))}
                {items.length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (hoveredMenu === 'purchase') {
      const categories = [
        { label: 'Production', key: 'Production' },
        { label: 'Sampling', key: 'Sampling' },
        { label: 'Company Essentials', key: 'Company' },
      ];
      const activeCategory =
        hoveredSubmenu?.menu === 'purchase' ? hoveredSubmenu.category : null;
      const items = activeCategory ? ipoByType(activeCategory) : [];
      return (
        <div className="hover-panel-group" ref={hoverPanelRef} onMouseLeave={() => setHoveredSubmenu(null)}>
          <div className="hover-panel">
            <div className="hover-panel-column">
              <div className="hover-panel-title">Purchase</div>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`hover-panel-item ${activeCategory === cat.key ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredSubmenu({ menu: 'purchase', category: cat.key })}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          {activeCategory && (
            <div className="hover-panel nested-panel">
              <div className="hover-panel-column">
                <div className="hover-panel-title">{categories.find((c) => c.key === activeCategory)?.label}</div>
                {items.map((ipo) => (
                  <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
                ))}
                {items.length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
                {activeCategory === 'Company' && (
                  <button className="hover-panel-action" onClick={() => { setActivePage('code-creation'); setCodeCreationView('generate-po'); setHoveredMenu(null); }}>
                    Generate PO
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (hoveredMenu === 'ims') {
      const categories = [
        { label: 'Production', key: 'Production' },
        { label: 'Sampling', key: 'Sampling' },
        { label: 'Company Essentials', key: 'Company' },
      ];
      const activeSection = hoveredSubmenu?.menu === 'ims' ? hoveredSubmenu.section : null;
      const activeCategory = hoveredSubmenu?.menu === 'ims' ? hoveredSubmenu.category : null;
      const items = activeCategory ? ipoByType(activeCategory) : [];
      return (
        <div className="hover-panel-group" ref={hoverPanelRef} onMouseLeave={() => setHoveredSubmenu(null)}>
          <div className="hover-panel">
            <div className="hover-panel-column">
              <div className="hover-panel-title">IMS</div>
              <button
                type="button"
                className={`hover-panel-item ${activeSection === 'inward' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredSubmenu({ menu: 'ims', section: 'inward', category: null })}
              >
                Inward Store Sheet
              </button>
              <button
                type="button"
                className={`hover-panel-item ${activeSection === 'outward' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredSubmenu({ menu: 'ims', section: 'outward', category: null })}
              >
                Outward Store Sheet
              </button>
            </div>
          </div>
          {activeSection && (
            <div className="hover-panel nested-panel">
              <div className="hover-panel-column">
                <div className="hover-panel-title">
                  {activeSection === 'inward' ? 'Inward Store Sheet' : 'Outward Store Sheet'}
                </div>
                {categories.map((cat) => (
                  <button
                    key={`${activeSection}-${cat.key}`}
                    type="button"
                    className={`hover-panel-item ${activeCategory === cat.key ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSubmenu({ menu: 'ims', section: activeSection, category: cat.key })}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeCategory && (
            <div className="hover-panel nested-panel second">
              <div className="hover-panel-column">
                <div className="hover-panel-title">{categories.find((c) => c.key === activeCategory)?.label}</div>
                {items.map((ipo) => (
                  <div key={`${activeSection}-${ipo.ipoCode}`} className="hover-panel-subitem">{ipo.ipoCode}</div>
                ))}
                {items.length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
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
                if (item.id === 'home' || item.id === 'tasks') {
                  setActivePage(item.id);
                  setHoveredMenu(null);
                  return;
                }
                if (item.id === 'code-creation') {
                  setCodeCreationView(null);
                }
                setActivePage(item.id);
                setHoveredMenu(item.id);
              }}
            >
              <span className="nav-icon" aria-hidden="true">
                <item.icon size={18} />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer" />
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h2 className="page-title">Binder Dashboard</h2>
          </div>
          <div className="top-bar-right" ref={profileMenuRef}>
            <button
              type="button"
              className="profile-trigger"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              aria-label="Open profile menu"
            >
              <span className="user-avatar">
                {displayName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-menu-name">{displayName}</div>
                  {showEmailLine && <div className="profile-menu-email">{user.email}</div>}
                </div>
                <div className="profile-menu-divider" />
                <button type="button" className="profile-menu-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="content-wrapper">
          {renderContent()}
          {renderHoverPanel()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
