import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../api';
import { 
  ArrowLeft, 
  Save, 
  Info, 
  Receipt, 
  Package, 
  Layers, 
  Trash2, 
  Edit3,
  Calendar,
  MapPin,
  Hash
} from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

const BusinessDetails = () => {
  const { ownerId, bizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startInEditMode = queryParams.get('edit') === 'true';

  const [activeTab, setActiveTab] = useState('info');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(startInEditMode);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!ownerId || !bizId) {
        console.warn('[BusinessDetails] Missing ownerId or bizId in params');
        return;
      }

      setLoading(true);
      setError(null);
      console.log(`[BusinessDetails] Fetching details for Owner: ${ownerId}, Biz: ${bizId}`);

      try {
        const res = await adminApi.getBusinessDetails(ownerId, bizId);
        console.log('[BusinessDetails] API Response:', res.data);
        
        if (res.data && res.data.info) {
          setData(res.data);
          setFormData(res.data.info);
        } else {
          console.error('[BusinessDetails] Invalid data structure received:', res.data);
          setError('Received invalid data from server.');
        }
      } catch (err) {
        console.error('[BusinessDetails] Fetch failed:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load business details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ownerId, bizId]);

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
      <p style={{ color: '#64748b', fontWeight: 500 }}>Loading business details...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}>
        <Info size={48} style={{ margin: '0 auto' }} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Error Loading Data</h3>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>
        Retry Loading
      </button>
    </div>
  );

  if (!data) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <p style={{ color: '#64748b' }}>Business not found.</p>
      <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/businesses')}>
        Back to Businesses
      </button>
    </div>
  );

  const handleUpdateInfo = async () => {
    try {
      await adminApi.updateBusiness(ownerId, bizId, formData);
      setEditing(false);
      // Refresh
      const res = await adminApi.getBusinessDetails(ownerId, bizId);
      setData(res.data);
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading business details...</div>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>Business not found.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/businesses')}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{data.info.name}</h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Business ID: {bizId} • Owner: {ownerId}</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <Info size={16} style={{ marginBottom: '-3px', marginRight: '6px' }} />
          Basic Info
        </button>
        <button 
          className={`tab ${activeTab === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveTab('bills')}
        >
          <Receipt size={16} style={{ marginBottom: '-3px', marginRight: '6px' }} />
          Bills
        </button>
        <button 
          className={`tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          <Package size={16} style={{ marginBottom: '-3px', marginRight: '6px' }} />
          Items
        </button>
        <button 
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Layers size={16} style={{ marginBottom: '-3px', marginRight: '6px' }} />
          Categories
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Business Information</h3>
              {!editing ? (
                <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
                  <Edit3 size={14} />
                  Edit Info
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleUpdateInfo}>
                    <Save size={14} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input 
                  className="form-input" 
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <CustomSelect 
                  value={formData.status || 'active'} 
                  onChange={(val) => setFormData({...formData, status: val})}
                  disabled={!editing}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'suspended', label: 'Suspended' }
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input 
                  className="form-input" 
                  value={formData.address || ''} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subscription Expiry</label>
                <input 
                  type="date"
                  className="form-input" 
                  value={(() => {
                    if (!formData.expiryDate) return '';
                    const d = new Date(formData.expiryDate);
                    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
                  })()} 
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">GST Enabled</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.gstEnabled} 
                    onChange={(e) => setFormData({...formData, gstEnabled: e.target.checked})}
                    disabled={!editing}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Enable Tax Calculations</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">GST Percentage (%)</label>
                <input 
                  type="number"
                  className="form-input" 
                  value={formData.gstPercentage || 0} 
                  onChange={(e) => setFormData({...formData, gstPercentage: e.target.value})}
                  readOnly={!editing}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Items</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.bills.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No bills found.</td></tr>
                ) : data.bills.map((bill) => (
                  <tr key={bill.id}>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{bill.id}</td>
                    <td>{new Date(bill.createdAt).toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{bill.total}</td>
                    <td><span className="badge badge-info">{bill.paymentMode}</span></td>
                    <td>{bill.items?.length || 0} items</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No items found.</td></tr>
                ) : data.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ width: 32, height: 32, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
                        {item.imageUrl ? <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td>{data.categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized'}</td>
                    <td>₹{item.price}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className="btn btn-outline btn-sm"><Edit3 size={12} /></button>
                        <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="table-container" style={{ maxWidth: 600 }}>
            <table>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.categories.length === 0 ? (
                  <tr><td colSpan="2" style={{ textAlign: 'center', padding: '2rem' }}>No categories found.</td></tr>
                ) : data.categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetails;
