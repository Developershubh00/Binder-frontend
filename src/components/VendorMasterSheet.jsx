import { useState, useEffect } from 'react';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import './VendorMasterSheet.css';

const VendorMasterSheet = ({ onBack }) => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Mock data for demonstration
  const mockVendors = [
    {
      code: '101',
      vendorName: 'ABC Textiles Pvt Ltd',
      address: '123, Industrial Area, Phase-1, Chandigarh, 160002',
      gst: '03AABCA1234A1Z5',
      bankName: 'State Bank of India',
      accNo: '12345678901',
      ifscCode: 'SBIN0001234',
      jobWorkCategory: 'Fabric',
      jobWorkSubCategory: 'Cotton Yarn',
      contactPerson: 'Rajesh Kumar',
      whatsappNo: '9876543210',
      altWhatsappNo: '9876543211',
      email: 'rajesh@abctextiles.com',
      paymentTerms: '30 days credit after delivery',
      createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
      code: '102',
      vendorName: 'Global Yarn Industries',
      address: '456, Export Promotion Industrial Park, Ludhiana, Punjab, 141003',
      gst: '03BBCDE5678B2Y4',
      bankName: 'HDFC Bank',
      accNo: '23456789012',
      ifscCode: 'HDFC0002345',
      jobWorkCategory: 'Greige Yarn',
      jobWorkSubCategory: 'Fine Count UV 24Ne to 60Ne',
      contactPerson: 'Priya Sharma',
      whatsappNo: '8765432109',
      altWhatsappNo: '',
      email: 'priya@globalyarn.com',
      paymentTerms: '45 days credit after delivery and quality check',
      createdAt: '2024-01-20T14:45:00.000Z'
    },
    {
      code: '103',
      vendorName: 'Premium Fabric Solutions',
      address: '789, Textile Hub, Sector-15, Noida, Uttar Pradesh, 201301',
      gst: '09CDEFG9012C3X6',
      bankName: 'ICICI Bank',
      accNo: '34567890123',
      ifscCode: 'ICIC0003456',
      jobWorkCategory: 'DYE',
      jobWorkSubCategory: 'Polyester Yarn',
      contactPerson: 'Amit Singh',
      whatsappNo: '7654321098',
      altWhatsappNo: '7654321099',
      email: 'amit@premiumfabric.com',
      paymentTerms: '60 days credit with 2% early payment discount',
      createdAt: '2024-01-25T09:15:00.000Z'
    }
  ];

  useEffect(() => {
    // Always show mock data first
    setVendors(mockVendors);
    
    // Load vendors from localStorage and merge with mock data
    const storedVendors = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
    
    if (storedVendors.length > 0) {
      // Filter out any duplicates and merge with mock data
      const allVendors = [...mockVendors];
      storedVendors.forEach(stored => {
        if (!allVendors.find(mock => mock.code === stored.code)) {
          allVendors.push(stored);
        }
      });
      setVendors(allVendors);
      // Update localStorage with merged data
      localStorage.setItem('vendorCodes', JSON.stringify(allVendors));
    } else {
      // If no stored vendors, save mock data to localStorage
      localStorage.setItem('vendorCodes', JSON.stringify(mockVendors));
    }
  }, []);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor =>
    vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.gst.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.paymentTerms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDeleteVendor = (vendorCode) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      const updatedVendors = vendors.filter(vendor => vendor.code !== vendorCode);
      setVendors(updatedVendors);
      localStorage.setItem('vendorCodes', JSON.stringify(updatedVendors));
    }
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon">↕</span>;
    }
    return sortConfig.direction === 'asc' ? 
      <span className="sort-icon active">↑</span> : 
      <span className="sort-icon active">↓</span>;
  };

  // Vendor Details Modal
  const VendorDetailsModal = ({ vendor, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vendor Details - Code: {vendor.code}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-section">
              <h3>Basic Information</h3>
              <div className="detail-item">
                <label>Vendor Name:</label>
                <span>{vendor.vendorName}</span>
              </div>
              <div className="detail-item">
                <label>Address:</label>
                <span>{vendor.address}</span>
              </div>
              <div className="detail-item">
                <label>GST Number:</label>
                <span>{vendor.gst}</span>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Banking Details</h3>
              <div className="detail-item">
                <label>Bank Name:</label>
                <span>{vendor.bankName}</span>
              </div>
              <div className="detail-item">
                <label>Account Number:</label>
                <span>{vendor.accNo}</span>
              </div>
              <div className="detail-item">
                <label>IFSC Code:</label>
                <span>{vendor.ifscCode}</span>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Job Work Information</h3>
              <div className="detail-item">
                <label>Category:</label>
                <span>{vendor.jobWorkCategory}</span>
              </div>
              <div className="detail-item">
                <label>Sub-Category:</label>
                <span>{vendor.jobWorkSubCategory}</span>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-item">
                <label>Contact Person:</label>
                <span>{vendor.contactPerson}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{vendor.email}</span>
              </div>
              <div className="detail-item">
                <label>WhatsApp Number:</label>
                <span>{vendor.whatsappNo}</span>
              </div>
              {vendor.altWhatsappNo && (
                <div className="detail-item">
                  <label>Alternative WhatsApp:</label>
                  <span>{vendor.altWhatsappNo}</span>
                </div>
              )}
            </div>
            
            <div className="detail-section full-width">
              <h3>Payment Terms</h3>
              <div className="detail-item">
                <span>{vendor.paymentTerms}</span>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Created Date</h3>
              <div className="detail-item">
                <span>{formatDate(vendor.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="vendor-master-container">
      <div className="vendor-master-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Vendor Management
        </button>
        <h1 className="page-title">Vendor Master Sheet</h1>
        <p className="page-description">
          View and manage all registered vendors in the system
        </p>
      </div>

      <div className="vendor-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by vendor name, code, contact person, email, GST, address, or payment terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
        <div className="vendor-count">
          Total Vendors: <strong>{filteredVendors.length}</strong>
        </div>
      </div>

      <div className="table-container">
        <table className="vendor-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('code')} className="sortable">
                Code {getSortIcon('code')}
              </th>
              <th onClick={() => handleSort('vendorName')} className="sortable">
                Vendor Name {getSortIcon('vendorName')}
              </th>
              <th>Address</th>
              <th>GST Number</th>
              <th onClick={() => handleSort('contactPerson')} className="sortable">
                Contact Person {getSortIcon('contactPerson')}
              </th>
              <th>Phone</th>
              <th>Email</th>
              <th onClick={() => handleSort('jobWorkCategory')} className="sortable">
                Category {getSortIcon('jobWorkCategory')}
              </th>
              <th>Sub-Category</th>
              <th>Bank</th>
              <th onClick={() => handleSort('paymentTerms')} className="sortable">
                Payment Terms {getSortIcon('paymentTerms')}
              </th>
              <th onClick={() => handleSort('createdAt')} className="sortable">
                Created {getSortIcon('createdAt')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedVendors.length > 0 ? (
              sortedVendors.map((vendor) => (
                <tr key={vendor.code} className="vendor-row">
                  <td className="vendor-code">
                    <span className="code-badge">{vendor.code}</span>
                  </td>
                  <td className="vendor-name">
                    <strong>{vendor.vendorName}</strong>
                  </td>
                  <td className="address-cell">
                    <div className="address-text">{vendor.address}</div>
                  </td>
                  <td className="gst-number">
                    <code>{vendor.gst}</code>
                  </td>
                  <td className="contact-person">
                    <strong>{vendor.contactPerson}</strong>
                  </td>
                  <td className="phone-number">
                    <div>{vendor.whatsappNo}</div>
                    {vendor.altWhatsappNo && (
                      <div className="alt-phone">{vendor.altWhatsappNo}</div>
                    )}
                  </td>
                  <td className="email">{vendor.email}</td>
                  <td className="category">
                    <span className="category-badge">{vendor.jobWorkCategory}</span>
                  </td>
                  <td className="sub-category">{vendor.jobWorkSubCategory}</td>
                  <td className="bank-info">
                    <div className="bank-name">{vendor.bankName}</div>
                    <div className="account-info">
                      <small>A/C: {vendor.accNo}</small>
                    </div>
                    <div className="ifsc-info">
                      <small>IFSC: {vendor.ifscCode}</small>
                    </div>
                  </td>
                  <td className="payment-terms">
                    <div className="payment-text">{vendor.paymentTerms}</div>
                  </td>
                  <td className="created-date">{formatDate(vendor.createdAt)}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn view-btn"
                        title="View Details"
                        onClick={() => handleViewDetails(vendor)}
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        title="Edit Vendor"
                        onClick={() => alert('Edit functionality to be implemented')}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        title="Delete Vendor"
                        onClick={() => handleDeleteVendor(vendor.code)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="no-data">
                  No vendors found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="summary-info">
          <span>Showing {filteredVendors.length} of {vendors.length} vendors</span>
        </div>
      </div>

      {selectedVendor && (
        <VendorDetailsModal 
          vendor={selectedVendor} 
          onClose={() => setSelectedVendor(null)} 
        />
      )}
    </div>
  );
};

export default VendorMasterSheet;