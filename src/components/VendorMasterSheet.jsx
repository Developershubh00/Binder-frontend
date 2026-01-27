import { useState, useEffect } from 'react';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getVendorCodes } from '../../integration';

const VendorMasterSheet = ({ onBack }) => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        try {
          const data = await getVendorCodes();
          let vendorList = [];
          
          if (data && Array.isArray(data)) {
            vendorList = data;
          } else if (data && data.results && Array.isArray(data.results)) {
            vendorList = data.results;
          } else {
            // Fallback to localStorage if API doesn't return expected format
            vendorList = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
          }
          
          // Normalize vendor data to handle both API and localStorage formats
          const normalizedVendors = vendorList.map(vendor => ({
            code: vendor.code || vendor.id || '',
            vendorName: vendor.vendor_name || vendor.vendorName || '',
            address: vendor.address || '',
            gst: vendor.gst || '',
            bankName: vendor.bank_name || vendor.bankName || '',
            accNo: vendor.account_number || vendor.accNo || '',
            ifscCode: vendor.ifsc_code || vendor.ifscCode || '',
            jobWorkCategory: Array.isArray(vendor.job_work_category) 
              ? vendor.job_work_category.join(', ') 
              : (vendor.job_work_category || vendor.jobWorkCategory || ''),
            jobWorkSubCategory: Array.isArray(vendor.job_work_sub_category)
              ? vendor.job_work_sub_category.join(', ')
              : (vendor.job_work_sub_category || vendor.jobWorkSubCategory || ''),
            contactPerson: vendor.contact_person || vendor.contactPerson || '',
            whatsappNo: vendor.whatsapp_number || vendor.whatsappNo || '',
            altWhatsappNo: vendor.alt_whatsapp_number || vendor.altWhatsappNo || '',
            email: vendor.email || '',
            paymentTerms: vendor.payment_terms || vendor.paymentTerms || '',
            createdAt: vendor.created_at || vendor.createdAt || new Date().toISOString()
          }));
          
          setVendors(normalizedVendors);
        } catch (apiError) {
          console.warn('API fetch failed, using localStorage:', apiError);
          // Fallback to localStorage if API fails
          const storedVendors = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
          setVendors(storedVendors);
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors');
        // Fallback to localStorage
        const storedVendors = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
        setVendors(storedVendors);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
    <div className="fullscreen-content" style={{ overflowY: 'auto' }}>
      <div className="content-header">
        <Button 
          variant="outline"
          onClick={onBack} 
          type="button"
          className="mb-6 bg-white"
        >
          ← Back to Vendor Management
        </Button>
        <h1 className="fullscreen-title">Vendor Master Sheet</h1>
        <p className="fullscreen-description">
          View and manage all registered vendors in the system
        </p>
      </div>

      <div style={{ maxWidth: '100%', width: '100%', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <Input
              type="text"
              placeholder="Search by vendor name, code, contact person, email, GST, address, or payment terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Total Vendors: <strong className="text-foreground">{filteredVendors.length}</strong>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted-foreground)' }}>
            Loading vendors...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--destructive)' }}>
            {error}
          </div>
        ) : sortedVendors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted-foreground)' }}>
            No vendors found{searchTerm ? ' matching your search' : ''}.
          </div>
        ) : (
          <div style={{ 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)',
            overflowX: 'auto',
            overflowY: 'visible',
            backgroundColor: 'var(--card)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
              <thead>
                <tr style={{ 
                  backgroundColor: 'var(--muted)',
                  borderBottom: '2px solid var(--border)'
                }}>
                  <th 
                    onClick={() => handleSort('code')} 
                    style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: '80px'
                    }}
                  >
                    Code {getSortIcon('code')}
                  </th>
                  <th 
                    onClick={() => handleSort('vendorName')} 
                    style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: '180px'
                    }}
                  >
                    Vendor Name {getSortIcon('vendorName')}
                  </th>
                  <th style={{ 
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    width: '250px'
                  }}>
                    Address
                  </th>
                  <th style={{ 
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    width: '140px'
                  }}>
                    GST Number
                  </th>
                  <th 
                    onClick={() => handleSort('contactPerson')} 
                    style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: '120px'
                    }}
                  >
                    Contact Person {getSortIcon('contactPerson')}
                  </th>
                  <th style={{ 
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    width: '120px'
                  }}>
                    Phone
                  </th>
                  <th style={{ 
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    width: '180px'
                  }}>
                    Email
                  </th>
                  <th 
                    onClick={() => handleSort('jobWorkCategory')} 
                    style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: '100px'
                    }}
                  >
                    Category {getSortIcon('jobWorkCategory')}
                  </th>
                  <th style={{ 
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    width: '120px'
                  }}>
                    Sub-Category
                  </th>
                  <th style={{ 
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    width: '150px'
                  }}>
                    Bank
                  </th>
                  <th 
                    onClick={() => handleSort('paymentTerms')} 
                    style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: '200px'
                    }}
                  >
                    Payment Terms {getSortIcon('paymentTerms')}
                  </th>
                  <th 
                    onClick={() => handleSort('createdAt')} 
                    style={{ 
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: '100px'
                    }}
                  >
                    Created {getSortIcon('createdAt')}
                  </th>
                  <th style={{ 
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    width: '130px'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedVendors.map((vendor, index) => (
                  <tr 
                    key={vendor.code || index}
                    style={{
                      borderBottom: index < sortedVendors.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background-color 0.15s',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--muted)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.5px'
                      }}>
                        {vendor.code || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <strong style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>
                        {vendor.vendorName || 'N/A'}
                      </strong>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '12px', color: 'var(--foreground)', lineHeight: '1.4', maxWidth: '250px' }}>
                        {vendor.address || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <code style={{ 
                        fontSize: '11px', 
                        color: 'var(--foreground)', 
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: 'var(--muted)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                      }}>
                        {vendor.gst || 'N/A'}
                      </code>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <strong style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>
                        {vendor.contactPerson || 'N/A'}
                      </strong>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--foreground)' }}>
                        {vendor.whatsappNo || 'N/A'}
                      </div>
                      {vendor.altWhatsappNo && (
                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '3px' }}>
                          {vendor.altWhatsappNo}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                        {vendor.email || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        backgroundColor: 'var(--muted)',
                        color: 'var(--foreground)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {vendor.jobWorkCategory || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                        {vendor.jobWorkSubCategory || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--foreground)' }}>
                        {vendor.bankName || 'N/A'}
                      </div>
                      {vendor.accNo && (
                        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
                          A/C: {vendor.accNo}
                        </div>
                      )}
                      {vendor.ifscCode && (
                        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
                          IFSC: {vendor.ifscCode}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '13px', color: 'var(--foreground)', lineHeight: '1.4', maxWidth: '200px' }}>
                        {vendor.paymentTerms || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                        {formatDate(vendor.createdAt)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(vendor)}
                          title="View Details"
                          className="h-8 w-8"
                        >
                          <FiEye style={{ fontSize: '16px' }} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => alert('Edit functionality to be implemented')}
                          title="Edit Vendor"
                          className="h-8 w-8"
                        >
                          <FiEdit2 style={{ fontSize: '16px' }} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteVendor(vendor.code)}
                          title="Delete Vendor"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <FiTrash2 style={{ fontSize: '16px' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && sortedVendors.length > 0 && (
          <div style={{ 
            marginTop: '24px', 
            padding: '12px 16px',
            backgroundColor: 'var(--muted)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            color: 'var(--muted-foreground)'
          }}>
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        )}
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