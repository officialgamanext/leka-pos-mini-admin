import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import { Search, ExternalLink, Trash2 } from 'lucide-react';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await adminApi.deleteBusiness(ownerId, bizId);
        fetchBusinesses();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Businesses</h1>
        <div className="card" style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} color="#64748b" />
          <input 
            type="text" 
            placeholder="Search businesses..." 
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.875rem' }} 
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Owner ID</th>
              <th>Status</th>
              <th>Created At</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading businesses...</td></tr>
            ) : businesses.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No businesses found.</td></tr>
            ) : businesses.map((biz) => (
              <tr key={biz.id}>
                <td style={{ fontWeight: 500 }}>{biz.name}</td>
                <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{biz.ownerId}</td>
                <td>
                  <span className={`badge ${biz.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {biz.status || 'Active'}
                  </span>
                </td>
                <td>{biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/business/${biz.ownerId}/${biz.id}`)}
                    >
                      <ExternalLink size={14} />
                      Manage
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444' }}
                      onClick={() => handleDelete(biz.ownerId, biz.id)}
                    >
                      <Trash2 size={14} />
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
