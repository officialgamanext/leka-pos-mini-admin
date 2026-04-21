import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import { UserCog, Building, Mail, Phone, Trash2 } from 'lucide-react';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await adminApi.getAllStaff();
        setStaff(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Staff Management</h1>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Phone</th>
              <th>Business ID</th>
              <th>Role</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading staff...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No staff found.</td></tr>
            ) : staff.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td>{s.mobileNumber}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <Building size={12} />
                    {s.businessId}
                  </div>
                </td>
                <td>
                  <span className={`badge ${s.role === 'manager' ? 'badge-info' : 'badge-outline'}`} style={{ border: s.role !== 'manager' ? '1px solid #e2e8f0' : 'none' }}>
                    {s.role || 'Staff'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
