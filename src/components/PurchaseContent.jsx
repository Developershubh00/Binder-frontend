import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const PURCHASE_SHARE_KEY = 'purchaseSharedData';
const PURCHASE_ISSUED_KEY = 'purchaseIssuedItems';

const normalizeTypeLabel = (value) => {
  const v = (value || '').toLowerCase();
  if (v === 'company essentials' || v === 'company-essentials') return 'Company Essentials';
  if (v === 'self') return 'Company';
  if (v === 'sam') return 'Sampling';
  if (v === 'pd') return 'Production';
  if (v === 'company') return 'Company';
  if (v === 'sampling') return 'Sampling';
  if (v === 'production') return 'Production';
  return value || 'Other';
};

const PurchaseContent = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [issuedMap, setIssuedMap] = useState({});
  const [openTypes, setOpenTypes] = useState({});
  const [openCodes, setOpenCodes] = useState({});
  const [openIpcs, setOpenIpcs] = useState({});
  const [openCategories, setOpenCategories] = useState({});

  const loadData = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(PURCHASE_SHARE_KEY) || '[]');
      setPurchaseData(Array.isArray(stored) ? stored : []);
    } catch {
      setPurchaseData([]);
    }
    try {
      const storedIssued = JSON.parse(localStorage.getItem(PURCHASE_ISSUED_KEY) || '{}');
      setIssuedMap(storedIssued && typeof storedIssued === 'object' ? storedIssued : {});
    } catch {
      setIssuedMap({});
    }
  };

  useEffect(() => {
    loadData();
    const onStorage = (event) => {
      if (event.key === PURCHASE_SHARE_KEY || event.key === PURCHASE_ISSUED_KEY) {
        loadData();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const grouped = useMemo(() => {
    const groups = {};
    purchaseData.forEach((entry) => {
      const label = normalizeTypeLabel(entry.orderType);
      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    });
    return groups;
  }, [purchaseData]);

  const toggle = (setter, key) => {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const issueItem = (itemKey) => {
    const next = {
      ...issuedMap,
      [itemKey]: { issuedAt: new Date().toISOString() }
    };
    setIssuedMap(next);
    localStorage.setItem(PURCHASE_ISSUED_KEY, JSON.stringify(next));
  };

  const renderItems = (entry, ipcCode, categoryKey, items) => {
    const withStatus = items.map((label) => {
      const key = `${entry.code}::${ipcCode}::${categoryKey}::${label}`;
      const issued = Boolean(issuedMap[key]);
      const issuedAt = issuedMap[key]?.issuedAt || '';
      return { label, key, issued, issuedAt };
    });
    const unissued = withStatus.filter((i) => !i.issued).sort((a, b) => a.label.localeCompare(b.label));
    const issued = withStatus.filter((i) => i.issued).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));
    const ordered = [...unissued, ...issued];

    return (
      <div className="purchase-items">
        {ordered.map((item) => (
          <div key={item.key} className={`purchase-item ${item.issued ? 'issued' : ''}`}>
            <span>{item.label}</span>
            {item.issued ? (
              <span className="purchase-issued">Issued VPO</span>
            ) : (
              <Button type="button" size="sm" onClick={() => issueItem(item.key)}>
                Issue VPO
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-content purchase-content">
      <h1 className="dashboard-title">Purchase</h1>
      <p className="dashboard-subtitle">Shared consumption sheet items ready for VPO.</p>

      {Object.keys(grouped).length === 0 && (
        <div className="purchase-empty">No items shared to Purchase yet.</div>
      )}

      <div className="purchase-tree">
        {Object.entries(grouped).map(([typeLabel, entries]) => (
          <div key={typeLabel} className="purchase-node">
            <button className="purchase-toggle" onClick={() => toggle(setOpenTypes, typeLabel)}>
              <span>{typeLabel}</span>
              <span className={`purchase-arrow ${openTypes[typeLabel] ? 'open' : ''}`}>▸</span>
            </button>
            {openTypes[typeLabel] && (
              <div className="purchase-children">
                {entries.map((entry) => (
                  <div key={`${typeLabel}-${entry.code}`} className="purchase-node">
                    <button className="purchase-toggle" onClick={() => toggle(setOpenCodes, entry.code)}>
                      <span>{entry.code}</span>
                      <span className={`purchase-arrow ${openCodes[entry.code] ? 'open' : ''}`}>▸</span>
                    </button>
                    {openCodes[entry.code] && (
                      <div className="purchase-children">
                        {(entry.ipcs || []).map((ipc, ipcIdx) => {
                          const ipcKey = `${entry.code}-ipc-${ipcIdx}`;
                          return (
                            <div key={ipcKey} className="purchase-node">
                              <button className="purchase-toggle" onClick={() => toggle(setOpenIpcs, ipcKey)}>
                                <span>{ipc.ipcCode}</span>
                                <span className={`purchase-arrow ${openIpcs[ipcKey] ? 'open' : ''}`}>▸</span>
                              </button>
                              {openIpcs[ipcKey] && (
                                <div className="purchase-children">
                                  {[
                                    { key: 'rawMaterials', label: 'Raw Materials' },
                                    { key: 'trimsAccessory', label: 'Trims & Accessory' },
                                    { key: 'artworkLabeling', label: 'Artwork & Labeling' },
                                    { key: 'packaging', label: 'Packaging' }
                                  ].map((cat) => {
                                    const items = ipc.categories?.[cat.key] || [];
                                    if (items.length === 0) return null;
                                    const catKey = `${ipcKey}-${cat.key}`;
                                    return (
                                      <div key={catKey} className="purchase-node">
                                        <button className="purchase-toggle" onClick={() => toggle(setOpenCategories, catKey)}>
                                          <span>{cat.label}</span>
                                          <span className={`purchase-arrow ${openCategories[catKey] ? 'open' : ''}`}>▸</span>
                                        </button>
                                        {openCategories[catKey] && renderItems(entry, ipc.ipcCode, cat.key, items)}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseContent;
