import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import { Search, Eye, Edit3, Trash2, MapPin, Calendar, User } from 'lucide-react';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBusinesses();
      setBusinesses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDelete = async (ownerId, bizId) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      try {
        await adminApi.deleteBusiness(ownerId, bizId);
        fetchBusinesses();
      } catch (err) {
        alert('Failed to delete business');
      }
    }
  };

  const filteredBusinesses = businesses.filter(biz => 
    biz.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.ownerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-warning';
      case 'suspended': return 'badge-danger';
      default: return 'badge-success';
    }
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>Business Directory</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage and monitor all registered businesses in the system</p>
        </div>
        <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '300px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search by name, owner or address..." 
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.875rem', width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container shadow-sm">
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem' }}>Business Info</th>
              <th style={{ padding: '1rem' }}>Owner</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Expiry Date</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ color: '#64748b' }}>Loading businesses...</p>
              </td></tr>
            ) : filteredBusinesses.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                No businesses found matching your criteria.
              </td></tr>
            ) : filteredBusinesses.map((biz) => (
              <tr key={biz.id} className="hover-row">
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{biz.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{biz.id}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                    <User size={14} color="#94a3b8" />
                    <span>{biz.ownerId}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${getStatusColor(biz.status)}`}>
                    {biz.status || 'Active'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                    <Calendar size={14} color="#94a3b8" />
                    <span>{biz.expiryDate ? new Date(biz.expiryDate).toLocaleDateString() : 'No expiry'}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569', maxWidth: '200px' }}>
                    <MapPin size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {biz.address || 'No address'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      title="View Details"
                      onClick={() => navigate(`/business/${biz.ownerId}/${biz.id}`)}
                      style={{ padding: '0.4rem' }}
                    >
                      <Eye size={16} color="#3b82f6" />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      title="Edit Business"
                      onClick={() => navigate(`/business/${biz.ownerId}/${biz.id}?edit=true`)}
                      style={{ padding: '0.4rem' }}
                    >
                      <Edit3 size={16} color="#10b981" />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      title="Delete Business"
                      onClick={() => handleDelete(biz.ownerId, biz.id)}
                      style={{ padding: '0.4rem' }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Businesses;
