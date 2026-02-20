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
  const [existingIPOs, setExistingIPOs] = useState([]);
  const profileMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

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
        if (codeCreationView === 'buyer') return <GenerateBuyerCode />;
        if (codeCreationView === 'vendor') return <GenerateVendorCode />;
        if (codeCreationView === 'company-essentials') return <CompanyEssentials />;
        if (codeCreationView === 'internal-purchase-order') {
          return (
            <InternalPurchaseOrder
              onBack={() => setActivePage('home')}
              onNavigateToCodeCreation={() => setActivePage('code-creation')}
              onNavigateToIPO={() => setActivePage('code-creation')}
            />
          );
        }
        if (codeCreationView === 'generate-po') return <GeneratePOCode />;
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

  const handleMenuHover = (id) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMenu(id);
  };

  const handleMenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredMenu(null), 150);
  };

  const ipoByType = (type) =>
    existingIPOs.filter((ipo) => (ipo.orderType || '').toLowerCase() === type.toLowerCase());

  const renderHoverPanel = () => {
    if (!hoveredMenu) return null;

    if (hoveredMenu === 'code-creation') {
      return (
        <div className="hover-panel" onMouseEnter={() => handleMenuHover('code-creation')} onMouseLeave={handleMenuLeave}>
          <div className="hover-panel-column">
            <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('buyer'); }}>
              Buyer
            </button>
            <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('vendor'); }}>
              Vendor
            </button>
            <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('company-essentials'); }}>
              Company Essentials
            </button>
            <button className="hover-panel-item" onClick={() => { setActivePage('code-creation'); setCodeCreationView('internal-purchase-order'); }}>
              Internal Purchase Order
            </button>
          </div>
        </div>
      );
    }

    if (hoveredMenu === 'ipo-issued') {
      return (
        <div className="hover-panel" onMouseEnter={() => handleMenuHover('ipo-issued')} onMouseLeave={handleMenuLeave}>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Production</div>
            {ipoByType('Production').map((ipo) => (
              <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            {ipoByType('Production').length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
          </div>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Sampling</div>
            {ipoByType('Sampling').map((ipo) => (
              <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            {ipoByType('Sampling').length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
          </div>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Company</div>
            {ipoByType('Company').map((ipo) => (
              <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            {ipoByType('Company').length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
          </div>
        </div>
      );
    }

    if (hoveredMenu === 'purchase') {
      return (
        <div className="hover-panel" onMouseEnter={() => handleMenuHover('purchase')} onMouseLeave={handleMenuLeave}>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Production</div>
            {ipoByType('Production').map((ipo) => (
              <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            {ipoByType('Production').length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
          </div>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Sampling</div>
            {ipoByType('Sampling').map((ipo) => (
              <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            {ipoByType('Sampling').length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
          </div>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Company Essentials</div>
            {ipoByType('Company').map((ipo) => (
              <div key={ipo.ipoCode} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            {ipoByType('Company').length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
            <button className="hover-panel-action" onClick={() => { setActivePage('code-creation'); setCodeCreationView('generate-po'); }}>
              Generate PO
            </button>
          </div>
        </div>
      );
    }

    if (hoveredMenu === 'ims') {
      return (
        <div className="hover-panel" onMouseEnter={() => handleMenuHover('ims')} onMouseLeave={handleMenuLeave}>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Inward Store Sheet</div>
            <div className="hover-panel-subtitle">Production</div>
            {ipoByType('Production').map((ipo) => (
              <div key={`in-${ipo.ipoCode}`} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            <div className="hover-panel-subtitle">Sampling</div>
            {ipoByType('Sampling').map((ipo) => (
              <div key={`in-${ipo.ipoCode}`} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            <div className="hover-panel-subtitle">Company Essentials</div>
            {ipoByType('Company').map((ipo) => (
              <div key={`in-${ipo.ipoCode}`} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
          </div>
          <div className="hover-panel-column">
            <div className="hover-panel-title">Outward Store Sheet</div>
            <div className="hover-panel-subtitle">Production</div>
            {ipoByType('Production').map((ipo) => (
              <div key={`out-${ipo.ipoCode}`} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            <div className="hover-panel-subtitle">Sampling</div>
            {ipoByType('Sampling').map((ipo) => (
              <div key={`out-${ipo.ipoCode}`} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
            <div className="hover-panel-subtitle">Company Essentials</div>
            {ipoByType('Company').map((ipo) => (
              <div key={`out-${ipo.ipoCode}`} className="hover-panel-subitem">{ipo.ipoCode}</div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
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
                }
              }}
              onMouseEnter={() => handleMenuHover(item.id)}
              onMouseLeave={handleMenuLeave}
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
                {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </span>
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-menu-name">{user?.name || 'User'}</div>
                  <div className="profile-menu-email">{user?.email || ''}</div>
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
