import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import { MoreVertical, Trash2, Edit2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(page);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(id);
        fetchUsers(pagination.page);
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Users</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="card" style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search users..." 
              style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.875rem' }} 
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created At</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td></tr>
            ) : users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 500 }}>{user.name || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{user.phoneNumber || 'N/A'}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm" 
                      title="Delete" 
                      style={{ color: '#ef4444' }}
                      onClick={() => handleDelete(user.id)}
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

      <div className="pagination">
        <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: 'auto' }}>
          Showing {users.length} of {pagination.total} users
        </span>
        <button 
          className="page-btn" 
          disabled={pagination.page <= 1}
          onClick={() => fetchUsers(pagination.page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {pagination.page} / {pagination.totalPages}
        </span>
        <button 
          className="page-btn"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => fetchUsers(pagination.page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Users;
