import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HomeContent from '../components/HomeContent';
import TasksContent from '../components/TasksContent';
import PurchaseContent from '../components/PurchaseContent';
import GenerateBuyerCode from '../components/GenerateBuyerCode';
import GenerateVendorCode from '../components/GenerateVendorCode';
import CompanyEssentials from '../components/CompanyEssentials';
import InternalPurchaseOrder from '../components/InternalPurchaseOrder/InternalPurchaseOrder';
import GeneratePOCode from '../components/GeneratePOCode';
import UQRFormsPreview from '../components/UQR_forms/UQRFormsPreview.jsx';
import {
  Menu,
  Home,
  Calculator,
  FileText
} from 'lucide-react';
import './Dashboard.css';

const FingerprintScanIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 11a3 3 0 0 1 6 0c0 1.657 .612 3.082 1 4" />
    <path d="M12 11v1.75c-.001 1.11 .661 2.206 1 3.25" />
    <path d="M9 14.25c.068 .58 .358 1.186 .5 1.75" />
    <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
  </svg>
);

const Stack3Icon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M20.894 17.553a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.553 3.774l7.554 -3.775a1 1 0 0 1 1.341 .447m0 -4a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.552 3.775l7.554 -3.775a1 1 0 0 1 1.341 .447m0 -4a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.552 3.775l7.554 -3.775a1 1 0 0 1 1.341 .447m-8.887 -8.552q .056 0 .111 .007l.111 .02l.086 .024l.012 .006l.012 .002l.029 .014l.05 .019l.016 .009l.012 .005l8 4a1 1 0 0 1 0 1.788l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 0 -1.788l8 -4l.011 -.005l.018 -.01l.078 -.032l.011 -.002l.013 -.006l.086 -.024l.11 -.02l.056 -.005z" />
  </svg>
);

const ShoppingBagIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304" />
    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
  </svg>
);

const ReceiptIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 17.5v-11" />
  </svg>
);

const StorefrontIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
    />
  </svg>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [tasksView, setTasksView] = useState('assign');
  const [codeCreationView, setCodeCreationView] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
  const [existingIPOs, setExistingIPOs] = useState([]);
  const [existingCompanyEssentials, setExistingCompanyEssentials] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('0');
  const profileMenuRef = useRef(null);
  const calculatorRef = useRef(null);
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

  const isOperator = (value) => ['+', '-', '*', '/'].includes(value);

  const appendCalcValue = (value) => {
    setCalcInput((prev) => {
      if (value === '.') {
        const lastSegment = prev.split(/[\+\-\*\/]/).pop() || '';
        if (lastSegment.includes('.')) {
          return prev;
        }
      }

      if (isOperator(value)) {
        if (!prev && value !== '-') {
          return prev;
        }
        if (prev && isOperator(prev.slice(-1))) {
          return `${prev.slice(0, -1)}${value}`;
        }
      }

      return `${prev}${value}`;
    });
  };

  const handleCalcClear = () => {
    setCalcInput('');
    setCalcResult('0');
  };

  const handleCalcDelete = () => {
    setCalcInput((prev) => prev.slice(0, -1));
  };

  const evaluateCalculation = () => {
    if (!calcInput) {
      return;
    }

    const safeExpression = calcInput.replace(/[^0-9+\-*/().]/g, '');
    if (!safeExpression || isOperator(safeExpression.slice(-1))) {
      return;
    }

    try {
      const raw = Function(`"use strict"; return (${safeExpression});`)();
      if (!Number.isFinite(raw)) {
        setCalcResult('Error');
        return;
      }
      const formatted = Number.isInteger(raw) ? raw.toString() : Number(raw.toFixed(8)).toString();
      setCalcResult(formatted);
      setCalcInput(formatted);
    } catch (error) {
      setCalcResult('Error');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getMenuItems = () => {
    return [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'uqr-forms', label: 'UQR Forms', icon: FileText },
      { id: 'tasks', label: 'Tasks', icon: Stack3Icon },
      { id: 'code-creation', label: 'Code Creation', icon: FingerprintScanIcon },
      { id: 'ipo-issued', label: 'IPO Issued', icon: ReceiptIcon },
      { id: 'purchase', label: 'Purchase', icon: ShoppingBagIcon },
      { id: 'ims', label: 'IMS', icon: StorefrontIcon },
    ];
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeContent user={user} />;
      case 'uqr-forms':
        return <UQRFormsPreview />;
      case 'tasks':
        return <TasksContent initialView={tasksView} />;
      case 'purchase':
        return <PurchaseContent />;
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
    if (!showCalculator) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      calculatorRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [showCalculator]);

  const handleCalculatorKeyDown = (event) => {
    const { key } = event;

    if (/^\d$/.test(key)) {
      event.preventDefault();
      appendCalcValue(key);
      return;
    }

    if (key === '.') {
      event.preventDefault();
      appendCalcValue('.');
      return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
      event.preventDefault();
      appendCalcValue(key);
      return;
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      evaluateCalculation();
      return;
    }

    if (key === 'Backspace') {
      event.preventDefault();
      handleCalcDelete();
      return;
    }

    if (key === 'Delete') {
      event.preventDefault();
      handleCalcClear();
    }
  };

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
      setExistingIPOs(stored);
    } catch (e) {
      setExistingIPOs([]);
    }
    try {
      const storedEssentials = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
      setExistingCompanyEssentials(storedEssentials);
    } catch (e) {
      setExistingCompanyEssentials([]);
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
    if (activePage === 'home' || activePage === 'tasks' || activePage === 'uqr-forms') {
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
    existingIPOs.filter((ipo) =>
      (ipo.orderType || '').toLowerCase() === type.toLowerCase() && ipo.ipoCode
    );

  const getCompanyEssentialsItems = () =>
    existingCompanyEssentials.map((entry, index) => {
      const label = entry.code || entry.poNumber || 'CHD/E/.../PO-';
      return {
        key: entry.code || entry.poNumber || `${entry.category || 'ce'}-${index}`,
        label
      };
    });

  const getIpoItems = (orderType) => {
    const normalizedType = String(orderType || '').trim();
    const prefixByType = {
      Production: 'CHD/PD/',
      Sampling: 'CHD/SAM/',
      Company: 'CHD/SELF/'
    };
    const expectedPrefix = prefixByType[normalizedType];
    return ipoByType(normalizedType)
      .filter((ipo) => {
        if (!expectedPrefix) return true;
        const code = (ipo.ipoCode || ipo.code || '').toUpperCase();
        if (code.includes('/E/')) return false;
        return code.startsWith(expectedPrefix);
      })
      .map((ipo, index) => ({
        key: ipo.ipoCode || `${type}-${index}`,
        label: ipo.ipoCode || ipo.code || 'IPO'
      }));
  };

  const getItemsForCategory = (categoryKey, categoryType) => {
    if (categoryKey === 'company-essentials') {
      return getCompanyEssentialsItems();
    }
    return getIpoItems(categoryType);
  };

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
        { label: 'Production', key: 'production', type: 'Production' },
        { label: 'Sampling', key: 'sampling', type: 'Sampling' },
        { label: 'Company Essentials', key: 'company-essentials', type: 'Company Essentials' },
        { label: 'Company', key: 'company', type: 'Company' },
      ];
      const actionsBySection = {
        inward: { key: 'receive', label: 'Receive Challan' },
        outward: { key: 'generate', label: 'Generate Challan' },
      };
      const activeSection = hoveredSubmenu?.menu === 'ims' ? hoveredSubmenu.section : null;
      const activeAction = hoveredSubmenu?.menu === 'ims' ? hoveredSubmenu.action : null;
      const activeCategory = hoveredSubmenu?.menu === 'ims' ? hoveredSubmenu.category : null;
      const activeCategoryMeta = categories.find((cat) => cat.key === activeCategory);
      const items = activeCategory ? getItemsForCategory(activeCategory, activeCategoryMeta?.type) : [];
      return (
        <div className="hover-panel-group" ref={hoverPanelRef} onMouseLeave={() => setHoveredSubmenu(null)}>
          <div className="hover-panel">
            <div className="hover-panel-column">
              <div className="hover-panel-title">IMS</div>
              <button
                type="button"
                className={`hover-panel-item ${activeSection === 'inward' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredSubmenu({ menu: 'ims', section: 'inward', action: null, category: null })}
              >
                Inward Store Sheet
              </button>
              <button
                type="button"
                className={`hover-panel-item ${activeSection === 'outward' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredSubmenu({ menu: 'ims', section: 'outward', action: null, category: null })}
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
                <button
                  key={`${activeSection}-${actionsBySection[activeSection]?.key}`}
                  type="button"
                  className={`hover-panel-item ${activeAction === actionsBySection[activeSection]?.key ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredSubmenu({
                    menu: 'ims',
                    section: activeSection,
                    action: actionsBySection[activeSection]?.key,
                    category: null
                  })}
                >
                  {actionsBySection[activeSection]?.label}
                </button>
              </div>
            </div>
          )}
          {activeAction && (
            <div className="hover-panel nested-panel second">
              <div className="hover-panel-column">
                <div className="hover-panel-title">Select Type</div>
                {categories.map((cat) => (
                  <button
                    key={`${activeSection}-${cat.key}`}
                    type="button"
                    className={`hover-panel-item ${activeCategory === cat.key ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSubmenu({
                      menu: 'ims',
                      section: activeSection,
                      action: activeAction,
                      category: cat.key
                    })}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeCategory && (
            <div className="hover-panel nested-panel third">
              <div className="hover-panel-column">
                <div className="hover-panel-title">{activeCategoryMeta?.label}</div>
                {items.map((item) => (
                  <div key={`${activeSection}-${activeCategory}-${item.key}`} className="hover-panel-subitem">
                    {item.label}
                  </div>
                ))}
                {items.length === 0 && <div className="hover-panel-subitem muted">No PO codes</div>}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (hoveredMenu === 'tasks') {
      const poTypes = [
        { label: 'Production', key: 'production', type: 'Production' },
        { label: 'Sampling', key: 'sampling', type: 'Sampling' },
        { label: 'Company', key: 'company', type: 'Company' },
      ];
      const departments = ['Department 1', 'Department 2', 'Department 3'];
      const users = ['User 1', 'User 2', 'User 3'];
      const priorities = ['Low', 'Medium', 'High', 'Urgent'];

      const activeAction = hoveredSubmenu?.menu === 'tasks' ? hoveredSubmenu.action : null;
      const activeType = hoveredSubmenu?.menu === 'tasks' ? hoveredSubmenu.type : null;
      const activeIpo = hoveredSubmenu?.menu === 'tasks' ? hoveredSubmenu.ipo : null;
      const activeDepartment = hoveredSubmenu?.menu === 'tasks' ? hoveredSubmenu.department : null;
      const activeUser = hoveredSubmenu?.menu === 'tasks' ? hoveredSubmenu.user : null;

      const activeTypeMeta = poTypes.find((t) => t.key === activeType);
      const ipoItems = activeTypeMeta ? getIpoItems(activeTypeMeta.type) : [];

      return (
        <div className="hover-panel-group" ref={hoverPanelRef} onMouseLeave={() => setHoveredSubmenu(null)}>
          <div className="hover-panel">
            <div className="hover-panel-column">
              <div className="hover-panel-title">Tasks</div>
              <button
                type="button"
                className={`hover-panel-item ${activeAction === 'assign' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredSubmenu({ menu: 'tasks', action: 'assign', type: null, ipo: null, department: null, user: null })}
                onClick={() => {
                  setTasksView('assign');
                  setActivePage('tasks');
                  setHoveredMenu(null);
                }}
              >
                Assign Tasks
              </button>
              <button
                type="button"
                className={`hover-panel-item ${activeAction === 'assigned' ? 'active' : ''}`}
                onMouseEnter={() => setHoveredSubmenu({ menu: 'tasks', action: 'assigned', type: null, ipo: null, department: null, user: null })}
                onClick={() => {
                  setTasksView('assigned');
                  setActivePage('tasks');
                  setHoveredMenu(null);
                }}
              >
                Tasks Assigned To You
              </button>
            </div>
          </div>

          {activeAction === 'assign' && (
            <div className="hover-panel nested-panel">
              <div className="hover-panel-column">
                <div className="hover-panel-title">Select PO Type</div>
                {poTypes.map((po) => (
                  <button
                    key={po.key}
                    type="button"
                    className={`hover-panel-item ${activeType === po.key ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSubmenu({
                      menu: 'tasks',
                      action: activeAction,
                      type: po.key,
                      ipo: null,
                      department: null,
                      user: null
                    })}
                  >
                    {po.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeType && (
            <div className="hover-panel nested-panel second">
              <div className="hover-panel-column">
                <div className="hover-panel-title">Select IPO</div>
                {ipoItems.map((ipo) => (
                  <button
                    key={ipo.key}
                    type="button"
                    className={`hover-panel-item ${activeIpo === ipo.key ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSubmenu({
                      menu: 'tasks',
                      action: activeAction,
                      type: activeType,
                      ipo: ipo.key,
                      department: null,
                      user: null
                    })}
                  >
                    {ipo.label}
                  </button>
                ))}
                {ipoItems.length === 0 && <div className="hover-panel-subitem muted">No IPOs</div>}
              </div>
            </div>
          )}

          {activeIpo && (
            <div className="hover-panel nested-panel third">
              <div className="hover-panel-column">
                <div className="hover-panel-title">Select Department</div>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    className={`hover-panel-item ${activeDepartment === dept ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSubmenu({
                      menu: 'tasks',
                      action: activeAction,
                      type: activeType,
                      ipo: activeIpo,
                      department: dept,
                      user: null
                    })}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeDepartment && (
            <div className="hover-panel nested-panel fourth">
              <div className="hover-panel-column">
                <div className="hover-panel-title">Users</div>
                {users.map((user) => (
                  <button
                    key={user}
                    type="button"
                    className={`hover-panel-item ${activeUser === user ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSubmenu({
                      menu: 'tasks',
                      action: activeAction,
                      type: activeType,
                      ipo: activeIpo,
                      department: activeDepartment,
                      user
                    })}
                  >
                    {user}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeUser && (
            <div className="hover-panel nested-panel fifth">
              <div className="hover-panel-column">
                <div className="hover-panel-title">Define Task</div>
                <input className="hover-panel-input" placeholder="Define task" />
                <input className="hover-panel-input" placeholder="Add sub task" />
                <input className="hover-panel-input" placeholder="Remarks" />
                <input className="hover-panel-input" placeholder="Due date" />
                <div className="hover-panel-subtitle">Priority</div>
                {priorities.map((priority) => (
                  <button key={priority} type="button" className="hover-panel-subitem">
                    {priority}
                  </button>
                ))}
                <button type="button" className="hover-panel-action">Assign</button>
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
                if (item.id === 'home' || item.id === 'tasks' || item.id === 'uqr-forms' || item.id === 'purchase') {
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
              className="calculator-trigger"
              onClick={() => {
                setShowProfileMenu(false);
                setShowCalculator(true);
              }}
              aria-label="Open calculator"
            >
              <Calculator size={18} />
            </button>
            <span className="profile-username">{displayName}</span>
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
        {showCalculator && (
          <div
            className="calculator-overlay"
            role="presentation"
          >
            <div
              className="calculator-popup"
              role="dialog"
              aria-label="Calculator"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              ref={calculatorRef}
              tabIndex={0}
              onKeyDown={handleCalculatorKeyDown}
            >
              <div className="calculator-header">
                <div>
                  <div className="calculator-title">Calculator</div>
                  <div className="calculator-subtitle">Quick math</div>
                </div>
                <button
                  type="button"
                  className="calculator-close"
                  onClick={() => setShowCalculator(false)}
                  aria-label="Close calculator"
                >
                  x
                </button>
              </div>
              <div className="calculator-display">
                <div className="calculator-expression">{calcInput || '0'}</div>
                <div className="calculator-result">{calcResult}</div>
              </div>
              <div className="calculator-keys">
                <button type="button" className="calc-key util" onClick={handleCalcClear}>
                  C
                </button>
                <button type="button" className="calc-key util" onClick={handleCalcDelete}>
                  DEL
                </button>
                <button type="button" className="calc-key util" onClick={() => appendCalcValue('/')}>
                  /
                </button>
                <button type="button" className="calc-key operator" onClick={() => appendCalcValue('*')}>
                  x
                </button>

                <button type="button" className="calc-key" onClick={() => appendCalcValue('7')}>
                  7
                </button>
                <button type="button" className="calc-key" onClick={() => appendCalcValue('8')}>
                  8
                </button>
                <button type="button" className="calc-key" onClick={() => appendCalcValue('9')}>
                  9
                </button>
                <button type="button" className="calc-key operator" onClick={() => appendCalcValue('-')}>
                  -
                </button>

                <button type="button" className="calc-key" onClick={() => appendCalcValue('4')}>
                  4
                </button>
                <button type="button" className="calc-key" onClick={() => appendCalcValue('5')}>
                  5
                </button>
                <button type="button" className="calc-key" onClick={() => appendCalcValue('6')}>
                  6
                </button>
                <button type="button" className="calc-key operator" onClick={() => appendCalcValue('+')}>
                  +
                </button>

                <button type="button" className="calc-key" onClick={() => appendCalcValue('1')}>
                  1
                </button>
                <button type="button" className="calc-key" onClick={() => appendCalcValue('2')}>
                  2
                </button>
                <button type="button" className="calc-key" onClick={() => appendCalcValue('3')}>
                  3
                </button>
                <button type="button" className="calc-key equals" onClick={evaluateCalculation}>
                  =
                </button>

                <button type="button" className="calc-key zero" onClick={() => appendCalcValue('0')}>
                  0
                </button>
                <button type="button" className="calc-key" onClick={() => appendCalcValue('.')}>
                  .
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="content-wrapper">
          {renderContent()}
          {renderHoverPanel()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
